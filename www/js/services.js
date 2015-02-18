angular.module('starter.services', [])
.factory('apiFactory', function($http){

  var urlBase = 'http://localhost:3000/api';
  var apiFactory = {};

  apiFactory.getProfile = function() {
    return $http.get(urlBase + '/users/me'); 
  }
  
  apiFactory.updateProfile = function(data) {
    console.log(data);
    return $http.post(urlBase + '/users/update', data);
  }

  apiFactory.getEducations = function(){
    return $http.get(urlBase + '/education/all');
  }
  
  return apiFactory;
});
