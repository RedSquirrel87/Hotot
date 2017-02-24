if (typeof ui == 'undefined') var ui = {};
ui.ImageUploader = {

// 4.0: Multiple images support
files: [],

mediaid: [],

message: '',

reply_id: null,

quote_link: null,

isClosed: true,

compare_image_files:
function compare_image_files(a,b) {
    return ((a.lastModified == b.lastModified) && (a.name == b.name) && (a.size == b.size));
},

index_of_image_file:
function index_of_image_file(obj) {
    for (var i = 0; i < ui.ImageUploader.files.length; i++) {
        if (ui.ImageUploader.compare_image_files(ui.ImageUploader.files[i],obj)) {
            return i;
        }
    }
    return -1;
},

init:
function init() {
	$('#btn_uploading_box_close').click(function() {
		ui.StatusBox.close();
	});
},

upload_media:
function upload_media(index) {
	ui.ImageUploader.isClosed = false;
	$('#status_uploading').find('#image'+(index+1)).show();
	var file = ui.ImageUploader.files[index];
	var reader = new FileReader();
        reader.onload = function (e) { 
		globals.twitterClient.upload_media(file, e.target.result, 
			ui.ImageUploader.upload_media_success, ui.ImageUploader.upload_media_fail); 
	}
        reader.readAsArrayBuffer(file);
},

upload_media_success:
function upload_media_success(result) {
	if (ui.ImageUploader.isClosed === false) { // Check if user has closed the dialog
		ui.ImageUploader.mediaid.push(result.media_id_string);
		$('#status_uploading').find('#image'+ui.ImageUploader.mediaid.length+' > img').attr('src','../image/ic16_checked.png');
			
		if (ui.ImageUploader.mediaid.length < ui.ImageUploader.files.length) {
			ui.ImageUploader.upload_media(ui.ImageUploader.mediaid.length);
		} else {
			// Posting tweet...	
			ui.ImageUploader.post_tweet();
		}
	}
},

upload_media_fail:
function upload_media_fail(result) {
	if (ui.ImageUploader.isClosed === false) { // Check if user has closed the dialog
		$('#status_uploading').find('#image'+(ui.ImageUploader.mediaid.length+1)+' > img').attr('src','../image/ic16_delete.png');
		console.error(JSON.stringify(result,null,4));
	}
},

post_tweet:
function post_tweet() {
	$('#status_uploading').find('#tweeting').show();
	var status_text = ui.ImageUploader.message;
	if (ui.ImageUploader.quote_link) status_text = status_text + " " + ui.ImageUploader.quote_link;
	
	var hashtags = status_text.match(ui.Template.reg_hash_tag);
	db.dump_hashtags(hashtags);
	
	var reply_to_id = ui.ImageUploader.reply_id;
	
	globals.twitterClient.update_status_with_media_ids(status_text, reply_to_id, ui.ImageUploader.mediaid.join(','), 
	function (result) {
		$('#status_uploading').find('#tweeting > img').attr('src','../image/ic16_checked.png');
		ui.Main.add_tweets(ui.Main.views['home'], [result], false, true);
		toast.set(_('update_successfully')).show();
		ui.StatusBox.close('slide');
	}, 
	function (xhr, textStatus, errorThrown) {
		console.error(xhr);
		$('#status_uploading').find('#tweeting > img').attr('src','../image/ic16_delete.png');
		globals.twitterClient.default_error_handler('', xhr, textStatus, errorThrown);
	});
},

reset:
function reset() {
	// Reset vars
	ui.ImageUploader.isClosed = true;
	ui.ImageUploader.mediaid = [];
	ui.ImageUploader.files = [];
	ui.ImageUploader.message = '';
	ui.ImageUploader.reply_id = null;
	
	// Reset html	
	for (var i=0; i<4; i+=1) {
		$('#status_uploading').find('#image'+(i+1)).hide();
		$('#status_uploading').find('#image'+(i+1)+' > img').attr('src','../image/ic16_loading.gif');
	}
	
	$('#status_uploading').find('#tweeting').hide();
	$('#status_uploading').find('#tweeting > img').attr('src','../image/ic16_loading.gif');
}


}
