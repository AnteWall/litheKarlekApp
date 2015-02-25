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
  $scope.error;
  getPhotos();

  function getPhotos(){
    $scope.error;
    $ionicLoading.show({
      template: 'Laddar...' 
    });

    apiFactory.getUserImages().success(function(data){
      $scope.images = data;
      $ionicLoading.hide();
    }).error(function(){
      $scope.error = "Fel när vi försökte ladda dina bilder.";
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
            $scope.error = "Fel när vi försökte ta bort din bild";
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
        $scope.error = "Fel när vi försökte ladda upp din bild";
      })
    }, function(err) {
      $scope.error = "Fel när vi försökte ladda upp din bild";
    });
  }

  $scope.takePhoto = function(){
    Camera.getPicture().then(function(imageURI) {
      $scope.takenPhoto = imageURI;
      d = apiFactory.uploadImage(imageURI,function(d){
        $scope.error = JSON.parse(d.response).error;
        getPhotos();
      },function(err){
        $scope.error = "Fel när vi försökte ladda upp din bild";
      })
    }, function(err) {
      $scope.error = "Fel när vi försökte ladda upp din bild";
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
  $scope.error;
  $scope.update = {};
  $scope.update.lookingFor = [
{
  "name": "Kvinna",
"isChecked": false,
"displayName": "Kvinnor"
},{
  "name": "Man",
"displayName": "Män",
"isChecked": false
},
]
getProfile();

function getProfile(){
  $scope.error;
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
    $scope.error = "Fel när vi försökte ladda dina inställningar";
    $ionicLoading.hide();
  });
}
$scope.updateSettings = function(){
  apiFactory.updateSettings($scope.update).success(function(data){
    if(data.success){
      $state.go('app.profile')
    } 
  }).error(function(){
    $scope.error = "Fel när vi försökte uppdatera dina inställningar";
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
  $scope.error;
  getProfile();

  function getProfile(){
    $scope.error;
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
      $scope.error = "Fel när vi försökte ladda din profil";
    });
  }
})

.controller('MatchesCtrl',function($scope,apiFactory,$location,$ionicLoading) {
  $scope.matches;

  getProfile();
  $scope.getName = function(match){
    if(match.user_1.name == $scope.name){
      return match.user_2.name
    }
    return match.user_1.name
  }
  $scope.getImage = function(match){

    if(match.user_1.name == $scope.name){
      return match.user_2.images_url[0];
    }
    return match.user_1.images_url[0];
  }
  function getMatches(){
    apiFactory.getMatches().success(function(data){
      $scope.matches = data;
      console.log(data)
      $ionicLoading.hide();
    }).error(function(err){
      $scope.error = "Fel när vi försökte läsa dina matchningar";
      $ionicLoading.hide();
    });
  }

  function getProfile(){
    $scope.error;
    $ionicLoading.show({
      template: 'Laddar...' 
    });
    apiFactory.getProfile().success(function(data){
      $scope.name = data.name;
      getMatches();
    }).error(function(error){
      $scope.error = "Fel när vi försökte ladda dina inställningar";
      $ionicLoading.hide();
    });
  }
})
.controller('EditProfileCtrl',function($scope,apiFactory,$location,$ionicLoading) {
  $scope.educations;
  $scope.error;
  $scope.update = {}
  $scope.genders = ['Man','Kvinna']
  getEducations();
getProfile();

$scope.updateProfile = function(){
  $scope.error;
  apiFactory.updateProfile($scope.update).success(function(data){
    if(data.success){
      $location.path('app/profile')
    }else{
      $scope.error = "Fel när vi försökte spara din data";
    } 
  }).error(function(){
    $scope.error = "Fel när vi försökte spara din data";
  })
}

function getProfile(){
  $scope.error;
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
    $scope.error = "Fel när vi försökte ladda dina inställningar";
    $ionicLoading.hide();
  });
}

function getEducations(){
  apiFactory.getEducations().success(function(data){
    $scope.educations = data;
  }).error(function(error){
    $scope.error = "Fel när vi försökte ladda utbildningar.";
  })
} 



})
.controller('FindMatchCtrl', function($scope,apiFactory,
      $ionicLoading,
      $ionicSlideBoxDelegate,
      $timeout,
      $ionicPopup) {
        $scope.matches;
        $scope.error;
        $scope.fadeout = false;
        findMatches();

        $scope.showPopup = function(){
        var myPopup = $ionicPopup.show({
          templateUrl: 'templates/new_match.html',
            title: 'En ny matchning!',
            scope: $scope,
            buttons: [
              { text: 'Stäng' },
            {
              text: '<b>Visa</b>',
              type: 'button-positive',
              onTap: function(e) {
                $scope.go('app/matches'); 
              }
            }
            
        ]
        });
      }
        $scope.approve = function(){
          $scope.error;
          data = {'matched': $scope.matches[0].id, 'liked': true }
          apiFactory.reportMatch(data).success(function(res){
            $scope.fadeout = true;
            if(res.match == true){
              $scope.match = $scope.matches[0];
              $scope.showPopup();
            } 
            $timeout(function(){
              removeMatch(); 
              $scope.fadeout = false;
            },1000);
          }).error(function(err){
            $scope.error = "Fel när vi försökte gilla din matchning";
          });
        }
        $scope.decline = function(){
          $scope.error;
          data = {'matched': $scope.matches[0].id, 'liked': false }
          apiFactory.reportMatch(data).success(function(){
            $scope.fadeout = true;
            $timeout(function(){
              removeMatch(); 
              $scope.fadeout = false;
            },1000);
          }).error(function(err){
            $scope.error = "Fel när vi försökte skippa din matchning";
          });
        } 

        $scope.animation = function(){
          if($scope.fadeout){
            return 'fade-out';
          }
        }
        function removeMatch(){
          $scope.matches.splice(0,1);
          if($scope.matches.length == 0){
            findMatches();
          }
          $timeout(function(){
            $ionicSlideBoxDelegate.slide(0,0);
            $ionicSlideBoxDelegate.update();
          },100);
        }

        function findMatches(){
          $ionicLoading.show({
            template: 'Letar efter matchningar...' 
          });

          apiFactory.findMatches().success(function(data){
            console.log(data);
            $scope.matches = data;
            $ionicSlideBoxDelegate.slide(0,0);
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
          }).error(function(err){
            $scope.error = "Fel när vi försökte hämta matchningar, försök igen senare";
            $ionicLoading.hide();
          });
        }
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
