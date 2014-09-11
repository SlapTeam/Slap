
(function(slap){

	slap.app.directive('slapMenu', ['$sce', function ($sce) {
    	return {
        	restrict: 'E',
        	templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('client/directives/menu/menu.html')),    
        	scope: {
            	availableSlaps: '=',
            	selectedSlap: '=',
            	open: '='
            },
        	link: function ($scope, element, attrs) { 
        		$scope.select = function(item) {
					$scope.selectedSlap = item;
				};
        	}
    	};
	}]);


}(window.slap));