
(function(slap){

	// angular module init
	slap.app = angular.module('slap', [
		'firebase',
		'firebase.utils',
		'ui.bootstrap'
	]);

	slap.app.config(function($sceDelegateProvider) {
		 $sceDelegateProvider.resourceUrlWhitelist([
   		'self',
   		'chrome-extension:**']);
	});

	// make slap object acessible by all scopes
	slap.app.run(['$rootScope', function($rootScope) {
		$rootScope.slap = slap;
	}]);


}(window.slap));
