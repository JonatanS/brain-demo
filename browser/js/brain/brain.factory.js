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

    var readTextFile = function(filename) {
        return $http.get('/api/reviews', {params: {filename: filename}})
        .then(function(response){
            //convert to array and return
            var unfilteredArr = response.data.split('\n').map(function(line){
                return line.split('\t')
            });

            return unfilteredArr.filter(function(subArr){
                return subArr[1] !== ""
            });
        });
    }

    return {
        load: loadData,
        save: saveData,
        readTextFile: readTextFile
    };
});
