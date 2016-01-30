app.factory('BrainFactory', function ($http){
    var loadData = function (typesToLoad) {
        return $http.get('/api/data', {params:typesToLoad}).then(function(response) {
            // var retArr = response.data.map(function(obj) {
            //     var newData = JSON.parse(obj.data);
            //     obj.data = newData;
            //     return obj;

            // });
            // console.log('after:')
            // console.dir(retArr);
            return response.data;
        });
    };

    var saveData = function (data) {
        return $http.post('/api/data', data).then(function(response){
            return response.data;
        });
    };

    return {
        load: loadData,
        save: saveData
    };
});
