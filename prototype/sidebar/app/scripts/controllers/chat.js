'use strict';
/**
 * @ngdoc function
 * @name sidebarApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('sidebarApp')
  .controller('ChatCtrl', function ($scope, fbutil, $timeout) {
    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    $scope.selectors = fbutil.syncObject('selectors');

    // display any errors
    $scope.selectors.$loaded().catch(alert);

    // provide a method for adding a message
    //$scope.addMessage = function(newMessage) {
    //  if( newMessage ) {
        // push a message to the end of the array
    //    $scope.messages.$add({text: newMessage})
          // display any errors
    //      .catch(alert);
    //  }
    //};

    $scope.addMessage = function(newMessage, selector, name) {
      if( newMessage && selector && name ) {

        if ( $scope.selectors[selector])
        {
          $scope.selectors[selector].push({message : newMessage, name: name});
        }

       else {
        $scope.selectors[selector] = [{message : newMessage, name: name}];

       }
        $scope.selectors.$save();
        }
    };




   $scope.removeMessage = function(message, selector) {

        // push a message to the end of the array
        var index = $scope.selectors[selector].indexOf(message);
        $scope.selectors[selector].splice(index, 1);
          // display any errors


    };

    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }
  });
