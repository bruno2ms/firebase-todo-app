(function(_) {
  angular
    .module('app.core')
    .controller('MyController', MyController);

  MyController.$inject = [];
  function MyController() {
    /* jshint validthis: true */
    var vm = this;
    vm.viewedTickets = [{
      ticketKey: 100,
      userKey: 4
    },{
      ticketKey: 100,
      userKey: 5
    }];

    // public
    vm.add = function(obj) {
      var exists = _.filter(vm.viewedTickets, function(item) {
        return item.ticketKey === obj.ticketKey && item.userKey === obj.userKey;
      });
      if (!exists.length) {
        vm.viewedTickets.push(angular.copy(obj));
      }
    };

    vm.remove = function(index) {
      vm.viewedTickets.splice(index, 1);
    };
  }
})(window._);
