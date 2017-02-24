if (typeof ui == 'undefined') var ui = {};
ui.HomeTabs = {

// 4.0: Home media-only mode
init:
function init() {},

init_view:
function init_view(view) {
    var toggle = view._header.find('.home_view_toggle_btns');
    var sub_view_btns = toggle.find('.radio_group_btn');
    
    switch(conf.get_current_profile().preferences.current_filter) {
	case 'home_media_only':
		sub_view_btns.removeClass('selected');
		$('#home_media_only').addClass('selected');
		ui.HomeTabs.filter_timeline(view);
	break;
	case 'home_exclude_replies':
		sub_view_btns.removeClass('selected');
		$('#home_exclude_replies').addClass('selected');
		ui.HomeTabs.filter_timeline(view);
	break;
	default:
	break;
    }
    
    sub_view_btns.click(function (event) {
	if (!($(this).hasClass('selected'))) {
		// Get filter
		var pagename = $(this).attr('id');
		conf.get_current_profile().preferences.current_filter = pagename;
		conf.save_prefs(conf.current_name);
		
		// Change selected radio button
		sub_view_btns.removeClass('selected');
		$(this).addClass('selected');
			
		// Apply filter
		ui.HomeTabs.filter_timeline(view);
	}
    });
},

load_tweet_success:
function load_tweet_success(self, json) {   
    // Filter:
    switch (conf.get_current_profile().preferences.current_filter) {
	case 'home_media_only':
		var media_json = [];
		for (var i=0; i<json.length; i+=1) {
			if( (json[i].entities && json[i].entities.media) || (json[i].extended_entities && json[i].extended_entities.media) )
				media_json.push(json[i]);
		} 
		json = media_json;
	break;
	case 'home_exclude_replies':
		var media_json = [];
		for (var i=0; i<json.length; i+=1) {
			if (!(json[i].in_reply_to_screen_name && json[i].in_reply_to_screen_name == globals.myself.screen_name)) {
				media_json.push(json[i]);			
			}
				
		} 
		json = media_json;
	break;
	default:
	break;
    }
    
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
			notification.notify_tweet(json[i]);
		}
	}
        unread_alert(self.incoming_num);
    }
    if (ui.Main.views[self.name].use_notify_sound) {
            $('#audio_notify').get(0).play();
    }

    return json.length;
},

loadmore_tweet_success:
function loadmore_tweet_success(self, json) {

    // Filter:
    switch (conf.get_current_profile().preferences.current_filter) {
	case 'home_media_only':
		var media_json = [];
		for (var i=0; i<json.length; i+=1) {
			if( (json[i].entities && json[i].entities.media) || (json[i].extended_entities && json[i].extended_entities.media) ) {
				media_json.push(json[i]);
			}
		} 
		self.max_id = json[json.length-1].id; // Fix for max_id if no new tweet contains media...
		json = media_json;
	break;
	case 'home_exclude_replies':
		var media_json = [];
		for (var i=0; i<json.length; i+=1) {
			if (!(json[i].in_reply_to_screen_name && json[i].in_reply_to_screen_name == globals.myself.screen_name)) {
				media_json.push(json[i]);			
			}
				
		} 
		self.max_id = json[json.length-1].id; // Fix for max_id if no new tweet contains mentions...
		json = media_json;
	break;
	default:
	break;
    }
    
    var ret = ui.Main.add_tweets(self, json, true);
    if (0 < self.incoming_num) {
        ui.Slider.set_unread(self.name);
    }
    
    return ret;
},

load_home_exclude_replies:
function load_home_exclude_replies(self, success, fail) {
    globals.twitterClient.get_home_timeline(true, self.since_id, null, conf.get_current_profile().preferences.items_per_request, success);
},

loadmore_home_exclude_replies:
function loadmore_home_exclude_replies(self, success, fail) {
    globals.twitterClient.get_home_timeline(true, null, self.max_id, conf.get_current_profile().preferences.more_items_per_request,success);
},

filter_timeline:
function filter_timeline(view) {
	switch (conf.get_current_profile().preferences.current_filter) {
		case 'home_media_only':	
			view._load = ui.HomeTabs.load_home_exclude_replies;
			view._loadmore = ui.HomeTabs.loadmore_home_exclude_replies;
			view.max_id = null;
			view.since_id = 1;
			view.clear();
			view.load();
		break;
		case 'home_exclude_replies':
			view._load = ui.HomeTabs.load_home_exclude_replies;
			view._loadmore = ui.HomeTabs.loadmore_home_exclude_replies;
			view.max_id = null;
			view.since_id = 1;
			view.clear();
			view.load();		
		break;
		default:
			view._load = ui.Main.load_home;
			view._loadmore = ui.Main.loadmore_home;
			view.max_id = null;
			view.since_id = 1;
			view.clear();
			view.load();
		break;
	}
}
};
