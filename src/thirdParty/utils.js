const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const multer = require('multer')

//zip all output files into one
function sendZip() {
    const out = fs.createWriteStream(path.resolve(__dirname, `../zip/nhut.zip`))
    const archive = archiver('zip', {
        zlib: { level: 9 }
      });
      archive.pipe(out);
      archive.directory(path.resolve(__dirname, `../output/`), false)
      archive.finalize()
    
}

//modified to find all related method
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

  //multer 

const storage = multer.diskStorage({
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
        if(!file.originalname.match(/\.(xlsx|xls|txt)$/)) {
           cb(new Error('Chỉ chấp nhận file excel'))
           
       }
        cb(undefined, true)
      
    }
})

module.exports = {
    uploadData,
    modString,
    sendZip
}