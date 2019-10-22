const User = require('../model/user');
const jwt = require('jsonwebtoken');

const validateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        
        const decoded = jwt.verify(token, process.env.JWT)
        const user = await User.findOne({_id: decoded}, {id: 0})
        if(!user) {
            throw new Error('Please Auth')
        }
        req.user = user;
        next()
    }catch(e) {
        res.status(400).send({mes:'Ban chua dang nhap'})
    }
  
}

module.exports = validateUser