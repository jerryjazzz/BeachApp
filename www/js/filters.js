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
  .filter("OriginalImages", function (HOME_IMG_URL) {
    return function (link) {
      if (angular.isDefined(link)) {
        var newData = "";
        try {
          newData = JSON.parse(link).original[0];
        }
        catch (e) {
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
  .filter('tel', function () {
    return function (tel) {
      if (!tel) {
        return '';
      }

      var value = tel.toString().trim().replace(/^\+/, '');

      if (value.match(/[^0-9]/)) {
        return tel;
      }

      var country, city, number;

      switch (value.length) {
        case 10: // +1PPP####### -> C (PPP) ###-####
          country = 1;
          city = value.slice(0, 3);
          number = value.slice(3);
          break;

        case 11: // +CPPP####### -> CCC (PP) ###-####
          country = value[0];
          city = value.slice(1, 4);
          number = value.slice(4);
          break;

        case 12: // +CCCPP####### -> CCC (PP) ###-####
          country = value.slice(0, 3);
          city = value.slice(3, 5);
          number = value.slice(5);
          break;

        default:
          return tel;
      }

      if (country == 1) {
        country = "";
      }

      number = number.slice(0, 3) + '-' + number.slice(3);

      return (country + " (" + city + ") " + number).trim();
    };
  });
;
