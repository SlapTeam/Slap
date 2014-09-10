
(function(slap){	

	if(!slap.initialized) {
		chrome.runtime.onMessage.addListener(onMessage);
		createMenu();
		slap.initialized = true;
		console.log('you are logged in as: ', slap.user);
	}

	// handle incoming messages
	function onMessage(request, sender, respond) {
		console.log(request);
		if(!request) return;

		switch(request.type) { 
			case 'toggle': toggleMenu(request.value); break;
		}
	}

	function toggleMenu(visible){
		//slap.visible = !slap.visible;
		//slap.port.postMessage({type: 'toggle', context: slap});


		$('nav.slide-menu-left')[visible ? 'addClass' : 'removeClass']('open');
		//$('body')[visible ? 'addClass' : 'removeClass']('pml-open');
	}

	function createMenu() {
		$.ajax({
		    url: chrome.extension.getURL('src/menu.html'),
		    success: function (data) {
		    	//$('body').wrapInner('<div class="pml-wrapper" />');
		    	$('body').append(data);
		    	$('.close-menu').click(function() { 
		    		toggleMenu(false);
		    		chrome.runtime.sendMessage({type: "closemenu", context: slap});
		    	});
		    },
		    dataType: 'html'
		});
	}

}(window.slap));