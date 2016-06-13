(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('FbTicketViewingService', FbTicketViewingService);

  FbTicketViewingService.$inject = ['FbDataService', '$firebaseObject'];
  function FbTicketViewingService(Service, $firebaseObject) {
    var service = {
      get: getViewers,
      set: setViewing
    };

    return service;

    function getViewers(ticketKey) {
      return $firebaseObject(Service.events.child('ticketViewing'));
    }

    function setViewing(ticketKey, userKey) {
      return $firebaseObject(Service.events.child('ticketViewing').child(ticketKey).child(userKey));
    }
  }
})();
