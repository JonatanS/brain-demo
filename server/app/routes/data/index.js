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
    // var upload = req.body;
    // var data = JSON.stringify(req.body.data).toString();
    // //debugger;
    // console.log(data);
    Data.create(req.body).then(function(newData){
        res.send(newData);
    });
});
