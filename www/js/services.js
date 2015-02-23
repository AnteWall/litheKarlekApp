angular.module('starter.services', [])

.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])

.factory('apiFactory', function($http,store){

  //var urlBase = 'http://192.168.1.102:3000/api';
  var urlBase = 'http://localhost:3000/api';
  //var urlBase = 'http://lithekarlek.klante.webfactional.com/api';
  var apiFactory = {};

  apiFactory.getProfile = function(id) {
    if(id != undefined){
      return $http.get(urlBase + '/users/' + id); 
    }
    return $http.get(urlBase + '/users/me'); 
  }
  
  apiFactory.updateProfile = function(data) {
    return $http.post(urlBase + '/users/update', data);
  }

  apiFactory.updateSettings = function(data){
    return $http.post(urlBase + '/users/settings/update', data);
  }

  apiFactory.getEducations = function(){
    return $http.get(urlBase + '/education/all');
  }

  apiFactory.getUserImages = function(){
    return $http.get(urlBase + '/images/me');
  }

  apiFactory.deleteImage = function(id){
    return $http.get(urlBase + '/image/'+ id + '/delete');
  }

  apiFactory.findMatches = function(){
    return $http.get(urlBase + '/matches/find');
  }
  
  apiFactory.reportMatch = function(data){
    return $http.post(urlBase + '/report/',data);
  }

  apiFactory.uploadImage = function(imageURI,suCall,erCall){

    var ft = new FileTransfer(),
    options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.headers = {"Authorization" : store.get('token')}
    options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
       "description": "Uploaded from my phone",
    };
    ft.upload(imageURI, urlBase + "/image/new",suCall,erCall, options);
  }
  
  return apiFactory;
});
