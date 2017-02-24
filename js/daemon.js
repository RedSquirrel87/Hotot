if (typeof daemon == 'undefined') var daemon = {};
daemon = {

    time: 0,

    running: false,

    use_streaming: false,

    timer: null,

    timer_interval: 60000, //default, 60 sec per loop

    home_queue: [],

    home_last_time: 0,

    poll_views: [],

    push_views: [],
    
    favorited_list: [],
    
    new_followers_list: [],
    
    tags_length: 0, // 5.5

    init: function init() {},

    start: function start() {
        daemon.running = true;
        daemon.time = 0;
        daemon.work();
    },

    stop: function stop() {
        daemon.running = false;
        daemon.abort_push();
    },
    
    restart: function restart() {
	daemon.stop();
	daemon.start();
    },

    work: function work() {
        if (globals.twitterClient.use_oauth && globals.twitterClient.api_base.indexOf('https://api.twitter.com/') != - 1) {
            daemon.use_streaming = true;
        }
        if (daemon.running) {
            daemon.poll();
            daemon.push();

            ui.Slider.save_state();
            conf.save_prefs(conf.current_name);
            db.reduce_db(); 
            if (daemon.time % 1800 === 0) { // sync per 30 minutes
                syncMyself();
            }
        }
        daemon.time += 60;
        if (daemon.time === 3600) { // reset timer per hour
            daemon.time = 0;
        }

        daemon.timer = setTimeout(daemon.work, daemon.timer_interval);
    },

    poll: function poll() {
        var step = 0;
        for (var i = 0; i < daemon.poll_views.length; i += 1) {
            var view = daemon.poll_views[i];
            if (!view.use_auto_update) {
                continue;
            }
            var interval = view.interval;
            if (daemon.time % (Math.ceil(interval / 60) * 60) == 0) {
                view.load();
                step += 1;
            }
        }
        for (var i = 0; i < daemon.push_views.length; i += 1) {
            var view = daemon.push_views[i];
            if (!view.use_auto_update) {
                continue;
            }
            var interval = view.interval;
            if (daemon.use_streaming && globals.twitterClient.watch_user_streams.is_running) {
                // poll push_views per 5 minutes when the Steaming xhr works
                // poll them as normal if Streaming xhr is not running or the user stream is disabled.
                interval = 300;
            }
            if (daemon.time % (Math.ceil(interval / 60) * 60) == 0) {
                hotot_log('poll as push', view.name);
                view.load();
                step += 1;
            }
        }
        if (step != 0) {
	    toast.set(_('updated') + ' ' + step + ' ' +  _('page_on_schedule') + '.').show();
        }
    },

    abort_push: function abort_push() {
        globals.twitterClient.abort_watch_user_streams();
    },
    
    push: function push() {
	// 5.5
	var tags = conf.get_current_profile().preferences.following_hashtags;
	if (globals.twitterClient.streaming_filter.is_running) {
		if (tags.length !== daemon.tags_length) {
			globals.twitterClient.abort_streaming_filter();
			daemon.tags_length = tags.length;
			if (tags.length > 0) 
				globals.twitterClient.streaming_filter(tags.join(','), on_ret);
		}
	} else {
		if (tags.length > 0)
			globals.twitterClient.streaming_filter(tags.join(','), on_ret);	
	}
		
        if (globals.twitterClient.watch_user_streams.is_running) {
            if (daemon.home_queue.length > 0) {
                hotot_log('daemon push, timeout', daemon.home_queue.length);
                if (ui.Main.views.home) {
                    ui.Main.views.home.load_success(daemon.home_queue);
                }
                daemon.home_queue.splice(0, daemon.home_queue.length);
            }
            return;
        }
        function on_ret(ret) {	
		
	    if (ret.extended_tweet) {
		ret.text = ret.extended_tweet.full_text;
		ret.entities = ret.extended_tweet.entities;
	    }
			  
	    //3.6: Favorited notify
	    if ((ret.event === "favorite") && (conf.get_current_profile().preferences.notify_favorited)) {
		if ((ret.source.screen_name != globals.myself.screen_name) 
			&& (daemon.favorited_list.indexOf(ret.created_at) === -1)) {
				daemon.favorited_list.push(ret.created_at);
				var tweet = ret.target_object;
				tweet.favorited_at = ret.created_at;
				tweet.favorited_by = ret.source;
				ui.Main.insert_favorited(tweet);
		}
		return;
	    }
	    if (ret.event === "unfavorite") {
                var id = ret.target_object.id_str;
                if (conf.get_current_profile().preferences.use_deleted_mark) {
                    $('.card[favorited_id="'+id+'"]').addClass('deleted');
                } else {
                    $('.card[favorited_id="'+id+'"]').remove();
                }
                return;
	    }

	    if ((ret.event === "follow") && (conf.get_current_profile().preferences.notify_new_followers)) {
		if ((ret.source.screen_name != globals.myself.screen_name) 
			&& (daemon.new_followers_list.indexOf(ret.created_at) === -1)) {
				daemon.new_followers_list.push(ret.created_at);
				ui.Main.insert_new_follower(ret.source);
		}
		return;
	    }

	    if (ret.event === "quoted_tweet") {
		if (ret.source.screen_name != globals.myself.screen_name) {
                    if (ui.Main.views.mentions && ui.Main.views.mentions.use_auto_update) {
                        ui.Main.views.mentions.load_success([ret.target_object]);
                    }
		}
		return;
	    }
	    
            if (ret.direct_message) {
                if (ret.direct_message.recipient_screen_name == globals.myself.screen_name || ret.direct_message.sender_screen_name == globals.myself.screen_name) {
                    if (ui.Main.views.messages && ui.Main.views.messages.use_auto_update) {
                        ui.Main.views.messages.load_success([ret.direct_message]);
                    }
                }
                return;
            }
	    
            if (ret['delete'] && ret['delete']['status']) {
                var id = ret['delete']['status'].id_str;
                if (conf.get_current_profile().preferences.use_deleted_mark) {
                    $('.card[tweet_id="'+id+'"]').addClass('deleted');
                } else {
                    $('.card[tweet_id="'+id+'"]').remove();
                }
                return;
            }
            if (ret.text && ret.user) {
                if (ret.hasOwnProperty('retweeted_status') && ret.user.screen_name == globals.myself.screen_name) {
			return;
                }
		
		//3.6: Support for mutes users
		if (globals.mutes_ids.indexOf(ret.user.id) !== -1) {
			// He's a muted user, ignore his tweet if not a mention!
			if (!(ret.hasOwnProperty('in_reply_to_screen_name') && ret.in_reply_to_screen_name == globals.myself.screen_name)) {
				return;
			}
		}
		
		//3.6: No Retweets improvements
                if (globals.no_retweets_ids.indexOf(ret.user.id_str) !== -1) {
                    return;
                }
				
                // ignore tweets from blocking users
                if (globals.blocking_ids.indexOf(ret.user.id_str) !== -1) {
                    return;
                }
		
		// skip RT of my tweets from home view
		if (!(ret.hasOwnProperty('retweeted_status') &&  ret.retweeted_status.user.screen_name == globals.myself.screen_name)) {
			var now = Date.now();
			if (now - daemon.home_last_time > 1000) {
				hotot_log('daemon push', 1);
				if (ui.Main.views.home && ui.Main.views.home.use_auto_update) {
		                        ui.Main.views.home.load_success([ret]);
				}
			} else {
				daemon.home_queue.push(ret);
				if (128 < daemon.home_queue.length) {
					hotot_log('daemon push, batch', daemon.home_queue.length);
					if (ui.Main.views.home && ui.Main.views.home.use_auto_update) {		
						ui.Main.views.home.load_success(daemon.home_queue);
					}
					daemon.home_queue.splice(0, daemon.home_queue.length);
				}
			}
		}
		
                // mentions
                if (ret.entities) {
                    if (ui.Main.views.mentions && ui.Main.views.mentions.use_auto_update) {
                        var user_mentions = ret.entities.user_mentions;
			//if (ret.retweeted_status && ret.retweeted_status.user.screen_name == globals.myself.screen_name) {} 
                        for (var i = 0, l = user_mentions.length; i < l; i += 1) {
                            if (user_mentions[i].screen_name == globals.myself.screen_name) {
                                ui.Main.views.mentions.load_success([ret]);
                            }
                        }
                    }
                }
		
                daemon.home_last_time = now;
                return;
            }
        }
        globals.twitterClient.watch_user_streams(on_ret);
    },

    register_poll_view: function register_poll_view(v, interval) {
        if (daemon.poll_views.indexOf(v) == - 1) {
            daemon.poll_views.push(v);
            return true;
        }
        return false;
    },

    register_push_view: function register_push_view(v, token) {
        if (daemon.push_views.indexOf(v) == - 1) {
            daemon.push_views.push(v);
            return true;
        }
        return false;
    },

    unregister_poll_view: function unregister_poll_view(v) {
        var idx = daemon.poll_views.indexOf(v)
        if (idx != - 1) {
            daemon.poll_views.splice(idx, 1);
            return true;
        }
        return false;
    },

    unregister_push_view: function unregister_push_view(v) {
        var idx = daemon.push_views.indexOf(v)
        if (idx != - 1) {
            daemon.push_views.splice(idx, 1);
            return true;
        }
        return false;
    },

    update_all: function update_all() {
        for (var i = 0; i < daemon.poll_views.length; i += 1) {
            daemon.poll_views[i].load();
        }
        for (var i = 0; i < daemon.push_views.length; i += 1) {
            daemon.push_views[i].load();
        }
    }   

};

