if (typeof db == 'undefined') var db = {};
db = {

cache: null,

MAX_TWEET_CACHE_SIZE: 5000,

MAX_USER_CACHE_SIZE: 3000,

MAX_TAGS_CACHE_SIZE: 2000,

version: 35,

tweet_cache: {},

init:
function init (callback) {
	db.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	db.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	db.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	
var request = db.indexedDB.open("Hotot+", db.version);
	request.onerror = function(event) {
		console.error(event);
	};
	request.onsuccess = function(event) {
		db.database = event.target.result;
		if (typeof (callback) != 'undefined') callback();
	};
	request.onupgradeneeded = function(event) { 
		db.database = event.target.result;
		db.create_db();
	};	
},

delete_db: 
function delete_db() {
	for (var i = 0; i < db.database.objectStoreNames.length; i++) {
		db.database.deleteObjectStore(db.database.objectStoreNames.item(i));
	}
},

create_db:
function create_db() {
	if (!db.database.objectStoreNames.contains("Options")) {
		db.database.createObjectStore("Options", { keyPath: "key" });
	}
	if (!db.database.objectStoreNames.contains("Profiles")) {
		var objectStoreP = db.database.createObjectStore("Profiles", { keyPath: "name" });
		objectStoreP.createIndex("order", "order", { unique: true });
	}
	if (!db.database.objectStoreNames.contains("TweetCache")) {
		db.database.createObjectStore("TweetCache", { keyPath: "id" });
	}
	if (!db.database.objectStoreNames.contains("UserCache")) {
		var objectStoreU = db.database.createObjectStore("UserCache", { keyPath: "id" });
		objectStoreU.createIndex("screen_name", "screen_name", { unique: true });
	}
	if (!db.database.objectStoreNames.contains("TagCache")) {
		var objectStoreT = db.database.createObjectStore("TagCache", { keyPath : "tag" });
		objectStoreT.createIndex("use", "use", { unique: false });
	}
},

dump_hashtags:
function dump_hashtags(tags) {	
	var dump_single_hashtag = function (hashtag) {
		var request = objectStore.get(hashtag);
		request.onerror = function(event) {
			console.error(event);
		};
		request.onsuccess = function(event) {
			var newdata = {
				tag: hashtag,
				use: ((request.result) ? (request.result.use + 1) : 1)
			};
			var requestUpdate = objectStore.put(newdata);
			requestUpdate.onerror = function(event) {
				console.error(event);
			};					
		};
	};
	
	var transaction = db.database.transaction(["TagCache"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("TagCache");	
    
	if (tags != null) {
		for (var i = 0, l = tags.length; i < l; i += 1) {
			var hashtag = ((tags[i].indexOf('#') === 1) ? tags[i].substr(2) : tags[i].substr(1));
			dump_single_hashtag(hashtag);
		}
	}
},

dump_users:
function dump_users(json_obj) {
	var transaction = db.database.transaction(["UserCache"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("UserCache");				
	for (var i = 0; i < json_obj.length; i++) {
		var user = {
			id: json_obj[i].id_str,
			screen_name: json_obj[i].screen_name,
			json: JSON.stringify(json_obj[i])
		};
		var request = objectStore.put(user);
		request.onerror = function(event) {
			console.error(event);
		};
	} 
},

dump_tweets:
function dump_tweets(json_obj) {    
	var transaction = db.database.transaction(["UserCache", "TweetCache"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStoreU = transaction.objectStore("UserCache");	
	var objectStoreT = transaction.objectStore("TweetCache");
	
	for (var i = 0; i < json_obj.length; i++) {
		var tweet_obj = json_obj[i];
		if (tweet_obj.hasOwnProperty('retweeted_status')) {
			tweet_obj = tweet_obj['retweeted_status']
		}
		var user = typeof tweet_obj.user != 'undefined' ? tweet_obj.user: tweet_obj.sender;
		
		var dataU = {
			id: user.id_str,
			screen_name: user.screen_name,
			json: JSON.stringify(user)			
		};
		var dataT = {
			id: tweet_obj.id_str,
			text: tweet_obj.text,
			json: JSON.stringify(tweet_obj)		
		};
		var requestU = objectStoreU.put(dataU);	
		var requestT = objectStoreT.put(dataT);	
	}
},

get_tweet:
function get_tweet(key, callback) {
	var transaction = db.database.transaction(["TweetCache"]);
	transaction.onerror = function(event) {
		console.error(event);
	};	
	
	var objectStore = transaction.objectStore("TweetCache");
	var request = objectStore.get(key);
	request.onerror = function(event) {
		console.error(event);
		callback({});
	};
	request.onsuccess = function(event) {
		if (request.result) {
			callback(JSON.parse(request.result.json));
		} else {
			callback({});
		}
	};
},

get_hashtags:
function get_hashtags(callback) {
	var transaction = db.database.transaction(["TagCache"]);
	transaction.onerror = function(event) {
		console.error(event);
	};

	var tags = [];
	var objectStore = transaction.objectStore("TagCache");
	objectStore.index("use").openCursor(null, "prev").onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			tags.push(cursor.value.tag);
			cursor.continue();
		}
		else {
			callback(tags);
		}
	};
},

get_screen_names:
function get_screen_names(callback) {
	var transaction = db.database.transaction(["UserCache"]);
	transaction.onerror = function(event) {
		console.error(event);
	};

	var users = [];
	var objectStore = transaction.objectStore("UserCache");
	objectStore.index("screen_name").openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			users.push(cursor.value.screen_name);
			cursor.continue();
		}
		else {
			callback(users);
		}
	};
},

reduce_user_cache:
function reduce_user_cache(limit) {
	var transaction = db.database.transaction(["UserCache"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	
	var c = 0;
	var objectStore = transaction.objectStore("UserCache");
	objectStore.openCursor(null, "prev").onsuccess = function (event) {
		var cursor = event.target.result;
		if (cursor) {
			if (++c > limit) {
				var request = objectStore.delete(cursor.value.id);
				request.onerror = function(event) {
					console.error(event);
				};
			}
			cursor.continue();
		}
	};
},

reduce_tweet_cache:
function reduce_tweet_cache(limit) {
	var transaction = db.database.transaction(["TweetCache"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	
	var c = 0;
	var objectStore = transaction.objectStore("TweetCache");
	objectStore.openCursor(null, "prev").onsuccess = function (event) {
		var cursor = event.target.result;
		if (cursor) {
			if (++c > limit) {
				var request = objectStore.delete(cursor.value.id);
				request.onerror = function(event) {
					console.error(event);
				};
			}
			cursor.continue();
		}
	};
},

reduce_hashtags_cache:
function reduce_hashtags_cache(limit) {
	var transaction = db.database.transaction(["TagCache"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	
	var c = 0;
	var objectStore = transaction.objectStore("TagCache");
	objectStore.index("use").openCursor(null, "prev").onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			if (++c > limit) {
				var request = objectStore.delete(cursor.value.tag);
				request.onerror = function(event) {
					console.error(event);
				};
			}
			cursor.continue();
		}
	};
},

get_tweet_cache_size:
function get_tweet_cache_size(callback) {
	var transaction = db.database.transaction(["TweetCache"]);
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("TweetCache");	
	var count = objectStore.count();
	count.onsuccess = function() {
		callback(count.result);
	}
	count.onerror = function() {
		callback(0);
	}
},

get_user_cache_size:
function get_user_cache_size(callback) {
	var transaction = db.database.transaction(["UserCache"]);
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("UserCache");	
	var count = objectStore.count();
	count.onsuccess = function() {
		callback(count.result);
	}
	count.onerror = function() {
		callback(0);
	}
},

get_hashtags_cache_size:
function get_hashtags_cache_size(callback) {
	var transaction = db.database.transaction(["TagCache"]);
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("TagCache");	
	var count = objectStore.count();
	count.onsuccess = function() {
		callback(count.result);
	}
	count.onerror = function() {
		callback(0);
	}
},

reduce_db:
function reduce_db () {
	db.get_tweet_cache_size(function (size) {
	        if (db.MAX_TWEET_CACHE_SIZE < size) {
			db.reduce_tweet_cache(parseInt(db.MAX_TWEET_CACHE_SIZE*2/3));
	        }
	});
	db.get_user_cache_size(function (size) {
		if (db.MAX_USER_CACHE_SIZE < size) {
			db.reduce_user_cache(parseInt(db.MAX_USER_CACHE_SIZE*2/3));
		}
	});
	db.get_hashtags_cache_size(function (size) {
		if (db.MAX_TAGS_CACHE_SIZE < size) {
			db.reduce_hashtags_cache(parseInt(db.MAX_TAGS_CACHE_SIZE*2/3));
		}
	});
},

save_option:
function save_option(value, callback) {
	var transaction = db.database.transaction(["Options"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("Options");
	
	var data = {
		key: "settings",
		options: JSON.stringify(value) 
		
	};
	
	var request = objectStore.put(data);	
	request.onerror = function(event) {
		console.error(event);
		callback(false);
	};
	request.onsuccess = function(event) {
		callback(true);
	};
},

load_option:
function load_option(callback) {
	var transaction = db.database.transaction(["Options"]);
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("Options");
	var request = objectStore.get("settings");	
	request.onerror = function(event) {
		console.error(event);
		callback({});
	};
	request.onsuccess = function(event) {
		if (request.result) {
			callback(JSON.parse(request.result.options));
		} else {
			callback({});
		}
	};
},

add_profile:
function add_profile(prefix, protocol, password, callback) { 
	var transaction = db.database.transaction(["Profiles"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("Profiles");
	var profile = {
		name: prefix+'@'+protocol,
		protocol: protocol, 
		preferences: JSON.stringify(conf.get_default_prefs(protocol)), 
		password: password,
		order: 0
	};	
	var objectStore = transaction.objectStore("Profiles");
	var request = objectStore.add(profile);	
	request.onerror = function(event) {
		console.error(event);
		callback(false);
	};
	request.onsuccess = function(event) {
		callback(true);
	};	
},

remove_profile:
function remove_profile(name, callback) { 
	var transaction = db.database.transaction(["Profiles"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("Profiles");
	var request = objectStore.delete(name);
	request.onerror = function(event) {
		console.error(event);
		callback(false);
	};
	request.onsuccess = function(event) {
		callback(true);
	};
},

modify_profile:
function modify_profile(name, profile, password, callback) {  
	var transaction = db.database.transaction(["Profiles"], "readwrite");
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("Profiles");
	var request = objectStore.get(name);
	request.onerror = function(event) {
		console.error(event);
		callback(false);
	};
	request.onsuccess = function(event) {
		if (request.result) {
			var p = request.result;
			p.name = profile.name;
			p.protocol = profile.protocol;
			p.preferences = profile.preferences;
			p.order = profile.order;
			if (password !== null) p.password = password;
			var requestUpdate = objectStore.put(p);
			requestUpdate.onerror = function(event) {
				console.error(event);
				callback(false);
			};
			requestUpdate.onsuccess = function(event) {
				callback(true);
			};
		} else {
			callback(false);
		}
	};
},

get_profile:
function get_profile(name, callback) {
	var transaction = db.database.transaction(["Profiles"]);
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("Profiles");
	var request = objectStore.get(name);
	request.onerror = function(event) {
		console.error(event);
		callback({});
	};
	request.onsuccess = function(event) {
		if (request.result) {
			var p = request.result;
			callback({'name': p.name
	                        , 'protocol': p.protocol
	                        , 'preferences': p.preferences
				, 'password': p.password
	                        , 'order': p.order});
		} else {
			callback({});
		}
	};
},

get_all_profiles:
function get_all_profiles(callback) {
	var transaction = db.database.transaction(["Profiles"]);
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("Profiles");
	var profiles = [];
	objectStore.index("order").openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			profiles.push({'name': cursor.value.name
                        , 'protocol': cursor.value.protocol
                        , 'preferences': cursor.value.preferences
			, 'password': cursor.value.password
                        , 'order': cursor.value.order});
			cursor.continue();
		}
		else {
			callback(profiles);
		}
	};
},

get_password_of_profile:
function get_password_of_profile(name, callback) {
	var transaction = db.database.transaction(["Profiles"]);
	transaction.onerror = function(event) {
		console.error(event);
	};
	var objectStore = transaction.objectStore("Profiles");
	var request = objectStore.get(name);
	request.onerror = function(event) {
		console.error(event);
		callback("");
	};
	request.onsuccess = function(event) {
		if (request.result) {
			callback(request.result.password);
		} else {
			callback("");
		}
	};
}

};

