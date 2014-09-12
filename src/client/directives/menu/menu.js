
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
        		$scope.select = function(item) {
					$scope.selectedSlap = item;
				};

                $scope.create = function() { 
                    if($scope.onCreate)
                        $scope.onCreate();
                };
        	}
    	};
	}]);


}(window.slap));