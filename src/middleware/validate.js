const Method = require('../model/method');
const Media = require('../model/media');

const validateMethod = async (req, res, next) => {
    try {
        const method = await Method.findById(req.params.id);
        console.log(req.params.id)
        if(!method) {
          return  res.status(401).send({err: 'method not exist'})
        }
        req.method = method
        next()
    } catch (e) {
        res.status(401).send()
    }
    
}

const validateMedia = async (req, res, next) => {
    try {
        const media = await Media.findById(req.params.id);
        if(!media) {
            return res.status(401).send({err: 'Media not found'})
        }
        req.media = media
         next()
    } catch(e) {
        res.status(500).send()
    }
    
}

module.exports = {
    validateMedia,
    validateMethod
}