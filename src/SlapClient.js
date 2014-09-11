// slap client scripts
var clientJsFiles = [
	'client/js/lib/jquery.min.js',
	'client/js/lib/angular.min.js',
	'client/js/init.js',
	'client/directives/menu/menu.js',
	'client/directives/overlay/overlay.js',
	'client/main.js',
	'client/js/inject.js'
];

// slap client styles
var clientCssFiles = [
	'client/css/menu.css'
];

// slap client class
function SlapClient(tab) {
	this.tab = tab;
	this.visible = false;
}

SlapClient.prototype = {

	init: function(done) {
		var tabId = this.tab.id;
		chrome.identity.getProfileUserInfo(function(user) {
			// inject the tab and user info into the context
			chrome.tabs.executeScript(tabId, {
				code: 'window.slap={tab:' + tabId + ',user:' + JSON.stringify(user) + '};',
				runAt: 'document_start'
			});

			// load css
			clientCssFiles.forEach(function(file) {
				chrome.tabs.insertCSS(tabId, {file: file});
			});

			var i = 0;
			var loadContent;

			// this loads all scripts in order
			loadContent = function() {
				if(i < clientJsFiles.length)
					chrome.tabs.executeScript(tabId, {file: clientJsFiles[i++]}, loadContent);
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