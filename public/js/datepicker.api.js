(function (window, document) {
    var module = angular.module('datepicker.api', []);

    module.service('CalendarApi', CalendarApi);

    /**
     * CalendarApi constructor
     */
    CalendarApi.$inject = [];
    function CalendarApi() {
        var DAYS = {
            MONDAY: 0,
            TUESDAY: 1,
            WEDNESDAY: 2,
            THURSDAY: 3,
            FRIDAY: 4,
            SATURDAY: 5,
            SUNDAY: 6,
        }

        ONE_DAY = 1000 * 60 * 60 * 24;
        ONE_HOUR = 1000 * 60 * 60;
        FIRST_WEEK_DAY = DAYS.MONDAY;

        //Public API
        this.getMonthDays = getMonthDays;
        this.getMonthWeeks = getMonthWeeks;
        this.getSimpleCurrentDate = getSimpleCurrentDate;

        //Private methods
        function _adjustWeekday(weekday) {
            return weekday > 0 ? weekday - 1 : 6
        };

        function _createSimpleStructureDay(date) {
            return {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                time: date.getTime()
            }
        }

        /**
         * Returns all the month days, each day is a Date object
         */
        function getMonthDays(year, month) {
            if (month < 1 || month > 12) {
                throw new Error('Invalid month');
            }

            var date = new Date(year, month - 1, 1);
            var day = _adjustWeekday(date.getDay());
            var days = (day - FIRST_WEEK_DAY) >= 0 ? (day - FIRST_WEEK_DAY) % 7 : 7 + (day - FIRST_WEEK_DAY);

            date.setTime(date.getTime() - (days * ONE_DAY));

            var dates = [];
            while (true) {
                dates.push(_createSimpleStructureDay(new Date(date.getTime())));

                var currentDate = date.getDate();
                date.setTime(date.getTime() + ONE_DAY);

                // Hack to account for DST
                while (date.getDate() === currentDate) {
                    date.setTime(date.getTime() + ONE_HOUR);
                }

                if (date.getMonth() !== month - 1 && _adjustWeekday(date.getDay()) === FIRST_WEEK_DAY) {
                    break;
                }
            }

            return dates;
        }

        /**
         * Returns a matrix, each row represents a week
         */
        function getMonthWeeks(year, month) {
            var days = [];
            dates = getMonthDays(year, month);

            for (var i = 0; i < dates.length; i += 7) {
                days.push(dates.slice(i, i + 7));
            }

            return days;
        }

        function getSimpleCurrentDate() {
            var d = new Date();
            return { year: d.getFullYear(), day: d.getDate(), month: d.getMonth() + 1 }
        }
    }
})(window, document);
