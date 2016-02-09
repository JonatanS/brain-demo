
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    date_created: {type: Date, default: Date.now},
    type: {type: String, enum: ['sin', 'housing'], required: true},
    data: {type: Object, required: true},
    iterations: Number,
    setSize: Number
}, {minimize: false});  //this setting will not convert empty object to null

mongoose.model('Data', schema);
