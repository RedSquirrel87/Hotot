if (typeof ui == 'undefined') var ui = {};
ui.Main = {

me: {},

active_tweet_id: null,

selected_tweet_id: null,

use_preload_conversation: true,

use_auto_loadmore: false,

default_color: [
        '#EB374B', '#FFE11D', '#73F560', '#63C6FF', 
        '#FFA135', '#C262FF', '#5C33FF', '#B30002', 
        '#2E3333', '#7A005A', '#FF6C00', '#B4FC2C', 
        '#00FC50', '#F4F50A', '#DBFFDB', '#277077'],

// info of blocks. all pages use as containers to display tweets.
views: {
},

init:
function init () {
    this.me = $('#main_page');

    $('#hashtag_filter_btn').click(
    function (event) {
	if(confirm(_('mute_confirm') + " "+$(this).attr('href')+"?\n")) {
		var tag = $(this).attr('href');
		var rule = filter.empty_rule("Hashtag: " + tag);
		rule.actions.push("DROP");
		rule.hashtags.push(tag.trim().toLowerCase().substring(1));
		if (filter.add_rule(rule)) {
			toast.set(_('you_have_muted') +' "'+$(this).attr('href')+'"').show(3);
			if (conf.get_current_profile().preferences.filter_framework === false) 
				ui.InfoDlg.show(_('info'),_('filter_framework_disabled'));
		} else {
			toast.set(_('filter_add_error')).show();
		}
	}
        return false;
    });

    $('#hashtag_search_btn').click(
    function (event) {
	ui.Slider.addDefaultView('search', {}) || ui.Slider.add('search');
        ui.Main.views.search._header.find('.search_entry').val($(this).attr('href'));
        ui.Main.views.search._header.find('.search_tweet').click();
        return false;
    });
    
    // 5.5
    $('#hashtag_follow_btn').click(
    function (event) {
	conf.get_current_profile().preferences.following_hashtags.push($(this).attr('href'));
	conf.save_prefs(conf.current_name);
	clearTimeout(daemon.timer);
	daemon.work();
	$('#hashtag_menu').hide();	
        return false;
    });
    $('#hashtag_unfollow_btn').click(
    function (event) {
	var i = conf.get_current_profile().preferences.following_hashtags.indexOf($(this).attr('href'));
	if (i !== -1) {
		conf.get_current_profile().preferences.following_hashtags.splice(i, 1);
		conf.save_prefs(conf.current_name);
		clearTimeout(daemon.timer);
		daemon.work();
	}
	$('#hashtag_menu').hide();	
        return false;
    });
    
    // -- more menu --
    $('#tweet_alt_retweet_btn').click(
    function (event) {
        ui.Main.on_retweet_click(this, ui.Main.active_tweet_id, event);
        return false;
    });
    $('#tweet_alt_reply_btn').click(
    function (event) {
        ui.Main.on_reply_click(this, ui.Main.active_tweet_id, event);
        return false;
    });
    $('#tweet_rt_btn').click(
    function (event) {
        ui.Main.on_rt_click(this, ui.Main.active_tweet_id, event);
        return false;
    });

    $('#quote_link_btn').click(
    function (event) {
        ui.Main.on_qt_click(this, ui.Main.active_tweet_id, event);
        return false;
    });    

    $('#tweet_reply_all_btn').click(
    function (event) {
        ui.Main.on_reply_all_click(this, ui.Main.active_tweet_id, event);	
        return false;
    });

    $('#tweet_dm_btn').click(
    function (event) {
        ui.Main.on_dm_click(this, ui.Main.active_tweet_id, event);
        return false;
    });

    $('#tweet_del_btn').click(
    function (event) {
        ui.Main.on_del_click(this, ui.Main.active_tweet_id, event);
    });
    
    $('#tweet_edit_btn').click(
    function (event) {
        ui.Main.on_edit_click(this, ui.Main.active_tweet_id, event);
    });
    
    $('#tweet_hide_btn').click(
    function (event) {
        ui.Main.on_hide_click(this, ui.Main.active_tweet_id, event);
    });

    $('#tweet_filter_btn').click(
    function (event) {
        var li = $(ui.Main.active_tweet_id);
        var id = (li.attr('retweet_id') == '' || li.attr('retweet_id') == undefined) ? li.attr('tweet_id'): li.attr('retweet_id');
        db.get_tweet(id, function (value) {
		var tweet = value;
		var user = tweet.hasOwnProperty('user') ? tweet.user : tweet.hasOwnProperty('sender') ? tweet.sender : null;
		var real_tweet = tweet;
		if (tweet.hasOwnProperty('retweeted_status')) {
			real_tweet = tweet['retweeted_status'];
		        user = real_tweet.hasOwnProperty('user') ? real_tweet.user : real_tweet.hasOwnProperty('sender') ? real_tweet.sender: null;
		}
		var tweet_client = (real_tweet.source) ? real_tweet.source.replace(/<.*?>/g, "").trim() : "";
		var tweet_hashtags = [];
		if (real_tweet.entities && real_tweet.entities.hashtags) {
			for (i = 0; i < real_tweet.entities.hashtags.length; i++) {
				tweet_hashtags.push(real_tweet.entities.hashtags[i].text.toLowerCase());
			}
		}
		var tweet_author = user ? user.screen_name : "";
		
		var tweet_retweeter = (tweet.retweeted_status) ? tweet.user.screen_name : "";
		var tweet_mentions = [];
		if (real_tweet.entities && real_tweet.entities.user_mentions) {
			for (i = 0; i < real_tweet.entities.user_mentions.length; i++) {
				tweet_mentions.push(real_tweet.entities.user_mentions[i].screen_name.toLowerCase());
			}
		}
		var tweet_urls = (real_tweet.entities && real_tweet.entities.urls && real_tweet.entities.urls.length > 0) ? true : false;
		var tweet_geo = (real_tweet.geo && real_tweet.geo.length > 0) ? true : false;
		var tweet_media = (real_tweet.entities && real_tweet.entities.media && real_tweet.entities.media.length > 0) ? true : false;
		
		$('#filter_rule_edit_name').val("");
		$('#filter_drop').prop('checked',false);
		$('#filter_mask').prop('checked',false);
		$('#filter_notify').prop('checked',false);
		$('#filter_rt').prop('checked',false);
		$('#filter_contain').val("");
		$('#filter_come').val(tweet_client);
		$('#filter_hashtags').val(tweet_hashtags.join(","));
		$('#filter_authors').val(tweet_author);
		$('#filter_retweeters').val(tweet_retweeter);
		$('#filter_mentions').val(tweet_mentions.join(","));
		$('#filter_urls').prop('checked',tweet_urls);
		$('#filter_geo').prop('checked',tweet_geo);
		$('#filter_media').prop('checked',tweet_media);
		
		ui.FilterDlg.rule_edit_dialog.open();
		var e = $('#filter_rule_edit_name .entry');
		e.focus();
        });
    });

    $('#tweet_set_color_btn').click(
    function (ev) {
        var li = $(ui.Main.active_tweet_id);
        var screen_name = li.attr('screen_name');
        globals.color_guide_dialog.open();
        $('#color_guide_dialog').data('screen_name', screen_name);
    });
    
    $('#set_color_list a').click(function () {
        var color_code = $(this).attr('href');
        var screen_name = $('#color_guide_dialog').data('screen_name');
        var li = $('.card[screen_name="'+screen_name+'"]');
        if (screen_name) {
            ui.Main.set_user_color(screen_name, color_code);
            li.find('.tweet_color_label').css('background-color', color_code);
        }
        globals.color_guide_dialog.close();
        conf.save_prefs(conf.current_name);
        return false;
    });    
    
    var color_cells = $('#set_color_list .cell');
    var color_hrefs = $('#set_color_list a');
    for (var i = 0; i < ui.Main.default_color.length; i += 1) {
        $(color_cells.get(i+1)).css('background-color', ui.Main.default_color[i]);
        $(color_hrefs.get(i+1)).attr('href', ui.Main.default_color[i]);
    }
    

    $('#tweet_readlater_btn').click(
    function (ev) { 
        var text = $(ui.Main.active_tweet_id + ' .card_body').children('.text').text();
        var reg_url = new RegExp('[a-zA-Z]+:\\/\\/(' + ui.Template.reg_url_path_chars_1+'+)');
        var m = text.match(reg_url);
        if (m == null){
            var url = 'http://twitter.com/' + $(ui.Main.active_tweet_id).attr('screen_name') + '/status/' + $(ui.Main.active_tweet_id).attr('tweet_id');
        } else {
            var url = m[1];
        };
        toast.set(_('saving')).show();
        globals.readLaterServ.addItem(
            conf.get_current_profile().preferences.readlater_service,
            url, text,
            function (ret) {
                if (ret.indexOf('bookmark_id')!=-1) {
                    toast.set(_('saved')).show();
                } else {
                    toast.set(_('error_code')).show()
                }
            });        
    });

    $('#tweet_translate_btn').click(
    function (ev) {      
	var dst_lang = conf.get_current_profile().preferences.dst_lang;
	var tweet_id = ui.Main.active_tweet_id;
	var text = $(tweet_id).find('.text_inner:eq(0)');
	ui.Main.do_translate(dst_lang, text.attr('alt')||text.text(),
	function (result) {
	        var content = '';
	        if (result.responseStatus == 200) {
			content = $("<span>").text("→" + dst_lang + ": ")
				.append($("<span>").text(result.responseData.translatedText))
				.css({
					'background' : 'transparent url(image/ic16_translate.png) no-repeat',
					'padding-left' : '20px'
				});
		} else {
			content = $("<span>").text("ERROR: ")
				.append($("<span>").text(result.responseDetails))
				.css({
					'background' : 'transparent url(image/ic16_translate.png) no-repeat',
					'padding-left' : '20px'
				});
		}
		var ht = $(tweet_id + ' > .card_body > .text > .hotot_translate');
		if (ht.length != 0) ht.remove();
		$(tweet_id + ' .card_body > .text').first().append(
			$("<div>", { class: "hotot_translate" })
			.append(content)
		);		
	});
    });    
    
    $('#tweet_expand_url_btn').click(
    function (ev) {     
	var text = $(ui.Main.active_tweet_id).find('.text');
	text.find("a[href]").each(
	function(){ 
		var tweet = $(this);
		var href = tweet.attr("href");
		if ((href.indexOf('http') === 0) && (tweet.attr("longurl") != "yes")) {
			if (tweet.text().substring(tweet.text().length-3) === "...") {
				hotot_log("LONGURL", href);
				tweet.attr("longurl","yes");
				tweet.text(href);
			} else {
				var params = {
					'user-agent': "Hotot+/" + conf.vars.version,
					'format': 'json',
					'url': href
				};
				
				globals.network.do_request('GET', " http://api.longurl.org/v2/expand", params, null, null,
					function(json) {
						if (json && json.hasOwnProperty('long-url')) {
							hotot_log("LONGURL", json['long-url']);
							tweet.text(json['long-url']);
						}
						tweet.attr("longurl","yes");
					},	
					function(error) {
						hotot_log("LONGURL", "ERROR");
						tweet.attr("longurl","yes");
					}
				);
			}
		}
	});
	$('#tweet_more_menu').hide();	
    });
    
    $('#tweet_view_replies_btn').click(
    function (ev) {     
	var li = $(ui.Main.active_tweet_id);
        var id = (li.attr('retweet_id') == '' || li.attr('retweet_id') == undefined) ? li.attr('tweet_id'): li.attr('retweet_id');
	var screen_name = li.attr('screen_name');
	open_replies(id, screen_name);
    });    

    $('#tweet_more_menu').mouseleave(function(){
        $(this).hide();
    });
    
    $('#hashtag_menu').mouseleave(function(){
        $(this).hide();
    });    
},

hide:
function hide () {
    daemon.stop();
    ui.StatusBox.close();
    globals.signed_in = false;
    this.me.hide();
},

show:
function show () {
    daemon.start();
    globals.signed_in = true;
    this.me.show();
},

load_home:
function load_home(self, success, fail) {
    globals.twitterClient.get_home_timeline(false, self.since_id, null, conf.get_current_profile().preferences.items_per_request, success);
},

loadmore_home:
function loadmore_home(self, success, fail) {
    globals.twitterClient.get_home_timeline(false, null, self.max_id, conf.get_current_profile().preferences.more_items_per_request,success);
},

load_mentions:
function load_mentions(self, success, fail) {
    globals.twitterClient.get_mentions(self.since_id, null, conf.get_current_profile().preferences.items_per_request,success);
},

loadmore_mentions:
function loadmore_mentions(self, success, fail) {
    globals.twitterClient.get_mentions(null, self.max_id, conf.get_current_profile().preferences.more_items_per_request,success);
},

load_messages:
function load_messages(self, success, fail) {
	var since_id = self.since_id;
	globals.twitterClient.get_direct_messages(since_id, null, conf.get_current_profile().preferences.items_per_request, success);
	globals.twitterClient.get_sent_direct_messages(since_id, null, conf.get_current_profile().preferences.items_per_request, success);
},

load_messages_new:
function load_messages_new(self, success, fail) {
	globals.twitterClient.get_direct_messages(self.since_id, null, conf.get_current_profile().preferences.items_per_request, function(result) {
		ui.Main.load_messages_success(self, result, true);
	});
	globals.twitterClient.get_sent_direct_messages(self.since_id, null, conf.get_current_profile().preferences.items_per_request, function(result) {
		ui.Main.load_messages_success(self, result, false);
	});
},

loadmore_messages:
function loadmore_messages(self, success, fail) {
	globals.twitterClient.get_direct_messages(null, self.max_id, conf.get_current_profile().preferences.more_items_per_request, success);
	globals.twitterClient.get_sent_direct_messages(null, self.max_id, conf.get_current_profile().preferences.more_items_per_request, success);
},

loadmore_messages_new:
function loadmore_messages_new(self) {
	globals.twitterClient.get_direct_messages(null, ui.DMTabs.max_id_dm_get, 200, function(result) {
		if (result.length === 1) ui.DMTabs.no_more_get = true;
		ui.DMTabs.max_id_dm_get = result[result.length-1].id_str;
		ui.Main.loadmore_messages_success(self, result, true);
	});
	globals.twitterClient.get_sent_direct_messages(null, ui.DMTabs.max_id_dm_sent, 200, function(result) {
		if (result.length === 1) ui.DMTabs.no_more_sent = true;
		ui.DMTabs.max_id_dm_sent = result[result.length-1].id_str;
		ui.Main.loadmore_messages_success(self, result, false);
	});
},

load_messages_success:
function load_messages_success(self, json, sender) {
	self._footer.hide();
	if (json.length > 0) {
		self.since_id = json[0].id_str;
		if (sender === undefined) {
			sender = ((json[0].sender_screen_name == globals.myself.screen_name) ? false : true);
		}
		if (sender === true) { 
			ui.DMTabs.max_id_dm_get = json[json.length-1].id_str;	
		} else {
			ui.DMTabs.max_id_dm_sent = json[json.length-1].id_str;
		}
	}

	var user = '';
	var new_json = [];
	for (var obj in json) {
		user = (sender ? json[obj].sender : json[obj].recipient);
		if (ui.DMTabs.views[user.screen_name] == undefined) {
			ui.DMTabs.addTo_DM_header(self, user.screen_name, user.profile_image_url, true);
			ui.DMTabs.views[user.screen_name] = [];
		}
		ui.DMTabs.views[user.screen_name].push(json[obj]);
		if (ui.DMTabs.current_view === user.screen_name) {
			new_json.push(json[obj]);
		}
	}

	var ret = -1;
	if (ui.DMTabs.current_view) {
		if (ui.DMTabs.current_view == _('any')) {
			ret = ui.Main.add_tweets(self, json, false, true);
		} else {
			ret = ui.Main.add_tweets(self, new_json, false, true);
		}
	} else {
		if (json.length != 0 && self.item_type == 'id') {
		        var current_profile = conf.get_current_profile();
		        var prefs = current_profile.preferences;
		        if (!prefs.hasOwnProperty('views_lastest_id')) {
		            prefs.views_lastest_id = {};
		        }
		        var latest_id = prefs.views_lastest_id[self.name + '_latest_id'] || "0";
		        var last_id = json[json.length - 1].id_str;
		        if (util.compare_id(last_id, latest_id) > 0) {
		            prefs.views_lastest_id[self.name + '_latest_id'] = last_id;
		        }
		        self.incoming_num = 0;
			for (var i = 0; i < json.length; i++) {
				if (util.compare_id(json[i].id_str, latest_id) > 0) self.incoming_num += 1;
			}
		} else {
		        self.incoming_num = 0;
		}	
	}
	
	if ((ret == 0) || (self.incoming_num <= 0)) {
		return json.length;
	}

	// Notify! // 4.0: Optimizations
	ui.Slider.set_unread(self.name);
	if (ui.Main.views[self.name].use_notify) {
		// Check for too notifications
		var index = 0;
		if (self.incoming_num > 3) {
			for (var i = 0; i < self.incoming_num; i += 1) {
				index = i;
				if (json[i].sender.screen_name != globals.myself.screen_name) {
					ui.DMTabs.show_button_notify(self,json[i].sender.screen_name); // 2.2: New notification icon
				}
			}
			notification.notify_text(self.incoming_num + " " + _('new_notifications'), _('many_notifications_on_page') + " " + self.name, null);
		} else {
			for (var i = 0; i < self.incoming_num; i += 1) {
				if (json[index].sender.screen_name != globals.myself.screen_name) {
					notification.notify_tweet(json[i]);
					ui.DMTabs.show_button_notify(self,json[i].sender.screen_name); // 2.2: New notification icon
				}
			}
		}
		unread_alert(self.incoming_num);
	}
	if (ui.Main.views[self.name].use_notify_sound) {
		if (self.incoming_num == 1) {
			// Check if it's a sent message
			if (json[0].sender.screen_name != globals.myself.screen_name) {
				$('#audio_notify').get(0).play();
			}
		} else {
			$('#audio_notify').get(0).play();
		}
	}

	return json.length;
},

loadmore_messages_success:
function loadmore_messages_success(self, json, sender) {
	self._footer.hide();
	var user = '';
	for (var obj in json) {
		user = (sender ? json[obj].sender : json[obj].recipient);
		if (ui.DMTabs.views[user.screen_name] == undefined) {
			ui.DMTabs.addTo_DM_header(self, user.screen_name, user.profile_image_url, true);
			ui.DMTabs.views[user.screen_name] = [];
		}
		ui.DMTabs.views[user.screen_name].push(json[obj]);
	}
		
	if (json.length != 0 && self.item_type == 'id') {
		        var current_profile = conf.get_current_profile();
		        var prefs = current_profile.preferences;
		        if (!prefs.hasOwnProperty('views_lastest_id')) {
		            prefs.views_lastest_id = {};
		        }
		        var latest_id = prefs.views_lastest_id[self.name + '_latest_id'] || "0";
		        var last_id = json[json.length - 1].id_str;
		        if (util.compare_id(last_id, latest_id) > 0) {
		            prefs.views_lastest_id[self.name + '_latest_id'] = last_id;
		        }
		        self.incoming_num = 0;
		        for (var i = json.length - 1; json.length - 3 <= i && 0 <= i; i -= 1, self.incoming_num += 1) {
		            if (util.compare_id(json[i].id_str, latest_id) <= 0) {
		                break;
		            }
		        }
	} else {
		        self.incoming_num = 0;
	}

	if (ui.DMTabs.no_more_get && ui.DMTabs.no_more_sent) {
		$('#dm_load_more').attr("disabled","disabled");
	} 
	
	if (0 < self.incoming_num) {
	        ui.Slider.set_unread(self.name);
	}
	toast.set(_('successfully'));
	
	return ret;
},

load_tweet_success:
function load_tweet_success(self, json) {
    var original_json = JSON.parse(JSON.stringify(json)); // Fix for notifications order 
    
    var ret = ui.Main.add_tweets(self, json, false);
    
    if ((ret == 0) || (self.incoming_num <= 0)) { // Nothing to notify
        return json.length;
    }
    
    hotot_log('incoming_num of '+self.name, self.incoming_num);
    
    // Notify!
    ui.Slider.set_unread(self.name);
    if (ui.Main.views[self.name].use_notify) {
	// Check for too notifications
	if (self.incoming_num > 3) {
		notification.notify_text(self.incoming_num + " " + _('new_notifications'), _('many_notifications_on_page') + " " + self.name, null);
	} else {
		for (var i = 0; i < self.incoming_num; i += 1) {
			notification.notify_tweet(original_json[i]);
		}
	}
        unread_alert(self.incoming_num);
    }
    if (ui.Main.views[self.name].use_notify_sound) {
            $('#audio_notify').get(0).play();
    }
    
    return json.length;
},

load_people_success:
function load_people_success(self, json) {
    var ret = ui.Main.add_people(self, json.users);
    if (0 < self.incoming_num) {
        ui.Slider.set_unread(self.name);
    }
    return ret;
},

load_list_success:
function load_list_success(self, json) {
    var ret = ui.Main.add_people(self, json);
    if (0 < self.incoming_num) {
        ui.Slider.set_unread(self.name);
    }
    return ret;
},

load_listed_list_success:
function load_listed_list_success(self, json) {
    var ret = ui.Main.add_people(self, json.lists);
    if (0 < self.incoming_num) {
        ui.Slider.set_unread(self.name);
    }
    return ret;
},

loadmore_tweet_success:
function loadmore_tweet_success(self, json) {
    var ret = ui.Main.add_tweets(self, json, true);
    if (0 < self.incoming_num) {
        ui.Slider.set_unread(self.name);
    }
    return ret;
},

loadmore_people_success:
function loadmore_people_success(self, json) {
    var ret = ui.Main.add_people(self, json.users);
    if (0 < self.incoming_num) {
        ui.Slider.set_unread(self.name);
    }
    return ret;
},

loadmore_listed_list_success:
function loadmore_listed_list_success(self, json) {
    var ret = ui.Main.add_people(self, json.lists);
    if (0 < self.incoming_num) {
        ui.Slider.set_unread(self.name);
    }
    return ret;
},

load_retweets:
function load_retweets_of_me(view, success, fail) {
    globals.twitterClient.get_retweets_of_me(view.since_id , null, conf.get_current_profile().preferences.items_per_request, success);
},

loadmore_retweets:
function load(view, success, fail) {
    globals.twitterClient.get_retweets_of_me(null, view.max_id, conf.get_current_profile().preferences.more_items_per_request, success);
},

destroy_view:
function destroy_view(view) {
    ui.Slider.remove(view.name);
},

add_people:
function add_people(self, users) {
    var new_tweets_height = 0;
    var html_arr = [];
    for (var i = 0, l = users.length; i < l; i += 1) {
        html_arr.push(self.former(users[i], self.name));
    }
    self._body.append(html_arr.join('\n'));
    // if timeline is not on the top
    // resume to the postion before new tweets were added
    // offset = N* (clientHeight + border-width)
    // @TODO
    if (self.hasOwnProperty('_me') && self.resume_pos) {
        self._content.get(0).scrollTop += new_tweets_height + users.length;
    }

    // @TODO dumps to cache
    // bind events
    for (var i = 0, l = users.length; i < l; i += 1) {
        ui.Main.bind_tweet_action('#'+self.name + '-' + users[i].id_str );
    }
    toast.hide();
    return users.length;
},

add_tweets:
function add_tweets(self, json_obj, reversion, ignore_filter) {
/* Add one or more tweets to a specifed container.
 * - Choose a template-filled function which correspond to the json_obj and
 *   Add it to the container in order of tweets' id (in order of post time).
 *   ** Note that as some tweets was retweeted by users, whose appearance is
 *   different, include timestamp, text, screen_name, etc. However, the DOM
 *   id of them are the original id and they have a new DOM attribute
 *   'retweet_id' which should be used to handle retweeted tweets by Hotot.
 *
 * - Argument container is the jQuery object where the json_obj will be add.
 *   The container.pagename indicate the pagename of the container. If the
 *   tweet in a thread, the container.pagename should be assigned with the
 *   id of the lastest tweet.
 */
    ui.Main.unique(json_obj);

    // Mute filters
    if (conf.get_current_profile().preferences.filter_framework && 
	(ignore_filter == undefined || ignore_filter == false)) {  
		json_obj = filter.apply_filtering(json_obj);
    }
    
    var new_tweets_height = 0;
    
    // sort
    // if reversion: large ... small
    // else:         small ... large
    ui.Main.sort(json_obj, reversion);

    // insert the isoloated tweets.
    var i = 0;
    var batch_arr = [];
    while (i < json_obj.length) {
	if (self && self.hide_rt && json_obj[i].hasOwnProperty('retweeted_status')) { // 3.6: Hide every RT in home
		// Remove the unwanted tweet from json_obj
		json_obj.splice(i, 1);
	} else {
		var ret = ui.Main.insert_isolated_tweet(self, json_obj[i], reversion)
		if (ret == -1) {
			// remove the duplicate tweet from json_obj
			json_obj.splice(i, 1);
		} else if (ret > 0) {
			var dom_id = self.name + '-' + json_obj[i].id_str;
			new_tweets_height += $('#'+dom_id).get(0).clientHeight;
			i += 1;
		} else { // ret[0] == 0
			batch_arr.push(json_obj[i])
			i += 1;
		}
	}	
    }
    // insert in batch
    ui.Main.sort(batch_arr, true);
    var batch_html = $.map(batch_arr, function (n, i) {
        return self.former(n, self.name, self.thread_container);
    }).join('');
    if (reversion) {
        self._body.append(batch_html);
    } else {
        self._body.prepend(batch_html);
    }

    // preload
    if (ui.Main.use_preload_conversation && self.hasOwnProperty('_me')) {
        for (var i = 0; i < json_obj.length; i += 1) {
            if (json_obj[i].in_reply_to_status_id_str == null
                && json_obj[i].in_reply_to_status_id == null) {
                continue;
            }
            var dom_id = self.name + '-' + json_obj[i].id_str;
            var thread_container = $($(
                    '#'+dom_id+' .tweet_thread')[0]);
            var listview = {'name': dom_id
                , 'thread_container': true
                , 'former': ui.Template.form_tweet
                , '_body': thread_container};
            ui.Main.preload_thread(listview, json_obj[i]);
        }
    }

        // calculator the height of remaining tweets
        for (var i = 0; i < batch_arr.length; i += 1) {
            var dom_id = self.name+'-'+batch_arr[i].id_str;
	    if ($('#'+dom_id).get(0)) new_tweets_height += $('#'+dom_id).get(0).clientHeight;
        }
        
        // if timeline is not on the top
        // resume to the postion before new tweets were added
        // offset = N* (clientHeight + border-width)
        if (self.hasOwnProperty('_me') && self.resume_pos) {
            /*
            self._me.animate(
                {scrollTop: (self._me.get(0).scrollTop + new_tweets_height + json_obj.length) + 'px'}, 200);
                */
            self._content.get(0).scrollTop += new_tweets_height + json_obj.length;
        }
	
    // dumps to cache
    db.dump_tweets(json_obj);

    if (!reversion && json_obj.length != 0 && self.item_type == 'id') {
        var current_profile = conf.get_current_profile();
        var prefs = current_profile.preferences;
        if (!prefs.hasOwnProperty('views_lastest_id')) {
            prefs.views_lastest_id = {};
        }
        var latest_id = prefs.views_lastest_id[self.name + '_latest_id'] || "0";
        var last_id = json_obj[json_obj.length - 1].id_str;
        if (util.compare_id(last_id, latest_id) > 0) {
            prefs.views_lastest_id[self.name + '_latest_id'] = last_id;
        }
        self.incoming_num = 0;
        for (var i = json_obj.length - 1; json_obj.length - 3 <= i && 0 <= i; i -= 1, self.incoming_num += 1) {
            if (util.compare_id(json_obj[i].id_str, latest_id) <= 0) {
                break;
            }
        }
    } else {
        self.incoming_num = 0;
    }

    // bind events
    for (var i = 0, l = json_obj.length; i < l; i += 1) {
	var jid = json_obj[i].id_str;
        ui.Main.bind_tweet_action('#'+self.name +'-'+jid);
	//3.6: Fix for RT on home
	if (json_obj[i].retweeted_status && json_obj[i].user.screen_name === globals.myself.screen_name) {
		var li = $('.card[tweet_id="'+jid+'"]');
		li.attr('my_retweet_id', jid);
		li.addClass('retweeted');
	}
    }

    return json_obj.length;
},

sort:
function sort(json_obj, reversion) {
    if (1 < json_obj.length) {
        json_obj.sort(function (a, b) {
            if (reversion)  {
                return util.compare_id(b.id_str, a.id_str);
            } else {
                return util.compare_id(a.id_str, b.id_str);
            }
        });
    }
},

insert_isolated_tweet:
function insert_isolated_tweet(self, tweet, reversion) {
    /* insert this tweet into a correct position in the order of id.
     * if the tweet is isoloated, then insert it & return [c, html]
     * if the tweet isn't isoloated, then return [0, html]
     * if the tweet is duplicate, return [-1, null]
     * */
    
    var this_one = tweet;
    var this_one_html;
    var next_one = ui.Main.get_next_tweet_dom(self, null, reversion);
    var c = 0;
    while (true) {
        if (next_one == null) {
            // insert to end of container
            // or the top of the container,
            // according to argument `reversion`
            if (c != 0) {
		this_one_html = self.former(this_one, self.name, self.thread_container);   
                if (reversion) {
                    self._body.prepend(this_one_html);
                } else {
                    self._body.append(this_one_html);
                }
            }
            return c;
        } else {
            var next_one_id = $(next_one).attr('tweet_id');
            var cmp_ret = util.compare_id(next_one_id, this_one.id_str);
            if (cmp_ret == 0) {
                //next_one_id == this.id_str
                return -1;
            } else if (cmp_ret == -1) {
                //next_one_id < this.id_str
                if (reversion) {
                    next_one = ui.Main.get_next_tweet_dom(self, next_one, reversion);
                } else {
                    if (c != 0) { 
			this_one_html = self.former(this_one, self.name, self.thread_container);   
			$(next_one).before(this_one_html); 
		    }
                    return c;
                }
            } else {
                //next_one_id > this.id_str
                if (reversion) {
                    if (c != 0) { 
			this_one_html = self.former(this_one, self.name, self.thread_container);   
			$(next_one).after(this_one_html); 
		    }
                    return c;
                } else {
                    next_one = ui.Main.get_next_tweet_dom(self, next_one, reversion);
                }
            }
        }
        c += 1;
    }
},

insert_isolated_tweet2:
function insert_isolated_tweet2(self, tweet, reversion) {
    /* insert this tweet into a correct position in the order of id.
     * if the tweet is isoloated, then insert it & return [c, html]
     * if the tweet isn't isoloated, then return [0, html]
     * if the tweet is duplicate, return [-1, null]
     * */
    
    var this_one = tweet;
    var this_one_html = self.former(this_one, self.name, self.thread_container);    
    var next_one = ui.Main.get_next_tweet_dom(self, null, reversion);
    var c = 0;
    while (true) {
        if (next_one == null) {
            // insert to end of container
            // or the top of the container,
            // according to argument `reversion`
            if (c != 0) {
                if (reversion) {
                    self._body.prepend(this_one_html);
                } else {
                    self._body.append(this_one_html);
                }
            }
            return [c, this_one_html];
        } else {
            var next_one_id = $(next_one).attr('tweet_id');
            var cmp_ret = util.compare_id(next_one_id, this_one.id_str);
            if (cmp_ret == 0) {
                //next_one_id == this.id_str
                return [-1, null];
            } else if (cmp_ret == -1) {
                //next_one_id < this.id_str
                if (reversion) {
                    next_one = ui.Main.get_next_tweet_dom(self, next_one, reversion);
                } else {
                    if (c != 0) { $(next_one).before(this_one_html); }
                    return [c, this_one_html];
                }
            } else {
                //next_one_id > this.id_str
                if (reversion) {
                    if (c != 0) { $(next_one).after(this_one_html); }
                    return [c, this_one_html];
                } else {
                    next_one = ui.Main.get_next_tweet_dom(self, next_one, reversion);
                }
            }
        }
        c += 1;
    }
},

insert_favorited:
function insert_favorited(tweet) {   
	var view = ui.Main.views.mentions;
	if (view) {
		var html = view.former(tweet, view.name, view.thread_container);
		view._body.prepend(html);
		ui.Main.bind_tweet_action('#'+view.name +'-'+tweet.id_str);
		if (view.use_notify) {
			var text = "@" + tweet.favorited_by.screen_name + " " +  _('liked_your_tweet');
			notification.notify_text(_('liked'), text, tweet.favorited_by.profile_image_url);
		}   
		if (view.use_notify_sound) $('#audio_notify').get(0).play();
	}
		
},

insert_new_follower:
function insert_new_follower(tweet) {   
	var view = ui.Main.views.mentions;
	if (view) {
		var html = ui.Template.form_new_follower(tweet, view.name);
		view._body.prepend(html);
		ui.Main.bind_tweet_action('#'+view.name +'-'+tweet.id_str);
		if (view.use_notify) notification.notify_fav(tweet);
		if (view.use_notify_sound) $('#audio_notify').get(0).play();
	}
},

get_next_tweet_dom:
function get_next_tweet_dom(view, current, reversion) {
    /* return the next/prev brother DOM of current.
     * if current is null, return the first/last DOM of tweets
     * if no tweet at the next position, return null
     * */
    var next_one = null;
    if (current == null) {
        next_one = reversion? view._body.find('.card:last')
            : view._body.find('.card:first');
    } else {
        next_one = reversion? $(current).prev('.card')
            : $(current).next('.card');
    }
    if (next_one.length == 0) next_one = null;
    return next_one;
},

bind_tweet_action:
function bind_tweet_action(id) {
    $(id).click(
    function (event) {
        if (event.button == 0) {
            var id = '#' + this.id;
            $(ui.Main.selected_tweet_id).removeClass('selected');
            ui.Main.selected_tweet_id = id;
            $(id).addClass('selected');
            ui.ContextMenu.hide();
            ui.Main.closeTweetMoreMenu();
        }
        event.stopPropagation();
    }).mouseover(function (event) {
        ui.Main.set_active_tweet_id('#' + this.id);
        event.stopPropagation();
    }).hover(function (event) {
        event.stopPropagation();
        $(this).children('.tweet_bar').show();
        var p = $(event.target).parents('.tweet_thread_wrapper');
        if (p.length > 0) {
            p.siblings('.tweet_bar').hide();
        }
    }, function (event) {
        event.stopPropagation();
        $(this).children('.tweet_bar').hide();
        var p = $(event.target).parents('.tweet_thread_wrapper');
        if (p.length > 0 && $(event.relatedTarget).parents('.card')[0] === p.parents('.card')[0]) {
            p.siblings('.tweet_bar').show();
        }
    });

        $(id).find('a[target]').click(function (ev) {
            if (ev.which != 1 && ev.which != 2) {
                return;
            }

            var link = $(this).attr('href');
            if (chrome && chrome.tabs) {
                chrome.tabs.create(
                  { url: link, active: ev.which == 1 },
                  function(){}
                )
                return false;
            }
        });


    $(id).find('a[full_text_id]').unbind().click(function (ev) {
        var full_text_id = $(this).attr('full_text_id');
        globals.network.do_request('GET', 
            'http://hotot.in/tweet/'+full_text_id+'.json', 
            {}, {}, null,
            function (result) {
                if (result && result.full_text) {
                    $(id).find('.text_inner:eq(0) a').unbind();
                    $(id).find('.text_inner:eq(0)').empty();
                    $(id).find('.text_inner:eq(0)').html(
                        ui.Template.form_text_raw(result.full_text)
                    );
                    ui.Main.bind_tweet_action(id);
                } 
            },
            function () {
                toast.set(_('twitlonger_fail')).show();
            });
        return false;
    });

    //Twitlonger
    $(id).find('a[twitlonger]').unbind().click(function (ev) {
	jQuery.ajax({    
                type: 'GET',
                url: "http://www.twitlonger.com/api_read/" + $(this).attr('twitlonger'),
                beforeSend: 
                function(xhr) {
                    xhr.setRequestHeader("Content-Type", "text");
                },
                success: 
                function(result, textStatus, xhr) {
			$(id).find('.text_inner:eq(0) a').unbind();
	                $(id).find('.text_inner:eq(0)').empty();
	                $(id).find('.text_inner:eq(0)').html(ui.Template.form_text_raw($(result).find('content').text()));
	                ui.Main.bind_tweet_action(id);			
                },
                error: 
                function (result, textStatus, xhr) {
		    console.error(result);
                    toast.set(_('twitlonger_fail')).show();
                }
	}); 
        return false;
    });
    
    // 1.1: Vine - 2.2: Close button
    $(id).find('a[vine]').unbind().click(function (ev) {
	var size = ((globals.tweet_block_width < 580) ? (globals.tweet_block_width-100) : 480);
	var tweet_id = ui.Main.active_tweet_id;
	var text = $(tweet_id + ' .card_body').children('.text');
	var ht = $(tweet_id + ' > .card_body > .vine-embed');
	if (ht.length == 0) {
		$(tweet_id + ' .card_body').first().append(
		'<div class="vine-embed">\
		<a id="vine_close" href="#"><span class="ic_close" style="display:inline-block;width:16px;height:16px;vertical-align:top;position:absolute;"></span></a>\
		<iframe style="background-color:rgba(0,0,0,0.1);border: 1px inset;"\
		src="' + $(this).attr('vine') + '/embed/simple?audio=1" width="' + size + '" height="' + size + '" frameborder="0" ></iframe>\
		</div>'
		);	
		$(id).find('#vine_close').click(function () {
			$(ui.Main.active_tweet_id + ' > .card_body > .vine-embed').remove();
			return false;
		});	  		
	}
        return false;
    });
    
    // 1.1: Twit
    $(id).find('a[twit]').unbind().click(function (ev) {
	var tweet_id = ui.Main.active_tweet_id;
	var tid = $(this).attr('twit');
	var ht = $(tweet_id + ' > .card_body > .text > .twitter-tweet-' + tid);
	if (ht.length === 0) {
	    db.get_tweet(tid,
		function (value) {
			if (value.id_str === undefined) {
				globals.twitterClient.show_status(tid,
					function (result) {
						$(tweet_id + ' .card_body > .text').first().append('<div class="quoted_tweet twitter-tweet-' + tid + '"><ul>' 
						+ ui.Template.form_quoted(result)
						+ '</ul></div>');
						ui.Main.bind_tweet_action(id);
						db.dump_tweets([result]);
					}
				);
			} else {
				$(tweet_id + ' .card_body > .text').first().append('<div class="quoted_tweet twitter-tweet-' + tid + '"><ul>' 
				+ ui.Template.form_quoted(value)
				+ '</ul></div>');
				ui.Main.bind_tweet_action(id);
			}
		});
    
	}
        return false;
    });
    
    /*
    //4.0: Embedly support (needs more work! Maybe in future...)
    $(id).find('a[embedly]').unbind().click(function (ev) { 
	var tweet_id = ui.Main.active_tweet_id;
	var ht = $(tweet_id + ' > .card_body > .embedly');
	if (ht.length === 0) {
		var url = $(this).attr('href');
		var params = {
			'key': "",
			'url': url
    		};
		globals.network.do_request('GET', "http://api.embed.ly/1/oembed", params, null, null,
			function(json) {
				if (json.type === 'link') {
					$(tweet_id + ' .card_body').first().append(
						'<div class="embedly" style="border: dotted 1px; margin: 10px 0 10px 0;"><h2>' + json.title + '</h2>\
						<img src="' + json.thumbnail_url + 
						'" style="max-width:128px;max-height:128px;display:inline;margin:5px;" />' 
						+ '<p>' + json.description + '</p>' +
						'</div>'
					);
				}
			},
			function(error) {
				console.error("Embledy ERROR.");
			}
		);
	}
	return false;
    });
    */
    
    // Twitter Video
    $(id).find('a[twitter_video]').unbind().click(function (ev) {
    	var url = $(this).attr('href');
	var processData = function (data) {
		var src = $(data).find('iframe').attr('src');
		if (src) {
			ui.Previewer.reload_proc_video(src);
			ui.Previewer.open();
			return false;		
		}
	} 
  
	$.ajax({
	        url: url,
	        success: function(data, textStatus, jqXHR) {
			processData(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status === 200) {
				processData(jqXHR.responseText);
			} else {
				console.error(errorThrown);
			}
		}
	});
	return false;
    });
    
    // Streaming video
    $(id).find('a[hls]').unbind().click(function (ev) {
    	var url = $(this).attr('hls');
	var type = $(this).attr('type');
	ui.Previewer.reload_proc_streaming(url,type);
	ui.Previewer.open();
	return false;
    });    


    // Masked twit with mute filters
    $(id).find('a[masked_id]').unbind().click(function (ev) {
	var mid = $(this).attr('masked_id');
	globals.twitterClient.show_status(mid,
		function (result) {
			$(id).find('.text_inner:eq(0) a').unbind();
			$(id).find('.text_inner:eq(0)').empty();
			$(id).find('.text_inner:eq(0)').html(
				ui.Template.form_text_raw(result.text)
			);
			ui.Main.bind_tweet_text_action(id);
		}
	);
        return false;
    });
    
    $(id).find('a[direct_url]').click(function () {
        var direct_url = $(this).attr('direct_url');
        if (typeof (direct_url) != 'undefined') {
            ui.Previewer.reload_proc(direct_url);
            ui.Previewer.open();
            return false;
        }
        return false;
    });
    
    $(id).find('a[youtube_id]').click(function () {
        var id = $(this).attr('youtube_id');
        if (typeof (id) != 'undefined') {
	    var src = 'http://www.youtube.com/embed/' + id + '?rel=0&autoplay=1';
            ui.Previewer.reload_proc_video(src);
            ui.Previewer.open();
            return false;
        }
        return false;
    });      
    
    $(id).find('a[dailymotion_id]').click(function () {
        var id = $(this).attr('dailymotion_id');
        if (typeof (id) != 'undefined') {
	    var src = 'http://www.dailymotion.com/embed/video/' + id + '?related=0&autoplay=1';
            ui.Previewer.reload_proc_video(src);
            ui.Previewer.open();
            return false;
        }
        return false;
    }); 
    
    $(id).find('.profile_img_wrapper').click(function() {
	var link = $(this).attr('href');
	if (link) {
	        ui.Previewer.reload(link.replace("_normal",""))
	        ui.Previewer.open();
	}
        return false;	
    });
    
    ui.Main.bind_tweet_text_action(id);

    $(id).find('.btn_tweet_thread:first').click(
    function (event) {
        ui.Main.on_expander_click(this, event);
    });

    $(id).find('.btn_tweet_thread_more:first').click(
    function (event) {
        ui.Main.on_thread_more_click(this, event);
    });

    $(id).find('.tweet_source a.show').click(
    function (event) {
        var _this = $(this);
        var tweet_id = _this.attr("tweet_id");
        var list = $(".tweet_retweeters[tweet_id='" + tweet_id + "']");
        _this.text(_('loading_dots'));
        globals.twitterClient.get_retweeted_by_whom(tweet_id, 100, function(result) {
            if (_this == null) {
                return;
            }
            list.empty();
            var ul = $('<ul/>').appendTo(list);
            for (var i = 0, l = result.length; i < l; i++) {
                var p = result[i]['user'];
                var li = $('<li/>');
                var a = $('<a/>').appendTo(li).attr('href', '#' + p.screen_name);
		$('<img height="24" width="24"/>').attr({'title': '@' + p['screen_name'] + ' (' + p['name'] + ')', 'src': p['profile_image_url_https']}).appendTo(a);
                a.click(function(event) {
                    if (event.which == 1) {
                        open_people($(this).attr('href').substring(1));
                    } else if (event.which == 2) {
                        open_people($(this).attr('href').substring(1),{},true);
                    }
                });	
                li.appendTo(ul);
            }
            $("<span/>").text(result.length + (result.length == 1 ? (" " + _('person')) : (" " + _('people')) )).insertBefore(_this);
            _this.remove();
            _this = null;
        });
    });

    //tweet bar buttons
    $(id).find('.tweet_more_menu_trigger').click(function(event){
        if (ui.Main.isTweetMoreMenuClosed) {
            ui.Main.openTweetMoreMenu($(id), $(this));
        } else {
            ui.Main.closeTweetMoreMenu();
        }
        return false;
    });

    // type: tweet
    $(id).find('.tweet_reply_btn').click(function(ev) {
        if (conf.get_current_profile().preferences.use_alt_reply) {
            ui.Main.on_reply_all_click(this, ui.Main.active_tweet_id, ev);
        } else {
            ui.Main.on_reply_click(this, ui.Main.active_tweet_id, ev);
        }
        return false;
    }).mouseenter(function (ev) {
        if (conf.get_current_profile().preferences.use_alt_reply) {
            $(this).attr('title', _('reply_all'));
        } else {
            $(this).attr('title', _('reply_this_tweet'));
        }
    });

    $(id).find('.tweet_retweet_btn').click(
    function (ev) {
        if (conf.get_current_profile().preferences.use_alt_retweet) {
            ui.Main.on_rt_click(this, ui.Main.active_tweet_id, ev);
        } else {
            ui.Main.on_retweet_click(this, ui.Main.active_tweet_id, ev);
        }
        return false;
    }).mouseenter(function (ev) {
        if (conf.get_current_profile().preferences.use_alt_retweet) {
            $(this).attr('title', _('quote_title'));
        } else {
            $(this).attr('title', _('retweet_title'));
        }
    });
    $(id).find('.tweet_fav_btn').click(
    function (event) {
        ui.Main.on_fav_click(this, ui.Main.active_tweet_id, event);
        return false;
    });

    // type: message
    $(id).find('.tweet_dm_reply_btn').click(
    function (event) {
        ui.Main.on_dm_click(this, ui.Main.active_tweet_id, event);
        return false;
    });
    $(id).find('.tweet_dm_delete_btn').click(
    function (event) {
        ui.Main.on_dm_delete_click(this, ui.Main.active_tweet_id, event);
        return false;
    });

    // type: people
    $(id).find('.follow_btn').click(
    function (event) {
        ui.Main.on_follow_btn_click(this, ui.Main.active_tweet_id, event);
    });
    $(id).find('.unfollow_btn').click(
    function (event) {
        ui.Main.on_unfollow_btn_click(this, ui.Main.active_tweet_id, event);
    });
},

bind_tweet_text_action:
function bind_tweet_text_action(id) {
    $(id).find('.who_href').click(
    function (event) {
        if (event.which == 1) {
            open_people($(this).attr('href').substring(1));
        }else if (event.which == 2) {
            open_people($(this).attr('href').substring(1), {}, true);
        }
        return false;
    });

    $(id).find('.list_href').click(
    function (event) {
        var target = $(this).attr('href').substring(1).split('/');
        open_list(target[0], target[1]);
        return false;
    });

    $(id).find('.hash_href').click(
    function (event) {
	if ($('#hashtag_menu').is(":visible")) {
            ui.Main.closeHashtagMenu();
        } else {
	    ui.Main.openHashtagMenu($(id), $(this));
        }
        return false;
    });
},

unbind_tweet_action:
function unbind_tweet_action(li_id){
    $(li_id + ' a').unbind();
    $(li_id).unbind();
},

on_reply_click:
function on_reply_click(btn, li_id, event) {
    var li = $(li_id);
    var id = (li.attr('retweet_id') == '' || li.attr('retweet_id') == undefined) ? li.attr('tweet_id'): li.attr('retweet_id');
    var screen_name = li.attr('screen_name');
    var text = $(li.find('.text')[0]).text();
    var orig_text = $('#tbox_status').val();

    ui.StatusBox.reply_to_id = id;
    ui.StatusBox.set_reply_info(screen_name, text);
    if (screen_name.toLowerCase() !== globals.myself.screen_name.toLowerCase()) {
	if (event && event.shiftKey) {
	        if (orig_text.indexOf('@'+screen_name) == -1) {
			ui.StatusBox.insert_status_text('@' + screen_name + ' ', null);
		}
	} else {
	        ui.StatusBox.set_status_text("@" + screen_name + ' ');
	}
    }
    ui.StatusBox.open(
    function() {
        ui.StatusBox.move_cursor(ui.StatusBox.POS_END);
        ui.StatusBox.change_mode(ui.StatusBox.MODE_REPLY);
    });
},

on_rt_click:
function on_rt_click(btn, li_id, event) {
    var li = $(li_id);
    var screen_name = li.attr('screen_name');
    var _text = $(li.find('.text')[0]);
    var text = _text.attr('alt') || _text.text();

    ui.StatusBox.set_status_text(" RT @" + screen_name
        + ': ' + text + ' ');
    ui.StatusBox.open(
    function() {
        ui.StatusBox.move_cursor(ui.StatusBox.POS_BEGIN);
        ui.StatusBox.change_mode(ui.StatusBox.MODE_TWEET);
        ui.StatusBox.update_status_len();
    });
},

on_retweet_click:
function on_retweet_click(btn, li_id, event) {
    var li = $(li_id);
    var id = (li.attr('retweet_id') == '' || li.attr('retweet_id') == undefined) ? li.attr('tweet_id'): li.attr('retweet_id');
    if (li.hasClass('retweeted')) {
        var rt_id = li.attr('my_retweet_id')
        toast.set(_('undo_retweeting_dots')).show();
        globals.twitterClient.destroy_status(rt_id,
        function (result) {
            toast.set(_('undo_successfully')).show();
	    li.removeClass('retweeted');
	    $('.card[my_retweet_id="'+rt_id+'"]').removeClass('retweeted');  
        });
    } else {
        toast.set(_('retweeting_dots')).show();
        globals.twitterClient.retweet_status(id,
        function (result) {
            li.attr('my_retweet_id', result.id_str);
            li.addClass('retweeted');
	    li.find('.icon_rtd_value').text(result.retweet_count);	    
	    if (ui.Main.views['home']) {
		ui.Main.add_tweets(ui.Main.views['home'], [result], false, true);
	    }
	    toast.set(_('retweet_successfully')).show();
        });
    }
},

on_qt_click:
function on_qt_click(btn, li_id, event) {
	var li = $(li_id);
	ui.StatusBox.add_quote('https://twitter.com/' + li.attr('screen_name') + '/status/' + li.attr('tweet_id'));
	ui.StatusBox.open(
		function() {
			ui.StatusBox.move_cursor(ui.StatusBox.POS_BEGIN);
			ui.StatusBox.update_status_len();
		});
},

on_reply_all_click:
function on_reply_all_click(btn, li_id, event) {
    var li = $(li_id);
    var id = (li.attr('retweet_id') == '' || li.attr('retweet_id') == undefined) ? li.attr('tweet_id'): li.attr('retweet_id');
    var screen_name = li.attr('screen_name');
    var text = $(li.find('.text')[0]).text();
    var orig_text = $('#tbox_status').val();
    // @TODO reduce this process by entities
    var who_names = ((screen_name.toLowerCase() !== globals.myself.screen_name.toLowerCase()) ? [ '@' + screen_name] : []);
    var match = ui.Template.reg_user.exec(text);
    while (match != null ) {
	if (match[2].toLowerCase() !== globals.myself.screen_name.toLowerCase()) {
		who_names.push('@' + match[2]);
	}
        match = ui.Template.reg_user.exec(text);
    }
    
    ui.StatusBox.reply_to_id = id;
    ui.StatusBox.set_reply_info(screen_name, text);
    if (event && event.shiftKey) {
        ui.StatusBox.append_status_text(who_names.join(' ') + ' ');
    } else {
        ui.StatusBox.set_status_text(who_names.join(' ') + ' ');
    }
    ui.StatusBox.open(
    function() {
        ui.StatusBox.move_cursor(ui.StatusBox.POS_END);
        ui.StatusBox.change_mode(ui.StatusBox.MODE_REPLY);
    });

},

on_dm_click:
function on_dm_click(btn, li_id, event) {
    var li = $(li_id);
    var screen_name = (li.attr('screen_name') == '' || li.attr('screen_name') == undefined)
        ?li.attr('sender_screen_name'):li.attr('screen_name');
    ui.StatusBox.set_dm_target(screen_name);
    ui.StatusBox.set_status_text('');
    ui.StatusBox.open(
    function () {
        ui.StatusBox.change_mode(ui.StatusBox.MODE_DM);
        ui.StatusBox.move_cursor(ui.StatusBox.POS_END);
    });
},

on_edit_click:
function on_edit_click(btn, li_id, event) {
    var li = $(li_id);
    var id = (li.attr('retweet_id') == '' || li.attr('retweet_id') == undefined) ? li.attr('tweet_id'): li.attr('retweet_id');
    
    globals.twitterClient.show_status(id,
	function (result) {
		var testo = (result.full_text ? result.full_text : result.text);
		var reply_id = result.in_reply_to_status_id_str;
		var reply_recipient = result.in_reply_to_screen_name;
		
		globals.twitterClient.destroy_status(id, function () {
			ui.StatusBox.last_sent_text = "";
			ui.StatusBox.set_status_text(testo);
			ui.StatusBox.open(
			function () {
				if (reply_id !== null) {
					ui.StatusBox.change_mode(ui.StatusBox.MODE_REPLY);
					ui.StatusBox.reply_to_id = reply_id;
					ui.StatusBox.set_reply_info(reply_recipient, testo);
				} else {
					ui.StatusBox.change_mode(ui.StatusBox.MODE_TWEET);
				}
				ui.StatusBox.move_cursor(ui.StatusBox.POS_END);
				ui.StatusBox.update_status_len();
			});			
		});	
    	}
    );   
},

on_del_click:
function on_del_click(btn, li_id, event) {
    var li = $(li_id);
    var id = (li.attr('retweet_id') == '' || li.attr('retweet_id') == undefined) ? li.attr('tweet_id'): li.attr('retweet_id');

    if (confirm(_('delete_confirm'))) {
	toast.set(_('destroy')).show();
	if (li.attr('type') === 'message') {
	        globals.twitterClient.destroy_direct_messages(id,function (result) {
			for (var i = 0; i < ui.DMTabs.views[ui.DMTabs.current_view].length; i++) {
				if (ui.DMTabs.views[ui.DMTabs.current_view][i].id_str == li.attr('tweet_id')) {
					ui.DMTabs.views[ui.DMTabs.current_view].splice(i,1);
					break;
				}
			}
    			ui.Main.unbind_tweet_action(li_id);
			li.remove();		
			toast.set(_('destroy_successfully')).show();
		});
	} else {
	        globals.twitterClient.destroy_status(id,
	        function (result) {
		ui.Main.unbind_tweet_action(li_id);
		li.remove();
		toast.set(_('destroy_successfully')).show();
		});
	}
    }
},

on_hide_click:
function on_hide_click(btn, li_id, event) {
    var li = $(li_id);
    li.remove();
    toast.set(_('hidden_successfully')).show();
},

on_fav_click:
function on_fav_click(btn, li_id, event) {
    var li = $(li_id);
    var id = (li.attr('retweet_id') == '' || li.attr('retweet_id') == undefined) ? li.attr('tweet_id'): li.attr('retweet_id');
    if (li.hasClass('faved')) {
	toast.set(_('un_like_this_tweet_dots')).show();
        globals.twitterClient.destroy_favorite(id,
        function (result) {
            toast.set(_('successfully')).show();
            li.removeClass('faved');
	    li.find('.tweet_fav_indicator').css("background-image", "none"); 	
	    li.find('.icon_liked_value').text(result.favorite_count);
	    li.find('.icon_rtd_value').text(result.retweet_count);	        
        });
    } else {
	toast.set(_('like_this_tweet_dots')).show();
        globals.twitterClient.create_favorite(id,
        function (result) {
            toast.set(_('successfully')).show();
            li.addClass('faved');
	    li.find('.tweet_fav_indicator').first().css("background-image", "url(../image/tweet_like_indicator.png)"); 
	    li.find('.icon_liked_value').text(result.favorite_count);
	    li.find('.icon_rtd_value').text(result.retweet_count);
        });
    }
},

on_follow_btn_click:
function on_follow_btn_click(btn, li_id, event) {
    var li = $(li_id);
    if (li.attr('type') == 'people') {
        var screen_name = li.attr('screen_name');
        toast.set(_('follow_at') + screen_name + ' ' + _('dots')).show();
        globals.twitterClient.create_friendships(screen_name,
        function () {
            toast.set(
                _('follow_at') + screen_name+' '+ _('successfully')).show();
            li.attr('following', 'true').addClass('following');
        });
    } else if (li.attr('type') == 'list') {
        var screen_name = li.attr('screen_name');
        var slug = li.attr('slug');
        toast.set(_('follow_at') + screen_name + '/' + slug + ' ' + _('dots')).show();
        globals.twitterClient.create_list_subscriber(screen_name, slug,
        function () {
            toast.set(
                _('follow_at') + screen_name + '/' + slug + ' '+ _('successfully')).show();
            li.attr('following', 'true').addClass('following');
        });
    }
},

on_unfollow_btn_click:
function on_unfollow_btn_click(btn, li_id, event) {
    var li = $(li_id);
    if (li.attr('type') == 'people') {
        var screen_name = li.attr('screen_name');
        toast.set(_('unfollow_at') + screen_name + ' '+ _('dots')).show();
        globals.twitterClient.destroy_friendships(screen_name,
        function () {
            toast.set(
                _('unfollow_at') + screen_name+ ' '+ _('successfully')).show();
            li.attr('following', 'false').removeClass('following');
        });
    } else if (li.attr('type') == 'list') {
        var screen_name = li.attr('screen_name');
        var slug = li.attr('slug');
        toast.set(_('unfollow_at') + screen_name + '/' + slug + ' ' + _('dots')).show();
        globals.twitterClient.destroy_list_subscriber(screen_name, slug,
        function () {
            toast.set(
                _('unfollow_at') + screen_name + '/' + slug + ' '+ _('successfully')).show();
            li.attr('following', 'false').removeClass('following');
        });
    }
},

on_open_link_btn_click:
function on_open_link_btn_click(btn, li_id, event) {
    var li = $(li_id);
    var link = li.attr('link');
    if (link.length > 0) window.open(link, '_blank');
},

on_open_people_btn_click:
function on_open_people_btn_click(btn, li_id, event) {
    var li = $(li_id);
    var screen_name = (li.attr('screen_name') == '' || li.attr('screen_name') == undefined)
        ?li.attr('sender_screen_name'):li.attr('screen_name');
    if (screen_name !== undefined && screen_name !== '')
        open_people(screen_name);
},

on_thread_more_click:
function on_thread_more_click(btn, event) {
    var li = ui.Main.ctrl_btn_to_li(btn);
    var id = li.attr('retweet_id') == ''? li.attr('tweet_id'): li.attr('retweet_id');
    var reply_id = li.attr('reply_id');

    var thread_container = $(li.find('.tweet_thread')[0]);
    var listview = {'name': li.attr('id')
        , 'thread_container': true
        , 'former': ui.Template.form_tweet
        , '_body': thread_container};
    li.find('.tweet_thread_hint').show();

    ui.Main.load_thread_proc(listview, reply_id, function () {
        li.find('.tweet_thread_hint').fadeOut();
        $(btn).hide();
    });
},

on_expander_click:
function on_expander_click(btn, event) {
    var li = ui.Main.ctrl_btn_to_li(btn);
    var id = li.attr('retweet_id') == ''
        ? li.attr('tweet_id'): li.attr('retweet_id');
    var reply_id = li.attr('reply_id');

    var container = $(li.find('.tweet_thread')[0]);

    if ($(btn).hasClass('expand')) {
        $(btn).removeClass('expand');
        container.parent().hide();
    } else {
        $(btn).addClass('expand');
        container.parent().show();
        if (container.children('.card').length == 0) {
            li.find('.tweet_thread_hint').show();
            li.find('.btn_tweet_thread_more').hide();

            var listview = {'name': li.attr('id')
                , 'thread_container': true
                , 'former': ui.Template.form_tweet
                , '_body': container};
            ui.Main.load_thread_proc(listview, reply_id, function () {
                li.find('.tweet_thread_hint').fadeOut();
            }, function (xhr, textStatus, errorThrown) {
                li.find('.tweet_thread_hint').fadeOut();
            });
        }
    }
},

load_thread_proc:
function load_thread_proc(listview, tweet_id, on_finish, on_error) {
    var load_thread_proc_cb = function (prev_tweet_obj) {
        //listview.resume_pos = false;
        var count=ui.Main.add_tweets(listview, [prev_tweet_obj], true, true);
        // load the prev tweet in the thread.
        var reply_id = prev_tweet_obj.hasOwnProperty('in_reply_to_status_id_str') 
            ? prev_tweet_obj.in_reply_to_status_id_str: prev_tweet_obj.in_reply_to_status_id;
        if (reply_id == null) { // end of thread.
            on_finish();
            return ;
        } else {
            reply_id = reply_id.toString();
            ui.Main.load_thread_proc(listview, reply_id, on_finish, on_error);
        }
    }

    db.get_tweet(tweet_id,
    function (value) {
        if (value.id_str === undefined) {
            globals.twitterClient.show_status(tweet_id,
            function (result) {
                load_thread_proc_cb(result);
            }, on_error);
        } else {
            load_thread_proc_cb(value);
        }
    });
},

preload_thread:
function preload_thread(listview, tweet_obj) {
    var reply_id = tweet_obj.hasOwnProperty('in_reply_to_status_id_str') ? tweet_obj.in_reply_to_status_id_str: tweet_obj.in_reply_to_status_id;
    if (reply_id == null) return;
    reply_id = reply_id.toString();
    db.get_tweet(reply_id,
    function (value) {
        if (value.id_str !== undefined) {
            var prev_tweet_obj = value;
            var li = $(listview._body.parents('.card')[0]);
            ui.Main.add_tweets(listview, [prev_tweet_obj], true, true);
            li.find('.btn_tweet_thread').addClass('expand');
            li.find('.tweet_thread_hint').hide();
            if (prev_tweet_obj.in_reply_to_status_id == null) {
                li.find('.btn_tweet_thread_more').hide();
            }
            listview._body.parent().show();
        }
    });
},

move_to_tweet:
function move_to_tweet(pos) {
    var target = null;
    var current = null;
    var cur_view = null;
    if (ui.Main.selected_tweet_id != null) {
        current = $(ui.Main.selected_tweet_id);
    }
    // if we lose current placemarker ...
    if (current == null || current.length == 0) {
        cur_view = ui.Main.views[ui.Slider.current];
        if (!cur_view.hasOwnProperty('selected_item_id')) {
            cur_view.selected_item_id
                = '#'+ cur_view._body.find('.card:first').attr('id');
        }
        current = $(cur_view.selected_item_id);
    } else {
        cur_view= ui.Main.views[current.parents('.listview').attr('name')];
    }
    var container = cur_view._body;
    if (pos == 'top') {
        target = container.find('.card:first');
    } else if (pos == 'bottom') {
        container.find('.card').show();
        target = container.find('.card:last');
    } else if (pos == 'next') {
        target = current.next('.card');
    } else if (pos == 'prev') {
        target = current.prev('.card');
    } else if (pos == 'orig') {
        target = current;
    } else {
        cur_view = ui.Main.views[pos.split('-')[0].substring(1)];
        target = $(pos);
    }
    if (target.length == 0) {
        target = current;
    }
    if (target == null || target.length == 0) {
        // too bad
        return;
    }
    cur_view._content.stop().animate(
        {scrollTop: target.get(0).offsetTop - current.height()}, 300);
    current.removeClass('selected');
    target.addClass('selected');
    ui.Main.selected_tweet_id = '#'+ target.attr('id');
    cur_view.selected_item_id = ui.Main.selected_tweet_id;
    target.focus();
},

move_by_offset:
function move_by_offset(offset) {
    var current = null;
    var cur_view = null;
    if (ui.Main.selected_tweet_id != null) {
        current = $(ui.Main.selected_tweet_id);
    }
    // if we lose current placemarker ...
    if (current == null || current.length == 0) {
        cur_view = ui.Main.views[ui.Slider.current];
        if (!cur_view.hasOwnProperty('selected_item_id')) {
            cur_view.selected_item_id
                = '#'+ cur_view._body.find('.card:first').attr('id');
        }
        current = $(cur_view.selected_item_id);
    } else {
        cur_view= ui.Main.views[current.parents('.listview').attr('name')];
    }
    cur_view._content.get(0).scrollTop += offset;
},

set_active_tweet_id:
function set_active_tweet_id(id) {
    ui.Main.active_tweet_id = id;
},

openHashtagMenu:
function openHashtagMenu(li, btn) {
	var tag = btn.attr('href');
	$('#hashtag_filter_btn').attr('href', tag);
	$('#hashtag_filter_btn').parent().css('display', 'block');
	$('#hashtag_search_btn').attr('href', tag);
	$('#hashtag_search_btn').parent().css('display', 'block');
	$('#hashtag_follow_btn').attr('href', tag.toLowerCase());
	$('#hashtag_unfollow_btn').attr('href', tag.toLowerCase());
	// 5.5
	if (conf.get_current_profile().preferences.following_hashtags.indexOf(tag.toLowerCase()) === -1) {
		$('#hashtag_follow_btn').parent().css('display', 'block');
		$('#hashtag_unfollow_btn').parent().css('display', 'none');
	} else {
		$('#hashtag_follow_btn').parent().css('display', 'none');
		$('#hashtag_unfollow_btn').parent().css('display', 'block');
	}
	$('#hashtag_menu').css({'left': (btn.offset().left)+'px', 'top': (btn.offset().top - 50)+'px'}).show();
},

closeHashtagMenu:
function closeHashtagMenu() {
	$('#hashtag_menu').hide();
},

openTweetMoreMenu:
function openTweetMoreMenu(li, btn) {
    var type = li.attr('type'); 
    switch(type) {
	case 'people':
	case 'message':
	        $('#tweet_more_menu .separator').prevAll().hide();
		$('#tweet_view_replies_btn').parent().css('display', 'none');
	break;
	default: // tweet & search
	        $('#tweet_more_menu .separator').prevAll().show();
		$('#tweet_view_replies_btn').parent().css('display', 'block');
	break;
    }
    
    // deletable?
    if (li.attr('deletable') === 'true' || li.attr('type') === 'message') {
        $('#tweet_del_btn').parent().css('display', 'block');
    } else {
        $('#tweet_del_btn').parent().css('display', 'none');
    }

    //3.5: Edit tweet    
    // editable?
    if (li.attr('deletable') === 'true' && li.attr('type') != 'message') {
	$('#tweet_edit_btn').parent().css('display', 'block'); 
    } else {
	$('#tweet_edit_btn').parent().css('display', 'none'); 
    }    
    
    if (type != 'message') {
	        // retweet or quote?
	        if (conf.get_current_profile().preferences.use_alt_retweet &&
		li.attr('retweetable') == 'true') {
		$('#tweet_alt_retweet_btn').parent().css('display', 'block');
		$('#tweet_rt_btn').parent().css('display', 'none');
		} else {
		$('#tweet_alt_retweet_btn').parent().css('display', 'none');
		$('#tweet_rt_btn').parent().css('display', 'block');
		}
		// reply or reply all
		if (conf.get_current_profile().preferences.use_alt_reply) {
		$('#tweet_alt_reply_btn').parent().css('display', 'block');
		$('#tweet_reply_all_btn').parent().css('display', 'none');
		} else {
		$('#tweet_alt_reply_btn').parent().css('display', 'none');
		$('#tweet_reply_all_btn').parent().css('display', 'block');
		}
    }
    
    //2.2: Fix for height position
    var h = $(window).height();
    var mh = $('#tweet_more_menu').height();
    var start = btn.offset().top - 42;
    if (h < (start+mh+70)) {
	start = btn.offset().top - mh - 82;
    }
    $('#tweet_more_menu').css({'left': (btn.offset().left - 135)+'px', 'top': start+'px'}).show();
    ui.Main.isTweetMoreMenuClosed = false;
},

closeTweetMoreMenu:
function closeTweetMoreMenu() {
    $('#tweet_more_menu').hide();
    ui.Main.isTweetMoreMenuClosed = true;
},

unique:
function unique (items) {
    var o = {}, i, l = items.length;;
    for(i=0; i < l; i += 1)
        o[items[i].id_str] = items[i];
    items.splice(0, items.length);
    for(i in o) items.push(o[i]);
    return items;
},


ctrl_btn_to_li:
function ctrl_btn_to_li(btn) {
    return $($(btn).parents('.card')[0]);
},

get_google_translate_text:
function get_google_translate_text(dst_lang, text, callback) {
	var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + 
	encodeURIComponent(dst_lang) + "&dt=t&q=" + encodeURIComponent(text.replace(ui.Template.reg_link_g, ""));

	var processData = function (data) {
		var result = {};
	        result.responseData = {};
	        result.lang = "";
	        result.responseStatus = 200;
		result.responseData.translatedText = "";
		var text_array = data[0];
		for (var key in text_array) {
			result.responseData.translatedText += util.unicodeToChars(text_array[key][0]).replace(new RegExp('\\\\', 'g'),'');
		}
		result.responseData.translatedText = result.responseData.translatedText.replace(new RegExp('…', 'g'),'');
	        callback(result);
		toast.set(_('successfully')).show(1);
	} 
  
	$.ajax({
	        url: url,
	        success: function(data, textStatus, jqXHR) {
			processData(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status === 200) {
				processData(jqXHR.responseText);
			} else {
				var data = {};
				data.responseDetails = errorThrown;
				callback(data);
			}
		}
	});
},

do_translate:
function do_translate(dst_lang, text, callback) {	
    toast.set(_("translating")).show(5);
    ui.Main.get_google_translate_text(dst_lang, text, callback);
},

new_version_popup:
function new_version_popup() {
    $('#btn_new_version_close').click(function () {    
    	conf.settings.installed_version = conf.vars.version;
	conf.save_settings();
	globals.new_version_dialog.close();
    });
    globals.new_version_dialog.open();  
},

set_user_color:
function set_user_color(screen_name, color) {
    if (color === null || color.length < 4 || color[0] !== '#') {
        delete conf.get_current_profile().preferences.colored_user_map[screen_name];
    } else {
        conf.get_current_profile().preferences.colored_user_map[screen_name] = color;
    }
},

get_user_color:
function get_user_color(screen_name) {
    if (conf.get_current_profile().preferences.colored_user_map.hasOwnProperty(screen_name)) {
        return conf.get_current_profile().preferences.colored_user_map[screen_name];
    }
    return 'transparent';
}

};


