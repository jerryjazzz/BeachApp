angular.module('DBApp.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicHistory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    //$scope.loginData = {};
    //
    //// Create the login modal that we will use later
    //$ionicModal.fromTemplateUrl('templates/login.html', {
    //  scope: $scope
    //}).then(function (modal) {
    //  $scope.modal = modal;
    //});
    //
    //// Triggered in the login modal to close it
    //$scope.closeLogin = function () {
    //  $scope.modal.hide();
    //};
    //
    //// Open the login modal
    //$scope.login = function () {
    //  $scope.modal.show();
    //};
    //
    //// Perform the login action when the user submits the login form
    //$scope.doLogin = function () {
    //  console.log('Doing login', $scope.loginData);
    //
    //  // Simulate a login delay. Remove this and replace with your login
    //  // code if using a login system
    //  $timeout(function () {
    //    $scope.closeLogin();
    //  }, 1000);
    //};
  })

  .controller('HomeCtrl', function ($scope, $state, $stateParams, Icons) {
    $scope.HomeIcons = Icons.icons;
    //console.log($scope.HomeIcons);
    $scope.goToCategory = function (name) {
      console.log(name);
      //return false;
      var id = 0;
      if (name == "EAT") {
        id = 1;
        $state.go("mainApp.category", {"id": id});
        return false;
      }
      else if (name == "FITNESS") {
        id = 5;
      }
      else if (name == "EVENT") {
        $state.go("mainApp.events");
        return true;
      }
      else if (name == "DISCOUNT") {
        $state.go("mainApp.deals");
        return true;
      }
      if (id > 0) {
        $state.go("mainApp.category", {"id": id});
      }
      else {
        alert("Work in Progress");
      }

    }
  })
  .controller('catCtrl', function ($scope, $state, $stateParams, catList, $filter, $ionicHistory, $ionicScrollDelegate, $ionicPlatform, uiGmapGoogleMapApi, uiGmapIsReady) {
    $scope.data = catList.CatList;
    console.log(JSON.stringify($scope.data));
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
      console.log($ionicHistory.viewHistory());
      $state.go("mainApp.detailView", {"id": id});
    }
  })
  .controller('detailCtrl', function ($scope, $state, $stateParams, detailData, $localStorage,$ionicPlatform, $ionicHistory, uiGmapGoogleMapApi, uiGmapIsReady, $ionicModal, $ionicSlideBoxDelegate, $ionicTabsDelegate) {
    uiGmapGoogleMapApi.then(function (maps) {
    });
    $scope.map = {center: {latitude: 26.4611111, longitude: -80.0730556}, zoom: 12, bounds: {}};
    $scope.options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false
    };
    $scope.EstablishData = detailData.Data;
    $scope.markers = [];
    var markerHotel = {
      latitude: $scope.EstablishData.lat,
      longitude: $scope.EstablishData.lng,
      title: $scope.EstablishData.businessname,
      id: $scope.EstablishData.id,
      icon: 'img/blue_marker.png'
    };
    var markerCurrentLocation = {
      latitude: $localStorage.lat,
      longitude: $localStorage.long,
      title: 'Current Location',
      id: 100000,
    }
    $scope.markers.push(markerHotel);
    $scope.markers.push(markerCurrentLocation);
    $scope.businessName = $scope.EstablishData.businessname;
    $scope.dataArr = {
      "Price Range": "pricerange",
      "Category": "category",
      "Restaurant Type": "categorytype",
      "Details": "description",
    };
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService.route({
      origin: markerCurrentLocation.latitude + "," + markerCurrentLocation.longitude,
      destination: markerHotel.latitude + "," + markerHotel.longitude,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
      console.log("MapResponse", response);
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        alert("Unable to find a Route");
      }
    });
    uiGmapIsReady.promise().then(function (maps) {
      google.maps.event.trigger(maps[0].map, 'resize');
      directionsDisplay.setMap(maps[0].map);
    });
    if ($scope.EstablishData.galleryimages !== "") {
      $scope.Gallery = JSON.parse($scope.EstablishData.galleryimages);
    }
    else {
      $scope.Gallery = [];
    }
    if ($scope.EstablishData.menuImages !== "") {
    }
    else {
      $scope.MenuImages = [];
    }
    console.log($scope.EstablishData.menuImages);

    $scope.call = function () {
      console.log($scope.EstablishData.contact);
    }
    $scope.Back = function () {
      console.log($ionicHistory.viewHistory());
      $ionicHistory.goBack(-1);
      $ionicPlatform.offHardwareBackButton();
    }
    $scope.navigate = function () {
      if (window.launchnavigator) {
        launchnavigator.navigate(
          [$scope.EstablishData.lat, $scope.EstablishData.lng],
          null,
          function () {
            console.log("Map Opened Successfully")
          },
          function (error) {
            console.log("Error Opening Navigation");
          });
      } else {
        console.log("Launch Navigator is not available");
      }
    };
    $scope.fullAddress = $scope.EstablishData.address + ", " + $scope.EstablishData.city + ", " + $scope.EstablishData.state;
    $scope.callNow = function (number) {
      if (number) {
        window.open('tel:' + number, '_system', 'location=yes')
      }
      else {
        alert("Number not available");
      }


    };
    $scope.createModal = function () {
      $ionicTabsDelegate.select(1);
      $ionicModal.fromTemplateUrl('image-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });
    };

    $scope.loadFullScreen = function (index) {
      if (index == null || angular.isUndefined(index)) {
        index = 1
      }
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.slide(index);

      $scope.modal.show();
    }
    $scope.CloseModal = function () {
      $scope.modal.hide();
    }
    $ionicPlatform.registerBackButtonAction(function ($event) {
      console.log($scope.Back());
      $scope.$apply();
    }, 10000);
  })
  .controller('eventCtrl', function ($scope, $state, $stateParams, eventData, $ionicHistory) {
    $scope.showListing = function () {
      return eventData.eventList.length > 0 ? true : false;
    }
    $scope.eventList = eventData.eventList;
    console.log($scope.eventList);
    $scope.enableSearch = false;
    $scope.searchEnable = function () {
      if ($scope.enableSearch) {
        $scope.enableSearch = false;
      }
      else {
        $scope.enableSearch = true;
      }
    }
    $scope.Back = function () {
      $ionicHistory.goBack(-1);
    }
  })
  .controller('dealCtrl', function ($scope, $state, dealData, $ionicHistory) {
    $scope.showListing = dealData.dealList.length > 0 ? true : false;
    $scope.dealList = dealData.dealList;
    console.log($scope.dealList);
    $scope.Back = function () {
      $ionicHistory.goBack(-1);
    }
  })
;
