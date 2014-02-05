'use strict';

angular.module('minicolors', [])
.directive('minicolors', function ($parse) {
  return {
    require: '?ngModel',
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
      //source: https://github.com/SimpleApp/angular-colorpicker/blob/master/app/js/directives.js
      //parse it once so we don't parse it on every watch...
      var settingsGetter = $parse(attrs.minicolors);
      //gets the settings object
      var getSettings = function () {
        var defaultSettings = {
          theme: 'bootstrap',
          position: 'top left'
        };
        return angular.extend(defaultSettings, settingsGetter(scope));
      };

      //init method
      var initMinicolors = function () {
        if(!ngModel) {
          return;
        }
        var settings = getSettings();

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
      initMinicolors();

      // Watch for changes to the directives options and then call init method again
      scope.$watch(getSettings, initMinicolors, true);
      scope.$watch(attrs.ngModel, function(newValue) {
        if(!scope.$$phase) {
          scope.$apply(function () {
            element.minicolors('value', newValue);
          });
        }
      });
    }
  };
});
