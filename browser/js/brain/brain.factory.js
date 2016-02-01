app.factory('BrainFactory', function($http) {
    var loadData = function(typesToLoad) {
        return $http.get('/api/data', {
            params: typesToLoad
        }).then(function(response) {
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
        return $http.get('/api/housing')
        .then(function(response) {
            //convert to array and return
            var unfilteredArr = response.data.split('\n').map(function(line) {
                return line.split(' ').filter(function(entry){
                    return entry != "";
                });
            });
            return unfilteredArr.map(function(subArr) {
                return {
                    //turn into training objects
                    // {
                    //     input: {
                    //         'crime': subArr[0],
                    //         'zoning':subArr[1],
                    //         'indst':subArr[2],
                    //         'river' :subArr[3],
                    //         'NOX' :subArr[4],
                    //         'rooms' :subArr[5],
                    //         'age' :subArr[6],
                    //         'dist' :subArr[7],
                    //         'hgwy' :subArr[8],
                    //         'tax' :subArr[9],
                    //         'teacher' :subArr[10],
                    //         'lstat' :subArr[12],
                    //     },
                    //     output: {
                    //         'value': subArr[13]
                    //     }
                    // }
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
