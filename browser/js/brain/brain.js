app.config(function ($stateProvider) {
    $stateProvider.state('brain', {
        url: '/brain',
        templateUrl: 'js/brain/brain.html',
        controller: 'BrainCtrl'
    });
});
