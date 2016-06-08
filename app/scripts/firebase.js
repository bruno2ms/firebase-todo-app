var TodoApp = window.TodoApp;

TodoApp.prototype.firebaseInit = function(config) {
  firebase.initializeApp(config);
  this.initFirebase();
  this.checkFirebaseStatus();
};

// Firebase Initialization
TodoApp.prototype.checkFirebaseStatus = function () {
  if (!window.firebase || !(firebase.app instanceof Function)) {
    console.log('Where`s Firebase?');
  }
};

TodoApp.prototype.initFirebase = function () {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  this.ref = {};
};

TodoApp.prototype.loadReference = function (path) {
  // Reference to my database path
  var ref = this.database.ref(path);
  // Make sure we remove all previous listeners
  ref.off();
  return ref;
};
