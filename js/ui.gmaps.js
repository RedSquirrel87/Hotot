if (typeof ui == 'undefined') var ui = {};
ui.GMaps = {

map_doc: null,

map_dialog: null,

map_zoom: 14, 
map_x: null,
map_y: null,
map_type: 'roadmap',


init:
function init () {},

on_form_indicator:
function on_form_indicator(tweet) {
    if (tweet.geo && tweet.geo.type == 'Point') {
        var x = tweet.geo.coordinates[0];
        var y = tweet.geo.coordinates[1];
        var tag = "geo1_" + tweet.id + Date.now();
        
        setTimeout(function() {
            $('#' + tag).click(function(e) {
                e.preventDefault();
                return ui.GMaps.on_map_indicator_clicked(x, y);
            })
        }, 500);
        return '<a class="geo_indicator" href="#" x="'+x+'" y="'+y+'" id="' + tag + '" style="background: transparent url(../image/ic16_marker.png) no-repeat; width: 18px; height: 18px; display:inline-block;"></a>';
    } else {
	return '';
    }
},

on_map_indicator_clicked:
function on_map_indicator_clicked(x, y, zoom, type) {
    if ((x != null) && (y != null)) {
	navigate_action("http://maps.google.com/maps?q=loc:" + x + "," + y);
    }
    return false;
}


}

