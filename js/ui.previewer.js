(function() {
  var Previewer, root, _ref;

  Previewer = (function() {

    Previewer.name = 'Previewer';

    function Previewer(sel) {
      var _this = this;
      this.me = $(sel);
      this.image = this.me.find('.image');
      this.link = this.me.children('.image_wrapper');
      this.iframe = this.me.find('.ytframe');
      this.video = this.me.find('#hlsvideo');
      this.videoq = this.me.find('#hlsvideoq');
      this.close_btn = this.me.children('.close');
      this.visible = false;
      this.hls = null;
      this.close_btn.click(function() {
        return _this.close();
      });
      this.link.click(function(ev) {
        if (ev.which !== 1 && ev.which !== 2) {
          _this.close();
          return;
        }
        if (chrome && chrome.tabs) {
          chrome.tabs.create({
            url: _this.link.attr('href'),
            active: ev.which === 1
          }, function() {});
          _this.close();
          return false;
        }
        return _this.close();
      });
      //Init
      this.reset();
    }

    Previewer.prototype.reset = function() {
	this.image.hide();
	this.iframe.hide();
	this.video.hide();
	this.videoq.hide();
	this.iframe.attr('width','160');
	this.iframe.attr('height','24');
	this.iframe.attr('src','');
	this.video.attr('width','160');
	this.video.attr('height','24');
	this.video.find('source').attr('src','');
	this.video.find('source').attr('type','');
	this.videoq.find('option:gt(0)').remove();
	this.image.attr('src', '../image/ani_loading_bar.gif');
	this.image.css('margin', '0');
        this.image.width(160);
        this.image.height(24);
        this.resize(160, 24);
	if (this.hls != null) {
		this.hls.destroy();
		this.hls = null;
	}
	return this.image.css('margin', '20px 0');
    };

    Previewer.prototype.reload = function(image_url) {
	this.reset();
	return this.reload_proc(image_url);
    };

    Previewer.prototype.reload_proc_video = function(src) { //4.0: Dailymotion Support
	if (this.visible) this.reset();
	var width = 640;
        var height = 360;
        if ($(window).width() < width + 40) {
          width = $(window).width() - 40;
          height = (width + .0) / 640 * 360;
        }
        if ($(window).height() < height + 70) {
          height = $(window).height() - 70;
          width = (height + .0) / 360 * 640;
        }
	this.iframe.attr('src',src);	
	this.iframe.attr('width',width);
	this.iframe.attr('height',height);
        this.resize(width, height+8);
	this.image.hide();
	this.video.hide();
	this.videoq.hide();
	this.iframe.show();
	return true;
    };
    
    Previewer.prototype.reload_proc_streaming = function(src,type) {
	if (this.visible) this.reset();
	var width = 640;
        var height = 360;
        if ($(window).width() < width + 40) {
          width = $(window).width() - 40;
          height = (width + .0) / 640 * 360;
        }
        if ($(window).height() < height + 100) {
          height = $(window).height() - 100;
          width = (height + .0) / 360 * 640;
        }
	this.resize(width, height+8+24+5);
	this.video.attr('width',width);
	this.video.attr('height',height);
	this.video.find('source').attr('src',src);
	this.video.find('source').attr('type',type);		
	this.image.hide();
	this.iframe.hide();
	this.video.show();
	this.videoq.show();
	
	var _this = this;
	if(Hls.isSupported()) {
		this.hls = new Hls();
		this.hls.loadSource(src);
		this.hls.attachMedia(this.video[0]);
		this.hls.on(Hls.Events.MANIFEST_LOADED,function(event,data) {
			$.each(data.levels, function (i, level) {
			    $('#hlsvideoq').append($('<option>', { 
				value: i,
				text : level.height + "p"
			    }));
			});
			$('#hlsvideoq').off().on("change", function () {
				_this.hls.currentLevel = parseInt(this.value);
				return false;	
			}); 
		});
		this.hls.on(Hls.Events.ERROR, function (event, data) {
			if (data.fatal) {
				switch(data.type) {
				      case Hls.ErrorTypes.NETWORK_ERROR:
					console.error("HLS: fatal network error encountered, trying to recover...");
					_this.hls.startLoad();
					break;
				      case Hls.ErrorTypes.MEDIA_ERROR:
					console.error("HLS: fatal media error encountered, trying to recover...");
					_this.hls.swapAudioCodec();
					_this.hls.recoverMediaError();
					break;
				      default:
					console.error("HLS: fatal error encountered, destroying...");
					_this.hls.destroy();
					break;
				}
			}
		});
	}
	
	return true;
    };    
    
    Previewer.prototype.reload_proc = function(image_url) {
      if (this.visible) this.reset();
      var preloader,
        _this = this;
	_this.iframe.hide();
	_this.video.hide();
	_this.videoq.hide();
	_this.image.show();
      preloader = new Image;
      preloader.onload = function() {
        var height, preload, width;
        _this.image.attr('src', image_url);
        _this.image.css('margin', '0');
        width = preloader.width;
        height = preloader.height;
        if ($(window).width() < width + 40) {
          width = $(window).width() - 40;
          height = (width + .0) / preloader.width * preloader.height;
        }
        if ($(window).height() < height + 70) {
          height = $(window).height() - 70;
          width = (height + .0) / preloader.height * preloader.width;
        }
        _this.image.width(width);
        _this.image.height(height);
        _this.link.attr('href', image_url);
        _this.resize(width, height);
        return preload = null;
      };
      return preloader.src = image_url;
    };

    Previewer.prototype.resize = function(width, height) {
      if (width < 64) {
        width = 64;
      }
      if (height < 64) {
        height = 64;
      }
      height += 30;
      this.me.width(width).height(height);
      return this.me.css({
        'margin-top': (0 - height) / 2 - 10,
        'margin-left': (0 - width) / 2 - 10
      });
    };

    Previewer.prototype.open = function() {
      this.visible = true;
      this.me.show();
      return this.me.transition({
        'opacity': 1
      }, 100);
    };

    Previewer.prototype.close = function() {
      var _this = this;
      this.reset();
      this.visible = false;
      return this.me.transition({
        'opacity': 0
      }, 100, function() {
        return _this.me.hide();
      });
    };

    return Previewer;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.widget = (_ref = root.widget) != null ? _ref : {};

  root.widget.Previewer = Previewer;

}).call(this);
