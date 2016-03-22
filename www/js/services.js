/**
 * Created by varun on 19-03-2016.
 */
angular.module('DBApp.services', [])
  .service("homeIcons", function (HomeMenu) {
    this.getIcons = function () {
      HomeMenu.getIcons().then(function(response){
        console.log(response);
      });
    }
  });
