const express = require('express');
const router = new express.Router();
const Method = require('../model/method');
const Media = require('../model/media');
const validate = require('../middleware/validate')
router.get('/method', (req, res)=> {
    res.render('index')
})

//create new method
router.post('/method', async (req, res)=> {
    try {
        
        const method = new Method(req.body);
       await method.save();
      await  method.saveMedia()
        const public = await method.publicMethod()
        res.status(201).send(public)
    }
    catch (e) {
            res.status(400).send({err: e.message})
    }
    
})
//get method byId
router.get('/method/:id', validate.validateMethod,  async (req, res)=> {
    try {
        const public =  await req.method.publicMethod()
        res.send(public)
    } catch (e) {
        res.status(401).send({err: e.message})
    }
   
});

router.get('/method/media/:id', validate.validateMethod, async (req, res)=> {
    try {
        await req.method.populate({ path: 'medium', select: 'name' }).execPopulate()
        const public = req.method.medium.map(e=>e.name)
        res.send(public)
    } catch (e) {
        res.status(401).send({err: e.message})
    }
    
})
router.patch('/method/:id', validate.validateMethod, async (req, res)=> {
    
       // const method = await Method.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        // if(method) {
        //    res.send()
        // }
    try {
            const propUpdate =  Object.keys(req.body);
        //get the media name of incoming update
        const mediaName=[]
        req.body.steps.map((step)=> {
            for (let i of step.mediaQuantity) {
                mediaName.push(i.mediaName)

            }
        })
        //get the media of current data in database
        const refmedia =[];
        req.method.steps.map((step)=> {
            for (let i of step.mediaQuantity) {
            refmedia.push(i.mediaName.toString())
            }
        });
        //check which media name not macth...
        const isupdate = mediaName.map((e, i)=> {
            if(!refmedia.includes(e)){
                return {
                    name: e,
                    index: i
                }
            
            }
        }).filter(e=>e) //filter to remove undefined if any
        //check length if equal -> no media is deleted or new media add in
        if(mediaName.length === refmedia.length){
            if(isupdate.length > 0){
                isupdate.map(async (e)=> {
                    // add new id method to new media
                    const newMedia = await Media.findById(e.name)
                    newMedia.useIn = newMedia.useIn.concat({method: req.method._id})
                    await newMedia.save();
                    // delete id metho from the old one
                    const oldMedia = await Media.findById(refmedia[e.index]);
                    oldMedia.useIn= oldMedia.useIn.filter((e) => e.method.toString() !==req.method._id.toString())
                    await oldMedia.save()
                    })
            }
        // check if media is added
        } else if (mediaName.length > refmedia.length) {
                isupdate.map(async (e)=> {
                    // add new id method to new media
                    const newMedia = await Media.findById(e.name)
                    newMedia.useIn = newMedia.useIn.concat({method: req.method._id})
                    await newMedia.save();
                })
        } else if(mediaName.length < refmedia.length) {
            const revUpdate = refmedia.map((e, i)=> {
                if(!mediaName.includes(e)){
                    return {
                        name: e,
                        index: i
                    }
                
                }
            }).filter(e=>e) 
            revUpdate.map(async (e)=> {
                // delete id metho from the old one
                const oldMedia = await Media.findById(refmedia[e.index]);
                oldMedia.useIn= oldMedia.useIn.filter((e) => e.method.toString() !==req.method._id.toString())
                await oldMedia.save()
                })
        }

        //   console.log(mediaName);
        //   console.log(refmedia)
        //   console.log(isupdate)
        propUpdate.forEach((prop) => {
            req.method[prop] = req.body[prop]
        })
        
        await req.method.save();
        res.send()
    
    } catch (e) {
        res.status(401).send()
    }
       
})
router.delete('/method/:id', validate.validateMethod, async (req, res)=> {
    await req.method.remove()
        res.send()
})

module.exports = router  