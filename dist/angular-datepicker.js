
(function () {
  'use strict';

  angular
      .module('ozas.datepicker', []);


})();

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
angular.module('ozas.datepicker').run(['$templateCache', function($templateCache) {$templateCache.put('src/js/datepickerDirective/datepicker.html','<div class="datepicker-component-block"\r\n     data-datepicker-index="{{vm.datepickerIndex}}">\r\n    <div ng-if="vm.datepickerIndex === 0"\r\n         click-outside-closest="vm.setCloseAll()"\r\n         closest-selector=".datepicker-component-block"></div>\r\n    <ng-transclude ng-click="vm.setOpen()"></ng-transclude>\r\n    <div class="datepicker-container"\r\n         ng-show="vm.datepickerOpened">\r\n        <time-selector date-model="vm.selectedDate" lang-config="vm.langConfig"></time-selector>\r\n        <div class="datepicker-date-board">\r\n            <div class="month-switcher-panel">\r\n                <span class="switcher-title">{{vm.currentDateTitle()}}</span>\r\n                <div class="button-left"\r\n                      ng-click="vm.switchPrevMonth()">\r\n                    <span class="arrow-left"></span>\r\n                </div>\r\n                <div class="button-right"\r\n                      ng-click="vm.switchNextMonth()">\r\n                    <span class="arrow-right"></span>\r\n                </div>\r\n            </div>\r\n            <div class="date-board-title-panel">\r\n                <div class="title-item"\r\n                     ng-repeat="title in vm.langConfig.days">{{title}}</div>\r\n            </div>\r\n            <div class="date-board-container">\r\n                <div class="date-board-item"\r\n                     ng-class="{\'selected\': $index === vm.selectedDateIndex, \'selectable\': date !== \'\'}"\r\n                     ng-click="vm.selectDate($index)"\r\n                     data-ng-repeat="date in vm.dateBoard track by $index">\r\n                    {{date}}\r\n                </div>\r\n            </div>\r\n            <div class="control-panel">\r\n                <span class="control-cancel" ng-click="vm.datepickerOpened = false">{{vm.langConfig.cancelString}}</span>\r\n                <div class="control-accept" ng-click="vm.acceptResultTime(); vm.datepickerOpened = false"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
$templateCache.put('src/js/timeSelectorComponent/timeSelector.html','<div class="time-selector-block">\r\n    <div class="datepicker-heading-container">\r\n        <div class="date-field">{{vm.formatDateString()}}</div>\r\n        <div class="time-field">\r\n            <select ng-model="vm.hoursSelected" ng-change="vm.dateModel.setHours(+vm.hoursSelected)">\r\n                <option ng-repeat="hour in vm.hoursValues track by $index"\r\n                        value="{{$index}}">{{vm.formatTimeValue($index)}}</option>\r\n            </select>\r\n            <span>:</span>\r\n            <select ng-model="vm.minutesSelected" ng-change="vm.dateModel.setMinutes(+vm.minutesSelected)">\r\n                <option ng-repeat="hour in vm.minutesValue track by $index"\r\n                        value="{{$index}}">{{vm.formatTimeValue($index)}}</option>\r\n            </select>\r\n        </div>\r\n    </div>\r\n</div>\r\n');}]);
/*
 Language system service
 created by Oza / 28-12-2016
 */

(function () {
    'use strict';

    angular
        .module('ozas.datepicker')
        .factory('datepickerItemRegister', datepickerItemRegisterService);

    datepickerItemRegisterService.$inject = [];

    function datepickerItemRegisterService () {
        // var self = this;

        var datepickerInstantsArr = [];

        var service = {
            register: register,
            setOpen: setOpen,
            setCloseAll: setCloseAll
        };

        return service;

        //
        //
        //

        function register(setItemOpenValue) {
            datepickerInstantsArr.push({
                setItemOpenValue: setItemOpenValue
            });

            return datepickerInstantsArr.length - 1;
        }

        function setOpen(index) {
            setCloseAll();
            datepickerInstantsArr[index].setItemOpenValue(true);
        }

        function setCloseAll() {
            datepickerInstantsArr.forEach(function(item) {
                item.setItemOpenValue(false);
            });
        }

    }

})();

(function () {
    'use strict';

    angular
        .module('ozas.datepicker')
        .directive('datepicker', datepicker);

    datepicker.$inject = [];

    function datepicker() {
        return {
            templateUrl: 'src/js/datepickerDirective/datepicker.html',
            transclude: true,
            scope: {
                config: '='
            },
            link: datepickerLink,
            controller: datepickerController,
            controllerAs: 'vm',
            bindToController: true

        }
    }

    function datepickerLink($scope, element, attr, ctrl) {
        // get datepicker transcluded input
        var datepickerInput = angular.element(element[0].querySelector('input'));

        if (!datepickerInput.length) {
            console.error('Datepicker error: no child input find.');
        }

        $scope.$watch(
            function() {
                return ctrl.datepickerOpened
            },
            function(newValue) {
                if (newValue) {
                    datepickerInput.addClass('datepicker-input-focus');
                }
                else {
                    datepickerInput.removeClass('datepicker-input-focus');
                }
            }
        );

        $scope.setInputValue = function(value) {
            datepickerInput.val(value);
            datepickerInput.triggerHandler('input');
            datepickerInput.triggerHandler('change');//just to be sure;
        }
    }

    datepickerController.$inject = ['$scope', 'datepickerItemRegister'];

    function datepickerController($scope, datepickerItemRegister) {
        var vm = this;

        var viewDate = new Date();

        vm.datepickerOpened = false;
        vm.dateBoard = createDateBoardArray(viewDate);
        vm.selectedDateIndex = getSelectedIndex();
        vm.selectedDate = new Date();

        vm.datepickerIndex = datepickerItemRegister.register(
            function(value) {
                vm.datepickerOpened = value;
            }
        );


        // Default language constants
        vm.langConfig = {
            months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            monthsPartFormat: ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'],
            days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            cancelString: 'Отмена'
        };

        vm.switchNextMonth = switchNextMonth;
        vm.switchPrevMonth = switchPrevMonth;
        vm.selectDate = selectDate;
        vm.currentDateTitle = currentDateTitle;
        vm.acceptResultTime = acceptResultTime;
        vm.setCloseAll = datepickerItemRegister.setCloseAll;
        vm.setOpen = function() {
            datepickerItemRegister.setOpen(vm.datepickerIndex);
        };

        vm.$onInit = function() {
            if (vm.config) {
                vm.langConfig = vm.config;
            }
        };


        //
        //
        //

        function getFirstMonthDay(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        }

        function getLastMonthDay(date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0);
        }

        function calcWeekPrevMonthDays(date) {

            var firstDateNum = date.getDay();

            // Change sunday code to 7 from 0
            if (firstDateNum === 0) {
                firstDateNum = 7;
            }

            return firstDateNum - 1;
        }

        function calcWeekNextMonthDays(date) {

            var lastDateNum = date.getDay();

            // Change sunday code to 7 from 0
            if (lastDateNum === 0) {
                lastDateNum = 7;
            }

            return 7 - lastDateNum;
        }

        function createDateBoardArray(date) {

            var monthBoard = [];

            for (var i = 0; i < calcWeekPrevMonthDays(getFirstMonthDay(date)); i++) {
                monthBoard[monthBoard.length] = '';
            }

            for (i = 1; i <= getLastMonthDay(date).getDate(); i++) {
                monthBoard[monthBoard.length] = i;
            }

            for (i = 0; i < calcWeekNextMonthDays(getLastMonthDay(date)); i++) {
                monthBoard[monthBoard.length] = '';
            }

            return monthBoard;

        }

        function switchNextMonth() {
            viewDate.setMonth(viewDate.getMonth() + 1);
            vm.dateBoard = createDateBoardArray(viewDate);
            vm.selectedDateIndex = getSelectedIndex();
        }

        function switchPrevMonth() {
            viewDate.setMonth(viewDate.getMonth() - 1);
            vm.dateBoard = createDateBoardArray(viewDate);
            vm.selectedDateIndex = getSelectedIndex();
        }

        function getSelectedIndex() {
            if (!vm.selectedDate) {
                return null;
            }

            if (viewDate.getFullYear() != vm.selectedDate.getFullYear() || viewDate.getMonth() != vm.selectedDate.getMonth()) {
                return null;
            }

            return vm.selectedDate.getDate() + calcWeekPrevMonthDays(getFirstMonthDay(vm.selectedDate)) - 1;
        }

        function selectDate(index) {

            if (vm.dateBoard[index] === '') {
                return;
            }

            // vm.selectedDate = new Date(viewDate);
            vm.selectedDate.setFullYear(viewDate.getFullYear());
            vm.selectedDate.setMonth(viewDate.getMonth());
            vm.selectedDate.setDate(vm.dateBoard[index]);
            vm.selectedDateIndex = index;
        }

        function currentDateTitle() {
            return vm.langConfig.months[viewDate.getMonth()] + ' ' + viewDate.getFullYear();
        }

        function formatTimeValue(timeNum) {
            return timeNum < 10 ? '0' + timeNum : timeNum;
        }

        function acceptResultTime() {
            var dateString = vm.selectedDate.getDate() + ' ' + vm.langConfig.monthsPartFormat[vm.selectedDate.getMonth()] +
                ' ' + vm.selectedDate.getFullYear() + ', ' + formatTimeValue(vm.selectedDate.getHours()) + ':' + formatTimeValue(vm.selectedDate.getMinutes());

            $scope.setInputValue(dateString);
        }

    }

})();



(function () {
    'use strict';

    angular
        .module('ozas.datepicker')
        .component('timeSelector', {
            templateUrl: 'src/js/timeSelectorComponent/timeSelector.html',
            bindings: {
                dateModel: '=',
                langConfig: '<'
            },
            controller: timeSelectorController,
            controllerAs: 'vm'
        });

    timeSelectorController.$inject = [];

    function timeSelectorController() {
        var vm = this;

        vm.hoursValues = new Array(24);
        vm.minutesValue = new Array(60);

        vm.formatTimeValue = formatTimeValue;
        vm.formatDateString = formatDateString;

        vm.$onInit = function() {
            vm.hoursSelected = vm.dateModel.getHours().toString();
            vm.minutesSelected = vm.dateModel.getMinutes().toString();
        };

        //
        //
        //

        function formatTimeValue(timeNum) {
            return timeNum < 10 ? '0' + timeNum : timeNum;
        }

        function formatDateString() {
            return vm.dateModel.getDate() + ' / ' + vm.langConfig.monthsPartFormat[vm.dateModel.getMonth()] + ' / ' + vm.dateModel.getFullYear();
        }

    }


})();

