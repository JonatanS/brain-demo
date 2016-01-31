var router = require('express').Router();
var Promise = require('bluebird');
var fs = require('fs');
module.exports = router;

router.get('/', function (req, res, next) {
    var readFile = Promise.promisify(require("fs").readFile);
    var path = __dirname + '/sentiment_data/' + req.query.filename;
    console.log(path);
    readFile(path)
    .then(function(file){
        res.send(file);
    })
    .then(null, next);
});
