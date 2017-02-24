var filter = {

rules: [],

add_rule:
function add_rule(rule) {	
	for (var i = 0; i < filter.rules.length; i++) {
		if (filter.rules[i].name == rule.name) {
			if (confirm(_('filter_exist_confirm'))) {
				filter.rules[i] = rule;
				return true;
			} else {
				return false;
			}
		}
	} 
	filter.rules.push(rule);
	return true;	
},

delete_rule:
function delete_rule(name) {
	var found = false;
	for (var i = 0; i < filter.rules.length; i++) {
		if (filter.rules[i].name == name) {
			filter.rules.splice(i, 1);
			found = true;
			break;
		}
	}     
	return found;
},

check_rule:
function check_rule(tweet, rule) {
	if (!rule) {
		return false;
	}
	
	var i = 0;
	
	var user = tweet.hasOwnProperty('user') ? tweet.user : tweet.hasOwnProperty('sender') ? tweet.sender : null;
	var real_tweet = tweet;
	if (tweet.hasOwnProperty('retweeted_status')) {
		real_tweet = tweet['retweeted_status'];
	        user = real_tweet.hasOwnProperty('user') ? real_tweet.user : real_tweet.hasOwnProperty('sender') ? real_tweet.sender: null;
	}
    
    		
	var tweet_text = real_tweet.text;
	
	var tweet_client = (real_tweet.source) ? real_tweet.source.replace(/<.*?>/g, "").trim() : "";
	
	var tweet_hashtags = [];
	if (real_tweet.entities && real_tweet.entities.hashtags) {
		for (i = 0; i < real_tweet.entities.hashtags.length; i++) {
			tweet_hashtags.push(real_tweet.entities.hashtags[i].text.toLowerCase());
		}
	}
	
	var tweet_author = user ? user.screen_name : "";
	
	var tweet_retweeter = (tweet.retweeted_status) ? tweet.user.screen_name : "";
	
	var tweet_mentions = [];
	if (real_tweet.entities && real_tweet.entities.user_mentions) {
		for (i = 0; i < real_tweet.entities.user_mentions.length; i++) {
			tweet_mentions.push(real_tweet.entities.user_mentions[i].screen_name.toLowerCase());
		}
	}
	
	var tweet_urls = (real_tweet.entities && real_tweet.entities.urls && real_tweet.entities.urls.length > 0) ? true : false;
	
	var tweet_geo = (real_tweet.geo && real_tweet.geo.length > 0) ? true : false;
	
	var tweet_media = (real_tweet.entities && real_tweet.entities.media && real_tweet.entities.media.length > 0) ? true : false;
	
	
	var end = (rule.contains.length > 0 ? 1 : 0) +
		(rule.comes.length > 0 ? 1 : 0) +
		(rule.hashtags.length > 0 ? 1 : 0) +
		(rule.authors.length > 0 ? 1 : 0) +
		(rule.retweeters.length > 0 ? 1 : 0) +
		(rule.mentions.length > 0 ? 1 : 0) +
		(rule.urls ? 1 : 0) +
		(rule.geo ? 1 : 0) +
		(rule.media ? 1 : 0);
	var start = 0;
	
	var contains = rule.contains;
	for (i = 0; i < contains.length; i++) {
		if (tweet_text.indexOf(contains[i]) !== -1) 
		{
			start++;
			break;
		}
	}
	
	var comes = rule.comes;
	for (i = 0; i < comes.length; i++) {
		if (tweet_client.toLowerCase() === comes[i]) 
		{
			start++;
			break;
		}
	}
	
	var hashtags = rule.hashtags;
	for (i = 0; i < hashtags.length; i++) {
		if (tweet_hashtags.indexOf(hashtags[i]) !== -1) 
		{
			start++;
			break;
		}
	}
	
	var authors = rule.authors;
	for (i = 0; i < authors.length; i++) {
		if (tweet_author.toLowerCase() === authors[i]) 
		{
			start++;
			break;
		}
	}
	
	var retweeters = rule.retweeters;
	for (i = 0; i < retweeters.length; i++) {
		if (tweet_retweeter.toLowerCase() === retweeters[i]) 
		{
			start++;
			break;
		}
	}
	
	var mentions = rule.mentions;
	for (i = 0; i < mentions.length; i++) {
		if (tweet_mentions.indexOf(mentions[i]) !== -1) 
		{
			start++;
			break;
		}
	}
	
	if (rule.urls && tweet_urls) start++;
	
	if (rule.geo && tweet_geo) start++;

	if (rule.media && tweet_media) start++;
	
	return (start === end);
},

save:
function save() {
    if (typeof conf != 'undefined') {
        conf.get_current_profile().preferences.filter_rules = filter.rules;
        conf.save_prefs(conf.current_name);
    }
},

load:
function load() {
    var active_profile = conf.get_current_profile();
    filter.rules = active_profile.preferences.filter_rules;
    if (!filter.rules || filter.rules.constructor != Array) {
        filter.rules = [];
    }
},

verify:
function verify(rule) {
	var text = "";
	
	text = rule.actions.join(" " + _('and') + " ");
	text = text.replace("DROP",_('drop').toUpperCase());
	text = text.replace("MASK",_('mask').toUpperCase());
	text = text.replace("NOTIFY",_('notify').toUpperCase());
	text = text.replace("RT",_('retweet').toUpperCase());
	
	text += " " + _("all_conditions_true") + " <u>" +  _("at_the_same_time") + "</u>:<br/>";
	if (rule.contains.length > 0) {
		text += "• " + _("contains_one_of_these_words") + ": " + rule.contains.join(", ") + "<br/>";
	}
	if (rule.comes.length > 0) {
		text += "• " + _("comes_from_one_of_these_clients") + ": " + rule.comes.join(", ") + "<br/>";
	}
	if (rule.hashtags.length > 0) {
		text += "• " + _("contains_one_of_these_hashtags") + ": " + rule.hashtags.join(", ") + "<br/>";
	}
	if (rule.authors.length > 0) {
		text += "• " +  _("has_been_posted_by") + ": " + rule.authors.join(", ") + "<br/>";
	}
	if (rule.retweeters.length > 0) {
		text += "• " + _("has_been_retweeted_by") + ": " + rule.retweeters.join(", ") + "<br/>";
	}
	if (rule.mentions.length > 0) {
		text += "• " + _("contains_mentions_to") + ": " + rule.mentions.join(", ") + "<br/>";
	}
	if (rule.urls) {
		text += "• " + _("contains_at_least_one_url") + "<br/>";
	}
	if (rule.geo) {
		text += "• " + _("has_geo") + "<br/>";
	}
	if (rule.media) {
		text += "• " + _("has_media") + "<br/>";
	}
	
	$('#verify_dialog .dialog_body').empty();
	$('#verify_dialog .dialog_body').append(text);
	ui.FilterDlg.verify_result_dialog.open();
},

empty_rule:
function empty_rule(n) {
	var rule = {};
	rule.name = n;
	rule.actions = [];
	rule.contains = [];
	rule.comes = [];
	rule.hashtags = [];
	rule.authors = [];
	rule.retweeters = [];
	rule.mentions = [];
	rule.urls = false;
	rule.geo = false;
	rule.media = false;
	return rule;
},

do_mask:
function do_mask(tweet) {
	var mask = '<a masked_id=' + tweet.id_str + ' href=#>' + _('filter_masked_text') + '</a>';
	if (tweet.hasOwnProperty('retweeted_status')) {
		tweet.retweeted_status.text = mask;
	} else {
		tweet.text = mask;
	}
},

do_retweet:
function do_retweet(tweet) {
	var user = tweet.user;
	if (typeof globals != 'undefined' && user.screen_name != globals.myself.screen_name) {
		globals.twitterClient.retweet_status(tweet.id_str);
	}
},

apply_filtering:
function apply_filtering(json_obj) {
		var new_json_obj = [];
		for (var i = 0; i < json_obj.length; i++){
			var tweet = json_obj[i];
			var insert_ok = true;
			for (var j = 0; j < filter.rules.length; j++) {
				var rule = filter.rules[j];
				var result = filter.check_rule(tweet,rule);
				if (result) {
					var actions = rule.actions;
					for (var x = 0; x < actions.length; x++) {
						switch (actions[x]) {
							case "DROP": 
								insert_ok = false;
							break;
							case "MASK":
								filter.do_mask(tweet);
							break;
							case "NOTIFY":
								notification.notify_tweet(tweet);
							break;
							case "RT":
								filter.do_retweet(tweet);
							break;
							default:
							break;
						}
					}
				}
			}
			if (insert_ok) new_json_obj.push(tweet);
		}
		return new_json_obj;
}

};
