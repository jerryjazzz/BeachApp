// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('DBApp', ['ionic',
    'DBApp.controllers',
    'DBApp.directives',
    'DBApp.factory',
    'DBApp.filters',
    'DBApp.services',
    'uiGmapgoogle-maps',
    'ngStorage',
    'ngCordova',
  ])

  .run(function ($ionicPlatform, $rootScope, uiGmapIsReady, $ionicLoading, $localStorage) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      //$localStorage.lat = "";
      var geoOptions = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true};
      navigator.geolocation.getCurrentPosition(function (position) {
        $localStorage.lat = position.coords.latitude;
        $localStorage.long = position.coords.longitude;
      }, function (err) {
        console.log(err);
      }, geoOptions);

    });
    $rootScope.showMap = true;
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, options) {
      $ionicLoading.show({
        template: 'Please wait..'
      });
    });
    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      $ionicLoading.hide();
    })

  })

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl',
        resolve: {
          Icons: function (HomeMenu) {
            //console.log(HomeMenu.homeIcons());
            return HomeMenu.homeIcons();
          }
        }
      })
      .state('mainApp', {
        url: '/main',
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
        abstract: true,
      })
      .state('mainApp.category', {
        url: '/category/:id',
        params:{name:null},
        views: {
          'menuContent': {
            templateUrl: 'templates/category.html',
            controller: 'catCtrl',
            resolve: {
              catList: function (CatList, $stateParams) {
                var id = $stateParams.id;
                console.log($stateParams);
                return CatList.catlist(id);
              },
            }
          },
        }
      })
      .state('mainApp.detailView', {
        url: '/detail/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/detail.html',
            controller: 'detailCtrl',
            resolve: {
              detailData: function (detailData, $stateParams) {
                var id = $stateParams.id;
                return detailData.getData(id);
              },
            }
          },
        }
      })
      .state('mainApp.events', {
        url: '/events',
        views: {
          'menuContent': {
            templateUrl: 'templates/eventListing.html',
            controller: 'eventCtrl',
            resolve: {
              eventData: function (eventListing, $stateParams) {
                return eventListing.getListing();
              }
            }
          },
        }
      })
      .state('mainApp.eventDetail', {
        url: '/eventDetail/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/eventDetail.html',
            controller: 'eventDetailCtrl',
            resolve: {
              eventData: function (eventListing, $stateParams) {
                console.log($stateParams);
                var id = $stateParams.id
                return eventListing.getEventDetail(id);
              }
            }
          },
        }
      })
      .state('mainApp.deals', {
        url: '/deals',
        views: {
          'menuContent': {
            templateUrl: 'templates/dealListing.html',
            controller: 'dealCtrl',
            resolve: {
              dealData: function (dealListing, $stateParams) {
                return dealListing.getListing();
              }
            }
          },
        }
      });

    $ionicConfigProvider.tabs.position("bottom");
    $urlRouterProvider.otherwise('/home');
    //$httpProvider.defaults.headers.common["lat"] = "123456";
    //$httpProvider.defaults.headers.common["long"] = "123456";
    $httpProvider.interceptors.push("ManageHeader");
  })
  .constant("API_URL", "http://www.swaraasolutions.com/beachApp/api/")
  .constant("IMG_URL", "http://www.swaraasolutions.com")
  .constant("HOME_IMG_URL", "http://www.swaraasolutions.com/beachApp/images/");

