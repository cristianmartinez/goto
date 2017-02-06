(function (window, document) {
    var module = angular.module('datepicker.components', ['datepicker.api']);

    /**
     * Calendar widget component
     */
    module.component('calendar', {
        templateUrl: '/tpls/calendar.tpl.html',
        controllerAs: 'vm',
        bindings: {
            onChange: '&',
            selectedDate: '='
        },
        controller: CalendarComponentController
    });

    /**
     * @type controller
     */
    CalendarComponentController.$inject = ['CalendarApi'];
    function CalendarComponentController(CalendarApi) {
        var vm = this;

        vm.$onInit = function () {
            vm.date = CalendarApi.getSimpleCurrentDate();
            refreshCalendar();
        }

        vm.goToNextMonth = goToNextMonth;
        vm.goToPrevMonth = goToPrevMonth;
        vm.selectDate = selectDate;
        vm.isSelected = isSelected;

        function goToNextMonth() {
            if (vm.date.month === 12) {
                vm.date.year += 1;
                vm.date.month = 1;

                return;
            }

            vm.date.month += 1;
            refreshCalendar();
        }

        function goToPrevMonth() {
            if (vm.date.month === 1) {
                vm.date.year -= 1;
                vm.date.month = 12;
                return;
            }

            vm.date.month -= 1;
            refreshCalendar();
        }

        function refreshCalendar() {
            vm.month = CalendarApi.getMonthWeeks(vm.date.year, vm.date.month);
        }

        function selectDate(day) {
            vm.onChange({ date: day });
        }

        function isSelected(date) {
            if (!vm.selectedDate) {
                return;
            }

            console.log(vm.selectedDate.year === date.year
                && vm.selectedDate.month === date.month
                && vm.selectedDate.day === date.day);
            return vm.date.year === date.year
                && vm.selectedDate.month === date.month
                && vm.selectedDate.day === date.day;
        }
    }

    /**
     * Datepicker component
     */
    module.component('datepicker', {
        templateUrl: '/ctpls/datepicker.tpl.html',
        controllerAs: 'vm',
        require: {
            ngModelController: 'ngModel'
        },
        controller: DatepickerComponentController
    });

    /**
     * @type controller
     */
    DatepickerComponentController.$inject = [];
    function DatepickerComponentController() {
        var vm = this;

        vm.onCalendarChange = onCalendarChange;
        vm.onFocus = onFocus;
        vm.onBlur = onBlur;

        vm.$onInit = function () {
            vm.ngModelController.$formatters.push(function (modelValue) {
                return parseModelValueToLocalObject(modelValue);
            });

            vm.ngModelController.$render = function () {
                vm.date = vm.ngModelController.$viewValue;
                vm.prettyDate = toPrettyFormat(vm.date);
            };

            vm.ngModelController.$parsers.push(function (date) {
                return date;
            });
        }

        function onFocus (){
            vm.active = true;
        }

        function onBlur (){
            vm.active = false;
        }

        function onCalendarChange(date) {
            vm.active = false;
            vm.date = date;
            vm.prettyDate = toPrettyFormat(vm.date);
            vm.ngModelController.$setViewValue(date);
        }

        function parseModelValueToLocalObject(model) {
            if (isValid(model)) {
                return model;
            }
        }

        function toPrettyFormat(date) {
            if (isValid(date)) {
                return date.day + '/' + date.month + '/' + date.year;
            }
        }

        function isValid(date) {
            return angular.isObject(date)
                && angular.isNumber(date.day)
                && angular.isNumber(date.month)
                && angular.isNumber(date.day);
        }
    }
})(window, document);
