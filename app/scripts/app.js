(function() {
  angular
    .module('app.core', [
      'firebase'
    ]);

  angular
    .module('app.core')
    .constant('FIREBASE_APP', 'bruno2ms-playground')
    .constant('PROTECTED_PATHS', ['/waitlist']);
})();
