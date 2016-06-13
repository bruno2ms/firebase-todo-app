
(function() {
  angular
    .module('app.core')
    .directive('fbTicketViewing', fbTicketViewing)
    .controller('fbTicketViewingCtrl', fbTicketViewingCtrl);

  fbTicketViewing.$inject = [];
  function fbTicketViewing() {
    var directive = {
      restrict: 'E',
      controller: 'fbTicketViewingCtrl',
      controllerAs: 'vm',
      templateUrl: './scripts/directives/fb-ticket-viewing/template.html',
      scope: {},
      bindToController: {
        ticketKey: '=',
        userKey: '='
      }
    };

    return directive;
  }

  fbTicketViewingCtrl.$inject = ['$scope', 'FbTicketViewingService'];
  function fbTicketViewingCtrl($scope, Service) {
    /* jshint validthis: true */
    var vm = this,
      userViews, update, view;

    $scope.$on('$destroy', function() {
      console.log('destroy directive');
      vm.view.$remove();
    });

    //init
    function init() {
      if (angular.isDefined(update)) {
        return;
      }

      vm.viewers = Service.get(vm.ticketKey);
      vm.view = Service.set(vm.ticketKey, vm.userKey);
      vm.view.$ref().onDisconnect().remove();
      vm.view.status = 'online';
      vm.view.$save();

    }

    init();
  }
})();
// https://github.com/HackedByChinese/ng-idle
// document.onIdle = function () {
//   vm.view.status = 'parado';
// };
//
// document.onAway = function () {
//   vm.view.status = 'fora';
// };
//
// document.onBack = function (isIdle, isAway) {
//   vm.view.status = 'online';
// };
