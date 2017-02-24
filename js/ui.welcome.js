if (typeof ui == 'undefined') var ui = {};
ui.Welcome = {

me: {},

id: '',

profiles: [],

selected_profile: 'default',

init:
function init () {
    ui.Welcome.id = '#welcome_page';
    ui.Welcome.me = $('#welcome_page');
    ui.Welcome.load_background("image/background/" + conf.settings.welcome_background);
    
    $('#sign_in_block .service_chooser a').click(function () {
        $('#sign_in_block .service_chooser a').removeClass('selected');
        $(this).addClass('selected');
    });

    $('#tbox_new_profile_name').keydown(function (ev) {
        if (ev.keyCode == 13) {
            ui.Welcome.go.click();
        }
    });
    
    $('#tbox_profile_password').keydown(function (ev) {
        if (ev.keyCode == 13) {
            ui.Welcome.go.click();
        }
    });   

    ui.Welcome.go = $('#sign_in_block .go');
    ui.Welcome.go.click(function () {
        if (ui.Welcome.selected_profile == 'default') {
            ui.Welcome.create_profile();
        } else {
	    ui.Welcome.oauth_sign_in();
        }
    });

    $('#btn_welcome_prefs').click(
    function (event) {
        ui.PrefsDlg.load_settings(conf.settings);
        ui.PrefsDlg.load_prefs();
        globals.prefs_dialog.open();
    });

    $('#manage_password_btn').click(
    function (event) {
	var password = $('#tbox_profile_password').val();
	if (password === '') {
		alert(_('password_alert'));
	} else { 
		db.get_password_of_profile(ui.Welcome.selected_profile, function(result) {
			if (result === hex_sha1('')) {
				if (confirm(_('password_confirm_add') + '\n\n' + _('password_chosen') + ' ' + password + '\n')) {
					var profile = {};
					profile.name = conf.profiles[conf.current_name].name;
					profile.protocol = conf.profiles[conf.current_name].protocol;
					profile.preferences = JSON.stringify(conf.profiles[conf.current_name].preferences);
					profile.order = conf.profiles[conf.current_name].order;
					db.modify_profile(conf.current_name, profile, hex_sha1(password), function(ok) {
						if (ok) {
							toast.set(_('successfully')).show();
						} else {
							toast.set(_('error_occurred')).show();
						}
					});
				}
			} else {
				if (result === hex_sha1(password)) { 
					if (confirm(_('password_confirm_remove') + '\n')) {
						var profile = {};
						profile.name = conf.profiles[conf.current_name].name;
						profile.protocol = conf.profiles[conf.current_name].protocol;
						profile.preferences = JSON.stringify(conf.profiles[conf.current_name].preferences);
						profile.order = conf.profiles[conf.current_name].order;
						db.modify_profile(conf.current_name, profile, hex_sha1(''), function(ok) {
							if (ok) {
								toast.set(_('successfully')).show();
							} else {
								toast.set(_('error_occurred')).show();
							}
						});					
					}					
				} else {
					toast.set(_('wrong_password')).show();	
				}			
			}
		}); 	
	}
    });
    
    $('#clear_token_btn').click(
    function (event) {
        if (confirm(_('token_confirm') + '\n'))
        {
            conf.clear_token(conf.current_name);
            $('#profile_avatar_list a.selected').click();
        }
    });    

    $('#btn_welcome_delete_profile').click(
    function (event) {
        if (confirm(_('delete_profile_confirm') + '\n'))
        {
            db.remove_profile(ui.Welcome.selected_profile,
            function (result) {
                if (result) {
                    delete conf.profiles[conf.current_name];
                    ui.Welcome.load_profiles_info();
                    if ($('#profile_avatar_list a').length == 1) {
                        $('#profile_avatar_list a:first').click();
                    } else {
                        $('#profile_avatar_list a:eq(1)').click();
                    }
                }
            });
        }
    });

    $('#btn_welcome_about').click(
    function (event) {
        globals.about_dialog.open();
    });

    $('#sel_welcome_lang').change(function () {
        i18n.change($(this).val());
        if (conf.current_name.length != 0) {
            conf.get_current_profile().preferences['lang'] = $('#sel_welcome_lang').val();
            conf.save_prefs(conf.current_name);
        }
    });

    return this;
},

create_profile:
function create_profile () {
    var prefix = $.trim($('#tbox_new_profile_name').val());
    if (prefix.length == 0 ) {
        toast.set(_('please_entry_a_profile_prefix')).show();
        return;
    }
    if (prefix.indexOf('@') != -1) {
        toast.set(_('charactor_at_is_not_allow_in_profile_prefix'))
            .show();
        return;
    }
    
    var password = $('#tbox_new_profile_password').val();
    if (password !== "") {
	if (confirm(_('sure_to_protect')) === false) {
		$('#tbox_new_profile_password').val("");
		return;
	}
    }
    
    var service = $('#sign_in_block .service_chooser a.selected').attr('href').substring(1);
    db.add_profile(prefix, service, hex_sha1(password), 
    function (result) {
        if (result != true) {
            toast.set(_('this_profile_may_has_already_exists')).show();
        } else {
            toast.set(_('new_profile_has_been_created')).show();
	    $('#tbox_new_profile_name').val("");
	    $('#tbox_new_profile_password').val("");
            conf.reload(function () {
                ui.Welcome.load_profiles_info();
                $('#profile_avatar_list a[href="' + prefix + '@' + service + '"]').click();
            });
        }
    });
},

oauth_sign_in:
function oauth_sign_in(event) {
    globals.twitterClient.use_oauth = true;
    toast.set(_('sign_in_dots')).show();

    ui.Welcome.go.addClass('loading');

    if (!globals.twitterClient.oauth.access_token || typeof globals.twitterClient.oauth.access_token !== "object" || !("oauth_token" in globals.twitterClient.oauth.access_token)) {
    // access_token is not existed
    // then get a new one.
        globals.twitterClient.oauth.get_request_token(
        function (result) {
            ui.Welcome.go.removeClass('loading');
            if (result == '') {
                ui.ErrorDlg.alert(
                    _('oops_a_network_error_occurs')
                  , _('network_error_please_try_later'), '');
            } else {
                ui.PinDlg.set_auth_url(globals.twitterClient.oauth.get_auth_url());
		$('#tbox_oauth_pin').val("");
                globals.oauth_dialog.open();
            }
        }, function (result) {
            ui.Welcome.go.removeClass('loading');
            ui.ErrorDlg.alert(
                _('oops_a_network_error_occurs')
                , _('network_error_please_try_later'), 
		(conf.get_current_profile().preferences.use_custom_source_app ? 
			_('check_or_disable_custom_source_app') : _('cannot_get_token_from_server'))
	    );
        });
    } else {
    // access_token is existed
	db.get_password_of_profile(ui.Welcome.selected_profile, function(result) {
		var password = $('#tbox_profile_password').val();
		if (result === hex_sha1(password)) { 
			$('#tbox_profile_password').val("");
			// then test access_token
			globals.twitterClient.verify(
				function (result) {
				// access_token is valid
					ui.Welcome.go.removeClass('loading');
					if (result.screen_name) {
						ui.Welcome.authenticate_pass(result);
					} else if (result == '') {
						ui.ErrorDlg.alert(
							_('oops_a_network_error_occurs')
							, _('network_error_please_try_later'), '');
					} else {
						ui.ErrorDlg.alert(
							_('oops_an_api_error_occurs')
							, _('cannot_authenticate_you_please_check_your_username_or_password_and_api_base')
							, result);
					}
				},
				function (xhr, textStatus, errorThrown) {
					ui.ErrorDlg.alert(
						_('oops_an_authentication_error_occurs')
						, _('cannot_authenticate_you_please_try_later')
						, '');
					ui.Welcome.go.removeClass('loading');
				});				
		} else {
			ui.Welcome.go.removeClass('loading');
			toast.set(_('wrong_password')).show();
		}
	});	
    }
},

load_profiles_info:
function load_profiles_info() {
    $('#profile_avatar_list a').unbind('click');
    $('#profile_avatar_list li').not('.new_profile_item').remove();

    var profiles = [];
    for (var name in conf.profiles) {
        profiles.push([name, conf.profiles[name]]);
    }
    profiles.sort(function (a, b) {return b[1].order - a[1].order;})
    for (var i = 0; i < profiles.length; i += 1) {
        var name = profiles[i][0];
        var protocol = profiles[i][1].protocol;
        var prefs = profiles[i][1].preferences;
        var str = '<li><a title="'+ name
            + '" href="' + name
            + '" class="' + protocol
            + '" idx="' + (i + 1) + '"';
        if (prefs.profile_avatar.length != 0) {
            str += ' style="background-image: url('
                + prefs.profile_avatar + ')"></a></li>';
        } else {
            str += '></a></li>';
        }
        $('#profile_avatar_list').append(str);
    }
    $('#profile_avatar_list a').click(
    function (event) {
        var profile_name = $(this).attr('href');
        ui.Welcome.selected_profile = profile_name;

        var type = 'default';
        if (profile_name != 'default') {
            type = profile_name.split('@')[1];
        }
        var width_per_page = {'default': 480, 'twitter': 360};
        $('#sign_in_block .inner').stop().transition({'width': width_per_page[type]}, 200);
        if (profile_name == 'default') {
            $('#btn_welcome_prefs, #btn_welcome_delete_profile, #btn_welcome_exts').hide();
            $('#sign_in_block .profile_title').text(_('new_profile'));
            $('.service_tabs_page').hide();
            $("#service_page_new").show();
        } else {
            $('#token_pass').css('visibility', 'visibility');
            $("#service_page_new").hide();
            $('#service_page_' + type).show();
            $('.service_tabs_page').not('#service_page_' + type).hide();
            $('#sign_in_block .profile_title').text(profile_name)
            $('#btn_welcome_prefs, #btn_welcome_delete_profile, #btn_welcome_exts').show();
            // apply preferences
            conf.apply_prefs(profile_name, true);
            if (globals.twitterClient.oauth.access_token == ''
                || globals.twitterClient.oauth.access_token.constructor != Object) {
                $('#access_token_status_hint').css('display', 'block');
		$('#tbox_profile_password').css('display', 'none');
                $('#token_pass').css('visibility', 'hidden');
            } else {
                $('#access_token_status_hint').css('display', 'none');
		$('#tbox_profile_password').css('display', 'block');
                $('#token_pass').css('visibility', 'visible');
            }
        }
        $('#profile_avatar_list a').not(this).removeClass('selected');
        $('#profile_avatar_list li.selected').removeClass('selected');
        $(this).addClass('selected');
        $(this).parent().addClass('selected');

        var offset = parseInt($(this).attr('idx')) * (74 + 7);
        $('#profile_avatar_list').stop().transition(
            {'margin-top': '-' + (offset + 165) + 'px'}, 300);
	    
	$('#tbox_profile_password').val("");
        return false;
    });
},

authenticate_pass:
function authenticate_pass(result) {
    globals.myself = result;
    conf.apply_prefs(ui.Welcome.selected_profile, true);
    
    /*// apply preferences
    conf.get_current_profile().preferences.profile_avatar = globals.myself.profile_image_url;
    conf.apply_prefs(ui.Welcome.selected_profile, true);
    conf.get_current_profile().order = Date.now();
    conf.save_prefs(conf.current_name);
    */
    
    setTimeout(function () {
        $('#btn_my_profile').attr('style', 'background-image: url('+globals.myself.profile_image_url+');');
        }, 100);
    toast.set(_('authentication_ok')).show();
    conf.load_prefs(conf.current_name, function() {
        ui.Welcome.hide();
        ui.Slider.resume_state();
        ui.Main.show();
	
	// Get configuration
	var last = new Date(conf.settings.config_request_date), now = new Date(), diff = new Date(now-last), days = diff/1000/60/60/24;
	if (days > 1) { // as Twitter docs says: "no more than once a day."
		conf.settings.config_request_date = now;
		globals.twitterClient.configuration(
			function (result) {
				if (result.hasOwnProperty('characters_reserved_per_media')) {
					conf.settings.characters_reserved_per_media = result['characters_reserved_per_media'];
				}
				if (result.hasOwnProperty('short_url_length')) {
					conf.settings.short_url_length = result['short_url_length'];
				}
				if (result.hasOwnProperty('short_url_length_https')) {
					conf.settings.short_url_length_https = result['short_url_length_https'];
				}
				if (result.hasOwnProperty('photo_size_limit')) {
					conf.settings.photo_size_limit = result['photo_size_limit'];
				}
				// 6.0: DM no limit
				if (result.hasOwnProperty('dm_text_character_limit')) {
					conf.settings.dm_text_character_limit = result['dm_text_character_limit'];
				}
				conf.save_settings();
			}
		);
	}	
	
	filter.load();
	
	// apply prefs
        var prefs = conf.get_current_profile().preferences;
	prefs.profile_avatar = globals.myself.profile_image_url;
	conf.get_current_profile().order = Date.now();
    	
        globals.readLaterServ.init(prefs.readlater_username, prefs.readlater_password);	
	if (!prefs.noheader) globals.layout.open('north');
	
	document.title = _('hotot') + ' | ' + conf.current_name;
	conf.save_prefs(conf.current_name, function() {
		ui.Welcome.go.removeClass('loading');
		setTimeout(function () {
			ui.Slider.slide_to('home');
		}, 1000);		
	});
    });
},

load_background:
function load_background(url) {
    $('#welcome_page').css('background-image', 'url("'+url+'")');    
    if ((url == "image/background/default.jpg") || (url == "image/background/old.jpg")) {
	$('#welcome_page').css("background-size","cover");
    } else {
	$('#welcome_page').css("background-size","auto");
    }
},

hide:
function hide () {
    this.me.hide();
    return this;
},

show:
function show () {
    var _this = this;
    conf.reload(function () {
        _this.me.show();
    });
    return this;
}

}


