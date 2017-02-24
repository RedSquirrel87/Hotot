if (typeof ui == 'undefined') var ui = {};
ui.Header = {
isHototMenuClosed: true,
init:
function init () {
    $('#btn_my_profile').click(
    function (event) {
        open_people(globals.myself.screen_name); 
    }).mouseenter(function(event) {
        globals.ratelimit_bubble.place(widget.Bubble.BOTTOM, widget.Bubble.ALIGN_LEFT);
        globals.ratelimit_bubble.show();
    });

    $('#btn_my_profile').mouseleave(
    function (event) {
        ui.Header.closeHototMenu();
        globals.ratelimit_bubble.hide();
    });

    $('#hotot_menu').mouseleave(
    function (event) {
        ui.Header.closeHototMenu();
    });

    $('#btn_prefs').click(
    function (event) {
        ui.PrefsDlg.load_settings(conf.settings);
        ui.PrefsDlg.load_prefs();
        globals.prefs_dialog.open();
    });
    
    $('#btn_filter').click(
    function (event) {
	ui.PrefsDlg.load_prefs();
        ui.FilterDlg.reload_rules();
        globals.filter_dialog.open();
    });

    // 5.5
    $('#btn_ftags').click(
    function (event) {
	ui.PrefsDlg.load_prefs();
	var tags = conf.get_current_profile().preferences.following_hashtags;
	$('#ftags_list .ftags').unbind();
	$('#ftags_list').empty()
        for (var k in tags)
	$('#ftags_list').append('<a class="ftags" href="' + tags[k] + '">' + tags[k] + '</a> ');
        globals.following_hashtags_dialog.open();
    });
    $('#ftags_dialog').on('click', '.ftags', function () {       
	var i = conf.get_current_profile().preferences.following_hashtags.indexOf($(this).attr('href'));
	if (i !== -1) {
		conf.get_current_profile().preferences.following_hashtags.splice(i, 1);
		conf.save_prefs(conf.current_name);
		clearTimeout(daemon.timer);
		daemon.work();
		$(this).remove();
	}
        return false;
    });
    
    
    $('#btn_about').click(
    function (event) {
	ui.Header.closeHototMenu();
        globals.about_dialog.open();
    });

    $('#btn_report_bug').click(
    function (event) {
	ui.Header.closeHototMenu();
        ui.StatusBox.set_status_text("@redsquirrel87 #Hotot+ #bug ");
	ui.StatusBox.open(
	function() {
		ui.StatusBox.move_cursor(ui.StatusBox.POS_END);
		ui.StatusBox.change_mode(ui.StatusBox.MODE_TWEET);
	});
    });
    
    $('#btn_restart_streams').click(
    function (event) {
	ui.Header.closeHototMenu();
	daemon.restart();
	if (globals.twitterClient.watch_user_streams.is_running) {
		toast.set(_('restart_streams_success')).show(5);
	} else {
		toast.set(_('restart_streams_fail')).show(5);
	}
    });    
    
    $('#btn_sign_out').click(
    function (event) {
	ui.Header.closeHototMenu();
	toast.set(_('closing')).show();
        ui.Slider.save_state();
        conf.save_prefs(conf.current_name, function() {
            for (var k in ui.Main.views) {
                ui.Slider.remove(ui.Main.views[k].name, true);
            }
            globals.layout.close('north');
            globals.layout.close('south');
            ui.Main.hide();
            ui.Welcome.show();
            daemon.stop();
	    toast.hide();
        });
    });
},

openHototMenu:
function openHototMenu() {
    $('#hotot_button').addClass('hlight');
    $('#hotot_menu').show();
    ui.Header.isHototMenuClosed = false;
},

closeHototMenu:
function closeHototMenu() {
    $('#hotot_button').removeClass('hlight');
    $('#hotot_menu').hide();
    ui.Header.isHototMenuClosed = true;
},

closeAll:
function closeAll() {
    ui.Slider.closeSliderMenu();
    ui.Header.closeHototMenu();
    ui.Main.closeTweetMoreMenu();
    ui.Main.closeHashtagMenu();
}

};


