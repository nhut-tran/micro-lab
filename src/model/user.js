const mongoose = require('mongoose');
const validator= require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(val) {
            if(!validator.isEmail(val)) {
                throw new Error('Not valid Email')
            }
        }
    },
    password: {
        type: String,
        require: true,
        validate(value) {
            if(value.length < 8 || value.includes('password')) {
                throw new Error('password length >= 8')
            }
        },
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            require:true
        },
    }],
});
Userschema.virtual('order', {
    ref: 'WorkOrder',
    localField: '_id',
    foreignField: 'user'
})

Userschema.methods.generateAuthToken = async function () {
    const token = await jwt.sign({_id: this._id.toString()}, process.env.JWT, {expiresIn: `1 day`})
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}
Userschema.pre('save', async function (next) {
    const user = this;
   if(user.isModified('password')){
     user.password =   await bcrypt.hash(user.password, 8);
   }
   next()
})
Userschema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email})
    if(!user) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('unable to login')
    }

    return user
}
Userschema.methods.publicUser = function () {
    const publicUserObj = this.toObject()
    delete publicUserObj.password
    delete publicUserObj.tokens
    return publicUserObj
}
const user = mongoose.model('User', Userschema);
module.exports = user;