app.config(function ($stateProvider) {
    $stateProvider.state('brain1', {
        url: '/',
        templateUrl: 'js/brain/brain_sin.html',
        controller: 'BrainCtrl'
    });

    $stateProvider.state('brain2', {
        url: '/brain2',
        templateUrl: 'js/brain/brain_housing.html',
        controller: 'BrainCtrl'
    });

    $stateProvider.state('brain3', {
        url: '/brain3',
        templateUrl: 'js/brain/brain_sentiment.html',
        controller: 'BrainCtrl'
    });
});
