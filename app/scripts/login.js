var TodoApp = window.TodoApp;

TodoApp.prototype.signInInit = function () {
  this.bindEvents();
  this.bindSignInEvents();
};

// Sign In/Out Events
TodoApp.prototype.bindSignInEvents = function () {
  this.avatar = document.getElementById('user-avatar');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');

  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));

  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

TodoApp.prototype.signIn = function (event) {
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

TodoApp.prototype.signOut = function (event) {
  this.auth.signOut();
};

TodoApp.prototype.onAuthStateChanged = function (userAuth) {
  if (userAuth) {
    this.signedIn(userAuth);
  } else {
    this.signedOut();
  }
};

TodoApp.prototype.signedIn = function(user) {
  this.avatar.innerHTML =
  `<div class="avatar-container">
    <img class="picture" src="${user.photoURL}"/>
    <div class="name">${user.displayName}</div>
  </div>`;
  this.signInButton.setAttribute('hidden', 'true');
  this.signOutButton.removeAttribute('hidden');
};

TodoApp.prototype.signedOut = function(user) {
  this.avatar.innerHTML = '';
  this.signOutButton.setAttribute('hidden', 'true');
  this.signInButton.removeAttribute('hidden');
};

TodoApp.prototype.checkSign = function () {
  if (this.auth.currentUser) {
    return true;
  }

  var data = {
    message: 'You are not logged in',
    timetout: 2000
  };

  console.log(data);
  return false;
};
