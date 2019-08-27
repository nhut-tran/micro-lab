const Order = require('../model/order');
const express = require('express');
const router = new express.Router();
const multer = require('multer')
const fsExtra = require('fs-extra')
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
var mongoxlsx = require('mongo-xlsx');
const write = require('../thirdParty/write');
const config = [
'ISO 4831-DT:2006 (*)', 'ISO 4831-DL:2006 (*)', 'ISO 7251-DT:2005 (*)', 'ISO 7251-DL:2005 (*)'
, 'ISO 6579-1:2017 (*)', 'ISO 4832:2006 (*)'
,'ISO 9308-1:2014 (*)', 'ISO 16649-2:2001 (*)', 'ISO 7937:2004 (*)', 'ISO 4832:2006 (*)',
'ISO 21527-2:2008 (*)', 'ISO 6579-1:2017 (*)',  'ISO 21527-1:2008 (*)', 'ISO 6888-1:2003 (*)',
'ISO 21872-1:2017 (*)', 'ISO 21872-1-DL:2017 (*)','FDA/BAM Chapter 4:2002 revision 2013', 'ISO 6461-2:1986 (*)',
'ISO 7899-2:2000 (*)', 'ISO 6222:1999 (*)','ISO 11290-2:2004 (*)', 'ISO 11290-1:2004 (*)', 'ISO 19250:2010 (*)','ISO 16266:2006 (*)',
'ISO 7932:2004 (*)', 'ISO 6888-3:2003 (*)', 'ISO 13720:2010 (*)', 'ISO 21528-1:2004', 'ISO 15213:2003 (*)',
'ISO 21528-2:2004 (*)', 'ISO 21567:2004 (*)', 'NMKL 125:2005', 'NHS- W5:2005 (*)', 'ISO 4833-1:2013 (*)',
'TCVN 6187-2:1996', 'NMKL 86:2013 (*)'
];

function sendZip() {
    const out = fs.createWriteStream(path.resolve(__dirname, `../zip/nhut.zip`))
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });
      archive.pipe(out);
      archive.directory(path.resolve(__dirname, `../output/`), false)
      archive.finalize()
    
      
}
function modString (str) {
    if(str.includes('ISO') || str.includes('TCVN') || str.includes('NHS') ) {
        
        let  stArr = str.split(':');
        const resStr = stArr[0].split(' ')
        return resStr[1].toString()

    }
    else if(str.includes('FDA')) {
        let  stArr = str.split(' ');
        resStr = stArr.filter((e)=>e.includes(':'))
        return resStr.toString()
    } else if(str.includes('NMKL')) {
        
        let  stArr = str.split(':');
        const resStr = stArr[0]
        return resStr

    }
    else if(str.includes('SMEWW')) {
        let  stArr = str.split(' ');
        return stArr[1].toString()
    } else {
        console.log('not match', str)
        return str
    }
    
  
  }
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/upload/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname)
    }
  })
   
const uploadData = multer({
    storage: storage,
    fileFilter(req, file, cb) {
   //   if(file.originalname.endsWith('.jpg')||file.originalname.endsWith('.jpeg')||file.originalname.endsWith('.png')) {
        if(!file.originalname.match(/\.(xlsx|xls|txt)$/)) {
           cb(new Error('Chỉ chấp nhận file excel'))
           
       }
        cb(undefined, true)
      
    }
})
router.post('/order', uploadData.single('nhut'), async (req, res)=> {
   
    try {
        if(!req.file) {
            return res.send({mes: 'Không có file nào được chọn'})
        }
            const model = null;
            const xlsx  = './src/upload/nhut';
            mongoxlsx.xlsx2MongoData(xlsx, model,  function(err, data) {
                Order.deleteMany({}, ()=> {
                    data.forEach(async (e)=> {
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
                        const order = new Order(e)
                            await order.save()
                    })
                })
                
            res.send({mes: 'Thành Công'})
             });
    } catch (e) {
        res.status(500).send({err: e.message})
    }
    
}, (error, req, res, next)=> {
    res.send({mes: error.message})
})

router.get('/order', async (req, res)=> {
    fsExtra.emptyDirSync(path.resolve(__dirname, '../output/'))
    console.log(config.length)
   let all = await Order.find({}, { '_id': 0})
    
    for (const item of config) {
        const pathItem = item.replace(':','-').replace(' (*)', '')
        const modItem = modString(item)
        //item.replace('ISO ','').replace(' (*)', '')     
        const regex = new RegExp(modItem, "i")
        const data = await Order.find({Method: regex},null, {sort: {Code: 1}})
        if(data.length > 0) {
            write(data, pathItem, pathItem)
        } else {
            //console.log(modItem)
        }
       
        all = all.filter((e)=> {
           if(!e.Method.includes(modItem)) {
               return e
           }
        })
        // check last item to send data back
        if(config.findIndex((e) => e===item)===config.length-1) {
            write(all, 'output', 'output')
             sendZip()
             res.render('download')
          


        }
    }
    
})
router.get('/download', (req, res) => {
    res.set({'Content-Type': 'application/zip'})
    res.download('./src/zip/nhut.zip', `HaoBEDE-${new Date().toISOString().split('T')[0]}.zip`)
    // fs.createReadStream("./src/zip/nhut.zip").pipe(res);

})

module.exports = router