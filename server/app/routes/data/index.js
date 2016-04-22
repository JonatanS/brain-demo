var router = require('express').Router();
var fs = require('fs');
module.exports = router;
const mongoose = require('mongoose');
var Data = mongoose.models.Data;

router.get('/', function (req, res) {
    Data.find({}).then(function(allData){
        res.send(allData);
    });
});

router.post('/', function (req, res) {
    console.log(req.body);
    return Data.create(req.body).then(function(newData){
        res.send(newData);
    }).then(null, function(err){
        console.error(err);
    });
});
