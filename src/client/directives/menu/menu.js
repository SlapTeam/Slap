
(function(slap){

	slap.app.directive('slapMenu', ['$sce', function ($sce) {
    	return {
        	restrict: 'E',
        	templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('client/directives/menu/menu.html')),
        	scope: {
            	availableSlaps: '=',
            	selectedSlap: '=',
            	open: '=',
                onCreate: '='
            },
        	link: function ($scope, element, attrs) {
                $scope.slap = slap;

        		$scope.select = function(item) {
					$scope.selectedSlap = item;
				};

                $scope.create = function() {
                    if($scope.onCreate)
                        $scope.onCreate();
                };
                $scope.close = function() {
                    $scope.open = false;
                    chrome.runtime.sendMessage({
                        type: "closemenu",
                        context: slap
                    });
                };

				$scope.remove = function(item) {
				    $scope.availableSlaps.$remove(item);
					$scope.availableSlaps.$save();
				};
        	}
    	};
	}]);


}(window.slap));
