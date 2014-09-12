
(function(slap){
	// slap controller
	slap.app.controller('SlapCtrl', ['$scope', 'fbutil', '$firebase', function($scope, fbutil, $firebase) {

		$scope.menuOpen = true;
		$scope.selectedSlap = null;
		$scope.availableSlaps = fbutil.syncArray('slaps');

		$scope.createVisible = false;
		$scope.showCreate = function() {
			$scope.createVisible = true;
		};
		$scope.createSlap = function(slap) {
			$scope.availableSlaps.$add(slap);
			$scope.availableSlaps.$save();
			$scope.selectedSlap = slap;
		};

		// watch for selected slap changes, to notify extension
		var initialWatch = true;
		$scope.$watch('selectedSlap', function(val) {
			if(initialWatch) { 
				initialWatch = false;
				return;
			}

			chrome.runtime.sendMessage({
            	type: "selectslap",
            	context: slap,
            	value: (val ? val.$id : null)
            });
		});

		$scope.save = function(item) {
			$scope.availableSlaps.$save(item);
		};

		// setup chrome message handler
		chrome.runtime.onMessage.addListener(function (request, sender, respond) {
			if(!request) return;

			console.log('client message', request);
			switch(request.type) {
				case 'togglemenu': $scope.menuOpen = request.value; break;
				case 'selectslap':
					$scope.availableSlaps.$loaded().then(function() {
						var target = _.find($scope.availableSlaps, {"$id": request.value});
						if(target) {
							$scope.selectedSlap = target;
							respond(request);
						} else respond({value: null});
					});
					break;
			}

			$scope.$digest();
		});
	}]);

}(window.slap));
