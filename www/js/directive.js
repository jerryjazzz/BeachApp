/**
 * Created by varun on 19-03-2016.
 */

angular.module('DBApp.directives', [])
  .directive("hasNewHeader", function () {
    return function (scope, element, attrs) {
      element.ready(function () {
        angular.element(document).ready(function () {
          element.css("top", "15%");
        });
      })
    }
  })
  .directive("menuHeight", function () {
    return function (scope, element, attrs) {
      element.ready(function () {
        angular.element(document).ready(function () {
          element.css("height", "20%");
        });
      })
    }
  })
  .directive("checkHeight", function () {
    return function (scope, element, attrs) {
      element.ready(function () {
        angular.element(document).ready(function () {
          console.log("ContentHeight", scope.contentHeight);
          element.css("top", scope.contentHeight + "px");
        });
      })
    }
  })
  .directive("getMapHeight", function () {
    return function (scope, element, attrs) {
      element.ready(function () {
        angular.element(document).ready(function () {
          scope.$parent.contentHeight = element[0].offsetHeight + element[0].offsetTop;
          var mapDime = element[0].offsetHeight
          var mapDiv = angular.element(document.getElementsByClassName("angular-google-map-container"));
          mapDiv.css("height", mapDime + "px");
          scope.$apply();
        });
      })
    }
  })
  .directive("loadContent", function () {
    return function (scope, element, attrs) {
      var mapElem = angular.element(document.getElementById("mapContent"));
      mapElem.ready(function () {
        var newTop = mapElem[0].offsetHeight + mapElem[0].offsetTop;
        element.css("display", "none");
        element.css("top", newTop + "px");
        element.css("display", "block");
        //var mapDiv = angular.element(document.getElementsByClassName("angular-google-map-container"));
        //var mapDiv = angular.element(document.getElementById("mapContent"));
        //mapDiv.css("height", mapElem[0].offsetHeight + "px");
      })
    }
  })
  .directive("mapLoaded", function () {
    return function (scope, element, attrs) {
      element.ready(function () {
        var mapDiv = angular.element(document.getElementsByClassName("angular-google-map-container"));
        mapDiv.css("height", "40vh");
        var newTop = mapDiv[0].offsetHeight + mapDiv[0].offsetTop + 44;
        console.log(newTop);
        var contentElem = angular.element(document.getElementById("detailContent"));
        console.log(contentElem);
        contentElem.css("top", newTop + "px");
        //element.css("display", "none");
        //element.css("top", newTop + "px");
        //element.css("display", "block");
      })
    }
  })



