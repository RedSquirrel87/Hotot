// 4.0: Notifications Settings
var notification = {

Notification: window.Notification || window.mozNotification || window.webkitNotification,

init:
function init() {
	if (chrome && chrome.notifications) {
		chrome.notifications.onClicked.addListener(function(nid) {
			if (conf.get_current_profile().preferences.notification_clear_onclick) 
				chrome.notifications.clear(nid, function(wasCleared) {});
		});
	}
},

notify_tweet:
function notify_tweet(tweet) {
	var prefs = conf.get_current_profile().preferences;
		
	var media;
	if (tweet.extended_entities && tweet.extended_entities.media && prefs.notification_show_tweet_media) {
		media = tweet.extended_entities.media[0].media_url;
	}
	
	//Check if DM
	var usertype, dm = '';
	if (tweet.hasOwnProperty('user')) {
		usertype = tweet.user;
		dm = '';
	} else {
		usertype = tweet.sender;
		dm = '[DM] ';
	}
	
	var options = {
		type: (media ? "image" : "basic"),
		title: dm + ui.Template.parse_name(usertype.name,usertype.screen_name),
		message: (prefs.notification_show_tweet_msg ? tweet.text : _('notification_message')),
		iconUrl: (prefs.notification_show_user_pic ? usertype.profile_image_url.replace("_normal","") : '../image/ic128_notification.png'),
		isClickable: true
	};
	
	if (media) {
		$.extend(options, {
			imageUrl: media
		});
	}	
	
	notification.create(options);
},

notify_text:
function notify_text(title, text, image) {
    title = title.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
    text = text.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
    var prefs = conf.get_current_profile().preferences;		
    var options = {
	type: "basic",
	title: title,
	message: text,
	iconUrl: ((prefs.notification_show_user_pic && image) ? image.replace("_normal","") : '../image/ic128_notification.png'),
	isClickable: true
    };
    notification.create(options);
},

notify_error:
function notify_error(text) {
    text = text.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
    var options = {
	type: "basic",
	title: _('oops_an_error_occurs'),
	message: text,
	iconUrl: '../image/ic128_error.png',
	isClickable: true
    };
    notification.create(options);
    $('#audio_error').get(0).play();
},

notify_fav:
function notify_fav(favobj) {
	if (conf.get_current_profile().preferences.notification_chrome_api) {
		var options = {
			type: "basic",
			title: _('new_follower'),
			message: ui.Template.parse_name(favobj.name,favobj.screen_name) + _('starts_following_you'),
			iconUrl: favobj.profile_image_url.replace("_normal",""),
			buttons: [{
				title: _('open_profile_in_hotot'),
				iconUrl: "../image/ic24_hotot.png"
			}]
		};
		chrome.notifications.create("follow_" + favobj.screen_name, options, function creationCallback(id) {});	
		chrome.notifications.onButtonClicked.addListener(function(nid, buttonIndex) {
			if (buttonIndex === 0) {
				open_people(nid.substring(7));
			}
		});
	} else {
		var title = _('new_follower');
		var options = {
			body: ui.Template.parse_name(favobj.name,favobj.screen_name) + _('starts_following_you'),
			icon: favobj.profile_image_url.replace("_normal",""),
			data: favobj.screen_name
		};
		var instance = new Notification(title, options);
		instance.onerror = function () {
			console.error("HTML5 notification error.");
		};
		instance.onclick = function () {
			open_people(instance.data);
		};
	}
},

create:
function create(options) {
	var prefs = conf.get_current_profile().preferences;
	
	if (prefs.notification_chrome_api) {
		// Use Chrome API
		if (chrome && chrome.notifications) {
			chrome.notifications.create("", options, function creationCallback(id) {
				if (prefs.notification_auto_clear) {
					setTimeout(function() { 
						chrome.notifications.clear(id, function(wasCleared) {}); 
						}, 
						(prefs.notification_auto_clear_time * 1000)
					);
				}
			});	
		}
	} else {
		// Use HTML5 API
		var newoptions = {
			body: options.message,
			icon: options.iconUrl
		};
		var title = options.title;
		var instance = new Notification(title, newoptions);
		instance.onerror = function () {
			console.error("HTML5 notification error.");
		};	
		if (prefs.notification_auto_clear) {
			setTimeout(instance.close.bind(instance),(prefs.notification_auto_clear_time * 1000));
		}
	}
}

};
