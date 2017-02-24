if (typeof ui == 'undefined') var ui = {};
ui.StatusBox = {

reply_to_id: null,

MODE_TWEET: 0,

MODE_REPLY: 1,

MODE_DM: 2,

MODE_IMG: 3,

MODE_VIDEO: false,

MODE_QUOTE: false,

POS_BEGIN: 0,

POS_END: -1,

current_mode: 0,

isClosed: true,

reg_fake_dots: null,

last_sent_text: '',

get_status_len:
function get_status_len(status_text) {
    var rep_url = function (url) {
	    var aux = "12345678901234567890123456789012345678901234567890"; 
	    var isHTTPS = /^https.*$/.test(url);
	    if (isHTTPS) {
		return aux.substring(0, conf.settings.short_url_length_https);
	    } else {
		return aux.substring(0, conf.settings.short_url_length);
	    }
    }
    if ((ui.StatusBox.current_mode === ui.StatusBox.MODE_IMG) && (ui.StatusBox.MODE_QUOTE === true)) {
	return (status_text.replace(ui.Template.reg_link_g, rep_url).length + conf.settings.short_url_length_https + 1);
    } else {
	return status_text.replace(ui.Template.reg_link_g, rep_url).length;
    }
},

init:
function init () {
    $('#btn_update').click(function(event){
        var status_text = $.trim($('#tbox_status').val());
	// 6.0: DM no limit
        if (ui.StatusBox.current_mode === ui.StatusBox.MODE_DM) { 
	    if (ui.StatusBox.get_status_len(status_text) > conf.settings.dm_text_character_limit) 
	    {
		toast.set(_('status_is_over_maximum') + " " + conf.settings.dm_text_character_limit).show();
		return;
	    }
        }
	else	
        if (ui.StatusBox.get_status_len(status_text) > globals.max_status_len) {
            if (!conf.get_current_profile().preferences.auto_longer_tweet) {
                toast.set(_('status_is_over_140_characters')).show();
            } else {
			toast.set(_('contacting_twitlonger')).show();
			globals.network.do_request('POST',
			'http://www.twitlonger.com/api_post',
			{
				'application' : 'hotot', 
				'api_key' : 'Y986q318x61i49Jm', 
				'username' : globals.myself.screen_name, 
				'message' : status_text
			},
			{},
			null,
			function (result) {
		            var xml = $(result).find("short").text();
			    var text = status_text;
			    var l = globals.max_status_len - xml.length - 15;
			    if (ui.StatusBox.current_mode == ui.StatusBox.MODE_IMG) {
				l = l - (conf.settings.short_url_length_https + 2);
			    }
			    ui.StatusBox.set_status_text(text.substring(0,l) + "... (cont) " + xml);	
			    ui.StatusBox.update_status_len();		    
			    ui.StatusBox.open();
			},
			function () {
	                        toast.set(_('failed')).show();
			});	    
	    }
            return;
        }
	
        if (status_text.length != 0 || ui.StatusBox.current_mode != ui.StatusBox.MODE_TWEET) {
            if (ui.StatusBox.current_mode == ui.StatusBox.MODE_DM) {
                ui.StatusBox.post_message(status_text);
            } else if(ui.StatusBox.current_mode==ui.StatusBox.MODE_IMG){
		// 6.0: Video upload support
		if (ui.StatusBox.MODE_VIDEO) {
			ui.StatusBox.post_video(status_text);
		} else {
	                ui.StatusBox.post_image(status_text);
		}
            } else {
                if (ui.StatusBox.last_sent_text == status_text) {
                    toast.set(_('already_tweeted')).show();
                } else {
                    ui.StatusBox.update_status(status_text);
                }
            }
        }
    });

    $('#btn_clear').click(function (event) {
        $('#tbox_status').val('');
        ui.StatusBox.change_mode(ui.StatusBox.MODE_TWEET);
        ui.StatusBox.reply_to_id = null;
        ui.StatusBox.move_cursor(ui.StatusBox.POS_BEGIN);
        ui.StatusBox.update_status_len();
        $('#status_smiley').hide();
        $('#tbox_status').show();
    });

    var toggle_mode = new widget.Button('#toggle_mode');
    toggle_mode.on_clicked = function (event) {
	$('#tbox_dm_target').val('');
        ui.StatusBox.change_mode(ui.StatusBox.MODE_DM);
        $('#tbox_dm_target').focus();
    };
    toggle_mode.create();

    var emoji_visible = false, emoji_parsed = false;
    $('#btn_smiley').click(function () {
	if (emoji_visible) {
		$('#status_smiley').hide();
		$('#tbox_status').show();
		emoji_visible = false;
	} else {
		if (emoji_parsed === false) {
			twemoji.parse(document.getElementById("status_smiley_inner"), {base: '../image/',folder: 'emoji'});			
			emoji_parsed = true;
		}
		$('#tbox_status').hide();
		$('#status_smiley').show();
		emoji_visible = true;		
	}
    });

    $('ul.emoji-list li').click(function () {
        $('#status_smiley').hide();
        $('#tbox_status').show();
	emoji_visible = false;
	ui.StatusBox.insert_status_text($('img', this).attr('alt'), null);
        return false;
    });
    
    //2.2: Mic fix
    var recognizing = false;
    var recognition = (typeof webkitSpeechRecognition === 'undefined') ? null : new webkitSpeechRecognition();
    
    $('#btn_rec').click(function () {
	if (recognition === null) {
		alert(_('speech_error'));
		return;
	}
	var final_transcript = '';

	recognition.onstart = function() {
		$('#btn_rec').css('background','transparent url(../image/ic16_rec.png) no-repeat center center');
		recognizing = true;
	}

	recognition.onresult = function(event) {
		if (typeof(event.results) == 'undefined') {
			recognition.onend = null;
			recognition.stop();
			return;
		}
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			}
		}	
		if ($('#tbox_status').val().length > 0) {
			ui.StatusBox.append_status_text(' ' + final_transcript);	
		} else {
			ui.StatusBox.append_status_text(final_transcript.charAt(0).toUpperCase() + final_transcript.slice(1));	
		}
		ui.StatusBox.update_status_len(); 
	}

	recognition.onerror = function(event) {
		toast.set(_('error_occurred') + ' ' + _('error_code') + ' ' + event.error).show(5);
	}

	recognition.onend = function() {
		$('#btn_rec').css('background','transparent url(../image/ic16_mic.png) no-repeat center center');
		recognizing = false;
	}	

	if (recognizing) {
		recognition.stop();
		return;
	}
	recognition.lang = conf.get_current_profile().preferences.speech_lang;
	recognition.start();
    });

    $('#btn_imageuploader').click(function () {
	$('#btn_imageuploader_file').click();
	return false;
    });
    
    $('#btn_imageuploader_file').change(function() {
	ui.StatusBox.load_previews(this.files);
    });

    // 6.0: Video upload support
    $('#btn_videouploader').click(function () {
	$('#btn_videouploader_file').click();
	return false;
    });
    $('#btn_videouploader_file').change(function() {
	ui.StatusBox.load_video(this.files[0]);
    });
    
    
    $('#btn_save_draft').click(function () {
        if ($.trim($('#tbox_status').val()).length == 0) {
            return false;
        }
        var draft = {
            'mode': ui.StatusBox.current_mode,
            'text': $('#tbox_status').val()
        };
        if (ui.StatusBox.current_mode == ui.StatusBox.MODE_REPLY) {
            draft.reply_to_id = ui.StatusBox.reply_to_id;
            draft.recipient = encodeURIComponent($('#status_box .who').text());
            draft.reply_text = encodeURIComponent($('#status_box .quote').text())
        } else if (ui.StatusBox.current_mode == ui.StatusBox.MODE_DM) {
            draft.recipient = encodeURIComponent($('#tbox_dm_target').val());
        }
        ui.StatusBox.save_draft(draft);
        ui.StatusBox.reset();
    });
    
    $('#tbox_status').keyup(function (event) {
	ui.StatusBox.update_status_len();
    });
    
    $('#tbox_status').keydown(
    function (event) {
        // shortcut binding Ctrl+Enter or Command+Enter(Mac)
        if (navigator.platform.indexOf('Mac') != -1) {
            if (event.metaKey && event.keyCode === 13) {
                $('#btn_update').click();
		return false;
            }
        } else {
            if (event.ctrlKey && event.keyCode === 13) {
                $('#btn_update').click();
                return false;
            }
        }

        if (event.keyCode == 27) { // esc
            ui.StatusBox.close();
        }
    });

    $('#tbox_status').blur(function (event) {
        ui.StatusBox.update_status_len();
    });

    $('#status_box').bind('dragover', function () {
        return false;
    }).bind('dragend', function () {
        return false;
    }).bind('drop', function (ev) {
	ev.preventDefault();
	ui.StatusBox.load_previews(ev.originalEvent.dataTransfer.files);
    });

    $('#tbox_dm_target').click(
    function (event) {
        return false;
    });

    $('#status_len').text('0/' + globals.max_status_len);

    $('#status_box').click(function (event) {
        event.stopPropagation();
    });

    $('#status_box .dialog_close_btn').unbind().click(function(){
        ui.StatusBox.close();
        return false;
    });
    
    // setup autocomplete for user name
    widget.autocomplete.connect($('#tbox_status'));
    widget.autocomplete.connect($('#tbox_dm_target'));

},

// 6.0: Video upload support
load_video:
function load_video(video) {
	if (ui.FormChecker.test_mp4_video(video) === false) {
		toast.set(ui.FormChecker.ERR_STR_MP4_VIDEO).show(3);
		return false;
	}
	if (ui.FormChecker.test_file_size_bound(video, 15*1024*1024) === false) {
		toast.set(ui.FormChecker.ERR_STR_MP4_SIZE).show(3);
		return false;
	}
	// Check duration
	var reader = new FileReader();
        reader.onload = function(e) {
		ui.StatusBox.change_mode(ui.StatusBox.MODE_IMG);
		var div = $('#imagepreview').find('#preview');
		div.append('<td class="thumbnail"><video id="videobj" src="' + e.target.result + '" style="max-width:100%;max-height:150px;" controls ></video></td>');
		var btn = $('#imagepreview').find('.ic_close');
		btn.click(function () {
			div.empty();
			btn.hide();				
			ui.StatusBox.change_mode(ui.StatusBox.MODE_TWEET);
			return false;
		});
		btn.show();
		$('#videobj').on('loadedmetadata', function() {
			if (this.duration.toFixed(0) > 30) {
				div.empty();
				btn.hide();				
				ui.StatusBox.change_mode(ui.StatusBox.MODE_TWEET);
				toast.set(ui.FormChecker.ERR_STR_MP4_DURATION).show(3);
				return false;
			} else {
				ui.StatusBox.MODE_VIDEO = true;
			}
		});
        };		
        reader.readAsDataURL(video);
	ui.VideoUploader.file = video;
},

load_previews:
function load_previews(images) {
	// Tests on images
	if (ui.ImageUploader.files.length === 1 && ui.FormChecker.test_gif_image(ui.ImageUploader.files[0])) {
		toast.set(ui.FormChecker.ERR_STR_GIF_IMAGE).show(3);
		return false;	
	}
	if ((images.length + ui.ImageUploader.files.length) > 4) 
	{
		toast.set(ui.FormChecker.ERR_STR_TOO_MANY_IMAGE).show(3);
		return false;	
	}
	for (var i = 0; i < images.length; i += 1) {
		if (ui.FormChecker.test_file_image(images[i]) === false) {
			toast.set(ui.FormChecker.ERR_STR_NOT_ALL_IMAGE).show(3);
			return false;
		} 
		if (ui.FormChecker.test_gif_image(images[i]) && (images.length + ui.ImageUploader.files.length) > 1) {
			toast.set(ui.FormChecker.ERR_STR_GIF_IMAGE).show(3);
			return false;
		}
		if (ui.FormChecker.test_file_size_bound(images[i], conf.settings.photo_size_limit) === false) {
			toast.set(ui.FormChecker.ERR_STR_FILE_SIZE_EXCEED).show(3);
			return false;
		}
	}
	
	// Show previews
	ui.StatusBox.change_mode(ui.StatusBox.MODE_IMG);
	for (var i = 0; i < images.length; i += 1) {
		if (ui.ImageUploader.index_of_image_file(images[i]) === -1) {
			ui.ImageUploader.files.push(images[i]);
			var reader = new FileReader();
			reader.onload = function (e) {
				var div = $('#imagepreview').find('#preview');
				div.append('<td class="thumbnail"><img style="max-width:100%;max-height:150px;" src="'+e.target.result+'" /></td>');
				var btn = $('#imagepreview').find('.ic_close');
				btn.click(function () {
					div.empty();
					btn.hide();				
					ui.StatusBox.change_mode(ui.StatusBox.MODE_TWEET);
				});
				btn.show();
			}
			reader.readAsDataURL(images[i]);	
		}
	}
	
	ui.StatusBox.update_status_len();
	return false;	
},

resetSize:
function resetSize () {
    $('#tbox_status_wrapper').height(200);
},

resetMedia:
function resetMedia() {
	// 6.0: Video upload support
	$('#btn_videouploader_file').val(''); 
	ui.StatusBox.MODE_VIDEO = false;
	ui.VideoUploader.reset();
	
	$('#btn_imageuploader_file').val('');
	$('#imagepreview').find('#preview').empty();
	$('#imagepreview').find('.ic_close').hide();	
	ui.StatusBox.resetSize();
	ui.ImageUploader.reset();
},

change_mode:
function change_mode(mode) {
    if (mode == ui.StatusBox.MODE_DM) {
        $('#status_box').removeClass('reply_mode').addClass('dm_mode');
        $('#tbox_dm_target').show();
        $('#status_info').show();
	$('#btn_imageuploader').hide();
	$('#btn_videouploader').hide();
	ui.StatusBox.resetMedia();
	ui.StatusBox.remove_quote();
    } else if (mode == ui.StatusBox.MODE_REPLY){
        $('#status_box').removeClass('dm_mode').addClass('reply_mode');
        $('#status_info').show();
        $('#tbox_dm_target').hide();
	$('#btn_imageuploader').show();
	$('#btn_videouploader').show();
	if (ui.StatusBox.current_mode == ui.StatusBox.MODE_IMG) mode = ui.StatusBox.MODE_IMG;
    } else if (mode == ui.StatusBox.MODE_IMG) {
	$('#tbox_status_wrapper').height(100);
    } else {
        $('#status_box').removeClass('dm_mode').removeClass('reply_mode');
        $('#tbox_dm_target').hide();
        $('#status_info').hide();
	$('#btn_imageuploader').show();
	$('#btn_videouploader').show();	
	ui.StatusBox.resetMedia();
    }
    ui.StatusBox.current_mode = mode;
    ui.StatusBox.update_status_len();
},

update_status:
function update_status(status_text) {
    if (status_text.length != 0) {
    
	var hashtags = status_text.match(ui.Template.reg_hash_tag);
	db.dump_hashtags(hashtags);
	
        toast.set(_('updating_dots')).show();
        var draft = {
            'mode': ui.StatusBox.MODE_TWEET,
            'text': status_text
        };
        if (ui.StatusBox.current_mode == ui.StatusBox.MODE_REPLY) {
            draft.mode = ui.StatusBox.MODE_REPLY;
            draft.reply_to_id = ui.StatusBox.reply_to_id;
            draft.recipient = encodeURIComponent($('#status_box .who').text());
            draft.reply_text = encodeURIComponent($('#status_box .quote').text());
        }
	if (ui.StatusBox.MODE_QUOTE) {
		draft.quote_link = encodeURIComponent($('#status_box .quote_link').text());
	}
	
        ui.StatusBox.reset();

	if (conf.get_current_profile().preferences.free_support) {
		status_text = status_text.replace(ui.Template.reg_link_g, function replace_url(url) {
			if (url.indexOf("amazon.it/") > -1) {
				url = util.updateURLParameter(url,"tag","hotot-21")
			} else if (url.indexOf("amazon.com/") > -1) {
				url = util.updateURLParameter(url,"tag","hotot-20");	
			} else if (url.indexOf("amazon.es/") > -1) {
				url = util.updateURLParameter(url,"tag","hototes-21");
			} else if (url.indexOf("amazon.fr/") > -1) {
				url = util.updateURLParameter(url,"tag","hototfr-21");
			} else if (url.indexOf("amazon.de/") > -1) {
				url = util.updateURLParameter(url,"tag","hototde-21");
			} else if (url.indexOf("amazon.co.uk/") > -1) {
				url = util.updateURLParameter(url,"tag","hototcouk-21");
			} 
			return url;
		});
	}
		
	var sending = setTimeout(function() {
		globals.twitterClient.update_status(status_text
			, draft.reply_to_id
			, (draft.quote_link ? decodeURIComponent(draft.quote_link) : draft.quote_link)
			, function (result) {
				$('#notification_tweet_undo').hide();
				ui.StatusBox.last_sent_text = status_text;
				ui.StatusBox.update_status_cb(result);
			}, function (xhr, textStatus, errorThrown) {
				$('#notification_tweet_undo').hide();
				toast.set(_('update_failed')).show();
				ui.StatusBox.last_sent_text = '';
				ui.StatusBox.save_draft(draft);
			})
	}, conf.get_current_profile().preferences.sending_wait*1000);
	$('#notification_tweet_undo').show();
	$('#tweet_undo').click(function() {
		clearTimeout(sending);
		$('#notification_tweet_undo').hide();
		toast.set(_('cancelled')).show();
	});	

        ui.StatusBox.close('slide');
    }
    return this;
},

update_status_cb:
function update_status_cb(result) {
    ui.Main.add_tweets(ui.Main.views['home'], [result], false, true);
    if (conf.get_current_profile().preferences.undo_tweet) {
	$('#notification_tweet_delete').show();
	setTimeout(function() {
		$('#notification_tweet_delete').hide();
	}, 5000);
	$('#tweet_delete_now').on('click', function() {
		globals.twitterClient.destroy_status(result.id_str,
			function (result) {
				$('#notification_tweet_delete').hide();
				toast.set(_('destroy_successfully')).show();
			});	
	});
    } else {
	toast.set(_('update_successfully')).show();
    }
    return this;
},

update_status_len:
function update_status_len() {
    var status_len = ui.StatusBox.get_status_len($('#tbox_status').val());
    var max_len = ((ui.StatusBox.current_mode === ui.StatusBox.MODE_DM) ? conf.settings.dm_text_character_limit : globals.max_status_len);
    if (status_len > max_len)
        $('#status_len').css('color', '#cc0000');
    else
        $('#status_len').css('color', '#aaa');
    $('#status_len').text(status_len + '/' + max_len);
},

post_message:
function post_message(message_text) {
    if (message_text.length != 0) {
        var name = $.trim($('#tbox_dm_target').val());
        var draft = {
            'mode': ui.StatusBox.MODE_DM,
            'text': message_text,
            'recipient': encodeURIComponent(name)
        };
        ui.StatusBox.reset();
        if (name == '') {
            toast.set(_('please_enter_the_recipient')).show();
        } else {
            if (name[0] == '@') name = name.substring(1);
            toast.set(_('posting_dots')).show();
            globals.twitterClient.new_direct_messages(
                  message_text
                , null
                , name
                , ui.StatusBox.post_message_cb
                , function (xhr, textStatus, errorThrown) {
                    toast.set(_('update_failed')).show();
                    ui.StatusBox.save_draft(draft);
                });
            ui.StatusBox.close('slide');
        }
    }
},

post_message_cb:
function post_message_cb(result) {
	ui.StatusBox.change_mode(ui.StatusBox.MODE_TWEET);
	toast.set(_('post_successfully')).show();
	$('#tbox_status').val('');
	$('#status_info').hide();
	return this;
},	

post_image:
function post_image(msg) {
	ui.ImageUploader.message = msg;
	ui.ImageUploader.reply_id = ui.StatusBox.reply_to_id;
	ui.ImageUploader.quote_link = ui.StatusBox.MODE_QUOTE ? $('#status_box .quote_link').text() : null;
	$('#status_dialog').hide();
	$('#status_uploading').show();
	ui.ImageUploader.upload_media(0);
},

// 6.0: Video upload support
post_video:
function post_video(msg) {
	ui.VideoUploader.message = msg;
	ui.VideoUploader.reply_id = ui.StatusBox.reply_to_id;
	ui.VideoUploader.quote_link = ui.StatusBox.MODE_QUOTE ? $('#status_box .quote_link').text() : null;
	$('#status_dialog').hide();
	$('#video_uploading').show();
	ui.VideoUploader.upload_init();
},

save_draft:
function save_draft(draft) {
    $('#status_drafts ul').append(ui.Template.form_status_draft(draft));
    $('#status_drafts .btn_draft_clear').unbind().click(function() {
        $(this).parent().remove();
        var count = $('#status_drafts li').length;
        $('#status_drafts summary').text(_('drafts') + '(' + count + ')');
        if (count == 0) {
            $('#status_drafts').hide();
        }
    });
    $('#status_drafts .text').unbind().click(function() {
        var li = $(this).parent();
        var mode = parseInt(li.attr('mode'));
        ui.StatusBox.change_mode(mode);
        ui.StatusBox.set_status_text($(this).text().replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
        switch (mode){
        case ui.StatusBox.MODE_REPLY:
            ui.StatusBox.reply_to_id = li.attr('reply_to_id')
            ui.StatusBox.set_reply_info(decodeURIComponent(li.attr('recipient')), decodeURIComponent(li.attr('reply_text')));
        case ui.StatusBox.MODE_DM:
            ui.StatusBox.set_dm_target(decodeURIComponent(li.attr('recipient')));
        break;
        default:
        break;
        }
        li.remove();
        var count = $('#status_drafts li').length;
        $('#status_drafts summary').text(_('drafts') + ' ('+count+')');
        if (count == 0) {
            $('#status_drafts').hide();
        }

        ui.StatusBox.move_cursor(ui.StatusBox.POS_END);
    });
    var count = $('#status_drafts li').length;
    $('#status_drafts summary').text(_('drafts') + ' ('+count+')');
    $('#status_drafts').show();
},

append_status_text:
function append_status_text(text) {
    var orig = $('#tbox_status').val();
    if (orig.length == 0) {
        $('#tbox_status').val(text);
    } else {
        $('#tbox_status').val(orig + text);
    }
    $('#tbox_status').removeClass('hint_style');
},

insert_status_text:
function insert_status_text(text, pos) {
    if (pos == null) {
        pos = $('#tbox_status').get(0).selectionStart;
    } else {
        $('#tbox_status').get(0).selectionStart = pos;
    }
    $('#tbox_status').val(
        $('#tbox_status').val().substr(0, pos)
        + text
        + $('#tbox_status').val().substring(pos));
},

reset:
function reset() {
    ui.StatusBox.change_mode(ui.StatusBox.MODE_TWEET);
    $('#status_uploading').hide();
    $('#video_uploading').hide();
    $('#status_dialog').show();
    
    $('#status_info').hide();
    $('#tbox_status').val('');
    ui.StatusBox.reply_to_id = null;
    ui.StatusBox.resetSize();
    ui.StatusBox.remove_quote();
},

set_status_text:
function set_status_text(text) {
    $('#tbox_status').val(text);
    $('#tbox_status').removeClass('hint_style');
},

set_reply_info:
function set_reply_info(name, text) {
    $('#status_box .quote').text(text);
    $('#status_box .who').text(name);
},

set_dm_target:
function set_dm_target(screen_name) {
    $('#tbox_dm_target').val(screen_name);
},

add_quote:
function add_quote(text) {
	if (ui.StatusBox.current_mode != ui.StatusBox.MODE_DM) {
		$('#status_box .quote_link').text(text);
		$('#status_box').addClass('quote_mode');
		$('#status_info').show();
		ui.StatusBox.MODE_QUOTE = true;
	}
},

remove_quote:
function remove_quote() {
	$('#status_box .quote_link').text('');
	$('#status_box').removeClass('quote_mode');
	ui.StatusBox.MODE_QUOTE = false;
},

open:
function open(callback) { 
    $('.autocomplete').hide();
    syncAutocomplete();
    globals.compose_dialog.open('fade', function () {
        ui.StatusBox.move_cursor(ui.StatusBox.POS_END);
        if (callback && typeof (callback) === 'function') {
            callback();
        }
        ui.StatusBox.isClosed = false;
    });
},

close:
function close(method) {
    $('#status_smiley').hide();
    $('#tbox_status').show();
    globals.compose_dialog.close(method);
    $('#tbox_status').blur();
    ui.StatusBox.isClosed = true;
    ui.StatusBox.reset();
},

move_cursor:
function move_cursor(pos) {
    if (typeof pos == 'undefined')
        return;
    if (pos == ui.StatusBox.POS_END)
        pos = $('#tbox_status').val().length;
    $('#tbox_status').focus();
    var box = $('#tbox_status').get(0);
    if(box.setSelectionRange) {
    // others
        box.setSelectionRange(pos, pos);
    } else if (box.createTextRange) {
    // IE
        var range = box.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

};



