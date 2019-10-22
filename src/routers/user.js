const express= require('express');
const router= new express.Router();
const User = require('../model/user')
const validateUser = require('../middleware/validateuser')
router.post('/user', async (req, res)=> {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save()
    res.status(201).send({
        user: user.publicUser(),
        token
    })
})
router.get('/user/login', (req, res) => {
    res.render('login')
})
router.post('/user/logins', validateUser, (req, res) => {
        res.status(200).send(req.user.publicUser())
})
router.post('/user/login', async (req, res)=> {
   try{
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    if(!user) {
       throw new Error('unable to login')
    }
    res.send({
        user: user.publicUser(),
        token
    })
   } catch (e) {
        res.status(400).send({err: e.message})
   }
    
})
router.get('/user/me', validateUser, async (req, res)=> {
    try {
       res.send(req.user)
    } catch(e) {
        res.status(400).send()
    }
})
router.get('/index', validateUser, (req, res) => {
    res.render('index', {
        user: 'nhut'
    })
})
module.exports = router;