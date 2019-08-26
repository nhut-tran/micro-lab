const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
            byUsage: {
                type: String,
                trim: true,
                required: true
            },
    
            byPhysical: {
                type: String,
                trim: true,
                required: true
            }
    },
    description: {
        type: String
    },
    gramperlit: {
        type:Number,
        required: true,
        validate (value) {
            if(value <= 0) {
                throw new Error('this field must be > 0')
            }
        }
    },
    useIn: [
       {
           method: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'method'
           }
       } 
        
    ]
})

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media