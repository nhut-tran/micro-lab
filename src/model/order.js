const mongoose = require('mongoose');
const Orderchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    datas: [
             {
            Code: {
                type: String
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
            }
     ]
    
});

Orderchema.methods.add = function async (data) {
    this.datas = this.datas.concat({
        Code: data.Code,
        name: data.name,
        Method: data.Method,
        Unit: data.Unit
    })
}

const workOrder = mongoose.model('WorkOrder', Orderchema)
module.exports = workOrder