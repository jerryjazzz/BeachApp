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
  })

  .controller('HomeCtrl', function ($scope, $state, $stateParams, Icons) {
    $scope.HomeIcons = Icons.icons;
    console.log($scope.HomeIcons);
    $scope.goToCategory = function (name) {
      console.log(name);
      //return false;
      var id = 0;
      if (name == "EAT") {
        id = 1;
      }
      else if (name == "FITNESS") {
        id = 5;
      }
      if (id > 0) {
        $state.go("mainApp.category", {"id": id});
      }
      else {
        alert("Work in Progress");
      }

    }
  })
  .controller('catCtrl', function ($scope, $state, $stateParams, catList, $filter, $ionicScrollDelegate, $ionicPlatform) {
    var test = angular.element(document.getElementById("mapContent"));
    test.ready(function () {
      console.log(test[0].offsetTop);
      console.log(test[0].offsetHeight);
      $scope.contentHeight = test[0].offsetHeight + test[0].offsetTop;
      var mapDime = test[0].offsetHeight
      var mapDiv = angular.element(document.getElementsByClassName("angular-google-map-container"));
      console.log(mapDiv);
      mapDiv.css("height", mapDime + "px");
    });
    //console.log(test);
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
    $ionicPlatform.registerBackButtonAction(function ($event) {
      console.log($scope.goBack());
      $scope.$apply();
    }, 10000);

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
        console.log("Show the Categories");

        return true;
      }
      if ($scope.ShowHotelList) {
        if (!$scope.hasSubCategory) {
          $scope.ShowCategories = true;
          $scope.ShowHotelList = false;
          return true;
        }
        else {
          $scope.ShowSubCategories = true;
          $scope.ShowHotelList = false;
          return true;
        }
      }
    }


    $scope.showDetails = function (id) {
      $state.go("mainApp.detailView", {"id": id});
    }

  })
  .controller('detailCtrl', function ($scope, $state, $stateParams, detailData, $localStorage,$ionicHistory) {
    $scope.EstablishData = detailData.Data;
    console.log(detailData);
    $scope.map = {center: {latitude: $localStorage.lat, longitude: $localStorage.long}, zoom: 12, bounds: {}};
    $scope.options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    $scope.businessName = $scope.EstablishData.businessname;
    $scope.dataArr = {
      "Address": "address",
      "Phone No": "contact",
      "Price Range": "pricerange",
      "Category": "category",
      "Restaurant Type": "categorytype",
      "Details": "description"
    };
    console.log($scope.dataArr);
    console.log($scope.EstablishData);
    if ($scope.EstablishData.galleryimages !== ""){
      $scope.Gallery = JSON.parse($scope.EstablishData.galleryimages);
    }
    else{
      $scope.Gallery = [];
    }

    //$scope.MenuImages = JSON.parse($scope.EstablishData.menuImages);
    if ($scope.EstablishData.menuImages !== ""){
      //$scope.MenuImages = JSON.parse($scope.EstablishData.menuImages);
    }
    else{
      $scope.MenuImages = [];
    }
    console.log($scope.EstablishData.menuImages);

    $scope.call = function () {
      console.log($scope.EstablishData.contact);
    }
    $scope.goBack = function(){
      $ionicHistory.goBack();
    }
  });
