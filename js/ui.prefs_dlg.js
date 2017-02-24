if (typeof ui == 'undefined') var ui = {};
ui.PrefsDlg = {

id: '',

init:
function init () {
    ui.PrefsDlg.id = '#prefs_dlg';

    ui.PrefsDlg.switchPage("#prefs_main");

    $('#prefs_dlg .page_nav').click(function(){
        var page_name = $(this).attr('href');
        if (page_name == "#prefs_main") {
            $('#btn_prefs_back').hide();
        } else {
            $('#btn_prefs_back').show();
        }
        ui.PrefsDlg.switchPage(page_name);
        return false;
    });

    $('#sel_prefs_theme').change(function () {
        change_theme($(this).val(), $(this).children('option[value="'+$(this).val()+'"]').attr('path'));
    });
    
    $('#chk_show_social').click(function() {
	if($(this).prop('checked')) {
		$('.tweet_social').addClass('show_block');
	} else {
		$('.tweet_social').removeClass('show_block');
	}
    });    

    $('#sel_prefs_lang').change(function () {
        i18n.change($(this).val());
    });

    $('#sel_prefs_sys_font, #range_prefs_font_size, #tbox_prefs_custom_font, #chk_use_custom_font').bind('click change keypress blur',
    function (event) {
        ui.PrefsDlg.update_font_preview();
    });

    $('#sel_prefs_sys_font').change(function (event) {
        var val = $(this).val();
        if (val != 'more') {
            $('#tbox_prefs_custom_font').val(val);
            $(this).val('more');
        }
    });

    $('#chk_use_custom_font').click(function (event) {
        $('#tbox_prefs_custom_font, #sel_prefs_sys_font').attr('disabled', !$(this).prop('checked'));
    });

    $('#range_prefs_font_size').blur(
    function (event) {
        ui.FormChecker.test_int_value(this);
    });
    
    $('#range_prefs_font_size').change(
    function (event) {
        $('#range_prefs_font_size_st').text($(this).val() + 'pt');
        ui.PrefsDlg.update_font_preview();
    });
    
    $('#range_prefs_line_height').change(
    function (event) {
        $('#range_prefs_line_height_st').text(Number($(this).val()).toFixed(1));
        ui.PrefsDlg.update_font_preview();
    });
        
    $('#sel_prefs_emoji_size').change(
    function (event) {
	var esize = $(this).val();
	$('.emoji').css('height', esize + ((esize > 3) ? 'px' : 'em'));
    });
    
    $('#range_prefs_items_for_request').change(
    function (event) {
        $('#range_prefs_items_for_request_st').text($(this).val());
    });
    $('#range_prefs_more_items_for_request').change(
    function (event) {
        $('#range_prefs_more_items_for_request_st').text($(this).val());
    });
        
    $('#chk_prefs_chrome_notifications').click(function(event) {
	$('#chk_prefs_notification_show_tweet_media').attr('checked', false).prop('checked', false);
	$('#chk_prefs_notification_clear_onclick').attr('checked', true).prop('checked', true);
	$('#chk_prefs_notification_show_tweet_media, #chk_prefs_notification_clear_onclick').attr('disabled', !$(this).prop('checked'));
	if (!$(this).prop('checked') && (Notification.permission !== "granted")) {
		Notification.requestPermission(function (permission) {
			if (permission !== "granted") {
				$('#chk_prefs_chrome_notifications').attr('checked', true).prop('checked', true);
				Toast.set(_('errors_html5_permissions')).show();
			}
		});
	}
    });
    
    $('#range_prefs_notification_auto_clear_time').change(
    function (event) {
        $('#range_prefs_notification_auto_clear_time_st').text($(this).val() + "s");
    });
    $('#chk_prefs_notification_clear_onclick').change(function() {
	conf.get_current_profile().preferences.notification_clear_onclick = $(this).val();
    });
    $('#btn_notification_test').click(function (event) {
	ui.PrefsDlg.save_prefs();
	$('#audio_notify').attr('src',$('#sel_custom_sound').val());
	$('#audio_notify').get(0).play();
	
	var prefs = conf.get_current_profile().preferences;
	var media = (prefs.notification_show_tweet_media ? '../image/background/old.jpg' : null);
	
	var options = {
		type: (media ? "image" : "basic"),
		title: ui.Template.parse_name("Hotot+", "HototPlus"),
		message: (prefs.notification_show_tweet_msg ? "Hello!" : _('notification_message')),
		iconUrl: (prefs.notification_show_user_pic ? '../image/ic128_hotot.png' : '../image/ic128_notification.png'),
		isClickable: true
	}
	
	if (media) {
		$.extend(options, {
			imageUrl: media
		});
	}
	
	notification.create(options);
    });
    
    $('#sel_custom_sound').change(function (event) {
	$('#audio_notify').attr('src',$('#sel_custom_sound').val());
    });
    
    $('#chk_prefs_column_num').change(function() {
	conf.get_current_profile().preferences.column_num = $(this).val();
	update_tweet_block_width();   
    });
    
    $('#sel_prefs_background').change(function() {
	$('#prefs_background_preview').css("background-image", 
		"url(image/background/" + $('#sel_prefs_background').val() + ")"
	);
	ui.Welcome.load_background("image/background/" + $('#sel_prefs_background').val());
    });
    
    if (chrome.storage === undefined || chrome.storage.sync === undefined) {
	$('#chk_prefs_chrome_sync')
	.attr('checked', false)
	.prop('checked', false)
	.attr('disabled', true);
	$('#btn_prefs_chrome_sync_down').attr('disabled', true);
	$('#btn_prefs_chrome_sync_up').attr('disabled', true);
    }
    $('#chk_prefs_chrome_sync').change(function() {
	if ($(this).prop('checked')) {
		conf.get_current_profile().preferences.sync_cols = true;
		ui.Slider.resume_state();
	}
    });
    
    $('#chk_prefs_use_readlater_serv').click(function (event) {
        $('#tbox_prefs_readlater_username, #tbox_prefs_readlater_password, #sel_prefs_readlater_service').attr('disabled', !$(this).prop('checked'));
    });

    
    if (chrome.contextMenus === undefined || chrome.runtime === undefined || chrome.runtime.onMessage === undefined) {
	    $('#chk_prefs_context_menu_integration')
		.attr('checked', false)
		.prop('checked', false)
		.attr('disabled', true);
    }
    
    $('#chk_prefs_use_same_sign_api_base').click(
    function (event) {
        $('#tbox_prefs_sign_api_base').attr('disabled', $(this).prop('checked'));
    });

    $('#chk_prefs_use_same_sign_oauth_base').click(
    function (event) {
        $('#tbox_prefs_sign_oauth_base').attr('disabled', $(this).prop('checked'));
    });

    $('#chk_prefs_use_custom_source_app_name').click(function (event) {
	$('#tbox_prefs_custom_source_app_name_key').attr('disabled', !$(this).prop('checked'));
	$('#tbox_prefs_custom_source_app_name_secret').attr('disabled', !$(this).prop('checked'));
	conf.clear_token(conf.current_name);
    });

    $('#chk_prefs_enable_animation').click(
    function (event) {
        $('#chk_prefs_enable_gpu_acceleration').attr('disabled', !$(this).prop('checked'));
    });

    $('#btn_prefs_ok').unbind().click(function (event) {
        var err = ui.FormChecker.check_config_error(ui.PrefsDlg.id + ' input');
        if ( err.count != 0 ) {
	    toast.set(err.count + " " + _('errors_found_aborting')).show();
        } else {
            globals.prefs_dialog.close();
            ui.PrefsDlg.save_settings();
            ui.PrefsDlg.save_prefs();
        }
        return false;
    });

    $('#btn_prefs_restore_defaults').click(function (event) {
        if (confirm(_('restore_defaults_confirm')))
            ui.PrefsDlg.restore_defaults();
    });
    
    $('#support_explanation_trigger').click(function() {
	$('#support_explanation').toggle();
    });
    $('#custom_source_app_explanation_trigger').click(function() {
	$('#custom_source_app_explanation').toggle();
    });
    $('#items_for_request_explanation_trigger').click(function() {
	$('#items_for_request_explanation').toggle();
    });


    $('#btn_prefs_chrome_sync_down').click(function() {
	globals.prefs_dialog.close();
	conf.download_settings();
    });
    $('#btn_prefs_chrome_sync_up').click(function() {	
	globals.prefs_dialog.close();
	conf.upload_settings();
    });    

    return this;
},

switchPage:
function switchPage (name) {
    $(ui.PrefsDlg.id + ' .dialog_page').not(name).hide();
    $(name).show();
},

load_settings:
function load_settings() {
    $('#chk_prefs_use_verbose_mode')
        .attr('checked', conf.settings.use_verbose_mode)
        .prop('checked', conf.settings.use_verbose_mode);
   
    $('#chk_prefs_sign_in_automatically')
        .attr('checked', conf.settings.sign_in_automatically)
        .prop('checked', conf.settings.sign_in_automatically);

    $('#sel_prefs_background').val(conf.settings.welcome_background);
    $('#prefs_background_preview').css("background-image", 
		"url(image/background/" + conf.settings.welcome_background + ")"
    );
	
    $('#chk_prefs_context_menu_integration')
        .attr('checked', conf.settings.context_menu_integration)
        .prop('checked', conf.settings.context_menu_integration);
},

save_settings:
function save_settings() {
    conf.settings.use_verbose_mode
        = $('#chk_prefs_use_verbose_mode').prop('checked');
    
    conf.settings.sign_in_automatically
        = $('#chk_prefs_sign_in_automatically').prop('checked');

    conf.settings.welcome_background = $('#sel_prefs_background').val();
    
    conf.settings.context_menu_integration = $('#chk_prefs_context_menu_integration').prop('checked');

    conf.apply_settings();
    conf.save_settings();
},

load_prefs:
function load_prefs() {
    var prefs = conf.get_current_profile().preferences;
    
    $('#sel_prefs_lang').val(prefs.lang);

    var theme_list = $('#sel_prefs_theme').empty();
    for (var i = 0, l = conf.vars.builtin_themes.length; i < l; i += 1) {
        var theme_name = conf.vars.builtin_themes[i];
        $('<option/>').attr({'value': theme_name, 'path': 'theme/' + theme_name}).text(theme_name).appendTo(theme_list);
    }
    theme_list.val(prefs.theme);
    theme_list = null;

    var ff_list = $('#sel_prefs_sys_font').empty();
    for (var i = 0, l = conf.settings.font_list.length; i < l; i += 1) {
        var ff_name = conf.settings.font_list[i];
        $('<option/>').val(ff_name).text(ff_name).appendTo(ff_list);
    }
    $('<option/>').val('more').text('...').appendTo(ff_list);
    ff_list.val('more');
    ff_list = null;

    $('#tbox_prefs_custom_font').val(prefs.custom_font);
    $('#range_prefs_font_size').val(prefs.font_size);
    $('#range_prefs_font_size_st').text(prefs.font_size + 'pt');
    if (prefs.use_custom_font) {
        $('#chk_use_custom_font')
            .attr('checked', prefs.use_custom_font)
            .prop('checked', prefs.use_custom_font);
    } else {
        $('#sel_prefs_sys_font, #tbox_prefs_custom_font')
            .attr('disabled', true);
    }
    
    $('#range_prefs_line_height').val(prefs.line_height);
    $('#range_prefs_line_height_st').text(Number(prefs.line_height).toFixed(1));
    ui.PrefsDlg.update_font_preview();
    
    $('#chk_prefs_auto_longer_tweet')
        .attr('checked', prefs.auto_longer_tweet)
        .prop('checked', prefs.auto_longer_tweet);
	
    $('#chk_prefs_hide_media_link')
        .attr('checked', prefs.hide_media_link)
        .prop('checked', prefs.hide_media_link);
	
    $('#chk_prefs_thumb_preview')
        .attr('checked', prefs.thumb_preview)
        .prop('checked', prefs.thumb_preview);
	
    $('#range_prefs_items_for_request').val(prefs.items_per_request);
    $('#range_prefs_items_for_request_st').text(prefs.items_per_request);
    $('#range_prefs_more_items_for_request').val(prefs.more_items_per_request);
    $('#range_prefs_more_items_for_request_st').text(prefs.more_items_per_request);
    
    $('#chk_prefs_use_emoji')
        .attr('checked', prefs.use_emoji)
        .prop('checked', prefs.use_emoji);
    $('#sel_prefs_emoji_size').val(prefs.emoji_size);	
    
    $('#sel_custom_screen_name').val(prefs.screen_name);

    $('#chk_show_social')
	.attr('checked', prefs.show_social)
	.prop('checked', prefs.show_social); 
	    
    $('#sel_custom_sound').val(prefs.custom_sound);  
    
    $('#chk_use_new_dm_view')
	.attr('checked', prefs.use_new_dm_view_mode)
	.prop('checked', prefs.use_new_dm_view_mode);
	
    $('#chk_prefs_column_num').val(prefs.column_num);
    
    $('#chk_use_header_flap')
	.attr('checked', prefs.noheader)
	.prop('checked', prefs.noheader);
        
    $('#chk_prefs_chrome_notifications')
        .attr('checked', prefs.notification_chrome_api)
        .prop('checked', prefs.notification_chrome_api);	
    $('#chk_prefs_notify_favorited')
        .attr('checked', prefs.notify_favorited)
        .prop('checked', prefs.notify_favorited);
    $('#chk_prefs_notify_new_followers')
        .attr('checked', prefs.notify_new_followers)
        .prop('checked', prefs.notify_new_followers);
    $('#chk_prefs_notification_show_user_pic')
        .attr('checked', prefs.notification_show_user_pic)
        .prop('checked', prefs.notification_show_user_pic);
    $('#chk_prefs_notification_show_tweet_msg')
        .attr('checked', prefs.notification_show_tweet_msg)
        .prop('checked', prefs.notification_show_tweet_msg);
    $('#chk_prefs_notification_show_tweet_media')
        .attr('checked', prefs.notification_show_tweet_media)
        .prop('checked', prefs.notification_show_tweet_media);
    $('#chk_prefs_notification_auto_clear')
        .attr('checked', prefs.notification_auto_clear)
        .prop('checked', prefs.notification_auto_clear);
    $('#chk_prefs_notification_clear_onclick')
        .attr('checked', prefs.notification_clear_onclick)
        .prop('checked', prefs.notification_clear_onclick);	
    $('#range_prefs_notification_auto_clear_time').val(prefs.notification_auto_clear_time);
    $('#range_prefs_notification_auto_clear_time_st').text(prefs.notification_auto_clear_time + "s");
    $('#chk_prefs_notification_show_tweet_media, #chk_prefs_notification_clear_onclick').attr('disabled', !(prefs.notification_chrome_api));
	
    $('#chk_prefs_autoload_quoted')
        .attr('checked', prefs.autoload_quoted)
        .prop('checked', prefs.autoload_quoted);
	
    $('#chk_prefs_use_preload_conversation')
        .attr('checked', prefs.use_preload_conversation)
        .prop('checked', prefs.use_preload_conversation);	
   
    $('#chk_prefs_use_alt_retweet')
        .attr('checked', prefs.use_alt_retweet)
        .prop('checked', prefs.use_alt_retweet);
   
    $('#chk_prefs_use_alt_reply')
        .attr('checked', prefs.use_alt_reply)
        .prop('checked', prefs.use_alt_reply);
   
    $('#chk_prefs_use_media_preview')
        .attr('checked', prefs.use_media_preview)
        .prop('checked', prefs.use_media_preview);

    $('#chk_prefs_raw_preview')
        .attr('checked', prefs.hide_raw_previews)
        .prop('checked', prefs.hide_raw_previews);
	    
    $('#chk_prefs_youtube')
        .attr('checked', prefs.show_youtube)
        .prop('checked', prefs.show_youtube);    
    
    $('#chk_prefs_show_relative_timestamp')
        .attr('checked', prefs.show_relative_timestamp)
        .prop('checked', prefs.show_relative_timestamp);

    $('#chk_prefs_show_seconds_in_timestamp')
        .attr('checked', prefs.show_seconds_in_timestamp)
        .prop('checked', prefs.show_seconds_in_timestamp);
	
    $('#chk_prefs_filter_nsfw_media')
        .attr('checked', prefs.filter_nsfw_media)
        .prop('checked', prefs.filter_nsfw_media);        
    
    $('#chk_prefs_use_deleted_mark')
        .attr('checked', prefs.use_deleted_mark)
        .prop('checked', prefs.use_deleted_mark);
    
    $('#sel_dst_lang').val(prefs.dst_lang);
    
    $('#sel_speech_lang').val(prefs.speech_lang);

    $('#chk_prefs_use_readlater_serv')
        .attr('checked', prefs.use_readlater_serv)
        .prop('checked', prefs.use_readlater_serv);
    $('#sel_prefs_readlater_service').val(prefs.readlater_service);
    $('#tbox_prefs_readlater_username').val(prefs.readlater_username);
    $('#tbox_prefs_readlater_password').val(prefs.readlater_password);
    if (prefs.use_readlater_serv) {
        $('#tbox_prefs_readlater_password, #tbox_prefs_readlater_username, #sel_prefs_readlater_service').attr('disabled', false);
    } else {
        $('#tbox_prefs_readlater_password, #tbox_prefs_readlater_username, #sel_prefs_readlater_service').attr('disabled', true);
    }
    
    $('#chk_prefs_chrome_sync')
	.attr('checked', prefs.sync_cols)
	.prop('checked', prefs.sync_cols);
    
    $('#chk_prefs_user_autocomplete')
        .attr('checked', prefs.user_autocomplete)
        .prop('checked', prefs.user_autocomplete);
    $('#chk_prefs_tag_autocomplete')
        .attr('checked', prefs.tag_autocomplete)
        .prop('checked', prefs.tag_autocomplete);
	

    $('#chk_prefs_enable_animation')
        .attr('checked', prefs.enable_animation)
        .prop('checked', prefs.enable_animation);
   
    $('#chk_prefs_enable_gpu_acceleration')
        .attr('disabled', !prefs.enable_animation)
        .attr('checked', prefs.enable_gpu_acceleration)
        .prop('checked', prefs.enable_gpu_acceleration);
   
    $('#tbox_prefs_api_base').val(prefs.api_base);
    $('#tbox_prefs_sign_api_base').val(prefs.sign_api_base);
    $('#tbox_prefs_search_api_base2').val(prefs.search_api_base2);
    $('#tbox_prefs_upload_api_base').val(prefs.upload_api_base);
    $('#tbox_prefs_oauth_base').val(prefs.oauth_base);
    $('#tbox_prefs_sign_oauth_base').val(prefs.sign_oauth_base);
    $('#chk_prefs_use_same_sign_api_base')
        .attr('checked', prefs.use_same_sign_api_base)
        .prop('checked', prefs.use_same_sign_api_base);
    $('#chk_prefs_use_same_sign_oauth_base')
        .attr('checked', prefs.use_same_sign_oauth_base)
        .prop('checked', prefs.use_same_sign_oauth_base);
    if (prefs.use_same_sign_api_base) {
        $('#tbox_prefs_sign_api_base').attr('disabled', true);
    }
    if (prefs.use_same_sign_oauth_base) {
        $('#tbox_prefs_sign_oauth_base').attr('disabled', true);
    }
    
    $('#chk_prefs_use_custom_source_app_name')
	.attr('checked', prefs.use_custom_source_app)
        .prop('checked', prefs.use_custom_source_app);
    if (prefs.use_custom_source_app) {
	$('#tbox_prefs_custom_source_app_name_key').val(prefs.consumer_key);
	$('#tbox_prefs_custom_source_app_name_secret').val(prefs.consumer_secret);
    } else {
	$('#tbox_prefs_custom_source_app_name_key').attr('disabled', true);
	$('#tbox_prefs_custom_source_app_name_secret').attr('disabled', true);
    }
    
    $('#chk_prefs_free_support')
	.attr('checked', prefs.free_support)
        .prop('checked', prefs.free_support);
	
    $('#filter_framework_trigger')
	.attr('checked', prefs.filter_framework)
        .prop('checked', prefs.filter_framework);    
	
    $('#chk_prefs_use_undo_tweet')
	.attr('checked', prefs.undo_tweet)
        .prop('checked', prefs.undo_tweet);
	
    $('#sel_postpone_tweet').val(prefs.sending_wait);
},

save_prefs:
function save_prefs() {
    var prefs = conf.get_current_profile().preferences;

    prefs.lang = $('#sel_prefs_lang').val();

    prefs.theme = $('#sel_prefs_theme').val();
    prefs.theme_path = $('#sel_prefs_theme').children('option[value="'+$('#sel_prefs_theme').val()+'"]').attr('path');

    prefs.custom_font = $('#tbox_prefs_custom_font').val();
    prefs.font_size = $('#range_prefs_font_size').val();
    if (prefs.font_size === '') {
        prefs.font_size = 12;
    }
    prefs.line_height = $('#range_prefs_line_height').val();
    if (prefs.line_height === '') {
        prefs.line_height = 1.4;
    }
    prefs.use_custom_font = $('#chk_use_custom_font').prop('checked');
        
    prefs.items_per_request = $('#range_prefs_items_for_request').val();
    if (prefs.items_per_request === '') {
        prefs.items_per_request = 30;
    }    
    prefs.more_items_per_request = $('#range_prefs_more_items_for_request').val();
    if (prefs.more_items_per_request === '') {
        prefs.more_items_per_request = 100;
    }

    prefs.hide_media_link = $('#chk_prefs_hide_media_link').prop('checked');
    
    prefs.thumb_preview = $('#chk_prefs_thumb_preview').prop('checked');
    
    prefs.auto_longer_tweet = $('#chk_prefs_auto_longer_tweet').prop('checked');

    prefs.use_emoji = $('#chk_prefs_use_emoji').prop('checked');
    prefs.emoji_size = $('#sel_prefs_emoji_size').val();	
    if (prefs.emoji_size === '') {
        prefs.emoji_size = 14;
    }
    
    prefs.screen_name = $('#sel_custom_screen_name').val();
    
    prefs.show_social = $('#chk_show_social').prop('checked');       
    
    prefs.custom_sound = $('#sel_custom_sound').val();
    
    prefs.use_new_dm_view_mode = $('#chk_use_new_dm_view').prop('checked');
	
    prefs.column_num = $('#chk_prefs_column_num').val();
    
    prefs.noheader = $('#chk_use_header_flap').prop('checked');

    prefs.notification_chrome_api = $('#chk_prefs_chrome_notifications').prop('checked');
    prefs.notify_favorited = $('#chk_prefs_notify_favorited').prop('checked');
    prefs.notify_new_followers = $('#chk_prefs_notify_new_followers').prop('checked');
    prefs.notification_show_user_pic = $('#chk_prefs_notification_show_user_pic').prop('checked');
    prefs.notification_show_tweet_msg = $('#chk_prefs_notification_show_tweet_msg').prop('checked');
    prefs.notification_show_tweet_media = $('#chk_prefs_notification_show_tweet_media').prop('checked');
    prefs.notification_auto_clear = $('#chk_prefs_notification_auto_clear').prop('checked');
    prefs.notification_auto_clear_time = $('#range_prefs_notification_auto_clear_time').val();
    prefs.notification_clear_onclick = $('#chk_prefs_notification_clear_onclick').prop('checked');

    prefs.autoload_quoted = $('#chk_prefs_autoload_quoted').prop('checked');
    
    prefs.use_preload_conversation = $('#chk_prefs_use_preload_conversation').prop('checked');
    
    prefs.use_alt_retweet = $('#chk_prefs_use_alt_retweet').prop('checked');
    
    prefs.use_alt_reply = $('#chk_prefs_use_alt_reply').prop('checked');

    prefs.show_relative_timestamp = $('#chk_prefs_show_relative_timestamp').prop('checked');
    
    prefs.show_seconds_in_timestamp = $('#chk_prefs_show_seconds_in_timestamp').prop('checked');    
    
    prefs.use_media_preview = $('#chk_prefs_use_media_preview').prop('checked');
    
    prefs.hide_raw_previews = $('#chk_prefs_raw_preview').prop('checked');    
    
    prefs.filter_nsfw_media = $('#chk_prefs_filter_nsfw_media').prop('checked'); 
	    
    prefs.show_youtube = $('#chk_prefs_youtube').prop('checked');
    
    prefs.use_deleted_mark = $('#chk_prefs_use_deleted_mark').prop('checked');
	
    prefs.dst_lang = $('#sel_dst_lang').val();
    
    prefs.speech_lang = $('#sel_speech_lang').val();

    prefs.use_readlater_serv = $('#chk_prefs_use_readlater_serv').prop('checked');
    prefs.readlater_service = $('#sel_prefs_readlater_service').val();
    prefs.readlater_username = $('#tbox_prefs_readlater_username').val();
    prefs.readlater_password = $('#tbox_prefs_readlater_password').val();

    prefs.sync_cols = $('#chk_prefs_chrome_sync').prop('checked');
    
    prefs.user_autocomplete = $('#chk_prefs_user_autocomplete').prop('checked');
    prefs.tag_autocomplete = $('#chk_prefs_tag_autocomplete').prop('checked');
    
    prefs.enable_animation = $('#chk_prefs_enable_animation').prop('checked');
    prefs.enable_gpu_acceleration = $('#chk_prefs_enable_gpu_acceleration').prop('checked');
    
    prefs.api_base = $('#tbox_prefs_api_base').val();
    prefs.sign_api_base = $('#tbox_prefs_sign_api_base').val();
    prefs.search_api_base2 = $('#tbox_prefs_search_api_base2').val();
    prefs.upload_api_base = $('#tbox_prefs_upload_api_base').val();
    prefs.oauth_base = $('#tbox_prefs_oauth_base').val();
    prefs.sign_oauth_base = $('#tbox_prefs_sign_oauth_base').val();
    prefs.use_same_sign_api_base = $('#chk_prefs_use_same_sign_api_base').prop('checked');
    prefs.use_same_sign_oauth_base = $('#chk_prefs_use_same_sign_oauth_base').prop('checked');
	
    prefs.use_custom_source_app = $('#chk_prefs_use_custom_source_app_name').prop('checked');
    if (prefs.use_custom_source_app) {
	prefs.consumer_key = $('#tbox_prefs_custom_source_app_name_key').val();
	prefs.consumer_secret = $('#tbox_prefs_custom_source_app_name_secret').val();
    } else {
	prefs.consumer_key = '';
	prefs.consumer_secret = '';
    }
    
    prefs.free_support = $('#chk_prefs_free_support').prop('checked');
    
    prefs.filter_framework = $('#filter_framework_trigger').prop('checked');
    
    prefs.undo_tweet = $('#chk_prefs_use_undo_tweet').prop('checked');
    
    prefs.sending_wait = $('#sel_postpone_tweet').val();
    
    
    
    conf.apply_prefs(conf.current_name, true);
    conf.save_prefs(conf.current_name);
},

restore_defaults:
function restore_defaults() {
    conf.get_current_profile().preferences = conf.get_default_prefs(conf.get_current_profile().protocol);
    conf.settings = conf.default_settings;
    ui.PrefsDlg.load_settings(conf.settings);
    ui.PrefsDlg.load_prefs();
},

update_font_preview:
function update_font_preview() {
    $('#prefs_font_preview')
        .css('font-family'
            , $('#chk_use_custom_font').prop('checked')
                ? $('#tbox_prefs_custom_font').val()
                    : conf.get_default_font_settings())
        .css({'font-size': $('#range_prefs_font_size').val() + 'pt', 'line-height': $('#range_prefs_line_height').val()});
},

check_undefined:
function check_undefined() {
	
}


}
