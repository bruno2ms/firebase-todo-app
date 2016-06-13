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
