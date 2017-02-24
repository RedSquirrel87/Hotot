if (typeof ui == 'undefined') var ui = {};
ui.VideoUploader = {

file: null,

filesize: 0,

chunksize: 5000000,

segment_index: 0,

ending: false,

media_id: null,

message: '',

reply_id: null,

quote_link: null,

isClosed: true,

init:
function init() {
	$('#btn_videouploading_box_close').click(function() {
		ui.StatusBox.close();
	});
},

upload_init:
function upload_init() {
	ui.VideoUploader.isClosed = false;
	$('#video_uploading').find('#chunk0').show();
	globals.twitterClient.upload_chunked_init(ui.VideoUploader.file.size, ui.VideoUploader.upload_init_success, ui.VideoUploader.upload_init_fail); 
},

upload_init_success:
function upload_init_success(result) {
	$('#video_uploading').find('#chunk0 > img').attr('src','../image/ic16_checked.png');
	ui.VideoUploader.media_id = result.media_id_string;
	ui.VideoUploader.upload_append();
},

upload_init_fail:
function upload_init_fail(result) {
	if (ui.VideoUploader.isClosed === false) { 
		$('#video_uploading').find('#chunk0 > img').attr('src','../image/ic16_delete.png');
		if (result.responseText) {
			var json = JSON.parse(result.responseText);
			if (json.error) {
				ui.ErrorDlg.alert(_("error_video_uploading"), _("twitter_error_description"), json.error);
			}
		} 
		console.error(JSON.stringify(result,null,4));
	}
},

upload_append:
function upload_append() {	
	$('#video_uploading').find('#chunk'+(ui.VideoUploader.segment_index+1)).show();
	var reader = new FileReader();
	var end = ui.VideoUploader.chunksize + (ui.VideoUploader.chunksize * ui.VideoUploader.segment_index);
	if (end > ui.VideoUploader.file.size) {
		end = ui.VideoUploader.file.size;
		ui.VideoUploader.ending = true;
	}
        var blob = ui.VideoUploader.file.slice(ui.VideoUploader.chunksize * ui.VideoUploader.segment_index, end);
        reader.onload = function (e) { 
		globals.twitterClient.upload_chunked_append(ui.VideoUploader.media_id, blob, e.target.result, 
			ui.VideoUploader.segment_index, ui.VideoUploader.upload_append_success, ui.VideoUploader.upload_append_fail);
	};
        reader.readAsArrayBuffer(blob);
},

upload_append_success:
function upload_append_success(result) {
	ui.VideoUploader.segment_index += 1;
	$('#video_uploading').find('#chunk'+ ui.VideoUploader.segment_index + ' > img').attr('src','../image/ic16_checked.png');
	if (ui.VideoUploader.ending) {
		ui.VideoUploader.upload_finalize();
	} else {
		ui.VideoUploader.upload_append();
	}
},

upload_append_fail:
function upload_append_fail(result) {
	if (ui.VideoUploader.isClosed === false) { 
		$('#video_uploading').find('#chunk'+ (ui.VideoUploader.segment_index+1) + ' > img').attr('src','../image/ic16_delete.png');
		if (result.responseText) {
			var json = JSON.parse(result.responseText);
			if (json.error) {
				ui.ErrorDlg.alert(_("error_video_uploading"), _("twitter_error_description"), json.error);
			}
		} 
		console.error(JSON.stringify(result,null,4));
	}
},

upload_finalize:
function upload_finalize() {
	$('#video_uploading').find('#chunk4').show();
	globals.twitterClient.upload_chunked_finalize(ui.VideoUploader.media_id, ui.VideoUploader.upload_finalize_success, ui.VideoUploader.upload_finalize_fail); 
},

upload_finalize_success:
function upload_finalize_success(result) {
	ui.VideoUploader.segment_index += 1;
	$('#video_uploading').find('#chunk4 > img').attr('src','../image/ic16_checked.png');
	ui.VideoUploader.post_tweet();
},

upload_finalize_fail:
function upload_finalize_fail(result) {
	if (ui.VideoUploader.isClosed === false) { 
		$('#video_uploading').find('#chunk4 > img').attr('src','../image/ic16_delete.png');	
		if (result.responseText) {
			var json = JSON.parse(result.responseText);
			if (json.error) {
				ui.ErrorDlg.alert(_("error_video_uploading"), _("twitter_error_description"), json.error);
			}
		} 
		console.error(JSON.stringify(result,null,4));
	}
},



post_tweet:
function post_tweet() {
	$('#video_uploading').find('#tweeting').show();
	var status_text = ui.VideoUploader.message;
	if (ui.VideoUploader.quote_link) status_text = status_text + " " + ui.VideoUploader.quote_link;
	
	var hashtags = status_text.match(ui.Template.reg_hash_tag);
	db.dump_hashtags(hashtags);
	
	var reply_to_id = ui.VideoUploader.reply_id;
	
	globals.twitterClient.update_status_with_media_ids(status_text, reply_to_id, ui.VideoUploader.media_id, 
	function (result) {
		$('#video_uploading').find('#tweeting > img').attr('src','../image/ic16_checked.png');
		ui.Main.add_tweets(ui.Main.views['home'], [result], false, true);
		toast.set(_('update_successfully')).show();
		ui.StatusBox.close('slide');
	}, 
	function (xhr, textStatus, errorThrown) {
		console.error(xhr);
		$('#video_uploading').find('#tweeting > img').attr('src','../image/ic16_delete.png');
		globals.twitterClient.default_error_handler('', xhr, textStatus, errorThrown);
	});
},

reset:
function reset() {
	// Reset vars
	ui.VideoUploader.isClosed = true;
	ui.VideoUploader.media_id = null;
	ui.VideoUploader.message = '';
	ui.VideoUploader.reply_id = null;
	ui.VideoUploader.file = null;
	ui.VideoUploader.segment_index = 0;
	ui.VideoUploader.ending = false;
	
	// Reset html	
	for (var i=0; i<5; i+=1) {
		$('#video_uploading').find('#chunk'+(i)).hide();
		$('#video_uploading').find('#chunk'+(i)+' > img').attr('src','../image/ic16_loading.gif');
	}
	
	$('#video_uploading').find('#tweeting').hide();
	$('#video_uploading').find('#tweeting > img').attr('src','../image/ic16_loading.gif');
}


}
