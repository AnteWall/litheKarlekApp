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

.controller('ProfileCtrl', function($scope,apiFactory,$ionicLoading) {
  $scope.profile;
  $scope.images = ["https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-xap1/v/t1.0-9/1483030_10204500224600786_5797545058229427005_n.jpg?oh=c859bf8a21ecb7d9d8e8d9f8b0d9e466&oe=558A67E9&__gda__=1431226320_6b1864eafca1e387bd7044aa27db77a9","https://scontent-ams.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/10334314_10152689726059713_1090164303467743202_n.jpg?oh=875a92fec7accaeebc26c807db612c7f&oe=558A496F","https://fbcdn-sphotos-b-a.akamaihd.net/hphotos-ak-xpf1/v/t1.0-9/1150348_745846915463162_5547011624121043311_n.jpg?oh=9c9d6541f428d0200b9d73601534d10e&oe=554F0433&__gda__=1430948594_fdd64140d0d6e3d1521c39cc99517ac0"]
  getProfile();

  function getProfile(){
    $ionicLoading.show({
     template: 'Laddar...' 
    });
 
    apiFactory.getProfile().success(function(data){
      $scope.profile = data;
      $ionicLoading.hide();
    }).error(function(error){
      $ionicLoading.hide();
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
