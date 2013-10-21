'use strict';

angular.module('minicolors', [])
.directive('minicolors', function () {
  return {
    require: '?ngModel',
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
      //source: https://github.com/SimpleApp/angular-colorpicker/blob/master/app/js/directives.js

      //gets the settings object
      var getSettings = function () {
        return angular.extend({}, scope.$eval(attrs.minicolors));
      };

      //init method
      var initMinicolors = function () {
        if(!ngModel) {
          return;
        }
        var settings = getSettings();

        var defaultSettings = {
          theme: 'bootstrap',
          position: 'top left',
          control: 'wheel'
        };

        //if a model exists, hook up the ngModel
        if (ngModel) {
          var updateModel = function () {
            if(!scope.$$phase) {
              //not currently in $digest or $apply
              scope.$apply(function () {
                var color = element.minicolors('value');
                ngModel.$setViewValue(color);
              });
            }
          };
        }
        //initialize the starting value, if there is one
        ngModel.$render = function () {
          if(!scope.$$phase) {
            //not currently in $digest or $apply
            scope.$apply(function () {
              var color = ngModel.$viewValue;
              element.minicolors('value', color);
            });
          }
        };

        // If we don't destroy the old one it doesn't update properly when the config changes
        element.minicolors('destroy');

        // Create the new minicolors widget
        element.minicolors(settings);

        // Force a render to override whatever is in the input text box
        ngModel.$render();
      };

      // Watch for changes to the directives options and then call init method again
      scope.$watch(getSettings, initMinicolors, true);
    }
  };
});