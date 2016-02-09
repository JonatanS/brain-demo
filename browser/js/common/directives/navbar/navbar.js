app.directive('navbar', function ($rootScope, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'sine func', state: 'brain1' },
                { label: 'housing', state: 'brain2' }
            ];

        }

    };

});
