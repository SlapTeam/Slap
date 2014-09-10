
var clients = {};

// inject the content script when icon is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
	if(!clients[tab.id]) {
		// initialize the interface
		clients[tab.id] = new SlapClient(tab);
		clients[tab.id].init(function() {	
			clients[tab.id].toggle(true);
		});
	} else {
		clients[tab.id].toggle();
	}
});

// handle message from content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(!message || !message.context) return;

	switch(message.type) { 
		case 'closemenu':
		clients[message.context.tab].visible = false;
		break;
	}
});

// handle page refreshes on a tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	var target;

	// change happens when a page load is done
    if (changeInfo.status === 'complete') {
    	target = clients[tabId];
    	if(target) {
    		target.init(function() {
    			if(target.visible) {
    				target.toggle(true);
    			}
    		});
    	}
    }
});

// slap client class
var contentFiles = [
	'src/jquery-2.1.1.min.js',
	'src/content.js'
];

function SlapClient(tab) {
	this.tab = tab;
	this.visible = false;
}

SlapClient.prototype = {

	init: function(done) {
		var tabId = this.tab.id;
		chrome.identity.getProfileUserInfo(function(user) {
			chrome.tabs.executeScript(tabId, {
				code: 'var slap={tab:' + tabId + ',user:' + JSON.stringify(user) + '};',
				runAt: 'document_start'
			});

			// load css
			chrome.tabs.insertCSS(tabId, {file: 'src/styles.css'});

			var i = 0;
			var loadContent;

			loadContent = function() {
				if(i < contentFiles.length)
					chrome.tabs.executeScript(tabId, {file: contentFiles[i++]}, loadContent);
				else if (done) done();
			};

			loadContent();
		});
	},

	toggle: function(visible) {
		if(visible === undefined) {
			visible = !this.visible;
		}

		this.visible = visible;

		chrome.tabs.sendMessage(this.tab.id, {
			type: 'toggle',
			value: visible
		});
	}
};