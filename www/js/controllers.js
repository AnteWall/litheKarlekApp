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
.controller('EditPhotosCtrl', function($scope,Camera,apiFactory,$ionicActionSheet,$ionicLoading){
  $scope.images;
  getPhotos();

  function getPhotos(){
    $ionicLoading.show({
      template: 'Laddar...' 
    });


    apiFactory.getUserImages().success(function(data){
      $scope.images = data;
      $ionicLoading.hide();
    }).error(function(){

      $ionicLoading.hide();
    })
  }

  $scope.photoOptions = function(id){

    var hideSheet = $ionicActionSheet.show({
      destructiveText: 'Ta bort',
        titleText: 'Redigera bild',
        cancelText: 'Ångra',
        cancel: function() {
          // add cancel code..
        },
        destructiveButtonClicked: function(index) {
          apiFactory.deleteImage(id).success(function(){
            getPhotos();
          }).error(function(){
          })
          return true;
        },
        buttonClicked: function(index) {
          return true;
        }
    });

    function hideDelSheet(){
      hideSheet.close();
      getPhotos();
    }

  }

  $scope.selectPhoto = function(){
    Camera.getPicture({ sourceType: 0 }).then(function(imageURI) {
      $scope.takenPhoto = imageURI;
      d = apiFactory.uploadImage(imageURI,function(d){
        $scope.error = JSON.parse(d.response).error;
        getPhotos();
      },function(err){
        console.err(err);
      })
    }, function(err) {

    });
  }

  $scope.takePhoto = function(){
    Camera.getPicture().then(function(imageURI) {
      $scope.takenPhoto = imageURI;
      d = apiFactory.uploadImage(imageURI,function(d){
        $scope.error = JSON.parse(d.response).error;
        getPhotos();
      },function(err){
        console.err(err);
      })
    }, function(err) {

    });
  }

})
.controller('AppCtrl', function($scope, $ionicModal, $timeout,$location) {
  // Form data for the login modal
  $scope.loginData = {};

  $scope.go = function(path){
    $location.path(path);
  }
})

.controller('SettingsCtrl', function($scope,auth, $state, store, apiFactory,$ionicLoading){
  $scope.frozen = false;
  $scope.update = {};
  $scope.update.lookingFor = [
{
  "name": "Kvinnor",
"isChecked": false
},{
  "name": "Män",
"isChecked": false
},
]
  getProfile();

  function getProfile(){
    $ionicLoading.show({
      template: 'Laddar...' 
    });

    apiFactory.getProfile().success(function(data){
      if(data.name == undefined || data.name == ""){
        $location.path('app/editprofile')
      }
      $scope.update.frozen = data.frozen_account;
      angular.forEach(data.view_for,function(d){
        angular.forEach($scope.update.lookingFor,function(obj){
          if(obj.name == d){
            obj.isChecked = true;
          }
        })
      })
      $ionicLoading.hide();
    }).error(function(error){
      $ionicLoading.hide();
    });
  }
   $scope.updateSettings = function(){
      apiFactory.updateSettings($scope.update).success(function(data){
        if(data.success){
          $state.go('app.profile')
        } 
      }).error(function(){
        console.log("error");  
      }); 
   }
$scope.logout = function() {
  auth.signout();
  store.remove('token');
  store.remove('profile');
  store.remove('refreshToken');
  $state.go('login');
}
})

.controller('ProfileCtrl', function($scope,apiFactory,$ionicLoading,$ionicSlideBoxDelegate,$location) {
  $scope.profile;
  getProfile();

  function getProfile(){
    $ionicLoading.show({
      template: 'Laddar...' 
    });

    apiFactory.getProfile().success(function(data){
      if(data.name == undefined || data.name == ""){
        $location.path('app/editprofile')
      }
      $scope.profile = data;
      $ionicSlideBoxDelegate.update();
      $ionicLoading.hide();
    }).error(function(error){
      $ionicLoading.hide();
    });
  }
})
.controller('EditProfileCtrl',function($scope,apiFactory,$location,$ionicLoading) {
  $scope.educations;
  $scope.update = {}
  $scope.genders = ['Man','Kvinna']
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
    $ionicLoading.show({
      template: 'Laddar...' 
    });
    apiFactory.getProfile().success(function(data){
      $scope.update.description = data.description;
      $scope.update.education = data.education;
      $scope.update.name = data.name;
      $scope.update.gender = data.gender;
      $ionicLoading.hide();
    }).error(function(error){
      $ionicLoading.hide();
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
