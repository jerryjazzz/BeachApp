angular.module('DBApp.controllers', [])
  .controller('AppCtrl', function ($scope, $state, $ionicModal, $timeout, $ionicHistory, HomeMenu) {

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
    $scope.goHome = function () {
      $state.go("home");
    }
  })
  .controller('HomeCtrl', function ($scope, $state, $stateParams, Icons, $ionicHistory, HomeMenu, $localStorage, $filter) {
    $ionicHistory.clearCache().then(function (response) {
      console.log("cache removed");
    });
    $scope.HomeIcons = Icons.icons;
    $scope.$watch("HomeIcons", function (oldvalue, newvalue) {
      if (newvalue) {
        if (navigator && navigator.splashscreen) {
          navigator.splashscreen.hide();
        }
      }

    });
    $scope.goToCategory = function (name, id) {
      //return false;
      console.log(name);
      if (name == "THE AVE") {
        $state.go("mainApp.theAve");
        return false;
      } else if (name == "PHOTOS") {
        $state.go("mainApp.completedEventsListing");
        return false;
      } else if (name == "MAP") {
        $state.go("mainApp.maps");
        return false;
      } else if (name == "EVENT") {
        $state.go("mainApp.events");
        return true;
      }
      else if (name == "DISCOUNT") {
        $state.go("mainApp.deals");
        return true;
      }
      else {
        //var Data = {};
        var finalData = $filter('filter')($localStorage.allData, {id: parseInt(id)}, true);
        console.log(finalData);
        var Data = finalData[0];
        var name = Data.name;
        var newData = Data.details
        console.log(newData);
        $state.go("mainApp.category", {"id": id, "name": name, "data": newData});
      }
    };
    console.log($ionicHistory.viewHistory())


  })
  .controller('detailCtrl', function ($scope, $ionicGesture, $ionicPlatform, $sce, $state, $ionicScrollDelegate, $timeout, $filter, $ionicPopup, $stateParams, Data, $localStorage, $ionicPlatform, $ionicHistory, uiGmapGoogleMapApi, uiGmapIsReady, $ionicModal, $ionicSlideBoxDelegate, $ionicTabsDelegate) {
    console.log(Data);
    $scope.EstablishData = Data.Data;
    if ($scope.EstablishData.menuImages == "") {
      console.log("i am null");
    }
    if ($scope.EstablishData.galleryimages !== "" || $scope.EstablishData.galleryimages !== null) {
      $scope.hasGallery = true;
    }
    else {
      $scope.hasGallery = false;
    }
    if ($scope.EstablishData.menuImages == "" || $scope.EstablishData.menuImages == null) {
      $scope.hasMenu = false;
    }
    else {
      $scope.hasMenu = true;
    }
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
      disableDefaultUI: true
    };
    //$scope.EstablishData = detailData.Data;

    $scope.amenities = $scope.EstablishData.amenities;
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
      "Category": "subCategoryName",
      "Type": "categoryTypeName",
      //"Details": "description",
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

    if ($scope.EstablishData.galleryimages !== "" && $scope.EstablishData.galleryimages !== null) {
      var gallery = JSON.parse($scope.EstablishData.galleryimages);
      $scope.Gallery = gallery.thumbnail;
      $scope.GalleryFull = gallery.original;
    }
    else {
      $scope.Gallery = [];
    }
    if ($scope.EstablishData.menuImages !== "" && $scope.EstablishData.menuImages !== null) {
      var menuImages = JSON.parse($scope.EstablishData.menuImages);
      $scope.MenuImages = menuImages.thumbnail;
      $scope.MenuFull = menuImages.original;
    }
    else {
      $scope.MenuImages = [];
    }
    $scope.Back = function () {
      console.log($ionicHistory.viewHistory());
      $ionicHistory.goBack(-1);
      //$ionicPlatform.offHardwareBackButton();
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
          '<h5 class="title" style="font-size:1em; font-weight:bold;">' + number + '</h5><p> Are you sure you want to call?</p></div></div>'
        var confirmPopup = $ionicPopup.confirm({
          title: $scope.businessName,
          template: template,
          cancelText: 'No',
          okText: 'Yes'
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
    $scope.showModal = function (index, type) {
      var templateUrl = "";
      if (type == "menu") {
        templateUrl = "templates/detailMenus.html";
      }
      else if (type == "photos") {
        templateUrl = "templates/detailPhotos.html";
      }

      if (templateUrl !== "") {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
          $ionicSlideBoxDelegate.slide(index);
          $scope.activeSlide = index;
        })
      }
    };
    $scope.CloseModal = function () {
      $scope.modal.hide();
    }

    $scope.zoomMin = 1;
    $scope.updateSlideStatus = function (slide) {
      console.log(slide);
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };

    //$scope.createModal = function () {
    //  $ionicModal.fromTemplateUrl('templates/detailPhotos.html', {
    //    scope: $scope,
    //    animation: 'slide-in-up'
    //  }).then(function (modal) {
    //    $scope.modal = modal;
    //    console.log(modal);
    //  });
    //  $timeout(function () {
    //    $ionicSlideBoxDelegate.$getByHandle("Gallery").update();
    //    console.log("Updated Successfully");
    //  });
    //};
    //
    //$scope.createMenuModal = function () {
    //  //$ionicTabsDelegate.select(2);
    //
    //  $ionicModal.fromTemplateUrl('templates/detailMenus.html', {
    //    scope: $scope,
    //    animation: 'slide-in-up'
    //  }).then(function (modal) {
    //    $scope.modal = modal;
    //    console.log(document.getElementById("testId"));
    //    var testElem = angular.element(document.getElementById("testId"));
    //  });
    //  $ionicSlideBoxDelegate.$getByHandle("MenuFull").update();
    //};
    //$scope.loadMenuFull = function (index) {
    //
    //  console.log(JSON.stringify(testElem));
    //  $ionicGesture.on("pinch", function (e) {
    //    console.log(e.gesture.scale)
    //  }, testElem);
    //  if (index == null || angular.isUndefined(index)) {
    //    index = 1
    //  }
    //  $ionicSlideBoxDelegate.update();
    //  //$ionicSlideBoxDelegate.update();
    //  $ionicSlideBoxDelegate.slide(index);
    //  $scope.modal.show();
    //}
    //
    //$scope.loadFullScreen = function (index) {
    //  if (index == null || angular.isUndefined(index)) {
    //    index = 1
    //  }
    //  //$ionicSlideBoxDelegate.$getByHandle("Gallery").update();
    //  $ionicSlideBoxDelegate.slide(index);
    //  $scope.modal.show();
    //}
    //$scope.CloseModal = function () {
    //  $scope.modal.hide();
    //}
    //$ionicPlatform.registerBackButtonAction(function ($event) {
    //  $scope.$apply();
    //}, 10000);
    $scope.$on("$ionicView.beforeLeave", function () {
      $scope.showMap = false;
    });
    $scope.$on("$ionicView.enter", function () {
      $scope.showMap = true;
    });

    $scope.goHome = function () {
      $state.go("home");
    }
    //$scope.updateSlideStatus = function (slide) {
    //  if (angular.isUndefined($scope.activeSlide)) {
    //    slide = 0;
    //  }
    //  var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    //  if (zoomFactor == $scope.zoomMin) {
    //    $ionicSlideBoxDelegate.enableSlide(true);
    //  } else {
    //    $ionicSlideBoxDelegate.enableSlide(false);
    //  }
    //};
    //$scope.zoomMin = 1;
    //$scope.slideChanged = function (index) {
    //  console.log(index);
    //  $scope.activeSlide = index;
    //}
    //$scope.Zoomed = false;
    //$scope.changeStyle = function (event, index) {
    //  var elem = angular.element(event.target);
    //  if (!$scope.Zoomed) {
    //    $scope.Zoomed = true;
    //    elem.css("width", "auto");
    //    $ionicSlideBoxDelegate.$getByHandle("MenuFull").enableSlide(false);
    //  }
    //  else {
    //    $scope.Zoomed = false;
    //    elem.css("width", "100%");
    //    $ionicSlideBoxDelegate.$getByHandle("MenuFull").enableSlide(true);
    //  }
    //}
    $scope.openLink = function (link) {
      console.log(link);
      link = $filter('webLink')(link);
      window.open(link, "_blank", "location=yes");
    };


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
    $scope.goHome = function () {
      $state.go("home");
    }
  })
  .controller('dealCtrl', function ($scope, $state, dealData, $ionicHistory) {
    $scope.showListing = dealData.dealList.length > 0 ? true : false;
    $scope.dealList = dealData.dealList;
    console.log($scope.dealList);
    $scope.Back = function () {
      $ionicHistory.goBack(-1);
    }
    $scope.showDetails = function (id, data) {
      console.log(data);
      $state.go("mainApp.dealsDetail", {id: id, data: data});
    }
    //$scope.goToEstablishment = function (id) {
    //  $state.go("mainApp.detailView", {id: id});
    //}
    console.log($scope.dealList.length);
  })
  .controller('catCtrl', function ($scope, $state, $ionicHistory, $stateParams, CatList, $filter, $localStorage) {

    if ($stateParams.data == null) {
      console.log($stateParams);
      CatList.catlist($stateParams.id).then(function (response) {
        $scope.data = response.data;
        $scope.viewTitle = response.name;
      })
    }
    else {
      $scope.data = $stateParams.data;
      $scope.viewTitle = $stateParams.name;
    }
    $scope.markers = [];
    $scope.map = {center: {latitude: 26.4611111, longitude: -80.0730556}, zoom: 12, bounds: {}, control: {}};
    //$scope.map = {center: {lat: 26.4611111, lng: -80.0730556}, zoom: 12, bounds: {}, control: {}};
    $scope.options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    $scope.vh = window.innerHeight;
    if (ionic.Platform.isIOS()) {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + 20 + "px";
    }
    else {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + "px";
    }
    $scope.HotelList = [];
    $scope.markers = [];
    if ($scope.data) {
      angular.forEach($scope.data, function (value, key) {
        //console.log(value.iconName);
        var iconName = value.iconName;
        angular.forEach(value.HotelList, function (v1, k1) {
          //console.log(v1);
          var marker = {};
          marker = {
            latitude: v1.lat,
            longitude: v1.lng,
            title: v1.businessname,
            id: v1.id,
            options: {
              icon: {
                path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
                fillColor: '#E91E63',
                fillOpacity: 1,
                strokeColor: '',
                strokeWeight: 0
              },
              map_icon_label: '<span class="map-icon ' + iconName + '"></span>'
              //labelContent: '<span class="map-icon map-icon-point-of-interest"></span>',
              //shadow: "none"
            },

          };
          $scope.markers.push(marker);
        })

      });
    }
    $scope.openList = function (data) {
      if (data.subCategoryList.length > 0) {
        $state.go("mainApp.subCategory", {id: data.id, data: data});
      }
      else {
        var category = data.parent;
        var catData = $filter('filter')($localStorage.menu.icons, {'cat_id': category});
        if (catData[0].name == "PARKING TRANSPORT") {
          $scope.List = $filter('filter')(data.HotelList, {category: category});
        }
        else {
          $scope.List = $filter('filter')(data.HotelList, {subcategory: data.id});
        }
        $state.go("mainApp.establishment", {data: $scope.List, name: data.name});
      }
    }
    $scope.goBack = function () {
      $ionicHistory.goBack(-1);
    }

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
    $scope.TextDescription = String($scope.eventDetail.description).replace(/<br\s*[\/]?>/gi, "\n")
    $scope.TextDescription = String($scope.TextDescription).replace(/<[^>]+>/gm, '');
    $scope.TextDescription = String($scope.TextDescription).replace(/&nbsp;/gi, ' ');
    $scope.createEvent = function () {
      $cordovaCalendar.createEventInteractively({
        title: $scope.eventDetail.eventName,
        location: $scope.eventDetail.fullAddress,
        notes: $scope.TextDescription,
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

  })
  .controller('theAveCtrl', function ($scope, $state, $stateParams, uiGmapIsReady, $ionicHistory, $ionicPlatform, establishments) {
    //console.log(establishments);
    $scope.showMap = true;
    $scope.establishmentList = establishments.List;
    $scope.vh = window.innerHeight;
    $scope.ContentHeight = $scope.vh - 44 + "px";
    //angular.element(document).ready(function () {
    var mapElem = angular.element(document.getElementsByClassName("angular-google-map-container"));
    mapElem.css("height", $scope.ContentHeight);
    //});

    $scope.markers = [];
    angular.forEach($scope.establishmentList, function (value, key) {
      var marker = {};
      //var bounds = new google.maps.LatLngBounds();

      marker = {
        latitude: value.lat,
        longitude: value.lng,
        title: value.businessname,
        id: value.id,
        icon: 'img/blue_marker.png'
      };
      $scope.markers.push(marker);
    });

    $scope.mapOptions = {
      center: {latitude: 26.4611111, longitude: -80.0730556}, zoom: 12, bounds: {}, control: {}, events: {}
    };
    $scope.Back = function () {
      console.log($ionicHistory.viewHistory());
      $ionicHistory.goBack(-1);
      //$ionicPlatform.offHardwareBackButton();
    }
  })
  .controller("completedEventsListingCtrl", function ($scope, $state, $stateParams, completedEvents, $ionicHistory) {
    console.log(completedEvents);
    $scope.eventList = completedEvents.CompletedEvent;
    console.log($scope.eventList);
    $scope.openDetail = function (gallery) {
      $state.go("mainApp.completedEventPhotos", {gallery: gallery});
    }
    $scope.Back = function () {
      $ionicHistory.goBack(-1);
    }
  })
  .controller("completedEventPhotosCtrl", function ($scope, $state, $stateParams, $ionicModal, $ionicSlideBoxDelegate, $ionicHistory, $ionicScrollDelegate) {
    console.log($stateParams);
    $scope.gallery = $stateParams.gallery;
    if ($scope.gallery == null) {
      $state.go("mainApp.completedEventsListing");
      return false;
    }
    if ($scope.gallery !== null) {
      try {
        $scope.gallery = JSON.parse($scope.gallery);
      }
      catch (e) {
        console.log(e);
      }
      $scope.EventThumbs = $scope.gallery.thumbnail;
      $scope.EventOriginal = $scope.gallery.original;
    }
    //$scope.loadFullScreen = function (index) {
    //  if (index == null || angular.isUndefined(index)) {
    //    index = 1
    //  }
    //  $ionicModal.fromTemplateUrl('image-modal.html', {
    //    scope: $scope,
    //    animation: 'slide-in-up'
    //  }).then(function (modal) {
    //    $scope.modal = modal;
    //    $ionicSlideBoxDelegate.update();
    //    console.log(index);
    //    $ionicSlideBoxDelegate.slide(index);
    //    $scope.modal.show();
    //  });
    //};
    //$scope.CloseModal = function () {
    //  $scope.modal.hide();
    //}
    $scope.Back = function () {
      $ionicHistory.goBack(-1);
    }
    $scope.showModal = function (index) {
      templateUrl = "templates/eventPhotos.html";
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $ionicSlideBoxDelegate.slide(index);
        $scope.activeSlide = index;
      })
    };
    $scope.CloseModal = function () {
      $scope.modal.hide();
    }

    $scope.zoomMin = 1;
    $scope.updateSlideStatus = function (slide) {
      console.log(slide);
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };
  })
  .controller("mapsCtrl", function ($scope, $state, $stateParams, $ionicHistory, uiGmapIsReady) {
    $scope.vh = window.innerHeight;
    $scope.ContentHeight = $scope.vh - 44 + "px";
    //angular.element(document).ready(function () {
    var mapElem = angular.element(document.getElementsByClassName("angular-google-map-container"));
    mapElem.css("height", $scope.ContentHeight);
    //});
    $scope.mapOptions = {
      center: {latitude: 26.4611111, longitude: -80.0730556}, zoom: 12, bounds: {}, control: {}, events: {}
    };
    $scope.Back = function () {
      //console.log($ionicHistory.viewHistory());
      $ionicHistory.goBack(-1);
      //$ionicPlatform.offHardwareBackButton();
    }
    uiGmapIsReady.promise().then(function (maps) {
      console.log(maps);
      google.maps.event.trigger(maps[0].map, 'resize');
    })
  })
  .controller("parkingdetailCtrl", function ($scope, $state, $ionicHistory, $ionicPlatform, $stateParams, detailData, $localStorage, uiGmapIsReady) {
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
    $scope.EstablishData = detailData;
    $scope.amenities = $scope.EstablishData.amenities;
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
      "Type": "categorytype",
      //"Details": "description",
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

    $scope.moreInfo = function () {
      console.log($scope.EstablishData);

      var website = $scope.EstablishData.website;
      if (!/^https?:\/\//i.test(website)) {
        website = 'http://' + website;
      }
      window.open(website, "_blank", "location=yes");
    }
    $scope.fullAddress = $scope.EstablishData.address + ", " + $scope.EstablishData.city + ", " + $scope.EstablishData.state;
    $scope.Back = function () {
      console.log($ionicHistory.viewHistory());
      $ionicHistory.goBack(-1);
      //$ionicPlatform.offHardwareBackButton();
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
  })
  .controller("dealDetailCtrl", function ($scope, $stateParams, dealData, $state, $ionicHistory) {
    $scope.dealDetail = dealData.dealDetail;
    console.log($scope.dealDetail);
    $scope.businessName = $scope.dealDetail.businessname;
    var splitStartDate = $scope.dealDetail.startDate.split("-");
    var splitStartTime = $scope.dealDetail.startTime.split(":");
    var splitEndDate = $scope.dealDetail.endDate.split("-");
    var splitEndTime = $scope.dealDetail.endTime.split(":");
    $scope.startDateTime = new Date(splitStartDate[0], splitStartDate[1] - 1, splitStartDate[2], splitStartTime[0], splitStartTime[1], 0, 0);
    $scope.endDateTime = new Date(splitEndDate[0], splitEndDate[1] - 1, splitEndDate[2], splitEndTime[0], splitEndTime[1], 0, 0);
    $scope.goToEstablishment = function (id) {
      $state.go("mainApp.detailView", {id: id});
    }
    $scope.Back = function () {
      //console.log($ionicHistory.viewHistory());
      $ionicHistory.goBack(-1);
      //$ionicPlatform.offHardwareBackButton();
    }
  })
  .controller("subCatCtrl", function ($scope, $stateParams, $state, $localStorage, $filter, $ionicHistory) {
    console.log($stateParams);
    $scope.data = $stateParams.data;
    var iconName = $scope.data.iconName;
    $scope.CatList = $scope.data.subCategoryList;
    //$scope.markers = [];
    $scope.map = {center: {latitude: 26.4611111, longitude: -80.0730556}, zoom: 12, bounds: {}, control: {}};
    $scope.options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    $scope.viewTitle = $stateParams.data.name;
    $scope.vh = window.innerHeight;
    if (ionic.Platform.isIOS()) {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + 20 + "px";
    }
    else {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + "px";
    }
    $scope.HotelList = [];
    $scope.markers = [];
    angular.forEach($scope.data.HotelList, function (v1, k1) {
      console.log(v1);
      var marker = {};
      marker = {
        latitude: v1.lat,
        longitude: v1.lng,
        title: v1.businessname,
        id: v1.id,
        icon: '',
        options: {
          icon: {
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: '#E91E63',
            fillOpacity: 1,
            strokeColor: '',
            strokeWeight: 0
          },
          map_icon_label: '<span class="map-icon ' + iconName + '"></span>'
          //labelContent: '<span class="map-icon map-icon-point-of-interest"></span>',
          //shadow: "none"
        }
      };
      $scope.markers.push(marker);
    });

    $scope.openList = function (data) {
      if (data.id) {
        $scope.List = $filter('filter')($scope.data.HotelList, {categorytype: data.id});
        $state.go("mainApp.establishment", {data: $scope.List, name: data.name, icon: iconName});
      } else {
        console.log("Go to Home");
      }

    }
    $scope.goHome = function () {
      $state.go("home");
    }

    $scope.goBack = function () {
      $ionicHistory.goBack(-1);
    }
  })
  .controller("establishmentCtrl", function ($scope, $stateParams, $state, $localStorage, $filter, $ionicHistory, priceRange, $ionicPopup) {
    console.log($stateParams);
    $scope.data = $stateParams.data;
    var iconName = $stateParams.icon;
    $scope.markers = [];
    $scope.map = {center: {latitude: 26.4611111, longitude: -80.0730556}, zoom: 12, bounds: {}, control: {}};
    $scope.options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    $scope.viewTitle = $stateParams.name;
    $scope.vh = window.innerHeight;
    if (ionic.Platform.isIOS()) {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + "px";
    }
    else {
      $scope.ContentHeight = ($scope.vh * 40) / 100 + 44 + "px";
    }
    $scope.HotelList = [];
    var pushData = {'icon': 'blue_marker', 'data': $scope.data};
    $scope.HotelList = $scope.HotelList.concat(pushData);
    //console.log("Hotel List",$scope.HotelList);
    $scope.markers = [];
    angular.forEach($scope.data, function (v1, k1) {
      var marker = {};
      marker = {
        latitude: v1.lat,
        longitude: v1.lng,
        title: v1.businessname,
        id: v1.id,
        icon: '',
        options: {
          icon: {
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: '#E91E63',
            fillOpacity: 1,
            strokeColor: '',
            strokeWeight: 0
          },
          map_icon_label: '<span class="map-icon ' + iconName + '"></span>'
          //labelContent: '<span class="map-icon map-icon-point-of-interest"></span>',
          //shadow: "none"
        }
      };
      $scope.markers.push(marker);
    })
    $scope.goHome = function () {
      $state.go("home");
    }
    $scope.showDetails = function (id, category, data) {
      var catData = $filter('filter')($localStorage.menu.icons, {'cat_id': category});
      console.log("CatData", data);
      if (catData[0].name == "PARKING TRANSPORT") {
        $state.go("mainApp.parkingdetailView", {"id": id, "data": data});
      }
      else {
        $state.go("mainApp.detailView", {"id": id, "data": data});
      }
    };
    $scope.goBack = function () {
      $ionicHistory.goBack(-1);
    }
    $scope.filterData = {};
    $scope.filterData.miles = "5";
    $scope.filterData.priceRange = "All";
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
    $scope.checkFinalFilter = function (prop, val, prop1, val1) {
      return function (item) {
        //console.log(val1);
        if (val1 == null) {
          return item[prop] > val
        }
        else {
          return item[prop] > val && item[prop1] == val1;
        }
      }
    }

    priceRange.get().then(function (response) {
      $scope.PriceRange = [];
      var nonePrice = {price: "All", id: 0};
      $scope.PriceRange.push(nonePrice);
      $scope.PriceRange = $scope.PriceRange.concat(response.priceList);
      console.log($scope.PriceRange);
    });
    $scope.miles = ["5", "10", "15", "20", "25"];
    $scope.goHome = function () {
      $state.go("home");
    }
    $scope.$watch("filterData.priceRange", function (newvalue, oldvalue) {
      console.log(newvalue);
      if (newvalue && newvalue == "All") {
        $scope.filterData.priceRangeNew = null;
        //$scope.filterData.priceRangeNew = {};
      }
      else {
        $scope.filterData.priceRangeNew = newvalue;
      }
    })
  })
  .controller("offlineCtrl", function ($scope) {
    console.log("i am offline");
  })
;
