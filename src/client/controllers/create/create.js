
(function(slap){

	slap.app.controller('CreateCtrl', function ($modalInstance, $scope, fbutil) {
    $scope.slap = emptySlap();
		var slaps = fbutil.syncArray('slaps');

    $scope.cancel = function() {
      $modalInstance.dismiss();
  	};

    $scope.save = function() {
			slaps.$add($scope.slap);
			slaps.$save();
      $modalInstance.close();
    };
	});

  function user() {
    return (slap.user || {}).email || '';
  }

  function emptySlap() {
    return {
      name: '',
      owner: user(),
      pages: []
    };
  }

}(window.slap));
