
(function(slap){

	slap.app.directive('slapCreate', ['$sce', function ($sce) {
    	return {
        	restrict: 'E',
        	templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('client/directives/create/create.html')),    
        	scope: {
            	visible: '=',
                onCreated: '='
            },
        	link: function ($scope, element, attrs) { 
        		
                $scope.slap = emptySlap();

                $scope.cancel = function() {
                    $scope.slap = emptySlap();
                    $scope.visible = false;
                };

                $scope.save = function() { 
                    var newSlap = $scope.slap;
                    $scope.slap = emptySlap();
                    $scope.visible = false;

                    if($scope.onCreated)
                        $scope.onCreated(newSlap);
                };
        	}
    	};
	}]);

    function user() { 
        return (slap.user || {}).email || '';
    }

    function emptySlap() { 
        return { 
            name: '',
            owner: user(),
            pages: {}
        };
    }


}(window.slap));