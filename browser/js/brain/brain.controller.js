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
        iterations: 20000
    };

    $scope.test = {
        val: 0.5,
        result: '',
        correctVal: '',
        err: ''
    };

    // var size = 400;
    // var iterations = 20000;
    $scope.train = function() {
        if(myLiveChart) myLiveChart.destroy();
        setUpGraph();
        var trainArr = [];
        for (var i = 0; i < $scope.training.size; i++) {
            trainArr.push(
                {input: {val:i/($scope.training.size-1)},
                output: {res: Math.sin(i/($scope.training.size-1))}}
            )
        }

        netToTrain.train(trainArr,{
            errorThresh: $scope.settings.threshold/10000,  // error threshold to reach
            iterations: $scope.settings.iterations,   // maximum training iterations
            log: function () { addDataPoint(arguments[1], arguments[3]); },           // console.log() progress periodically
            logPeriod: 100,       // number of iterations between logging
            learningRate: 0.3   // learning rate
        });
        console.log('done training:');
        console.dir(netToTrain);
        netToTest = netToTrain;
        save();
        // debugger;

    };

    $scope.load = function(typesToLoad) {
        // if(typeof typesToLoad !== 'object') typesToLoad = {};
        BrainFactory.load(typesToLoad).then(function(allSets){
            //find latest where type === 'sin' and do net.fromJSON()
            var latest = allSets.pop().data;
            // var latest = allSets[0].data;
            console.log(latest);
            netToTest.fromJSON(latest);
        });
    };

    $scope.testBrain = function(){
        console.log('testing');
        var testVal = $scope.test.val;
        var output = netToTest.run({ val: testVal });
        console.log(output);
        $scope.test.result = output.res;
        $scope.test.correctVal = Math.sin(testVal);
        $scope.test.err = Math.abs(output.res - $scope.test.correctVal);
        console.log(output.res, Math.sin(testVal));
    };
    var save = function() {
        BrainFactory.save({type:'sin', data: netToTrain.toJSON()})
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
