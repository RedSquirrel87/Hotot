if (typeof ui == 'undefined') var ui = {};
ui.DMTabs = {

current: null,

json: [],
current_view: null,
max_id_dm_get: null,
max_id_dm_sent: null,
no_more_get: false,
no_more_sent: false,
views: {},

init:
function init() {
    var btns = new widget.RadioGroup('#dm_radio_group');
    btns.on_clicked = function (btn, event) {
        ui.DMTabs.current = $(btn).attr('href');
        var page_name = ui.DMTabs.current + '_sub_block';
        $('#direct_messages_tweet_block .tweet_sub_block').not(page_name).hide();
        $(page_name).show();
    };
    btns.create();
    ui.DMTabs.current = '#direct_messages_inbox';
    $(ui.DMTabs.current + '_sub_block').show();
},

//2.2: New DM view
init_view:
function init_view(view) {
	ui.DMTabs.reset(); // Reinitializes vars because they could be not empty if previous user did not use proper methods to exit
		
	// Set buttons click events
	view._header.find('#btn_dm_back').click(function() {		
		ui.DMTabs.current_view = null;
		view._header.find('.sub_header_frame').hide();
		view._header.find('.header_frame').show();
		view.clear();
	});
	
	view._header.find('#btn_dm_any').click(function() {
		ui.DMTabs.current_view = $(this).text().trim();
		view._header.find('.header_frame').hide();
		view._header.find('.sub_header_frame').show();				
		view.clear();
		var json = [];
		for (var obj in ui.DMTabs.views) {
			json = json.concat(ui.DMTabs.views[obj]);
		}
		ui.Main.add_tweets(view, json, false, true)
		view.scrollbar.recalculate_layout();
	});	
	
	$('#dm_load_more').click(function(event) {
		toast.set(_('loading_messages')).show();
		ui.Main.loadmore_messages_new(view);
	});

	$('#dm_write').click(function(event) {
		if (ui.DMTabs.current_view != _('any')) {
			ui.StatusBox.set_dm_target(ui.DMTabs.current_view);
		} else {
			ui.StatusBox.set_dm_target("");
		}
		ui.StatusBox.set_status_text('');
		ui.StatusBox.open(function () {
			ui.StatusBox.change_mode(ui.StatusBox.MODE_DM);
			ui.StatusBox.move_cursor(ui.StatusBox.POS_END);
		});
	});	
},

// 4.0: Optimizations
destroy_view:
function destroy_view(view) {
	ui.DMTabs.reset();	
	ui.Slider.remove(view.name);
},

reset:
function reset() {
	ui.DMTabs.json = [];
	ui.DMTabs.views = {};
	ui.DMTabs.current_view = null;
	ui.DMTabs.max_id_dm_get = null;
	ui.DMTabs.max_id_dm_sent = null;
	ui.DMTabs.no_more_get = false;
	ui.DMTabs.no_more_sent = false;
},

addTo_DM_header:
function addTo_DM_header(view, screen_name, pic, append) {
	var html = '<li class="mochi_list_item mochi_dm with_trigger" >\
		<a class="trigger mochi_dm page_nav btn_dm" screen_name="'+screen_name+'">\
			<span class="widget more"></span>\
			<img src="'+pic+'" style="float:left;height:30px;margin-right:10px;border-radius:5px;"/>\
			<label for="" class="label" style="font-weight:bold;font-size:13px;">'+screen_name+'</label>\
			<span title="'+_('new_messages')+'" class="icon"></span>\
		</a>\
	</li>';
	var ul = view._header.find('#dm_list');
	if (append) {
		ul.append(html);
	} else {
		ul.prepend(html);
	}
	
	view._header.find("a[screen_name='" + screen_name + "']").click(function() {
		ui.DMTabs.current_view = $(this).text().trim();
		$(this).find('.icon').removeClass('ic_new_message');
		view._header.find('.header_frame').hide();
		view._header.find('.sub_header_frame').show();				
		view.clear();
		ui.Main.add_tweets(view, ui.DMTabs.views[ui.DMTabs.current_view], false, true);
		view.scrollbar.recalculate_layout();
		$('.dm_recipient').hide();
	});
	
	view.scrollbar.recalculate_layout();
},

show_button_notify:
function show_button_notify(view, screen_name) {
	if (screen_name != ui.DMTabs.current_view) {
		view._header.find('.btn_dm').each(function() {
			if ($(this).text().trim() == screen_name) {
				var found = $(this), li = found.parent();
				li.parent().prepend(li);
				found.find('.icon').addClass('ic_new_message');
				return false;
			}
		});
	}
}

};
