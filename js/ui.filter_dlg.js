if (typeof ui == 'undefined') var ui = {};
ui.FilterDlg = {

init:
function init() {

    ui.FilterDlg.rule_edit_dialog = new widget.Dialog('#filter_rule_edit_dialog');
    ui.FilterDlg.rule_edit_dialog.set_styles('header', {'height': '0px', 'padding':'0px', 'display': 'none'});
    ui.FilterDlg.rule_edit_dialog.resize(500, $(window).height());
    ui.FilterDlg.rule_edit_dialog.create();
    
    ui.FilterDlg.verify_result_dialog = new widget.Dialog('#verify_dialog');
    ui.FilterDlg.verify_result_dialog.resize(550, 'auto');
    ui.FilterDlg.verify_result_dialog.create();      
  

    $('#filter_add_rule_btn').click(function () {
        ui.FilterDlg.show_edit_dialog();
        return false;
    });  
    
    $('#filter_rule_edit_ok').click(function () {
	var rule = ui.FilterDlg.fill_rule();
	
	if (rule.name.length === 0) {
		toast.set(_("rule_error_name")).show(5);
		return false;
	}
	if (rule.actions.length === 0) {
		toast.set(_("rule_error_action")).show(5);
		return false;
	}
	var conditions = rule.contains.length + rule.comes.length + rule.hashtags.length + rule.authors.length + rule.retweeters.length + rule.mentions.length;
	if (conditions === 0 && rule.urls === false && rule.geo === false && rule.media === false) {
		toast.set(_("rule_error_conditions")).show(5);
		return false;
	}
	
	var result = filter.add_rule(rule);
	if (result) {
		toast.set(_("mute_added")).show();
		filter.save();
		ui.FilterDlg.reload_rules();
		ui.FilterDlg.rule_edit_dialog.close();
		if (conf.get_current_profile().preferences.filter_framework === false) 
				ui.InfoDlg.show(_('info'),_('filter_framework_disabled'));
	} else {
		toast.set(_("filter_add_error")).show();
	}
	return false;
    });   
    
    $('#filter_rule_edit_verify').click(function () {
	var rule = ui.FilterDlg.fill_rule();
	
	if (rule.name.length === 0) {
		toast.set(_("rule_error_name")).show(5);
		return false;
	}
	if (rule.actions.length === 0) {
		toast.set(_("rule_error_action")).show(5);
		return false;
	}
	var conditions = rule.contains.length + rule.comes.length + rule.hashtags.length + rule.authors.length + rule.retweeters.length + rule.mentions.length;
	if (conditions === 0 && rule.urls === false && rule.geo === false && rule.media === false) {
		toast.set(_("rule_error_conditions")).show(5);
		return false;
	}
	filter.verify(rule);
        return false;
    });

    $('#filter_dialog').on('click', '.rule', function () {
        $('#filter_rule_list .rule').removeClass('selected');
        $(this).addClass('selected');
        $('#filter_rule_list .rule').parent().removeClass('selected');
        $(this).parent().addClass('selected');
        return false;
    });
    
    $('#filter_dialog').on('click', '.delete_btn', function () {
        var s=$('#filter_rule_list .rule.selected');
        if (s.length == 0) { return false; }
        filter.delete_rule(decodeURIComponent(s.attr('rule_name')));
        ui.FilterDlg.reload_rules();
        return false;
    });
    
    $('#filter_dialog').on('click', '.edit_btn', function () {
        var s=$('#filter_rule_list .rule.selected');
        if (s.length == 0) { return false; }
        var name = decodeURIComponent(s.attr('rule_name'));
	for (var i = 0; i < filter.rules.length; i++) {
		if (filter.rules[i].name === name) {
			ui.FilterDlg.show_edit_dialog(filter.rules[i]);
			break;
		}
	}
        return false;
    });
    
    $('#filter_dialog').on('click', '.verify_btn', function () {
        var s=$('#filter_rule_list .rule.selected');
        if (s.length == 0) { return false; }
        var name = decodeURIComponent(s.attr('rule_name'));
	for (var i = 0; i < filter.rules.length; i++) {
		if (filter.rules[i].name === name) {
			filter.verify(filter.rules[i]);
			break;
		}
	}
        return false;
    });     
    
    $('#filter_save_btn').click(function () {
        filter.save();
        globals.filter_dialog.close();
        return false;
    });
    
    $('#filter_framework_trigger').change(function (){
	conf.get_current_profile().preferences.filter_framework = $(this).prop('checked');
	conf.save_prefs(conf.current_name);
    });
},

show_edit_dialog:
function show_edit_dialog(rule) {
    if (rule) {
        $('#filter_rule_edit_name').val(rule.name);
	$('#filter_drop').prop('checked',rule.actions.indexOf("DROP") > -1);
	$('#filter_mask').prop('checked',rule.actions.indexOf("MASK") > -1);
	$('#filter_notify').prop('checked',rule.actions.indexOf("NOTIFY") > -1);
	$('#filter_rt').prop('checked',rule.actions.indexOf("RT") > -1);
	$('#filter_contain').val(rule.contains.join(","));
	$('#filter_come').val(rule.comes.join(","));
	$('#filter_hashtags').val(rule.hashtags.join(","));
	$('#filter_authors').val(rule.authors.join(","));
	$('#filter_retweeters').val(rule.retweeters.join(","));
	$('#filter_mentions').val(rule.mentions.join(","));
	$('#filter_urls').prop('checked',rule.urls);
	$('#filter_geo').prop('checked',rule.geo);
	$('#filter_media').prop('checked',rule.media);
    } else {
        $('#filter_rule_edit_name').val("");
	$('#filter_drop').prop('checked',true);
	$('#filter_mask').prop('checked',false);
	$('#filter_notify').prop('checked',false);
	$('#filter_rt').prop('checked',false);
	$('#filter_contain').val("");
	$('#filter_come').val("");
	$('#filter_hashtags').val("");
	$('#filter_authors').val("");
	$('#filter_retweeters').val("");
	$('#filter_mentions').val("");
	$('#filter_urls').prop('checked',false);
	$('#filter_geo').prop('checked',false);
	$('#filter_media').prop('checked',false);
    }
    ui.FilterDlg.rule_edit_dialog.open();
    var e = $('#filter_rule_edit_name .entry');
    e.focus();
},

reload_rules:
function reload_rules() {
    $('#filter_rule_list .button').unbind();
    $('#filter_rule_list .rule').unbind();
    $('#filter_rule_list').empty();
    for (var i = 0; i < filter.rules.length; i += 1) {
        var li = $('<li/>');
        var rule = $('<a class="rule"/>');
        rule.appendTo(li);
        rule.text(filter.rules[i].name);
        rule.attr('rule_name', encodeURIComponent(filter.rules[i].name));
        $('<div class="item_ctrl"><a href="#" class="button verify_btn">' + _('verify') + '</a><a href="#" class="button edit_btn">' + _('edit') + '</a><a href="#" class="button delete_btn">'+_('delete')+'</a></div>').appendTo(li);
        li.appendTo($('#filter_rule_list'));
    }
},

fill_rule:
function fill_rule() {
	var i = 0;
	var aux = [];
	var word = "";
	
	var rule = {};
	
	rule.name = $.trim($('#filter_rule_edit_name').val());
	
	rule.actions = [];
	$('#filter_form .filter_action_block .checkbox:checked').each(function(i,val) {
		rule.actions.push($(val).val());
	});
	
	rule.contains = [];
	aux = $('#filter_contain').val().split(',');
	for (i = 0; i < aux.length; i++) {
		if (aux[i].length > 0) {
			rule.contains.push(aux[i].trim().toLowerCase());
		}
	}
	
	rule.comes = [];
	aux = $('#filter_come').val().split(',');
	for (i = 0; i < aux.length; i++) {
		if (aux[i].length > 0) {
			rule.comes.push(aux[i].trim().toLowerCase());
		}
	}
	
	rule.hashtags = [];
	aux = $('#filter_hashtags').val().split(',');
	for (i = 0; i < aux.length; i++) {
		word = aux[i].trim().toLowerCase();
		if (word.length > 0) {
			if (word.indexOf("#") === 0) {
				rule.hashtags.push(word.substring(1));
			} else {
				rule.hashtags.push(word);
			}
		}
	}
	
	rule.authors = [];
	aux = $('#filter_authors').val().split(',');
	for (i = 0; i < aux.length; i++) {
		word = aux[i].trim().toLowerCase();
		if (word.length > 0) {
			if (word.indexOf("@") === 0) {
				rule.authors.push(word.substring(1));
			} else {
				rule.authors.push(word);
			}
		}
	}
	
	rule.retweeters = [];
	aux = $('#filter_retweeters').val().split(',');
	for (i = 0; i < aux.length; i++) {
		word = aux[i].trim().toLowerCase();
		if (word.length > 0) {
			if (word.indexOf("@") === 0) {
				rule.retweeters.push(word.substring(1));
			} else {
				rule.retweeters.push(word);
			}
		}
	}
	
	rule.mentions = [];
	aux = $('#filter_mentions').val().split(',');
	for (i = 0; i < aux.length; i++) {
		word = aux[i].trim().toLowerCase();
		if (word.length > 0) {
			if (word.indexOf("@") === 0) {
				rule.mentions.push(word.substring(1));
			} else {
				rule.mentions.push(word);
			}
		}
	}	
	
	rule.urls = $('#filter_urls').prop('checked');
	
	rule.geo = $('#filter_geo').prop('checked');
	
	rule.media = $('#filter_media').prop('checked');
	
	return rule;
}

}