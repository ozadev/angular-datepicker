
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

    datepickerController.$inject = ['$scope'];

    function datepickerController($scope) {
        var vm = this;

        var viewDate = new Date();

        vm.datepickerOpened = false;
        vm.dateBoard = createDateBoardArray(viewDate);
        vm.selectedDateIndex = getSelectedIndex();
        vm.selectedDate = new Date();

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

