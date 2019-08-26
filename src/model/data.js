const mongoose = require('mongoose');
const Dataschema = new mongoose.Schema({
    data: {
        type: Buffer
    }
});
const inputData = mongoose.model('Data', Dataschema)
module.exports = inputData