(function (window, document) {
    /**
     * Main application module
     */
    var module = angular.module('goto', ['datepicker']);

    module.controller('mainController', MainController);

    /**
     * Main controller constructor
     */
    MainController.$inject = ['$scope'];
    function MainController($scope) {
        var vm = this;

        $scope.$watch('vm.fromDate', function () {
            if (!vm.fromDate || !vm.toDate) return;
            vm.totalDays = getTotalDays(vm.fromDate, vm.toDate);
        });

        $scope.$watch('vm.toDate', function () {
            if (!vm.fromDate || !vm.toDate) return;
            vm.totalDays = getTotalDays(vm.fromDate, vm.toDate);
        });

        var getTotalDays = function (fromDate, toDate) {
            var timeDiff = Math.abs(fromDate.time - toDate.time);
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        }
    }
})(window, document);
