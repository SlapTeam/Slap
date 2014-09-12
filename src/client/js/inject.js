
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
		    },
		    dataType: 'html'
		});

}(window.slap));
