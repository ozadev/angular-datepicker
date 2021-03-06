
(function () {
    'use strict';

    angular
        .module('ozas.datepicker')
        .directive('clickOutsideClosest', clickOutsideClosest);

    clickOutsideClosest.$inject = ['$document'];

    function clickOutsideClosest($document) {
        return {
            restrict: 'A',
            scope: {
                clickOutsideClosest: '&',
                closestSelector: '@'
            },
            link: function (scope, elem, attr) {

                $document.on('click', function (e) {

                    if (!e.target.closest(scope.closestSelector)) {
                        scope.$apply(function () {
                            scope.clickOutsideClosest();
                        });
                    }

                });
            }
        }
    }

})();