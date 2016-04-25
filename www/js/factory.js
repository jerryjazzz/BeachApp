/**
 * Created by varun on 19-03-2016.
 */
angular.module('DBApp.factory', [])
  .factory("ManageHeader", function ($localStorage, $q, $injector) {
    var timestampMarker = {
      request: function (config) {
        if (angular.isDefined($localStorage.lat) && angular.isDefined($localStorage.long)) {
          config.headers['lat'] = $localStorage.lat;
          config.headers['long'] = $localStorage.long;
          config.timeout = 5000;
        }
        else {
          var geoOptions = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true};
          navigator.geolocation.getCurrentPosition(function (position) {
            $localStorage.lat = position.coords.latitude;
            $localStorage.long = position.coords.longitude;
            config.headers['lat'] = $localStorage.lat;
            config.headers['long'] = $localStorage.long;
          }, function (err) {
            console.log(err);
          }, geoOptions);
          config.timeout = 5000;
        }
        return config;
      },
      requestError: function (error) {
        console.log(error);
      },
      response: function (response) {
        return response || $q.when(response);
      },
      responseError: function (rejection) {
        console.log(rejection);
        if (rejection.status === 500) {
          $injector.get('$ionicLoading').hide();
          alert("There was an issue fetching the data. Please Try again");
          $injector.get('$state').go("home");
        }
        else if (rejection.status === 0) {
          $injector.get('$ionicLoading').hide();
          alert("There was an issue fetching the data. Please Try again");
          $injector.get('$state').go("home");
        }
        return $q.reject(rejection);
      }
      //responseError:function(rejection){
      //  console.log(rejection);
      //},
      //response:function(response){
      //  if (response.status === 500){
      //    console.log("Error with Webservice");
      //  }
      //}
    };
    return timestampMarker;
  })
  .factory("HomeMenu", function ($http, $q, API_URL, IMG_URL, $localStorage) {
    var returnData = {};

    returnData.homeIcons = function () {
      var deferred = $q.defer();
      var URL = API_URL + "home-icons/";
      //console.log(URL);
      if (angular.isUndefined($localStorage.menu)) {
        $http.get(URL).success(function (response) {
          console.log(response);
          $localStorage.menu = response;
          deferred.resolve(response);
        }).error(function (err) {
          deferred.reject(err);
        });
      }
      else {
        deferred.resolve($localStorage.menu);
      }
      return deferred.promise;
    };
    returnData.getAmenities = function () {
      var deferred = $q.defer();
      var URL = API_URL + "home-icons/getAmenities/";
      console.log(URL);
      $http.get(URL).success(function (response) {
        //$localStorage.menu = response;
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    return returnData;

  })
  .factory("CatList", function ($http, $q, API_URL) {
    var returnData = {};
    returnData.catlist = function (id) {
      var deferred = $q.defer();
      var URL = API_URL + "category/fetchSubCategory/" + id;
      //console.log(URL);return false;
      $http.get(URL).then(function (response) {
        //console.log(JSON.stringify(response));
        deferred.resolve(response.data);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    return returnData;
  })
  .factory("detailData", function ($http, $q, API_URL) {
    var returnData = {};
    returnData.getData = function (id) {
      var deferred = $q.defer();
      var URL = API_URL + "establishment/detail/" + id;
      $http.get(URL).then(function (response) {
        deferred.resolve(response.data);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
    return returnData;
  })
  .factory("eventListing", function ($http, $q, API_URL) {
    var returnData = {};
    returnData.getListing = function (date) {
      var deferred = $q.defer();
      if (!date) {
        console.log("No Date Specified");
        date = "";
      }
      var URL = API_URL + "event/" + date;
      $http.get(URL).then(function (response) {
        deferred.resolve(response.data);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
    returnData.getEventDetail = function (id) {
      var deferred = $q.defer();
      var URL = API_URL + "event/detail/" + id;
      $http.get(URL).then(function (response) {
        deferred.resolve(response.data);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    returnData.getCompletedEvents = function () {
      var deferred = $q.defer();
      var URL = API_URL + "event/photos/";
      $http.get(URL).then(function (response) {
        deferred.resolve(response.data);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    return returnData;
  })
  .factory("dealListing", function ($http, $q, API_URL) {
    var returnData = {};
    returnData.getListing = function (date) {
      var deferred = $q.defer();
      if (!date) {
        console.log("No Date Specified");
        date = "";
      }
      var URL = API_URL + "deal/" + date;
      console.log(URL);
      $http.get(URL).then(function (response) {
        deferred.resolve(response.data);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    returnData.getDetail = function (dealId) {
      var deferred = $q.defer();
      if (dealId) {
        var URL = API_URL + "deal/detail/" + dealId;
        console.log(URL);
        $http.get(URL).then(function (response) {
          deferred.resolve(response.data);
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      }
      else {
        return false;
      }
    }
    return returnData;
  })
  .factory("priceRange", function ($q, $http, API_URL) {
    var returnData = {};
    returnData.get = function () {
      var deferred = $q.defer();
      var URL = API_URL + "price/";
      $http.get(URL).then(function (response) {
        deferred.resolve(response.data);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
    return returnData;
  })
  .factory("establishmentList", function ($q, $http, API_URL) {
    var returnData = {};
    returnData.getList = function () {
      var deferred = $q.defer();
      var URL = API_URL + "establishment/list/";
      //console.log(URL);
      $http.get(URL).then(function (response) {
        deferred.resolve(response.data);
      }, function (err) {
        deferred.reject(err);
      })
      return deferred.promise;
    };
    return returnData;
  })
;
