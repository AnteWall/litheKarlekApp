angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, auth, $state, store,$location) {
  auth.signin({
    closable: false,
    // This asks for the refresh token
    // So that the user never has to log in again
    authParams: {
      scope: 'openid offline_access'
    }
  }, function(profile, idToken, accessToken, state, refreshToken) {
    store.set('profile', profile);
    store.set('token', idToken);
    store.set('refreshToken', refreshToken);
    $state.go('app.profile');
  }, function(error) {
    console.log("There was an error logging in", error);
  });
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$location) {
  // Form data for the login modal
  $scope.loginData = {};

  $scope.go = function(path){
    $location.path(path);
  }
})
.controller('DashCtrl', function($scope, $http,store) {

  $scope.callApi = function() {
    // Just call the API as you'd do using $http
    $http({
      url: 'http://localhost:3000/secured/ping',
      method: 'GET'
    }).then(function() {
      console.log(store.get('profile'));
      alert("We got the secured data successfully");
    }, function() {
      alert("Please download the API seed so that you can call it.");
    });
  }
})

.controller('SettingsCtrl', function($scope,auth, $state, store){
  $scope.frozen = false;
  $scope.lookingFor = [
  {
    "name": "Kvinnor",
    "isChecked": true
  },{
    "name": "Män",
    "isChecked": true
  },
  ]
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login');
  }
})

.controller('ProfileCtrl', function($scope,apiFactory) {
  $scope.profile;

  getProfile();

  function getProfile(){
    apiFactory.getProfile().success(function(data){
      $scope.profile = data;
    }).error(function(error){
    });
  }
})

.controller('FindMatchCtrl', function($scope) {
  $scope.name = "Ante Wall";
})
.controller('AccountCtrl', function($scope, auth, $state, store) {
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login');
  }
});
