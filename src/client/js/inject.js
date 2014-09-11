
// this is the final script to run
// and is responsible for injecting
// the main view into the document

(function(slap){

		$.ajax({
		    url: chrome.extension.getURL('client/main.html'),
		    success: function (data) {
		    	var slapRoot = $(data);
		    	$('body').append(slapRoot);
		    	angular.bootstrap(slapRoot, [slap.app.name]);

		    	// $('.close-menu').click(function() { 
		    	// 	toggleMenu(false);
		    	// 	chrome.runtime.sendMessage({type: "closemenu", context: slap});
		    	// });
		    },
		    dataType: 'html'
		});

}(window.slap));