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