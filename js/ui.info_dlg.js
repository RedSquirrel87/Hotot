if (typeof ui == 'undefined') var ui = {};
ui.InfoDlg = {

init:
function init() {
	var btn_close = new widget.Button('#btn_info_dlg_close');
	btn_close.on_clicked = function (event) {
		globals.info_dialog.close();
	};
	btn_close.create();
},

show:
function show(title, text) {
	$('#info_dlg_title').text(title);
	$('#info_dlg_text').text(text);
	globals.info_dialog.open();
}

};
