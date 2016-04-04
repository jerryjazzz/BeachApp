/**
 * Created by varun on 19-03-2016.
 */
angular.module('DBApp.filters', [])
  .filter("ImageLink", function (HOME_IMG_URL) {
    return function (link) {
      if (angular.isDefined(link)) {
        var finalLink = "img/homeicons/" + link;
        return finalLink;
      }
      else {
        return link;
      }
    }
  })
  .filter("MainImages", function (HOME_IMG_URL) {
    return function (link) {
      if (angular.isDefined(link)) {
        var finalLink = HOME_IMG_URL + link;
        return finalLink;
      }
      else {
        return link;
      }
    }
  })
  .filter("ThumbnailImages", function (HOME_IMG_URL) {
    return function (link) {
      if (angular.isDefined(link)) {
        var newData = "";
        try {
          newData = JSON.parse(link).thumbnail[0];
        }
        catch (e) {
          console.log(e);
          newData = link;
        }
        //console.log(JSON.parse(link));
        var finalLink = HOME_IMG_URL + newData;
        return finalLink;
      }
      else {
        return link;
      }
    }
  })
  .filter('getEventDate', function () {
    return function (input) {
      if (input) {
        return new Date(input);
      }
      else {
        return false;
      }

    }
  })
  .filter("galleryImages", function (HOME_IMG_URL) {
    return function (link) {
      if (angular.isDefined(link)) {
        console.log(link);
        return link;
      }
      else {
        return link;
      }
    }
  })
;
