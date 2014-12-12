(function(slap){

	slap.app.directive('slapMenu', function () {
   	return {
			restrict: 'E',
      templateUrl: chrome.extension.getURL('client/directives/menu/menu.html'),
			scope: {
       	availableSlaps: '=',
       	selectedSlap: '=',
				open: '='
      },
      controller: function ($scope, $modal) {
        $scope.slap = slap;

        $scope.create = function() {
					var modal = $modal.open({
						templateUrl: chrome.extension.getURL('client/controllers/create/create.html'),
						windowTemplateUrl: chrome.extension.getURL('client/templates/window.html'),
						backdropClass: 'slap-ui',
						windowClass: 'slap-ui',
						controller: 'CreateCtrl'
					});
 				};

				$scope.close = function() {
          $scope.open = false;
     			chrome.runtime.sendMessage({
            type: 'closemenu',
         		context: slap
     			});
 				};

				$scope.remove = function(item) {
     			$scope.availableSlaps.$remove(item);
					$scope.availableSlaps.$save();
 				};
     	}
   	};
 	});

}(window.slap));
