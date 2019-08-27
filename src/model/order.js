const mongoose = require('mongoose');
const Orderchema = new mongoose.Schema({
    Code: {
        type: Number
    },
    name: {
        type: String,
        trim: true
    },
    Specification: {
        type: String
    },
    Method: {
        type: String
    },
    Unit: {
        type: String
    }
});
const workOrder = mongoose.model('WorkOrder', Orderchema)
module.exports = workOrder