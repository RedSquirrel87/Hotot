var i18n = {
default_locale: window.navigator.language.replace('-', '_'),

locale: window.navigator.language.replace('-', '_'),

dict: {},

init:
function init(callback) {
    i18n.change(i18n.locale, callback);
    return ;
},

change:
function change(code, callback) {
    if (code === 'en_US' || code === 'en_GB' || code === 'auto') code = 'en';
    if (i18n.current == code) return;
    i18n.current = code;

    $.ajaxSetup({
	// Fix for Firefox
	beforeSend: function(xhr){
		if (xhr.overrideMimeType) xhr.overrideMimeType("application/json");
	}
    });
        
    $.getJSON('_locales/' + code + '/messages.json',
        function (result) {
            hotot_log('i18n', 'Use locale: ' + code);
            i18n.load_dict(result);
            i18n.trans_html();
            ui.Template.update_trans();
            if (callback != undefined)
                callback();
        }).error(function(jqXHR, txt, err){
            hotot_log('i18n', txt);
            hotot_log('i18n', 'Load messages "'+ code +'" failed. Use default locale: '+i18n.default_locale);
            $.getJSON('_locales/en/messages.json',
            function (result) {
                i18n.load_dict(result);
                i18n.trans_html();
                ui.Template.update_trans();
                if (callback != undefined)
                    callback();
            });
	});

    if (code != 'en') {
	$.getScript('_locales/' + code + '/timestring.js').always(function () {
		moment.locale(false);
	});
    }
},

load_dict:
function load_dict(new_dict) {
    i18n.dict = new_dict;
},

get_message:
function get_message(msg) {
        if (i18n.dict != null && i18n.dict.hasOwnProperty(msg)) {
            return i18n.dict[msg].message;
        } else {
            return '';
        }
},

trans_html:
function trans_html() {
    $('*[data-i18n-text]').each(function(idx, obj) {
        var obj = $(obj);
        var msg = i18n.get_message(obj.attr('data-i18n-text'));
        if (msg) {
            obj.text(msg);
        }
    });
    $('*[data-i18n-title]').each(function(idx, obj) {
        var obj = $(obj);
        var msg = i18n.get_message(obj.attr('data-i18n-title'));
        if (msg) {
            obj.attr('title', msg);
        }
    });
    $('*[data-i18n-placeholder]').each(function(idx, obj) {
        var obj = $(obj);
        var msg = i18n.get_message(obj.attr('data-i18n-placeholder'));
        if (msg) {
            obj.attr('placeholder', msg);
        }
    });
}
};

function _(msg) {
    var ret = i18n.get_message(msg);
    if (ret) {
        return ret;
    } else {
        return msg;
    }
}    


