(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('FbDataService', FbDataService);

  FbDataService.$inject = ['$firebaseObject'];
  function FbDataService($firebaseObject) {
    var root = firebase.database().ref(window._tenant);

    var service = {
      root: root,
      tickets: root.child('tickets'),
      users: root.child('users'),
      events: root.child('events')
    };

    return service;
  }
})();
