
// registry for all tabs that have activated slap
var clients = {};

// inject the content script when icon is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
	var client = clients[tab.id];

	if(!client) {
		// initialize the interface
		client = clients[tab.id] = new SlapClient(tab);
		client.init(function() {
			// display the menu once it's ready
			client.toggleMenu(true);
		});
	} else {
		// toggle the menu
		client.toggleMenu();
	}
});

// handle message from content script
chrome.runtime.onMessage.addListener(function(message, sender, respond){
	if(!message || !message.context) return;

	console.log('extension message: ', message);
	switch(message.type) {
		case 'closemenu':
			clients[message.context.tab].visible = false;
			break;
		case 'selectslap':
			clients[message.context.tab].selectedSlapId = message.value
			break;
	}
});

// handle page refreshes on a tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	var client;

	// change happens when a page load is done
    if (changeInfo.status === 'complete') {
    	client = clients[tabId];
    	if(client) {
    		client.init(function() {
    			if(client.visible) {
    				client.toggleMenu(true);
    			}
    			if(client.selectedSlapId) { 
    				client.selectSlap(client.selectedSlapId);
    			}
    		});
    	}
    }
});
