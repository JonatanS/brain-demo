var router = require('express').Router();
var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
module.exports = router;

router.get('/', function (req, res, next) {
    var readFile = Promise.promisify(require("fs").readFile);
    var path = __dirname + '/housing.data';
    console.log(path);
    readFile(path)
    .then(function(file){
        res.send(file);
    })
    .then(null, next);
});

router.get('/normalized', function (req, res, next) {
    var readFile = Promise.promisify(require("fs").readFile);
    var path = __dirname + '/housing.data';
    console.log(path);
    readFile(path)
    // .then(function(contents){
    //     return eval(contents.toString());
    // })
    .then(function(myFile){
        var file = myFile.toString();

        var unfilteredArr = file.split('\n').map(function(line) {
                return line.split(' ').filter(function(entry){
                    return entry != "";
                });
            });
        var cleanedArr = unfilteredArr.map(function(subArr) {
            return subArr.map(function(entry) {
                return Number(entry.trim());
            });
        });

        var normalizedArr = _.zip(cleanedArr).map(function(col) {
            var max = Math.max(...col);
            var min = Math.min(...col);

            return col.map(function(val){
                return (val-min)/(max-min);
            });
        });
        //zip again to flip matrix
        res.send(_.zip(normalizedArr));
    })
    .then(null, next);
});
