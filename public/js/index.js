(function (window, document){
    /**
     * Main application module
     */
    var module = angular.module('goto', ['datepicker']);

    module.controller('mainController', MainController);

    /**
     * Main controller constructor
     */
    MainController.$inject = [];
    function MainController(){

    }
})(window, document);
