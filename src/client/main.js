
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

		// setup chrome message handler
		chrome.runtime.onMessage.addListener(function (request, sender, respond) {
			if(!request) return;

			switch(request.type) {
				case 'toggle': $scope.menuOpen = request.value; break;
			}

			$scope.$digest();
		});
	}]);

}(window.slap));
