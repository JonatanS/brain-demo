app.factory('BrainFactory', function($http) {
    var loadData = function(typesToLoad) {

        return $http.get('/api/data', {params: typesToLoad })
        .then(function(response) {
            return response.data;
        });
    };

    var saveData = function(data) {
        return $http.post('/api/data', data).then(function(response) {
            console.log("SAVED:");
            console.log(response.data);
            return response.data;
        }).then(null, function(err){
            console.log("ERROR SAVING!!!");
            console.log(err);
        })
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
            //convert to objects and return
            return response.data.map(function(subArr) {
                return {
                    input: [Number(subArr[0]),
                            Number(subArr[1]),
                            Number(subArr[2]),
                            Number(subArr[3]),
                            Number(subArr[4]),
                            Number(subArr[5]),
                            Number(subArr[6]),
                            Number(subArr[7]),
                            Number(subArr[8]),
                            Number(subArr[9]),
                            Number(subArr[10]),
                            Number(subArr[11]),
                            Number(subArr[12])],
                    output: [Number(subArr[13])]
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
