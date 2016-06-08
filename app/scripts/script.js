'use strict';

function TodoApp(config) {
  this.firebaseInit(config);
  this.signInInit();

  this.todoTasksInit();

  this.bindEvents();
}
// BIND EVENTS
TodoApp.prototype.bindEvents = function () {};

window.onload = function() {
  var config = {
    'apiKey': 'AIzaSyCZMzwp6YtU-6uiCHzTarMX5F0ZIWTE0Y4',
    'authDomain': 'brunoms-todoapp.firebaseapp.com',
    'databaseURL': 'https://brunoms-todoapp.firebaseio.com',
    'storageBucket': 'brunoms-todoapp.appspot.com'
  };
  window.TodoApp = new TodoApp(config);
};
