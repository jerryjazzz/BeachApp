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
  .controller('HomeCtrl', function ($scope, $state, $stateParams, Icons, $ionicHistory) {
    $ionicHistory.clearCache().then(function (response) {
      console.log("cache removed");
    });
    $scope.HomeIcons = Icons.icons;
    //console.log(Icons)
    $scope.goToCategory = function (name) {
      //return false;
      var id = 0;
      if (name == "EAT") {
        id = 1;
        //$state.go("mainApp.category", {"id": id});
        //return false;
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
      else if (name == "HAPPY HOUR") {
        id = 10;
      }
      else if (name == "FUN&SUN") {
        id = 12;
      }
      else if (name == "LODGING") {
        id = 14;
      }
      else if (name == "BEAUTY") {
        id = 17;
      }
      if (id > 0) {
        $state.go("mainApp.category", {"id": id, "name": name});
      }
      else {
        alert("Work in Progress");
      }

    }
  })
  .controller('detailCtrl', function ($scope, $ionicPlatform, $state, $timeout, $filter, $ionicPopup, $stateParams, detailData, $localStorage, $ionicPlatform, $ionicHistory, uiGmapGoogleMapApi, uiGmapIsReady, $ionicModal, $ionicSlideBoxDelegate, $ionicTabsDelegate) {
    console.log(detailData);
    $scope.control = {};
    $scope.vh = window.innerHeight;
    if (ionic.Platform.isIOS()) {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + 20 + "px";
    }
    else {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + "px";
    }
    $scope.mapOptions = {
      center: {latitude: 26.4611111, longitude: -80.0730556}, zoom: 12, bounds: {}, control: {}, events: {}
    };
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
    };
    $scope.markers.push(markerHotel);
    $scope.markers.push(markerCurrentLocation);
    $scope.businessName = $scope.EstablishData.businessname;
    $scope.dataArr = {
      "Price Range": "priceName",
      "Category": "category",
      "Restaurant Type": "categorytype",
      "Details": "description",
    };
    console.log($scope.EstablishData);
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService.route({
      origin: markerCurrentLocation.latitude + "," + markerCurrentLocation.longitude,
      destination: markerHotel.latitude + "," + markerHotel.longitude,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {

      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        alert("Unable to find a Route");
      }
    });
    uiGmapIsReady.promise(1).then(function (maps) {
    });

    if ($scope.EstablishData.galleryimages !== "") {
      var gallery = JSON.parse($scope.EstablishData.galleryimages);
      $scope.Gallery = gallery.thumbnail;
      //console.log($scope.Gallery);
      $scope.GalleryFull = gallery.original;
    }
    else {
      $scope.Gallery = [];
    }
    if ($scope.EstablishData.menuImages !== "") {
      //console.log($scope.EstablishData.menuImages);
      var menuImages = JSON.parse($scope.EstablishData.menuImages);
      $scope.MenuImages = menuImages.thumbnail;
      $scope.MenuFull = menuImages.original;
      //console.log($scope.MenuImages);
    }
    else {
      $scope.MenuImages = [];
    }

    $scope.call = function () {

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
    $scope.callNow = function () {
      if ($scope.EstablishData.contact) {
        var number = $filter('tel')($scope.EstablishData.contact);
        var template = '<div class="row">' +
          '<div class="col col-center" style="text-align:center;">' +
          '<h5 class="title">' + $scope.businessName + ': <br/> ' + number + '</h5></div></div>'
        var confirmPopup = $ionicPopup.confirm({
          title: '',
          template: template
        });

        confirmPopup.then(function (res) {
          if (res) {
            window.open('tel:' + $scope.EstablishData.contact, '_system', 'location=yes')
          } else {
            console.log("Nothing to do");
          }
        });
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
      $ionicSlideBoxDelegate.$getByHandle("Gallery").update();
    };

    $scope.createMenuModal = function () {
      $ionicTabsDelegate.select(2);
      $ionicModal.fromTemplateUrl('menuImages.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });
      $ionicSlideBoxDelegate.$getByHandle("MenuFull").update();
    };
    $scope.loadMenuFull = function (index) {
      if (index == null || angular.isUndefined(index)) {
        index = 1
      }
      $ionicSlideBoxDelegate.update();
      //$ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.slide(index);
      $scope.modal.show();
    }

    $scope.loadFullScreen = function (index) {
      if (index == null || angular.isUndefined(index)) {
        index = 1
      }
      //$ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.slide(index);
      $scope.modal.show();
    }
    $scope.CloseModal = function () {
      $scope.modal.hide();
    }
    $ionicPlatform.registerBackButtonAction(function ($event) {
      $scope.$apply();
    }, 10000);
    $scope.$on("$ionicView.beforeLeave", function () {
      $scope.showMap = false;
    });
    $scope.$on("$ionicView.enter", function () {
      $scope.showMap = true;
    });
  })
  .controller('eventCtrl', function ($scope, $state, $stateParams, eventData, $ionicHistory) {
    $scope.showListing = function () {
      return eventData.eventList.length > 0 ? true : false;
    }
    $scope.eventList = eventData.eventList;
    $scope.enableSearch = false;
    $scope.searchEnable = function () {
      if ($scope.enableSearch) {
        $scope.enableSearch = false;
      }
      else {
        $scope.enableSearch = true;
      }
    };
    $scope.Back = function () {
      $ionicHistory.goBack(-1);
    }
    $scope.openDetail = function (eventId) {
      $state.go("mainApp.eventDetail", {id: eventId});
    }
  })
  .controller('dealCtrl', function ($scope, $state, dealData, $ionicHistory) {
    $scope.showListing = dealData.dealList.length > 0 ? true : false;
    $scope.dealList = dealData.dealList;
    console.log($scope.dealList);
    $scope.Back = function () {
      $ionicHistory.goBack(-1);
    }
    $scope.goToEstablishment = function (id) {
      $state.go("mainApp.detailView", {id: id});
    }
    console.log($scope.dealList.length);
  })
  .controller('catCtrl', function ($scope, priceRange, $localStorage, $ionicPopup, $state, $stateParams, catList, $filter, $timeout, $ionicHistory, $ionicScrollDelegate, $ionicPlatform, uiGmapGoogleMapApi, uiGmapIsReady) {
    $scope.viewTitle = $stateParams.name;
    $scope.vh = window.innerHeight;
    if (ionic.Platform.isIOS()) {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + 20 + "px";
    }
    else {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + "px";
    }
    $scope.data = catList.CatList;
    $scope.ShowCategories = true;
    $scope.ShowSubCategories = false;
    $scope.ShowHotelList = false;
    $scope.markers = [];
    $scope.map = {center: {latitude: 26.4611111, longitude: -80.0730556}, zoom: 12, bounds: {}, control: {}};
    $scope.options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false
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
            //console.log(marker);
            $scope.markers.push(marker);
          })
        })
      }
    });
    $ionicPlatform.registerBackButtonAction(function ($event) {
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
      }
    };
    $scope.manageSubCategory = function (id, parent) {
      var Parent = $filter('filter')($scope.data, {'id': parent})[0];
      $scope.HotelList = [];
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
        $scope.showMap = false;
      }
      if ($scope.ShowSubCategories) {
        $scope.ShowCategories = true;
        $scope.ShowSubCategories = false;
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
    $scope.$on("$ionicView.beforeLeave", function () {
      $timeout(function () {
        $scope.showMap = false;
      });
    });
    $scope.$on("$ionicView.enter", function () {
      $timeout(function () {
        $scope.showMap = true;
      });
    });

    $scope.returnJson = function (data) {
      var newData = JSON.parse(data);
    }
    uiGmapIsReady.promise(1).then(function (maps) {
      var contentElem = angular.element(document.getElementById("detailContent"));
      contentElem.css("display", "none");
      google.maps.event.trigger(maps[0].map, 'resize');
      var mapDiv = angular.element(document.getElementsByClassName("angular-google-map-container"));
      var newTop = mapDiv[0].offsetHeight + mapDiv[0].offsetTop + 44;
      mapDiv.ready(function () {
        mapDiv.css("height", "40vh");
        var newTop = mapDiv[0].offsetHeight + mapDiv[0].offsetTop + 44;
      });
      contentElem.ready(function () {
        contentElem.css("top", newTop + "px");
        contentElem.css("display", "block");
      });
    });

    $scope.filterData = {};
    $scope.filterData.miles = "5";
    $scope.finalFilter = {};
    $scope.showFilters = function () {
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/filter.html',
        title: 'Filter Options',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Apply</b>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.filterData;
            }
          }
        ]
      });
      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });
    };
    $scope.greaterThan = function (prop, val) {
      return function (item) {
        return item[prop] > val;
      }
    }
    priceRange.get().then(function (response) {
      $scope.PriceRange = response.priceList;
      console.log($scope.PriceRange);
    })
    $scope.miles = ["5", "10", "15", "20", "25"];
  })
  .controller('eventDetailCtrl', function ($scope, $state, $stateParams, $ionicHistory, eventData, $cordovaCalendar, $filter, $ionicPopup) {
    $scope.Back = function () {
      $ionicHistory.goBack(-1);
    }
    $scope.eventDetail = eventData.eventDetail;
    console.log($scope.eventDetail);
    $scope.eventName = $scope.eventDetail.eventName;
    $scope.eventDetail.fullAddress = $scope.eventDetail.address + ", " + $scope.eventDetail.city + ", " + $scope.eventDetail.state;
    $scope.eventFinalData = {
      "Address": "fullAddress",
      "Description": "description",
      "Contact Person": "contactName",
    }
    var splitStartDate = $scope.eventDetail.startDate.split("-");
    var splitStartTime = $scope.eventDetail.startTime.split(":");
    var splitEndDate = $scope.eventDetail.endDate.split("-");
    var splitEndTime = $scope.eventDetail.endTime.split(":");
    //console.log(new Date(splitEndDate[0], splitEndDate[1] - 1, splitEndDate[2], splitEndTime[0], splitEndTime[1], 0, 0));
    $scope.startDateTime = new Date(splitStartDate[0], splitStartDate[1] - 1, splitStartDate[2], splitStartTime[0], splitStartTime[1], 0, 0);
    $scope.endDateTime = new Date(splitEndDate[0], splitEndDate[1] - 1, splitEndDate[2], splitEndTime[0], splitEndTime[1], 0, 0);
    $scope.createEvent = function () {
      $cordovaCalendar.createEventInteractively({
        title: $scope.eventDetail.eventName,
        location: $scope.fullAddress,
        notes: $scope.eventDetail.description,
        startDate: $scope.startDateTime,
        endDate: $scope.endDateTime
      }).then(function (result) {
        if (result) {

        }
      }, function (err) {
        console.log("err", err);
      });
    }
    $scope.callNow = function () {
      if ($scope.eventDetail.contactNumber !== "") {
        var number = $filter('tel')($scope.eventDetail.contactNumber);
        var template = '<div class="row">' +
          '<div class="col col-center" style="text-align:center;">' +
          '<h5 class="title">' + $scope.eventDetail.contactName + ': <br/> ' + number + '</h5></div></div>'
        var confirmPopup = $ionicPopup.confirm({
          title: '',
          template: template
        });

        confirmPopup.then(function (res) {
          if (res) {
            window.open('tel:' + $scope.eventDetail.contactNumber, '_system', 'location=yes')
          } else {
            console.log("Nothing to do");
          }
        });
      }
    }
    $scope.openEventLink = function () {
      if ($scope.eventDetail.eventLink) {
        //console.log($scope.eventDetail.eventLink);
        window.open($scope.eventDetail.eventLink, "_blank", "location=yes");
      }
      else {
        alert("Event Link not available");
      }
    }
    $scope.openWebLink = function () {
      if ($scope.eventDetail.website) {
        //console.log($scope.eventDetail.eventLink);
        window.open($scope.eventDetail.website, "_blank", "location=yes");
      }
      else {
        alert("Website not available");
      }
    }
    $scope.navigate = function () {
      if (window.launchnavigator) {
        launchnavigator.navigate(
          [$scope.eventDetail.lat, $scope.eventDetail.lng],
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
  });
