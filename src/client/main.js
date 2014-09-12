
(function(slap){
	// slap controller
	slap.app.controller('SlapCtrl', ['$scope', function($scope) {

		$scope.menuOpen = true;
		$scope.selectedSlap = null;
		$scope.availableSlaps = [{
			name: 'Test Slap 1',
			pages: [{
				title: 'Page 1',
				href: '/page1',
				comments: {
    				'#c1': [{
        				email: 'kim.eberz@rightscale.com',
        				date: new Date(),
        				text: 'Need more poneys!'
      				},{
        				email: 'andre.rieussec@rightscale.com',
        				date: new Date(),
        				text: 'No more poneys!!!'
      				}],
    				'#c2': [{
        				email: 'jasonmelgoza@gmail.com',
        				date: new Date(),
        				text: 'I want an  animated GIF'
      				}]
				}
			}]
		}];

		$scope.createVisible = false;
		$scope.showCreate = function() {
			$scope.createVisible = true;
		};
		$scope.createSlap = function(slap) {
			// TODO: save it somewhere
			$scope.selectedSlap = slap;
		};

		// watch for selected slap changes, to notify extension
		$scope.$watch('selectedSlap', function(val) {
			chrome.runtime.sendMessage({
            	type: "selectslap",
            	context: slap,
            	value: (val ? val.id : null)
            });
		});

		// setup chrome message handler
		chrome.runtime.onMessage.addListener(function (request, sender, respond) {
			if(!request) return;

			switch(request.type) {
				case 'togglemenu': $scope.menuOpen = request.value; break;
				case 'selectslap':
					var target = _.find($scope.availableSlaps, {id: request.value});
					if(target) {
						$scope.selectedSlap = target;
						respond(request);
					} else response({value: null});
					break;
			}

			$scope.$digest();
		});
	}]);

}(window.slap));
