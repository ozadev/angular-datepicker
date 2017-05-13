
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

