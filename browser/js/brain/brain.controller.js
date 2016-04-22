//brain.controller.js


app.controller('BrainCtrl', function ($scope, BrainFactory) {
    var netToTrain = new brain.NeuralNetwork();
    var netToTest = new brain.NeuralNetwork();
    var myLiveChart, detailedHousingArr, detailedPipesArr, netToSave;

    // $scope.training = {
    //     size: 200
    // };

    $scope.settings = {
        threshold: 5,
        iterations: 10000,
        logPeriod: 5000,
        setSize: 2000
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
    };

    $scope.testPipesSet = {
        data: []
    };

    $scope.allSets = {
        data: []
    };

    $scope.trainFromHousingSet = function() {
        BrainFactory.readHousingData()
        .then(function(fileArr) {
            //use 480 entry to train
            var trainArr = fileArr.slice(0,$scope.settings.setSize);
            //use remaining 36 entries for testing:
            $scope.testHousingSet.data = fileArr.slice($scope.settings.setSize + 1);
            train('housing',trainArr);
        });
    };

    $scope.trainFromPipesSet = function() {
        BrainFactory.readPipesData()
        .then(function(fileArr) {
            
            //use 480 entry to train
            var trainArr = fileArr.slice(0,$scope.settings.setSize);
            //use remaining 36 entries for testing:
            $scope.testPipesSet.data = fileArr.slice($scope.settings.setSize + 1);
            train('pipes',trainArr);
        });
    };

    $scope.trainFromReviews = function() {
        BrainFactory.readTextFile($scope.trainingSet.selectedSet)
        .then(function(fileArr) {
            var trainArr = fileArr.map(function(subArr){
                return {input: subArr[0], output: subArr[1]};
            });
            trainArr.pop();
            train('reviews',trainArr);
        });
    };

    $scope.createSinTrainingSet = function() {
        var trainArr = [];
        for (var i = 0; i < $scope.settings.setSize; i++) {
            trainArr.push(
                {input: {val:i/($scope.settings.setSize-1)},
                output: {res: Math.sin(i/($scope.settings.setSize-1))}}
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
            log: function () { addDataPoint(arguments[1], arguments[3]); },
            logPeriod: $scope.settings.logPeriod,       // number of iterations between logging
            learningRate: 0.3   // learning rate
        });
        console.log('done training:');
        console.dir(netToTrain);
        netToTest = netToTrain;
        save(setType);
    };

    $scope.load = function(typesToLoad) {
        BrainFactory.load(typesToLoad)
        .then(function(allSets){
            $scope.allSets.data = allSets;   //ng-select from here
        });

        if(typesToLoad === 'housing') {
            BrainFactory.readHousingInfo()
            .then(function (housingInfoArr){
                detailedHousingArr = housingInfoArr;
            });
        }

        else if(typesToLoad === 'pipes') {
            BrainFactory.readPipesInfo()
            .then(function (pipesInfoArr){
                detailedPipesArr = pipesInfoArr;
            });
        }
    };

    $scope.selectSetById = function() {
        //var selected = JSON.parse($scope.testHousingSet.selectedTrainingSet).data;
        var selected = JSON.parse($scope.testPipesSet.selectedTrainingSet).data;
        netToTest.fromJSON(selected);
        console.log("set from the DB:");
        console.dir(selected);
        //BrainFactory.readHousingData()
        BrainFactory.readPipesData()
        .then(function(fileArr) {
            //$scope.testHousingSet.data = fileArr.slice($scope.settings.setSize + 1);  //trim of entries for testing
            $scope.testPipesSet.data = fileArr.slice($scope.settings.setSize + 1);  //trim of entries for testing
        });
    };

    $scope.testBrainPipes = function() {
        var idx = Number($scope.testPipesSet.selectedIndex);
        var testVal = $scope.testPipesSet.data[idx].input;
        var output = netToTest.run(testVal);
        console.log('result:', JSON.stringify(output[0]));
        $scope.test.result = output[0];
        $scope.test.correctVal = $scope.testPipesSet.data[idx].output[0];
        $scope.test.err = Math.abs($scope.test.result - $scope.test.correctVal);
        $scope.test.detailedInput = detailedPipesArr[idx];
    };

    $scope.testBrainHousing = function() {
        var idx = Number($scope.testHousingSet.selectedIndex);
        var testVal = $scope.testHousingSet.data[idx].input;
        var output = netToTest.run(testVal);
        console.log('result:', JSON.stringify(output[0]));
        $scope.test.result = output[0];
        $scope.test.correctVal = $scope.testHousingSet.data[idx].output[0];
        $scope.test.err = Math.abs($scope.test.result - $scope.test.correctVal);
        $scope.test.detailedInput = detailedHousingArr[idx];
    };

    $scope.testBrainSin = function(){
        var testVal = $scope.test.val;
        var output = netToTest.run({ val: testVal });
        $scope.test.result = output.res;
        $scope.test.correctVal = Math.sin(testVal);
        $scope.test.err = Math.abs(output.res - $scope.test.correctVal);
    };

    var save = function(setType) {
        netToSave = {type:setType, data: netToTrain.toJSON(), setSize: $scope.settings.setSize, iterations: $scope.settings.iterations }
        $scope.allSets.data.push(netToSave);
        return BrainFactory.save(netToSave)
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
