if (typeof ui == 'undefined') var ui = {};
ui.TrendingTopicsView = {

woeid: 1,

init:
function init() {},

init_view:
function init_view(view) {
    var prefs = conf.get_current_profile().preferences;
    $('#range_prefs_tt_font_size').val(prefs.tt_font_size);
    $('#range_prefs_tt_font_size_st').text(prefs.tt_font_size + " px");  
    $('#range_prefs_tt_number').val(prefs.tt_number);
    $('#range_prefs_tt_number_st').text(prefs.tt_number);

    ui.TrendingTopicsView.woeid = prefs.tt_woeid;
    ui.TrendingTopicsView.get_countries(view);

    var toggle = view._header.find('#sel_country');
    toggle.removeClass('dark');
    toggle.change(function (event) {
	ui.TrendingTopicsView.woeid = $(this).val();
	prefs.tt_woeid = ui.TrendingTopicsView.woeid;
	conf.save_prefs(conf.current_name);
	view.load();
    });    
    
    view._header.find('#range_prefs_tt_font_size').change(function (event) {
        $('#range_prefs_tt_font_size_st').text($(this).val() + " px");
	prefs.tt_font_size = $('#range_prefs_tt_font_size').val();
	if (prefs.tt_font_size === '') prefs.tt_font_size = 13;
	conf.save_prefs(conf.current_name);
	$('.ttlabel').css("font-size", prefs.tt_font_size + "px");
    });    
    
    view._header.find('#range_prefs_tt_number').change(function (event) {
        $('#range_prefs_tt_number_st').text($(this).val());
	prefs.tt_number = $('#range_prefs_tt_number').val();
	if (prefs.tt_number === '') prefs.tt_number = 10;
	conf.save_prefs(conf.current_name);
	view._header.find('.tt_list ul li').show();
	view._header.find('.tt_list ul li:gt(' + ( prefs.tt_number-1 ) + ')').hide();
    });     
    
    view._header.find('#tt_show_volume').change(function (event) {
	prefs.tt_show_volume = $(this).prop('checked');
        conf.save_prefs(conf.current_name);
	if (prefs.tt_show_volume) {
		view._header.find('.tt_super').show();
	} else {
		view._header.find('.tt_super').hide();
	}
    }); 
    
    view._header.find('#tt_no_hashtag').change(function (event) {
	prefs.tt_no_hashtag = $(this).prop('checked');
        conf.save_prefs(conf.current_name);
	view.load();
    });         
},

compare:
function compare(a,b) {
	var na = a.country +' ('+a.name+')', nb = b.country +' ('+b.name+')';
	if (na < nb) return -1;
	if (na > nb) return 1;
	return 0;
},

get_countries:
function get_countries(view){
	globals.twitterClient.get_trending_topics_available(function(result) {
		var h = "";
		result.sort(ui.TrendingTopicsView.compare);
		for (var place in result) {
			h += '<option value="'+result[place].woeid+'">'+result[place].country +' ('+result[place].name+')</option>';
		}
		view._header.find('#sel_country').html(h);
		view._header.find('#sel_country').val(ui.TrendingTopicsView.woeid);
	});
},

load_tt:
function load_tt(view, success) {
	var woeid = ui.TrendingTopicsView.woeid;
	if (!(woeid > 0)) woeid = 1;
	globals.twitterClient.get_trending_topics(woeid, conf.get_current_profile().preferences.tt_no_hashtag, success);
},

load_tt_success:
function load_tt_success(self, json) {
	var prefs = conf.get_current_profile().preferences;
	var trends = json[0].trends;
	var h = '<ul class="mochi_list mochi_dm">';
	for (var i in trends) {
		h += '<li class="mochi_list_item mochi_dm with_trigger" style="height:50px;" >\
			<a class="trigger dark btn_tt mochi_dm" query="' + trends[i].query + '" style="height:50px;line-height:48px;" >\
			<label for="" class="label ttlabel" style="font-weight:bold;font-size:' + prefs.tt_font_size + 'px;">' + trends[i].name + '\
			<span class="tt_super" style="font-weight:normal;font-size:x-small;vertical-align:super;display:' + (prefs.tt_show_volume ? 'inline-block' : 'none') + '">' + (trends[i].tweet_volume === null ? "" : trends[i].tweet_volume) + '</span>\
			</label></a></li>';
	}
	h+="</ul>";
	self._header.find('.tt_list').html(h);	
	self._header.find('.btn_tt').click(function(){
		ui.Slider.addDefaultView('search', {}) || ui.Slider.add('search');
		ui.Main.views.search._header.find('.search_entry').val($(this).attr('query').trim());
		ui.Main.views.search._header.find('.search_tweet').click();
	});
	self._header.find('.tt_list ul li').show();
	self._header.find('.tt_list ul li:gt(' + ( prefs.tt_number - 1 ) + ')').hide();	
}

};
