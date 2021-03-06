const mongoose = require('mongoose');
const Media = require('./media')
const methodSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    type: {
        type: String,
        trim: true,
        required: true
    },
 
    steps: [{
                name:{
                    type: String,
                    required: true
                },
                media: [
                    {
                        mediaName : {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true,
                            ref: 'Media'
                        },
                        mediaQuantity: {
                            type: Number,
                            required: true,
                        },
                        mediaUnit: {
                            type: String,
                            required: true
                        }
                        
                    }

                ] 
        
    }],
    
    duration: {
        long: {
            type: Number,
            required: true
        },
        short: {
            type: Number,
            default: 0
        }
    },

    controlStrain: {
        positive: {
            type: String,
            required: true
        },
        negative: {
            type: String,
            required: true
        }
    },

    ReadingInterval: {
        top: {
            type: Number,
        },
        bottom: {
            type: Number
        }
    }

    
});

methodSchema.virtual('medium', {
    ref: 'Media',
    localField: '_id',
    foreignField: 'useIn.method'
})



methodSchema.methods.publicMethod = async function () {
    const method = this;
   await method.populate(`steps.media.mediaName`, 'name').execPopulate();
   return method
}
methodSchema.methods.saveMedia = async function () {
    const method = this;
    const methodId = {method: method._id}
    method.steps.map(async (step)=> {
      for (let i of step.mediaQuantity) {
        const media = await Media.findById(i.mediaName)
        media.useIn = media.useIn.concat(methodId)
       await media.save()
      }
    })

}
methodSchema.methods.updateMedia = async function() {
    const method =this;
   await method.steps.map(async (step)=> {
        for (let i of step.mediaQuantity) {
          const media = await Media.findById(i.mediaName)
          media.useIn = []
          await media.save()
        }
      })

}
methodSchema.pre('remove', async function(next) {
    await this.populate('medium').execPopulate();
   if(this.medium) {
        for (let id of  this.medium) {
       const media = await Media.findById(id._id);
        media.useIn.splice(media.useIn.findIndex(e => e.method === id._id), 1)
     await media.save()
    }
   }
   next()
})
const Method = mongoose.model('method', methodSchema);
module.exports = Method;
