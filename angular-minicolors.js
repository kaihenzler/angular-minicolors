'use strict';

angular.module('minicolors', []);

angular.module('minicolors').provider('minicolors', function () {
  this.defaults = {
    theme: 'bootstrap',
    position: 'top left',
    defaultValue: '',
    animationSpeed: 50,
    animationEasing: 'swing',
    change: null,
    changeDelay: 0,
    control: 'hue',
    hide: null,
    hideSpeed: 100,
    inline: false,
    letterCase: 'lowercase',
    opacity: false,
    show: null,
    showSpeed: 100
  };

  this.$get = function() {
    return this;
  };

});

angular.module('minicolors').directive('minicolors', ['minicolors', '$timeout', '$parse', function (minicolors, $timeout, $parse) {
  return {
    require: '?ngModel',
    restrict: 'A',
    priority: 1, //since we bind on an input element, we have to set a higher priority than angular-default input
    link: function(scope, element, attrs, ngModel) {

      var inititalized = false;

      //gets the settings object
      var getSettings = function () {
        var config = angular.extend({}, minicolors.defaults, scope.$eval(attrs.minicolors));
        return config;
      };

      //what to do if the value changed
      ngModel.$render = function () {

        //we are in digest or apply, and therefore call a timeout function
        $timeout(function() {
          var color = ngModel.$viewValue;
          var opacity = scope.$eval(attrs.ngOpacity) || "1.0";
          element.minicolors('value', color);
          element.minicolors('opacity', opacity);
        }, 0, false);
      };

      //init method
      var initMinicolors = function () {

        if(!ngModel) {
          return;
        }
        var settings = getSettings();
        settings.change = function (hex, opacity) {
          scope.$apply(function () {
            ngModel.$setViewValue(hex);
            if (attrs.ngRgba) {
              var rgba = element.minicolors('rgbaString');
              $parse(attrs.ngRgba).assign(scope, rgba);
            }
            if (attrs.ngOpacity) {
              $parse(attrs.ngOpacity).assign(scope, opacity);
            }
          });
        };

        //destroy the old colorpicker if one already exists
        if(element.hasClass('minicolors')) {
          element.minicolors('destroy');
        }

        // Create the new minicolors widget
        element.minicolors(settings);

        // are we inititalized yet ?
        //needs to be wrapped in $timeout, to prevent $apply / $digest errors
        //$scope.$apply will be called by $timeout, so we don't have to handle that case
        if (!inititalized) {
          $timeout(function() {
            var color = ngModel.$viewValue;
            element.minicolors('value', color);
          }, 0);
          inititalized = true;
          return;
        }
      };

      initMinicolors();
      //initital call

      // Watch for changes to the directives options and then call init method again
      scope.$watch(getSettings, initMinicolors, true);
    }
  };
}]);