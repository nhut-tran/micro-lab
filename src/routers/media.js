const express = require('express');
const router = new express.Router();
const Media = require('../model/media');
const validate = require('../middleware/validate')
const validateUser = require('../middleware/validateuser')
router.post('/media', validateUser, async (req, res)=> {
    const media = new Media(req.body);
    try{
        await media.save()
        res.status(201).send()
    } catch (e) {
        res.status(500).send({err: e.message})
    }
    
})
router.get('/media/all', validateUser, async (req, res)=> {
    try {
        const result = await Media.find()
        if(result) {
            res.send(result)
        }
       
    } catch (e) {
        res.status(500).send({err:e.message})
    }
})
router.get('/media/:id', validate.validateMedia, async (req, res)=> {
    try {
        console.log(req.media)
        res.send(req.media)
    } catch (e) {
        res.status(500).send({err: e.message})
    }
   
})
router.patch('/media/:id', validate.validateMedia, async (req, res) => {
    try {
        const propUpdate = Object.keys(req.body) 
        propUpdate.forEach((prop) => {
            req.media[prop] = req.body[prop]
        })
        
        await req.media.save();
        res.send()
    } catch (e) {
        res.status(500).send({err: e.message})
    }
    
});

router.delete('/media/:id', validate.validateMedia, async (req, res)=> {
    try {
        if (req.media.useIn.length > 0) {
                return res.status(400).send({errr: 'media is ussing in at least one method. Can not be deleted'})
        }
        await req.media.remove();
        res.send()
    } catch (e) {
        res.status(500).send({err: e.message})
    }
    
})



module.exports = router