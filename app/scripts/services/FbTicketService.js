(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('FbTicketService', FbTicketService);

  FbTicketService.$inject = ['FbDataService', '$firebaseObject'];
  function FbTicketService(Service, $firebaseObject) {
    var service = {
      get: getTicket
    };

    return service;

    function getTicket(ticketKey) {
      return $firebaseObject(Service.tickets.child(ticketKey));
    }
  }
})();
