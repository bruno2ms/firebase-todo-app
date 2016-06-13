(function() {
  angular
    .module('app.core')
    .directive('fbTicket', fbTicket)
    .controller('fbTicketCtrl', fbTicketCtrl);

  fbTicket.$inject = [];
  function fbTicket() {
    var directive = {
      restrict: 'E',
      controller: 'fbTicketCtrl',
      controllerAs: 'vm',
      templateUrl: './scripts/directives/fb-ticket/template.html',
      scope: {},
      bindToController: {
        ticketKey: '='
      }
    };

    return directive;
  }

  fbTicketCtrl.$inject = ['FbTicketService'];
  function fbTicketCtrl(Service) {
    /* jshint validthis: true */
    var vm = this;
    
    function saveTicket() {
      var newTicket = {
        titulo: vm.ticketKey + ' - titulo do ticket'
      };
      angular.extend(vm.ticket, newTicket);
      vm.ticket.$save();
    }

    // init
    function init() {
      vm.ticket = Service.get(vm.ticketKey);
      vm.ticket.$watch(function(snapshot) {
        if (vm.ticket.$value === null) {
          saveTicket();
        }
      });
    }

    init();
  }
})();
