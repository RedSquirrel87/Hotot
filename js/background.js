var hototURL = chrome.extension.getURL("index.html");
var context_menu = false;

function onExtMessage(req, sender, response) {
	if (req.enableContextMenu) {
		EnableContextMenu();
		response({'reply': 'Enabled'});
	} else {
		DisableContextMenu();
		response({'reply': 'Disabled'});
	}
}

function sharePage(info, tab) {
	if (tab) {
		ShareWithHotot(tab.title + ' ' + info.pageUrl);
	} else {
		ShareWithHotot(info.tab.title + ' ' + info.pageUrl);
	}
}

function shareSelection(info) {
	ShareWithHotot("\"" + info.selectionText + "\" via: " + info.pageUrl);
}

function shareLink(info) {
	ShareWithHotot(info.linkUrl);	
}

function shareImage(info) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var image = new File([xhr.response], "image.jpeg");
	ShareWithHotot('', [image]);
    };
    xhr.onerror = function() {
	var options = {
		type: "basic",
		title: chrome.i18n.getMessage('error_occurred'),
		message:  chrome.i18n.getMessage("unable_get_image"),
		iconUrl: "../image/ic128_error.png"
	}
	chrome.notifications.create("", options, function creationCallback(id) {});    
    }
    xhr.open('GET', info.srcUrl);
    xhr.send();
}

function EnableContextMenu() {
    if (context_menu === false) {
	context_menu = true;
	chrome.contextMenus.create({
	        "title": chrome.i18n.getMessage('share_page'),
	        "contexts": ["page"],
		"onclick": sharePage
	});
	chrome.contextMenus.create({
	        "title": chrome.i18n.getMessage('share_selection'),
	        "contexts": ["selection"],
		"onclick": shareSelection
	});
	chrome.contextMenus.create({
		"title": chrome.i18n.getMessage('share_link'),
	        "contexts": ["link"],
	        "onclick": shareLink
	});
	chrome.contextMenus.create({
		"title": chrome.i18n.getMessage('share_image'),
		"contexts": ["image"],
		"onclick": shareImage
	});
    }
}

function DisableContextMenu() {
	chrome.contextMenus.removeAll();
	context_menu = false;
}

function ShareWithHotot(text,image) {
		var v =	null;
		var views = chrome.extension.getViews();
		for (var i=0; i<views.length; i++) {
			if (views[i].location.href.indexOf(hototURL) !== -1) {
				v = views[i];
				break;
			}
		}
		if (v && v.globals) {
			if (v.globals.signed_in) {
				GoToHototPlus();
				v.ui.StatusBox.set_status_text(text);
				v.ui.StatusBox.open(function() {
					v.ui.StatusBox.move_cursor(v.ui.StatusBox.POS_BEGIN);
					v.ui.StatusBox.change_mode(v.ui.StatusBox.MODE_TWEET);
					v.ui.StatusBox.update_status_len();
				});
				if (image) {
					v.ui.StatusBox.load_previews(image);
				}
			} else {
				var options = {
					type: "basic",
					title: chrome.i18n.getMessage('oops_not_signed'),
					message: chrome.i18n.getMessage('sign_in_to_share'),
					iconUrl: "../image/ic128_hotot.png"
				}
				chrome.notifications.create("", options, function creationCallback(id) {});
			}
		} else {
			var options = {
				type: "basic",
				title: chrome.i18n.getMessage('oops_hotot_not_running'),
				message: chrome.i18n.getMessage('start_hotot'),
				iconUrl: "../image/ic128_hotot.png"
			}
			chrome.notifications.create("", options, function creationCallback(id) {});	
		}		
}

/* Until Mozilla will fix its webextensions support we cannot use this better function! 
function GoToHototPlusGC() {
	chrome.tabs.query({url: hototURL}, function(tabs) {
		if (tabs.length > 0) {
			chrome.tabs.update(tabs[0].id, {selected: true});
		} else {
			chrome.tabs.create({url: hototURL});
		}
	});	
}
*/

function GoToHototPlus() {
	var firefix = false;
	chrome.tabs.query({}, function(tabs) {
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].url.indexOf(hototURL) === 0) {
				chrome.tabs.update(tabs[i].id, {active: true});
				firefix = true;
				break;
			} 
		}
		if (firefix === false) chrome.tabs.create({url: hototURL, active: true});
	});	
}
  
chrome.browserAction.onClicked.addListener(GoToHototPlus);
chrome.runtime.onMessage.addListener(onExtMessage);