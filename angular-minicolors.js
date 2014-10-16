'use strict';

angular.module('minicolors', [])
    .directive('minicolors', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var defaults = {
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
                        },
                        options = scope.$eval(attrs.sswminicolors),
                        config = angular.extend({}, defaults, options);

                    element.minicolors(config);
                }
            };
        }
    ]);