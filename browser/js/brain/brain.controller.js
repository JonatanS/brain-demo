//brain.controller.js


app.controller('BrainCtrl', function ($scope, BrainFactory) {
    var netToTrain = new brain.NeuralNetwork();
    var netToTest = new brain.NeuralNetwork();
    var myLiveChart;

    $scope.training = {
        size: 200
    };

    $scope.settings = {
        threshold: 5,
        iterations: 20000,
        logPeriod: 100
    };

    $scope.test = {
        val: 0.5,
        result: '',
        correctVal: '',
        err: ''
    };

    //the array of entries to test the trained set with
    $scope.testHousingSet = {
        data: []
    }

    $scope.trainingSet = {
        reviews:[
            {id:'yelp_labelled.txt', name:'1000 Yelp Reviews'},
            {id:'amazon_cells_labelled.txt', name:'1000 Amazon Reviews'},
            {id:'imdb_labelled.txt', name:'1000 IMDB Reviews'}
        ]
    };

    $scope.trainFromHousingSet = function() {
        BrainFactory.readHousingData()
        .then(function(fileArr) {
            //use 480 entry to train
            var trainArr = fileArr.slice(0,480);
            //use remaining 36 entries for testing:
            $scope.testHousingSet.data = fileArr.slice(481);
            train('housing',trainArr);
        });
    };

    $scope.trainFromReviews = function() {
        BrainFactory.readTextFile($scope.trainingSet.selectedSet)
        .then(function(fileArr) {
            var trainArr = fileArr.map(function(subArr){
                return {input: subArr[0], output: subArr[1]};
            });
            trainArr.pop();
            debugger;
            train('reviews',trainArr);
        });
    };

    $scope.createSinTrainingSet = function() {
        var trainArr = [];
        for (var i = 0; i < $scope.training.size; i++) {
            trainArr.push(
                {input: {val:i/($scope.training.size-1)},
                output: {res: Math.sin(i/($scope.training.size-1))}}
            );
        }
        train('sin',trainArr);
    };

    var train = function(setType,trainArr) {
        if(myLiveChart) myLiveChart.destroy();
        setUpGraph();

        netToTrain.train(trainArr,{
            errorThresh: $scope.settings.threshold/10000,  // error threshold to reach
            iterations: $scope.settings.iterations,   // maximum training iterations
            log: function () { addDataPoint(arguments[1], arguments[3]); },           // console.log() progress periodically
            logPeriod: $scope.settings.logPeriod,       // number of iterations between logging
            learningRate: 0.3   // learning rate
        });
        console.log('done training:');
        console.dir(netToTrain);
        netToTest = netToTrain;
        save(setType);
    };

    $scope.load = function(typesToLoad) {
        // if(typeof typesToLoad !== 'object') typesToLoad = {};
        BrainFactory.load(typesToLoad)
        .then(function(allSets){

                var latest = allSets.pop().data;
                // var latest = allSets[0].data;
                console.log(latest);
                netToTest.fromJSON(latest);
                if (typesToLoad === 'housing') {
                    BrainFactory.readHousingData()
                    .then(function(fileArr) {
                        //populate dropdown with input options
                        $scope.testHousingSet.data = fileArr.slice(481);
                    });
                }

        });
    };

    // $scope.load = function(typesToLoad) {
    //     // if(typeof typesToLoad !== 'object') typesToLoad = {};
    //     BrainFactory.load(typesToLoad)
    //     .then(function(allSets){
    //             if (typesToLoad === 'sin') {
    //             //find latest where type === 'sin' and do net.fromJSON()
    //             var latest = allSets.pop().data;
    //             // var latest = allSets[0].data;
    //             console.log(latest);
    //             netToTest.fromJSON(latest);
    //         } else if (typesToLoad === 'housing') {
    //             BrainFactory.readHousingData()
    //             .then(function(fileArr) {
    //                 //use remaining 36 entries for testing:
    //                 $scope.testHousingSet.data = fileArr.slice(481);
    //             });
    //             debugger;
    //             console.log(allSets);
    //             netToTest.fromJSON(allSets);
    //         }

    //     });
    // };

    $scope.testBrainHousing = function() {
        var testVal = JSON.parse($scope.testHousingSet.selectedSet).input;
        var output = netToTest.run(testVal);
        console.log('result:', JSON.stringify(output));
        $scope.test.result = output[0];
        $scope.test.correctVal = JSON.parse($scope.testHousingSet.selectedSet).output[0];
        $scope.test.err = Math.abs($scope.test.result - $scope.test.correctVal);
    };

    $scope.testBrainSin = function(){
        var testVal = $scope.test.val;
        var output = netToTest.run({ val: testVal });
        $scope.test.result = output.res;
        $scope.test.correctVal = Math.sin(testVal);
        $scope.test.err = Math.abs(output.res - $scope.test.correctVal);
    };

    var save = function(setType) {
        BrainFactory.save({type:setType, data: netToTrain.toJSON()})
        .then(function(savedNet){
            console.log('saved:', savedNet);
        });
    };

    var setUpGraph = function() {
        var canvas = document.getElementById('updating-chart'),
        ctx = canvas.getContext('2d'),
        startingData = {
            labels: [],
            datasets: [
                {
                    label: "Error %",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    data: []
                }
            ]
        };
        myLiveChart = new Chart(ctx).Line(startingData, {animationSteps: 120});
    };

    var addDataPoint = function(iteration, error) {
        myLiveChart.addData([Math.round(error * 1000000) / 1000000], iteration);
    };

});
