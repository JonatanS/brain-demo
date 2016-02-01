app.factory('BrainFactory', function($http) {
    var loadData = function(typesToLoad) {

        return $http.get('/api/data', {params: typesToLoad })
        .then(function(response) {
            return response.data;
        });
    };

    var saveData = function(data) {
        return $http.post('/api/data', data).then(function(response) {
            return response.data;
        });
    };

    var readTextFile = function(filename) {
        return $http.get('/api/reviews', {
                params: {
                    filename: filename
                }
            })
            .then(function(response) {
                //convert to array and return
                var unfilteredArr = response.data.split('\n').map(function(line) {
                    return line.split('\t')
                });

                return unfilteredArr.filter(function(subArr) {
                    return subArr[1] !== ""
                });
            });
    };


    var readHousingData = function() {
        return $http.get('/api/housing/normalized')
        .then(function(response) {
            debugger;
            //convert to objects and return
            return response.data.map(function(subArr) {
                return {
                    input: [Number(subArr[0].trim()),
                            Number(subArr[1].trim()),
                            Number(subArr[2].trim()),
                            Number(subArr[3].trim()),
                            Number(subArr[4].trim()),
                            Number(subArr[5].trim()),
                            Number(subArr[6].trim()),
                            Number(subArr[7].trim()),
                            Number(subArr[8].trim()),
                            Number(subArr[9].trim()),
                            Number(subArr[10].trim()),
                            Number(subArr[11].trim()),
                            Number(subArr[12].trim())],
                    output: [Number(subArr[13].trim())]
                }
            });
        });
    };

    return {
        load: loadData,
        save: saveData,
        readTextFile: readTextFile,
        readHousingData: readHousingData
    };
});
