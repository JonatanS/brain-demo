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
        res.send(cleanedArr.slice(481));    //only send last 25 entries
    })
    .then(null, next);
});

router.get('/normalized', function (req, res, next) {
    var readFile = Promise.promisify(require("fs").readFile);
    var path = __dirname + '/housing.data';
    console.log(path);
    readFile(path)
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

        //for every column, find min, max, and normalize the current value to be between 0 and 1
        //todo: return an array of min and max for every column
        var normalizedArr = _.zip.apply(_,cleanedArr).map(function(col) {
            var max = _.max(col);
            var min = _.min(col);
            return col.map(function(val){
                return (val-min)/(max-min) || 0;    //return 0 in case of 'null'
            });
        });
        //zip again to flip matrix
        res.send(_.zip.apply(_,normalizedArr));
    })
    .then(null, next);
});
