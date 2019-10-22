const express =require('express');
const app =  new express()
const path = require('path')
const port = process.env.PORT
const hbs = require('hbs');
require('./db/mongoose')
//import routers
const methodRouter = require('./routers/method')
const mediaRouter = require('./routers/media')
const orderRouter = require('./routers/order')
const userRouter = require('./routers/user')
//set satic asset and path
const staticPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../view')
const partials = path.join(__dirname, '../view/partials');
//resgister view engine
hbs.registerPartials(partials);
app.use(express.static(staticPath))
app.set('views', viewPath)
app.set('view engine', 'hbs')
app.use(express.json())
//route
app.use(mediaRouter);
app.use(methodRouter);
app.use(orderRouter);
app.use(userRouter);
app.get('', (req, res) =>{
    res.render('index')
})
// app.get('', async (req, res) => {
//     const media = new Media({
//         description: 'AAA',
//         completed: false
//     })

//     await media.save()

//     res.send({
//         media
//     })
// })
app.get('/login', (req, res) => {
    res.render('login')
})
app.listen(port, ()=> {
    console.log('Server is on' + port)
})
// const Media = require('./model/media')
// const Method = require('./model/method');

// const test = async () => {
//         // const media = await Media.findById('5d591bf34c14e709f4532bd8');
//         // await media.populate('useIn.method').execPopulate()
//         const method = await Method.findById('5d5c1811af146724e4597cd1').where()
        
//     //     await await method.populate({ path: 'medium'}).execPopulate()
//     //    console.log(method.medium)
// }
//test()



// function modString (e) {
//     if(e.method === 'FDA/BAM CHAPTER 18:2001') {
//         e.method = 'ISO 21527-1:2008 (*)'
//     }
//     if(e.method.includes('7251:2005')|| e.method.includes('4831:2006')){
//         if(e.Unit.split('/')[0]===''){
//             e.method = e.method+ '-DT'
//         } else {
//             e.method = e.method+ '-DL'
//         }
//     return e
//     }

//     // if(str.includes('ISO')) {
//     //     let  stArr = str.split(':');
//     //     const resStr = stArr[0].split(' ')
//     //     return resStr[1].toString()
//     // }
//     // if(str.includes('FDA')) {
//     //     let  stArr = str.split(' ');
//     //     resStr = stArr.filter((e)=>e.includes(':'))
//     //     return resStr.toString()
//     // }
//     // if(str.includes('SMEWW')) {
//     //     let  stArr = str.split(' ');
//     //     return stArr[1].toString()
//     // }
  
//   }

//  console.log(modString({
//     "Code" : "44150",
//     "name" : "Cốm gạo",
//     "Specification" : "Total the spores of Yeast, Mould/Tổng bào tử men mốc",
//     "method" : "ISO 47251:2005 (*)",
//     "Unit": '/g',
//     "__v" : 0
// }))
//   //const a = 'cf/25cm2' + 'DT'
// //  console.log(a.split('/')[0]==='cf')
// //console.log(a)

// function modString (str) {
//     if(str.includes('NMKL')) {
//         let  stArr = str.split(':');
//         console.log(stArr)

//         const resStr = stArr[0]
//         return resStr

//     }
// }
//console.log(modString('NMKL 86:2013 (*)'))
