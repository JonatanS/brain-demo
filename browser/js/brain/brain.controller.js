//brain.controller.js
app.controller('BrainCtrl', function ($scope, BrainFactory) {
    var net = new brain.NeuralNetwork();
    var myLiveChart;
    console.log('in the b-ctrl');
    console.dir(brain);
    $scope.training = {
        size: 200
    };
    $scope.settings = {
        threshold: 5,
        iterations: 20000
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

        net.train(trainArr,{
            errorThresh: $scope.settings.threshold/10000,  // error threshold to reach
            iterations: $scope.settings.iterations,   // maximum training iterations
            log: function () { addDataPoint(arguments[1], arguments[3]); },           // console.log() progress periodically
            logPeriod: 100,       // number of iterations between logging
            learningRate: 0.3   // learning rate
        });

        console.log('done training:');

        $scope.save();
        // debugger;

    };

    var testBrain = function(){
        console.log('testing');
        var testVal = .3333
        var output = net.run({ val: testVal });
        console.log(output, Math.sin(testVal));
        console.dir(net);
    }

    $scope.load = function(typesToLoad) {
        // if(typeof typesToLoad !== 'object') typesToLoad = {};
        BrainFactory.load(typesToLoad).then(function(allSets){
            console.log(allSets);
            //find latest where type === 'sin' and do net.fromJSON()
            var latest = allSets.pop().data;
            // var latest = allSets[0].data;
            console.log(latest);
            var netClone = new brain.NeuralNetwork();
            netClone.fromJSON(latest);
            var testVal = .666
            var output = netClone.run({ val: testVal });
            console.log(output, Math.sin(testVal));
        });
    }

    $scope.save = function() {
        BrainFactory.save({type:'sin', data: net.toJSON()})
        .then(function(savedNet){
            console.log('saved:', savedNet);
            testBrain();
        });
    }

    var addDataPoint = function(iteration, error) {
        myLiveChart.addData([Math.round(error*1000000)/1000000], iteration);
    }

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
        }

        myLiveChart = new Chart(ctx).Line(startingData, {animationSteps: 120});
    }

});
