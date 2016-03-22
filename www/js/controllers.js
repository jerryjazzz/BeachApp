angular.module('DBApp.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicHistory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
    $scope.goBack = function () {
      //console.log("I am working");
      //console.log($ionicHistory.viewHistory());
      //$ionicHistory.goBack();
    }
  })

  .controller('HomeCtrl', function ($scope, $state, $stateParams, Icons) {
    $scope.HomeIcons = Icons.icons;
  })
  .controller('catCtrl', function ($scope, $state, $stateParams, catList, $filter, $ionicScrollDelegate, $ionicPlatform) {
    var mapDiv = angular.element(document.getElementById("mapcontent"));
    console.log(mapDiv);
    $scope.data = catList.CatList;
    console.log($scope.data);
    $scope.ShowCategories = true;
    $scope.ShowSubCategories = false;
    $scope.ShowHotelList = false;
    $scope.markers = [];
    $scope.map = {center: {latitude: 26.4611111, longitude: -80.0730556}, zoom: 12, bounds: {}};
    $scope.options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    $scope.HotelList = [];
    angular.forEach($scope.data, function (value, key) {
      var pushData = {'icon': 'blue_marker', 'data': value.HotelList};
      $scope.HotelList = $scope.HotelList.concat(pushData);
    });
    $scope.$watch("ShowCategories", function (newValue, oldValue) {
      if (newValue) {
        $scope.HotelList = [];
        angular.forEach($scope.data, function (value, key) {
          var pushData = {'icon': 'blue_marker', 'data': value.HotelList};
          $scope.HotelList = $scope.HotelList.concat(pushData);
        });
      }
    });
    $scope.$watch("HotelList", function (newValue, oldValue) {
      if (newValue) {
        console.log(newValue);
        $scope.markers = [];
        angular.forEach(newValue, function (value, key) {
          var icon = value.icon;
          angular.forEach(value.data, function (v1, k1) {
            var marker = {};
            marker = {
              latitude: v1.lat,
              longitude: v1.lng,
              title: v1.businessname,
              id: v1.id,
              icon: 'img/' + icon + '.png'
            };
            $scope.markers.push(marker);
          })
        })
      }
    });
    $ionicPlatform.onHardwareBackButton(function () {
      event.preventDefault();
      event.stopPropagation();
      $scope.goBack();
      return true;
    });


    $scope.openList = function (index, id) {
      var SubCount = $scope.data[index].subCategoryList.length;
      var hotelData = $scope.data[index].HotelList;
      var catData = $scope.data[index];

      if (SubCount > 0) {
        $scope.hasSubCategory = true;
        $scope.HotelList = [];
        var data = $filter('filter')(hotelData, {'subcategory': id});
        var pushData = {'icon': 'blue_marker', 'data': data};
        $scope.HotelList = $scope.HotelList.concat(pushData);
        $scope.ShowCategories = false;
        $scope.ShowSubCategories = true;
        $scope.subCategories = catData.subCategoryList;
        //$ionicScrollDelegate.resize();
      }
      else {
        $scope.hasSubCategory = false;
        $scope.ShowCategories = false;
        $scope.ShowSubCategories = false;
        $scope.HotelList = [];
        var hotelData = $filter('filter')(hotelData, {'subcategory': id});
        var pushData = {'icon': 'blue_marker', 'data': hotelData};
        $scope.HotelList = $scope.HotelList.concat(pushData);
        //$scope.HotelList = hotelData;
        $scope.ShowHotelList = true;
        //$ionicScrollDelegate.resize();
      }
    };

    $scope.manageSubCategory = function (id, parent) {
      console.log(id);
      console.log(parent);
      var Parent = $filter('filter')($scope.data, {'id': parent})[0];
      $scope.HotelList = [];
      console.log(Parent);
      $scope.ShowSubCategories = false;
      $scope.ShowCategories = false;
      $scope.ShowHotelList = true;


      var hotelData = $filter('filter')(Parent.HotelList, {'categorytype': id})
      var pushData = {'icon': 'blue_marker', 'data': hotelData};
      $scope.HotelList = $scope.HotelList.concat(pushData);
      //$ionicScrollDelegate.resize();
    };
    $scope.goBack = function () {
      if ($scope.ShowCategories) {
        $state.go("home");
      }
      if ($scope.ShowSubCategories) {

        $scope.ShowCategories = true;
        $scope.ShowSubCategories = false;
      }
      if ($scope.ShowHotelList) {
        if (!$scope.hasSubCategory) {
          $scope.ShowCategories = true;
          $scope.ShowHotelList = false;
        }
        else {
          $scope.ShowSubCategories = true;
          $scope.ShowHotelList = false;
        }
      }
    }

  });
