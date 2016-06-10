// app.js
(function() {
  angular.module('app.core', ['firebase']);
})();

// constants.js
(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('FIREBASE_APP', 'bruno2ms-playground')
    .constant('PROTECTED_PATHS', ['/waitlist']);
})();

// config.js
(function() {
  'use strict';

  angular
    .module('app.core')
    .config(firebaseConfig);

  firebaseConfig.$inject = ['FIREBASE_APP'];
  function firebaseConfig(FIREBASE_APP) {
    var config = {
      apiKey: 'AIzaSyBOTLLgoP5XJgZ3hh84xnYGK5OrdiXY65Y',
      authDomain: FIREBASE_APP + '.firebaseapp.com',
      databaseURL: 'https://' + FIREBASE_APP + '.firebaseio.com',
      storageBucket: FIREBASE_APP + '.appspot.com',
    };
    firebase.initializeApp(config);
  }
})();


// firebaseDataService.js
(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('firebaseDataService', firebaseDataService);

  firebaseDataService.$inject = [];
  function firebaseDataService() {
    var root = firebase.database().ref(_tenant);

    var service = {
      root: root,
      tickets: root.child('tickets'),
      users: root.child('users'),
      features: root.child('features'),
      viewingTickets: root.child('features/viewingTickets')
    };

    return service;
  }
})();

(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('viewingTicketsService', viewingTicketsService);

  viewingTicketsService.$inject = ['firebaseDataService', '$firebaseArray', '$firebaseObject'];
  function viewingTicketsService(Service, $firebaseArray, $firebaseObject) {
    var service = {
      getRef: getRef,
      createView: createView,
      updateView: updateView,
      getByTicket: getByTicket
    };

    return service;

    function getRef(ticketKey, userKey) {
      return $firebaseArray(Service.viewingTickets.child(ticketKey).child(userKey));
    }

    function createView(ref) {
      return ref.$add({startAt: new Date().getTime()});
    }

    function updateView(userViews, view) {
      var index = userViews.$indexFor(view.key);
      userViews[index].endDate = new Date().getTime();
      return userViews.$save(index);
    }

    function getByTicket(ticketKey) {

    }
  }
})();

(function() {
  angular
    .module('app.core')
    .directive('fbTicketView', fbTicketView)
    .controller('fbTicketViewCtrl', fbTicketViewCtrl);

  fbTicketView.$inject = [];
  function fbTicketView() {
    var directive = {
      restrict: 'E',
      controller: 'fbTicketViewCtrl',
      controllerAs: 'vm',
      templateUrl: './scripts/_fb-ticket-tpl.html',
      scope: {},
      bindToController: {
        ticketKey: '=',
        userKey: '='
      }
    };

    return directive;
  }

  fbTicketViewCtrl.$inject = ['$scope', '$interval', 'viewingTicketsService', '$firebaseArray', '$firebaseObject'];
  function fbTicketViewCtrl($scope, $interval, Service, $firebaseArray, $firebaseObject) {
    /* jshint validthis: true */
    var vm = this,
      userViews, update, view;

    $scope.$on('$destroy', function() {stopUpdate(update);});

    function stopUpdate(update) {
      $interval.cancel(update);
    }

    function updateTime() {
      update = $interval(updateView, 1000);
    }

    function updateView() {
      Service.updateView(userViews, view).then(function(ref) {
        vm.view = $firebaseObject(ref);
      });
    }

    function createView() {
      Service.createView(userViews).then(function(ref) {
        console.log(ref.key, userViews.$indexFor(ref.key));
        view = ref;
        updateTime();
      });
    }

    //init
    function init() {
      if (angular.isDefined(update)) {return;}
      // vm.ticketList = Service.getByTicket(vm.ticketKey);
      userViews = Service.getRef(vm.ticketKey, vm.userKey);
      userViews.$loaded(createView);
      vm.userViews = userViews;
    }

    init();
  }
})();

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
      templateUrl: './scripts/_fb-ticket-tpl.html',
      scope: {},
      bindToController: {
        ticket: '=',
        permissoes: '='
      }
    };

    return directive;
  }

  fbTicketCtrl.$inject = ['$scope', '$firebaseObject'];
  function fbTicketCtrl($scope, $firebaseObject) {
    /* jshint validthis: true */
    var vm = this,
      ref, obj;

    // function getTicket(ticketKey) {
    //   vm.obj.$loaded().then(function(response) {
    //     console.log(response.$value);
    //     saveTicket();
    //   });
    // }
    //
    // function saveTicket(ticket) {
    //   angular.extend(vm.obj,
    //     _.pick(ticket, 'titulo', 'dataDaUltimaAlteracao')
    //   );
    //
    //   vm.obj.$save();
    // }
    //
    // //init
    function init() {
      // ref = firebase.database().ref(_tenant);
      // vm.obj = $firebaseObject(ref.child('tickets').child(vm.ticket.ticketKey));
      // getTicket(vm.ticket.ticketKey);
      // saveTicket(vm.ticket);
    }

    init();
  }
})();

(function() {
  angular
    .module('app.core')
    .controller('MyController', MyController);

  MyController.$inject = ['$http'];
  function MyController($http) {
    /* jshint validthis: true */
    var vm = this;
    vm.viewedTickets = [{
      ticketKey: 100,
      userKey: 4
    }];

    // public
    vm.add = function(item) {
      vm.viewedTickets.push(angular.copy(item));
    };

    vm.remove = function(index) {
      vm.viewedTickets.splice(index, 1);
    };

    // private
    function getTickets() {
      $http({url: './mocks/tickets.json', method: 'GET'}).then(function(response) {
        vm.tickets = response.data;
      });
    }

    function init() {
      // getTickets();
    }

    init();
  }
})();
