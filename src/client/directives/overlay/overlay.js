
(function(slap){

	slap.app.directive('slapOverlay', ['$sce', function ($sce) {
    	return {
        	restrict: 'E',
        	templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('client/directives/overlay/overlay.html')),    
        	scope: {
            	selectedSlap: '='
            },
        	link: function ($scope, element, attrs) { 
        		
                $scope.$watch('selectedSlap', function() { 
                    console.log('you just selected: ', $scope.selectedSlap);
                });
        	}
    	};
	}]);


}(window.slap));