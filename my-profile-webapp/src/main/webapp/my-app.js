'use strict';

(function() {
    
    app.config(['$routeProvider',function($routeProvider, $locationProvider) {
        $routeProvider.
         when('/settings', {templateUrl: 'partials/settings.html'}).
         when('/contact-info', {templateUrl: 'partials/contact-info.html'}).
         when('/main', {templateUrl: 'partials/main.html'}).
         when('/local', {templateUrl: 'partials/local-address.html'}).
         when('/local/adminLookup', {templateUrl: 'partials/admin-lookup.html'}).
         when('/emergencyContact', {templateUrl: 'partials/emergency-contact.html'}).
         otherwise({
             redirectTo: '/main'
         });
         }
    ]);
    
    //controllers
    
    app.controller('ContactInformationController', ['$localStorage','$scope', 'profileService', function($localStorage, $scope, profileService) {
        $scope.contactInfo = [];
        profileService.getContactInfo().then(function(result){
            $scope.contactInfo = result.data;
        });
        
      } ]);
    
    app.controller('LocalContactAdminController', ['$scope', 'profileService', function($scope, profileService){
        //init function
        var init = function() {
            $scope.error = "";
            $scope.empty = false;
            $scope.result = [];
            $scope.searchTerm = "";
            $scope.searchResultLimitIncrementor=10;
            $scope.searchResultLimit = $scope.searchResultLimitIncrementor;
        };
          
          //scope functions
          $scope.search = function() {
            $scope.empty=false;
            $scope.result = [];
            $scope.searchResultLimit = $scope.searchResultLimitIncrementor;
            profileService.searchUsersLastNameAndNetId($scope.searchTerm).then(function(result){
              $scope.result = result.data;
              angular.forEach($scope.result.addresses, function(value, key, obj){
                value.edit = false;
                value.readOnly=true;
              });
              if($scope.result && $scope.result.people && $scope.result.people.length === 0){
                  $scope.empty = true;
              }
            }, function(data){
              console.warn("Error looking up search term");
              if(data.status === 403) {
                $scope.error = "You do not have access to this module, if you feel this is incorrect please contact your supervisor.";
              } else {
                $scope.error = "Issue looking up contact information, please try again later.";
              }
            });
          };
        
        $scope.lookupUser = function(netIdToLookup, index) {
          profileService.searchLocalContactInfo(netIdToLookup).then(function(result){
            $scope.result.people[index].contactInformation = result.data;
            angular.forEach($scope.result.people[index].contactInformation.addresses, function(value, key, obj){
              value.edit = false;
              value.readOnly=true;
            });
            $scope.empty = result.data && result.data.addresses.length === 0;
          }, function(data){
            console.warn("Error looking up netId");
            if(data.status === 403) {
              $scope.error = "You do not have access to this module, if you feel this is incorrect please contact your supervisor.";
            } else {
              $scope.error = "Issue looking up contact information, please try again later.";
            }
          });
        };
        
        $scope.reset = function(){init();};
        init();
        
    }]);
    
    app.controller('LocalContactInformationController', ['$localStorage','$scope', 'profileService', function($localStorage, $scope, profileService) {
        //scope functions
        $scope.addEdit = function() {
          $scope.contactInfo.addresses.push({ addressLines : [""], edit : true})
        }
        
        $scope.save = function() {
            $scope.notSaving = false;
            $scope.error = "";
            profileService.saveLocalContactInfo($scope.contactInfo)
                .then(function(result){//success
                    $scope.contactInfo = result.data;
                    angular.forEach($scope.contactInfo.addresses, function(value, key, obj){
                        value.edit = false;
                    });
                    $scope.notSaving = true;
                },function(data, status){//error
                    $scope.notSaving = true;
                    $scope.error = "There was an issue saving your address, please try again later."
                });
        }
        
        $scope.deleteAddress = function(index) {
            $scope.contactInfo.addresses.splice(index,1);
            $scope.save();
        };
        
        $scope.cancel = function() {
            init();
        }
        
        //local functions
        var init = function() {
            $scope.contactInfo = [];
            $scope.error = "";
            $scope.notSaving = true;
            profileService.getLocalContactInfo()
                .then(
                  function(result){//success
                    $scope.contactInfo = result.data;
                    //clear out any editing that may have been saved
                    angular.forEach($scope.contactInfo.addresses, function(value, key, obj){
                        value.edit = false;
                    })
                }, function(result, status){//error
                  $scope.contactInfo = {};
                  $scope.error = "There was an issue getting your local address information. Please try again later.";
              });
        }
        
        //run init
        init();
      } ]);
      
      app.controller('BasicInformationController', ['$localStorage','$scope', 'profileService', function($localStorage, $scope, profileService) {
          $scope.basicInfo = [];
          profileService.getBasicInfo().then(function(result){
              $scope.basicInfo = result.data.basicInfo;
          });
          
      } ]);
      
      app.controller('EmergencyInformationController', ['$localStorage','$scope', 'profileService', function($localStorage, $scope, profileService) {
          $scope.emergencyContacts = [];
          profileService.getEmergencyInfo().then(function(result){
              $scope.emergencyContacts = result.data.emergencyContacts;
          });
          
      }]);
      
      /// directives
      
      app.directive('contactInfo', function() {
          return {
            restrict : 'E',
            templateUrl : 'partials/contact-info.html'
          }
        });
      
      app.directive('basicInfo', function() {
          return {
            restrict : 'E',
            templateUrl : 'partials/basic-info.html'
          }
        });
      
      app.directive('address', function() {
          return {
            restrict : 'E',
            templateUrl : 'partials/address.html'
          }
        });
      
      app.directive('user', function() {
          return {
            restrict : 'E',
            templateUrl : 'partials/user.html'
          }
        });
      
      app.directive('emergencyInfo', function() {
          return {
            restrict : 'E',
            templateUrl : 'partials/emergency-info.html'
          }
        });

      //service
      
      app.factory('profileService', function($http, miscService) {
          //var contactInfoPromise = $http.get('/profile/samples/contact-info.json');
          var contactInfoPromise = $http.get('/profile/api/contactInfo.json');
          var basicInfoPromise = $http.get('/profile/samples/basic-info.json');
          var emergencyInfoPromise = $http.get('/profile/samples/emergency-info.json');
        
          var getContactInfo = function() {
              return contactInfoPromise.success(
                 function(data, status) { //success function
                     return data;
                 }).error(function(data, status) { // failure function
                 miscService.redirectUser(status, "Get contact info");
              });
          }
          
          var getLocalContactInfo = function() {
              return $http.get('/profile/api/localContactInfo/get.json').success(
                 function(data, status) { //success function
                     return data;
                 }).error(function(data, status) { // failure function
                 miscService.redirectUser(status, "Get local contact info");
              });
          }
          
          var searchUsersLastNameAndNetId = function(searchTerm){          
            return $http.get('/profile/api/localContactInfo/searchUsers?searchTerm=' + searchTerm).success(
              function(data, status) { //success function
                return data.data;
              }).error(function(data, status) { // failure function
                miscService.redirectUser(status, "Search admin local contact info");
              });
            };
          
          var searchLocalContactInfo = function(netIdToLookup) {
              return $http.get('/profile/api/localContactInfo/adminLookup?netId=' + netIdToLookup).success(
                  function(data, status) { //success function
                      return data;
                  }).error(function(data, status) { // failure function
                  miscService.redirectUser(status, "Search admin local contact info");
              });
          };
          
          var saveLocalContactInfo = function (contactInfo) {
              contactInfo.lastModified = null;
              return $http.post('/profile/api/localContactInfo/set',contactInfo).success(
                  function(data, status) { //success function
                      return data;
                  }).error(function(data, status) { // failure function
                  miscService.redirectUser(status, "Get local contact info");
               });
          };
          
          var getBasicInfo = function() {
              return basicInfoPromise.success(
                 function(data, status) { //success function
                     return data.basicInfo;
                 }).error(function(data, status) { // failure function
                 miscService.redirectUser(status, "Get basic info");
              });
          }
          
          var getEmergencyInfo = function() {
              return emergencyInfoPromise.success(
                 function(data, status) { //success function
                     return data.emergencyContacts;
                 }).error(function(data, status) { // failure function
                 miscService.redirectUser(status, "Get emergency info");
              });
          }
        
          return {
            getContactInfo : getContactInfo,
            getLocalContactInfo : getLocalContactInfo,
            saveLocalContactInfo : saveLocalContactInfo,
            searchUsersLastNameAndNetId : searchUsersLastNameAndNetId,
            searchLocalContactInfo : searchLocalContactInfo,
            getBasicInfo   : getBasicInfo,
            getEmergencyInfo : getEmergencyInfo
          }
        });
})();
