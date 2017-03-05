if (typeof conf == 'undefined') var conf = {};
conf = {

vars: {
      'platform': 'Chrome'
    , 'version': '10'
    , 'consumer_key': 'Vc5nXsSN4K5vJoWr8JrnbpjlB'
    , 'consumer_secret': '7HflXSzdU16JAa9CR2zhXWE1NQdDwQqMEX41Ak6k35hTCAtOnw'
    , 'column_max_width': 400
    , 'trim_bound': 100
    , 'builtin_themes': ['New Hope','Classic', 'Classic Boy', 'Classic Remix', 'Classic Remix Variant', 'Iron Heart', 'Bare', 'Summer', 'Ocean', 'Grass', 'Lady', 'Smoke' ]
},

default_settings: {
      'use_verbose_mode': false
    , 'size_w': 500
    , 'size_h': 550
    , 'context_menu_integration': (chrome && chrome.contextMenus && chrome.extension && chrome.extension.onMessage && chrome.storage && chrome.storage.sync)
    , 'sign_in_automatically': false
    , 'font_list': ['Arial', 'Wide', 'Narrow', 'Calibri', 'Cambria', 'Comic Sans MS', 'Consolas', 'Corsiva', 'Courier New', 'Droid Sans', 'Droid Serif', 'Syncopate', 'Times New Roman']
    , 'welcome_background': 'default.jpg'
    , 'characters_reserved_per_media' : 23
    , 'photo_size_limit' : 3145728
    , 'short_url_length' : 22
    , 'short_url_length_https' : 23
    , 'dm_text_character_limit' : 140
    , 'config_request_date' : '2014-08-02'
    , 'installed_version' : '1.0'
},

default_prefs: {
    'twitter': {
          // Account
        'access_token': ''
          // Look & Feels
        , 'lang': 'en'
        , 'theme': 'Classic'
        , 'theme_path': 'theme/Classic'
	, 'screen_name': 'screen'
        , 'use_custom_font': false
        , 'custom_font': ''
        , 'font_size': 10
        , 'line_height': 1.4
        , 'enable_animation': true
        , 'enable_gpu_acceleration': true 
	, 'column_num': 'default'
	, 'noheader': false
	, 'show_social': true
          // Behaviors
        , 'auto_longer_tweet': true
	, 'use_emoji': true
	, 'emoji_size': 1
	, 'emoji_backcolor': false
	, 'use_new_dm_view_mode': true
        , 'use_preload_conversation': true
        , 'use_alt_retweet': false
        , 'use_alt_reply': true
        , 'use_media_preview': true
	, 'show_youtube': false
        , 'show_relative_timestamp': false
	, 'show_seconds_in_timestamp': true
        , 'filter_nsfw_media': false
        , 'use_deleted_mark': false
	, 'dst_lang' : 'en'
	, 'speech_lang' : 'en-GB'
        , 'use_readlater_serv': false
        , 'readlater_service': 'pocket'
        , 'readlater_username': ''
        , 'readlater_password': ''
	, 'user_autocomplete': true
	, 'tag_autocomplete': true
	, 'sync_cols': (chrome && chrome.storage && chrome.storage.sync) 
	, 'undo_tweet': true
	, 'sending_wait': 0
	, 'hide_media_link': true
	, 'thumb_preview': true
	, 'autoload_quoted': true
	, 'hide_raw_previews': false
          // Advanced
        , 'api_base': 'https://api.twitter.com/1.1/'
        , 'sign_api_base': 'https://api.twitter.com/1.1/'
        , 'use_same_sign_api_base': true
        , 'oauth_base': 'https://api.twitter.com/oauth/'
        , 'sign_oauth_base': 'https://api.twitter.com/oauth/'
        , 'use_same_sign_oauth_base': true
        , 'search_api_base2': 'https://api.twitter.com/1.1/search/tweets.json'
        , 'upload_api_base': 'https://api.twitter.com/1.1/'
	, 'items_per_request': 30
	, 'more_items_per_request': 100
	, 'use_custom_source_app': false
	, 'consumer_key': ''
	, 'consumer_secret': ''
	, 'free_support': true
          // Others
	, 'filter_rules': []  
	, 'filter_framework': false
	, 'colored_user_map': {}
        , 'base_url': 'https://twitter.com/'
        , 'slider_state': null
        , 'views_lastest_id': {}
        , 'profile_avatar': ''
	, 'following_hashtags': [] // 5.5
	, 'home_filter': ''
	, 'tt_font_size': 16
	, 'tt_number': 10
	, 'tt_no_hashtag': false
	, 'tt_show_volume': true
	, 'tt_woeid': 1		
	  //Notifications
	, 'notify_new_followers': false
	, 'notification_show_user_pic': true
	, 'notification_show_tweet_msg': true
	, 'notification_show_tweet_media': false
	, 'notification_auto_clear': true
	, 'notification_auto_clear_time': 5
	, 'notification_clear_onclick': true
	, 'custom_sound': 'sound/notify.ogg'
	, 'notify_favorited': true
	, 'notification_chrome_api': true
      }
},

profiles: {},

settings: {},

current_name: '',

OS_MAC: false,

OS_WINDOWS: false,

OS_LINUX: false,

init:
function init(callback) {
    conf.reload(callback);
    var platform = navigator.platform;
    conf.OS_WINDOWS = (platform.indexOf('Win') != -1);
    conf.OS_MAC = (platform.indexOf('Mac') != -1);
    conf.OS_LINUX = (platform.indexOf('Linux') != -1);
},

reload:
function reload(callback) {
    procs = [];
    procs.push(function () {
        conf.load_settings(function () {
            $(window).dequeue('_conf_init');
        });
    });
    procs.push(function () {
        db.get_all_profiles(function (profiles) {
            for (var i = 0, l = profiles.length; i < l; i += 1) {
                var name = profiles[i].name;
                var protocol = profiles[i].protocol;
                var prefs = JSON.parse(profiles[i].preferences);
                conf.profiles[name] = profiles[i];
                conf.profiles[name].preferences = conf.normalize_prefs(protocol, prefs);
		conf.save_prefs(profiles[i].name);
            }
            $(window).dequeue('_conf_init');
        });
    })
    if (typeof (callback) != 'undefined') {
        procs.push(function() {
            callback();
            $(window).dequeue('_conf_init');
        });
    }  
    $(window).queue('_conf_init', procs);
    $(window).dequeue('_conf_init');
},

get_default_prefs:
function get_default_prefs(protocol) {
    if (protocol == 'twitter') {
        return conf.default_prefs['twitter'];
    } else {
        return '';
    }
},

get_current_profile:
function get_current_profile() {
    return conf.profiles[conf.current_name];
},

save_settings:
function save_settings(callback) {
    db.save_option(conf.settings, function(result){
        if (typeof (callback) != 'undefined') {
            callback();
        }
    });
},

load_settings:
function load_settings(callback) {
    db.load_option(function(settings) {
        conf.settings = conf.normalize_settings(settings);
        conf.apply_settings();
        if (typeof (callback) != 'undefined') {
            callback();
        }
    });
},

save_prefs:
function save_prefs(name, callback) {
    var profile = {};
    profile.name = conf.profiles[name].name;
    profile.protocol = conf.profiles[name].protocol;
    profile.preferences = JSON.stringify(conf.profiles[name].preferences);
    profile.order = conf.profiles[name].order;

    db.modify_profile(name, profile, null, function(result) {
        if (typeof (callback) != 'undefined') {
            callback();
        }   
    });
},

load_prefs:
function load_prefs(name, callback) {
    db.get_profile(name, 
    function(profile) {
        profile.preferences = JSON.parse(profile.preferences);
        conf.profiles[name] = profile;
        if (typeof (callback) != 'undefined') {
            callback();
        }
    });
},

apply_settings:
function apply_settings() {
    $('.platform').text(conf.vars.platform);
    $('.version').text(conf.vars.version);
    try {
        chrome.runtime.sendMessage(
            {'enableContextMenu':conf.settings.context_menu_integration},
            function (resp) {}
        );
    } catch(err){}
    globals.twitterClient.oauth.key = conf.vars.consumer_key;
    globals.twitterClient.oauth.secret = conf.vars.consumer_secret;
},

apply_prefs:
function apply_prefs(name, full) {
    var active_profile = conf.profiles[name];
    var prefs = active_profile.preferences;
    conf.current_name = name;

    if (full == true) {
        i18n.change(prefs.lang);
        change_theme(prefs.theme, prefs.theme_path);
        globals.tweet_font_size = prefs.font_size;
        globals.tweet_line_height = prefs.line_height;
        $('.card_body > .text').css({'font-size': prefs.font_size + 'pt', 'line-height': prefs.line_height});
        ui.Main.use_preload_conversation = prefs.use_preload_conversation;
	
	$('.card').each(function(i,val) {
		var username = $(val).attr('user_name');
		if (username) {
			var screenname = $(val).attr('screen_name') || $(val).attr('sender_screen_name');
			$(val).find('.who .who_href').text(ui.Template.parse_name(username,screenname));
		}
	});
    }
    var fonts = conf.get_default_font_settings();
    $('body').css('font-family', fonts[0]);
    if (prefs.use_custom_font) {
        $('.listview, .dialog_block p, .card').css('font-family', prefs.custom_font);
        globals.tweet_font = prefs.custom_font;
    } else {
        $('.listview, .dialog_block p, .card').css('font-family', fonts[1]);
        globals.tweet_font = fonts[1];
    }
    // animation
    $.fx.off = !prefs.enable_animation;
    if ($.fx.off || !prefs.enable_gpu_acceleration) {
        $.fn.transition = $.fn.animate;
    }

    globals.twitterClient.api_base = (function(api_base) {
        if(api_base.indexOf('/1/') !== -1) {
            return api_base.replace(/\/1\/$/, '/');
        } else if(api_base.indexOf('/1.1/') !== -1) {
            return api_base.replace(/\/1\.1\/$/, '/');
        } else {
            return api_base;
        }
    })(prefs.api_base);
    
    globals.twitterClient.sign_api_base = prefs.sign_api_base;
    globals.twitterClient.search_api_base2 = prefs.search_api_base2;
    globals.twitterClient.upload_api_base = prefs.upload_api_base;
    globals.twitterClient.use_same_sign_api_base = prefs.use_same_sign_api_base;
    var oauth = globals.twitterClient.oauth;
    oauth.oauth_base = prefs.oauth_base;
    oauth.sign_oauth_base = prefs.sign_oauth_base;
    oauth.use_same_sign_oauth_base = prefs.use_same_sign_oauth_base;
   
    oauth.access_token = prefs.access_token;
    oauth.key = (prefs.consumer_key !== '') ? prefs.consumer_key : conf.vars.consumer_key;
    oauth.secret = (prefs.consumer_secret !== '') ? prefs.consumer_secret : conf.vars.consumer_secret;
    
    // read later
    globals.readLaterServ.init(prefs.readlater_username, prefs.readlater_password);
    if (prefs.use_readlater_serv) {
        $('#tweet_readlater_btn').parent().show();
    } else {
        $('#tweet_readlater_btn').parent().hide();
    }
    
    if (prefs.custom_sound !== '') {
	$('#audio_notify').attr('src',prefs.custom_sound);
    }  
        
    if (prefs.noheader) {
	var header_tm;
	if (ui.Main.me.is(":visible") && !globals.layout.state.north.isClosed)
		globals.layout.close('north');
	$("#header_flap").show();
	    
	$("#header").hover(
	    function() {
		clearTimeout(header_tm);
	    },
	    function () {
		header_tm = setTimeout(function() {
			globals.layout.close('north'); 
			$("#header_flap").show();
		}, 250);
	    }
	);
    
	$("#header_flap").bind('mouseenter',function() {
		globals.layout.open('north'); 
		$("#header_flap").hide();
	});
    } else {
	if (ui.Main.me.is(":visible") && globals.layout.state.north.isClosed)
		globals.layout.open('north'); 
	$("#header_flap").hide();
	$("#header").unbind();
	$("#header_flap").unbind('mouseenter');
    }
},

load_token:
function load_token(name) {
    return conf.profiles[name].preferences.access_token;
},

save_token:
function save_token(name, token) {
    conf.profiles[name].preferences.access_token = token;
    conf.save_prefs(name);
},

clear_token:
function clear_token(name) {
    conf.profiles[name].preferences.access_token = '';
    conf.save_prefs(name);
},

normalize_prefs:
function normalize_prefs(protocol, prefs) {
    var default_prefs = conf.get_default_prefs(protocol);
    for (var k in default_prefs) {
        if (!prefs.hasOwnProperty(k)) {
            prefs[k] = default_prefs[k];
        }
    }
    for (var k in prefs) {
        if (!default_prefs.hasOwnProperty(k)) {
            delete prefs['k'];
        } 
    }
    return prefs;
},

normalize_settings:
function normalize_settings(settings) {
    for (var k in conf.default_settings) {
        if (!(k in settings)) {
            settings[k] = conf.default_settings[k];
        }
    }
    for (var k in settings) {
        if (!(k in conf.default_settings)) {
            delete settings['k'];
        } 
    }
    return settings;
},

get_default_font_settings:
function get_default_font_settings () {
    var platform = navigator.platform;
    if (conf.OS_WINDOWS) {
        return ['\'Segoe UI\', \'Microsoft YaHei\', sans-serif', 'Verdana, \'Microsoft YaHei\', sans-serif'];
    } else if (conf.OS_MAC) {
        return ['\'Helvetica Neue\', \'Hiragino Sans GB\', sans-serif', '\'Lucida Grande\', \'Hiragino Sans GB\', sans-serif'];
    } else {
        return ['\'Helvetica Neue\', \'Hiragino Sans GB\', \'Droid Sans Fallback\', \'WenQuanYi Micro Hei\', sans-serif', '\'Droid Sans Fallback\', \'WenQuanYi Micro Hei\', Simhei, Simsun, sans-serif'];
    }
},

download_settings:
function download_settings() {
	if (chrome && chrome.storage && chrome.storage.sync) {
		if (conf.get_current_profile().preferences.access_token.user_id) {
			var key = conf.get_current_profile().preferences.access_token.user_id + "_settings";
			var value = conf.get_current_profile().preferences;
			var json = {};
			json[key] = value;
			chrome.storage.sync.get(json, function(data) {
				hotot_log("SYNC","Download");
				if (data[key]) {
					var token = JSON.parse(JSON.stringify(conf.get_current_profile().preferences.access_token));
					conf.get_current_profile().preferences = data[key];
					conf.get_current_profile().preferences.access_token = token;
					notification.notify_text(_('chrome_sync'), _('chrome_sync_success'));
				}
			});
		} else {
			notification.notify_error(_('chrome_sync_no_token'));
		}
	} else {
		console.error("Chrome Sync API not supported!");
	}	
},

upload_settings:
function upload_settings() {
	if (chrome && chrome.storage && chrome.storage.sync) {
		if (conf.get_current_profile().preferences.access_token.user_id) {
			var key = conf.get_current_profile().preferences.access_token.user_id + "_settings";
			var value = JSON.parse(JSON.stringify(conf.get_current_profile().preferences));
			value.access_token = null;
			var json = {};
			json[key] = value;
			chrome.storage.sync.set(json, function () {
				hotot_log("SYNC","Upload");
				notification.notify_text(_('chrome_sync'), _('chrome_sync_success'));
			});
		} else {
			notification.notify_error(_('chrome_sync_no_token'));
		}
	} else {
		console.error("Chrome Sync API not supported!");
	}
}


};
