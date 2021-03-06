const Order = require('../model/order');
const mongoose = require('mongoose')
const express = require('express');
const router = new express.Router();
const fsExtra = require('fs-extra')
const path = require('path')
const util = require('../thirdParty/utils')
var mongoxlsx = require('mongo-xlsx');
const write = require('../thirdParty/write');
const validateUser = require('../middleware/validateuser')
const config = [
'ISO 4831-DT:2006 (*)', 'ISO 4831-DL:2006 (*)', 'ISO 7251-DT:2005 (*)', 'ISO 7251-DL:2005 (*)'
, 'ISO 6579-1:2017 (*)', 'ISO 4832:2006 (*)','ISO 9308-1:2014 (*)', 'ISO 16649-2:2001 (*)', 'ISO 7937:2004 (*)', 'ISO 4832:2006 (*)',
'ISO 21527-2:2008 (*)', 'ISO 6579-1:2017 (*)',  'ISO 21527-1:2008 (*)', 'ISO 6888-1:2003 (*)', 'ISO 21872-1:2017 (*)', 'ISO 21872-1-DL:2017 (*)', 'ISO 6461-2:1986 (*)',
'ISO 7899-2:2000 (*)', 'ISO 6222:1999 (*)','ISO 11290-2:2004 (*)', 'ISO 11290-1:2004 (*)', 'ISO 19250:2010 (*)','ISO 16266:2006 (*)',
'ISO 7932:2004 (*)', 'ISO 6888-3:2003 (*)', 'ISO 13720:2010 (*)', 'ISO 21528-1:2004', 'ISO 15213:2003 (*)',
'ISO 21528-2:2004 (*)', 'ISO 21567:2004 (*)', 'NMKL 125:2005', 'NHS- W5:2005 (*)', 'ISO 4833-1:2013 (*)','TCVN 6187-2:1996', 'NMKL 86:2013 (*)'
];

router.post('/order/validate', validateUser, (req, res) => {
    res.send()
})
router.post('/order', validateUser, util.uploadData.single('nhut'), async (req, res, next)=> {
  
    try {
        
        if(!req.file) {
            
         return res.send({mes: 'Không có file nào được chọn'})
        }
            const model = null;
            const xlsx  = './src/upload/nhut';
            if(!fsExtra.existsSync(xlsx)) {
                throw new Error('Lỗi hệ thống, Vui lòng quay lại sau')
            }
            let order = await Order.findOne({user: req.user._id})
                    if(!order) {
                        order = await new Order({
                            user: req.user._id
                        }) 
            } else {
                //not first time overwrite old data
                order.datas = []
             
            }
            mongoxlsx.xlsx2MongoData(xlsx, model,  async function(err, data) {
                if(data) {
                       const modeldata = data.map((e)=> {
                            if(e.Method === 'FDA/BAM CHAPTER 18:2001') {
                                e.Method = 'ISO 21527-1:2008 (*)'
                            }
                            if(e.Method.includes('7251:2005')|| e.Method.includes('4831:2006')||e.Method.includes('21872-1:2017')){
                                
                                    const midd = e.Method.split(':')
                                
                                if(e.Unit.split('/')[0]===''){
                                    midd[0] = midd[0]+'-DT:';
                                } else {
                                    midd[0] = midd[0]+ '-DL:'
                                }
                                e.Method = midd.toString()
                            }
                            order.add(e)
                        })
                    //check if user first time use this function=> create new document
                    await order.save()
                    res.status(200).send({mes: 'Nạp dữ liệu thành Công'})
                   
                }
                
             });
    } catch (e) {
        res.send({err: e.message})
    }
    
}, (error, req, res, next)=> {
    res.send({err: error.message})

})

router.get('/order',validateUser, async (req, res)=> {

    //emty ouput folder
    fsExtra.emptyDirSync(path.resolve(__dirname, '../output/'))
    //get all data to check later
    let all = await Order.findOne({user: req.user._id}).select('datas')
    //loop throug all config method
    for (const item of config) {
        const pathItem = item.replace(':','-').replace(' (*)', '') //modify method -> filename
        const modItem = util.modString(item)
        const regex = new RegExp(modItem, "i")
        const pipeline = [{$match : {'datas.Method': regex}}]
        let data = await Order.aggregate([{
            "$match": {
                "user": new mongoose.mongo.ObjectId(req.user._id)
            }
        }, {
            "$unwind": "$datas"
        },{
            "$sort": {
                "datas.Code": 1
            }
        },{
                "$project": {
                    "_id": 0,
                    "datas": 1,
                }
            }
        
    ]).facet({
            datas: pipeline
        })
        data = data[0].datas.map((e)=>e.datas)
        if(data.length > 0) {
            write(data, pathItem, pathItem)
        } 
       //check method not have form
        all.datas = all.datas.filter((e)=> {
            console.log(e.Method)
           if(!e.Method.includes(modItem)) {
               return e
           }
        })
        // check last item to send data back
        if(config.findIndex((e) => e===item)===config.length-1) {
            write(all.datas, 'output', 'output') //write method not have form in output form
             util.sendZip()
             res.send({mes:'Xong'})

        }
    }
    
})

router.get('/download', (req, res) => {
    res.set({'Content-Type': 'application/zip'})
    res.download('./src/zip/nhut.zip', `nhut-${new Date().toISOString().split('T')[0]}.zip`, ()=> {
      
    });
    
    // fs.createReadStream("./src/zip/nhut.zip").pipe(res);

})

router.get('/order/test', validateUser, async (req, res) => {
    // const data = await Order.findOne({user: req.user._id}, 'datas')
    // const datas = data.datas.filter((e)=> {
    //     if(e.Method.includes('6888-1')){
            
    //         return e
    //     }
    // })
    // res.send(datas)
    //ISO 6888-1:2003 (*)
    const modItem = util.modString('ISO 6888-1:2003 (*)')
    console.log(modItem)
    const regexs = new RegExp(modItem, "i")
    const pipeline = [{$match : {'datas.Method': regexs}}]
    const data = await Order.aggregate([{
        "$match": {
            "user": new mongoose.mongo.ObjectId(req.user._id)
        }
    }, {
        "$unwind": "$datas"
    },{
        "$sort": {
            "datas.Code": 1
        }
    },{
            "$project": {
                "_id": 0,
                "datas": 1,
            }
        }
    
]).facet({
        datas: pipeline
    })
    
    res.send(data[0].datas.map((e)=>e.datas))
}) 
module.exports = router
// ,{
//     "$group": {
//         "datas": {
//             "$push": "$datas"
//         },
//         "_id": 0
//     }
//  },{
//     "$project": {
//         "_id": 0,
//         "datas": 1
//     }
// },
// {
//     "$redact": {
//         "$cond": [
//             { "$eq": ["$datas.method", ''] },
//             "$$KEEP",
//             "$$PRUNE"
//         ]
//     }
// }