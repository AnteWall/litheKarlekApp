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
.controller('EditProfileCtrl',function($scope,apiFactory,$location) {
  $scope.educations;
  $scope.test = ['one','two']
  $scope.update = {}
  getEducations();
  getProfile();

  $scope.updateProfile = function(){
    apiFactory.updateProfile($scope.update).success(function(data){
      if(data.success){
        $location.path('app/profile')
      }else{
        $scope.error = "Fel när vi försökte spara din data";
      } 
    }).error(function(){
      console.log("error") 
    })
  }

  function getProfile(){
    apiFactory.getProfile().success(function(data){
      $scope.update.description = data.description;
      $scope.update.education = data.education;
    }).error(function(error){
    });
  }

  function getEducations(){
    apiFactory.getEducations().success(function(data){
      $scope.educations = data;
    }).error(function(error){
      console.log("error loading educations")
    })
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
