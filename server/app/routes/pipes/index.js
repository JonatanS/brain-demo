var router = require('express').Router();
var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);
var json2csv = require('json2csv');
module.exports = router;

router.get('/cleanAndSaveFile', function (req, res, next) {
    var readPath = __dirname + '/pipes_500k.csv';
    readFile(readPath)
    .then(function(myFile){
        var file = myFile.toString();
        var dirtyArr = file.split('\n').map(line=> {
        	return line.split(',');
        });
        var fields = ['length', 'kips', 'min_thkn', 'max_thkn', 'min_wght_asd', 'limit_state_asd', 'slenderRat']

        dirtyArr = dirtyArr.splice(1);	//remove header row
        dirtyArr.pop();	//remove last empty row
        var simpifiedArr = dirtyArr.map(entry => {
        	var shortEntry = {};
        	shortEntry.length = Number(entry[0]);
        	shortEntry.kips = Number(entry[1]);
        	shortEntry.min_thkn = Number(entry[4]);
        	shortEntry.max_thkn = Number(entry[5]);
        	shortEntry.min_wght_asd = entry[6];
        	shortEntry.limit_state_asd = entry[7];
        	shortEntry.slenderRat = Number(entry[8].split('\r')[0]);
        	return shortEntry;
        });
        json2csv({data: simpifiedArr, fields: fields}, function(err, csv){
    		var writePath = __dirname + '/pipes_clean.csv';
        	writeFile(writePath, csv).then(null, next);
        });

        res.send({"message":"file saved", data:simpifiedArr});
    })
    .then(null, next);
});

router.get('/normalized', function (req, res, next) {
    var readPath = __dirname + '/pipes_clean.csv';
    readFile(readPath).then(myFile =>{
    	myFile = myFile.toString();
        var largeArr = myFile.split('\n').map(line=> {
        	return line.split('\r')[0].split(',').filter(function(entry){
				return entry != "";
			});
		});
		var headerRow = largeArr[0].map(e => e.trim());
		var legend = [];
        largeArr = largeArr.splice(1);	//remove header row
        largeArr.pop();	//remove last empty row

        //reverser matrix:
		var normalizedArr = _.zip.apply(_,largeArr).map(function(col, index) {
        //for each column:
        	//if is number: find min and max and normalize
        	if (isNumber(col[0])) {
				var max = _.max(col);
				var min = _.min(col);

				//add to legend:
				//var legendObj = {}
				console.log(headerRow[index]);
				legend.push({"name": headerRow[index].toString(), "type": "number", "min": min, "max": max})
				return col.map(val => (val-min)/(max-min) || 0);    //return 0 in case of 'null'
        	}
        	//if is label: find all uniq labels and replace with val btwn 0 and 1
        	else {
				var uniqLabels = _.uniq(col);
				var numLabels = uniqLabels.length;
				legend.push({"name": headerRow[index], "type": "label", "values": uniqLabels.map((e, i) =>{
					//console.log('e', e, 'i', i)
					return {
						"key": e, "val": i/(numLabels -1) || 0};
					})
				});
				
				return col.map(val => legend[index].values[val] || 0);
        	}
        });

        res.send({"legend": legend, "data": _.zip.apply(_,normalizedArr)});
    })
    .then(null, next);

});

//http://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};