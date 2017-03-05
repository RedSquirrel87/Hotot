if (typeof ui == 'undefined') var ui = {};
ui.FormChecker= {

ERR_STR_NOT_INT:
function ERR_STR_NOT_INT() {
	return _('err_str_not_int');
},

ERR_STR_INT_OUT_OF_RANGE:
function ERR_STR_INT_OUT_OF_RANGE() {
	return _('err_str_range');
},

ERR_STR_TEXT_TOO_LONG:
function ERR_STR_TEXT_TOO_LONG() {
	return _('err_str_too_long');
},

ERR_STR_FILE_IS_NOT_IMAGE:
function ERR_STR_FILE_IS_NOT_IMAGE() {
	return _('err_no_image');
},

ERR_STR_FILE_SIZE_EXCEED:
function ERR_STR_FILE_SIZE_EXCEED() {
	return _('err_str_size_exceed');
},

ERR_STR_TOO_MANY_IMAGE:
function ERR_STR_TOO_MANY_IMAGE() {
	return _('err_too_many_image');
},
ERR_STR_NOT_ALL_IMAGE:
function ERR_STR_NOT_ALL_IMAGE() {
	return _('err_not_all_image');
},
ERR_STR_GIF_IMAGE:
function ERR_STR_GIF_IMAGE() {
	return _('err_gif_image');
},

// 6.0: Video upload support
ERR_STR_MP4_VIDEO:
function ERR_STR_MP4_VIDEO() {
	return _('err_mp4_video');
},
ERR_STR_MP4_SIZE:
function ERR_STR_MP4_SIZE() {
	return _('err_mp4_size');
},
ERR_STR_MP4_DURATION:
function ERR_STR_MP4_DURATION() {
	return _('err_mp4_duration');
},

check_config_error: 
function check_config_error(widgets) {
    var result = [];
    var count = 0
    $(widgets).each(
    function (idx, widget) {
        if ($(widget).data('error') == true) {
            count += 1;
            result.push($(widget).attr('title') 
                + ': ' + $(widget).data('error_str') );
        }
    });
    return {'count':count, 'error_values':result};
},

test_int_value:
function test_int_value(widget) {
    var ret = false;
    var c_val = parseInt($(widget).val());
    if (!isNaN(c_val)) {
        $(widget).removeClass('test_fail');
        $(widget).val(c_val);
        $(widget).data('error', false);
        ret = true;
    } else {
        $(widget).addClass('test_fail');
        $(widget).data('error', true);
        $(widget).data('error_str', ui.FormChecker.ERR_STR_NOT_INT);
    }
    return ret;
},

test_int_range:
function test_int_bound(widget, min, max) {
    var ret = false;
    var c_val = parseInt($(widget).val());
    if (isNaN(c_val)) {
        $(widget).addClass('test_fail');
        $(widget).data('error', true);
        $(widget).data('error_str', ui.FormChecker.ERR_STR_NOT_INT);
    } else {
        $(widget).val(c_val);
        if (min < c_val && c_val < max) {
            $(widget).removeClass('test_fail');
            $(widget).data('error', false);
            ret = true;
        } else {
            $(widget).addClass('test_fail');
            $(widget).data('error', true);
            $(widget).data('error_str'
                , ui.FormChecker.ERR_STR_INT_OUT_OF_RANGE 
                    + min +' and ' + max);
        }
    }
    return ret;
},

test_text_len_limit:
function test_text_len_limit(widget, max_len) {
    var ret = false;
    if ($(widget).val().length < max_len) {
        $(widget).removeClass('test_fail');
        $(widget).data('error', false);
        ret = true;
    } else {
        $(widget).addClass('test_fail');
        $(widget).data('error', true);
        $(widget).data('error_str', ui.FormChecker.ERR_STR_TEXT_TOO_LONG);
    }
    return ret;
},

test_file_image:
function test_file_image(file) {
    var ret = false;
    var filename = file;
    if (typeof (file) != 'string') {
        filename = file.name;
    }
    if (/.*(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
        ret = true;
    }
    return ret;
},

test_gif_image:
function test_gif_image(file) {
    var ret = false;
    var filename = file;
    if (typeof (file) != 'string') {
        filename = file.name;
    }
    if (/.*(gif)$/i.test(filename)) {
        ret = true;
    }
    return ret;
},

// 6.0: Video upload support
test_mp4_video:
function test_mp4_video(file) {
    var ret = false;
    var filename = file;
    if (typeof (file) != 'string') {
        filename = file.name;
    }
    if (/.*(mp4)$/i.test(filename)) {
        ret = true;
    }
    return ret;
},


test_file_size_bound:
function test_file_size_bound(file, bound) {
    var ret = false;
    if (file.size < bound) {
        ret = true;
    }
    return ret;
}

};


