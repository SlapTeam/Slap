'use strict';

/**
 * @ngdoc function
 * @name sidebarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sidebarApp
 */
angular.module('sidebarApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
