
(function () {
    'use strict';

    angular
        .module('angular-datepicker')
        .component('timeSelector', {
            // templateUrl: './src/js/timeSelectorComponent/timeSelector.html',
            template: template(),
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

    function template() {
        return [
            '<div class="time-selector-block">',
                '<div class="datepicker-heading-container">',
                    '<div class="date-field">{{vm.formatDateString()}}</div>',
                    '<div class="time-field">',
                        '<select ng-model="vm.hoursSelected" ng-change="vm.dateModel.setHours(+vm.hoursSelected)">',
                            '<option ng-repeat="hour in vm.hoursValues track by $index" value="{{$index}}">{{vm.formatTimeValue($index)}}</option>',
                        '</select>',
                        '<span>:</span>',
                        '<select ng-model="vm.minutesSelected" ng-change="vm.dateModel.setMinutes(+vm.minutesSelected)">',
                            '<option ng-repeat="hour in vm.minutesValue track by $index" value="{{$index}}">{{vm.formatTimeValue($index)}}</option>',
                        '</select>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('');
    }


})();

