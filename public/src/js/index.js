console.log('nhut')
import * as Usermodel from './models/user'
import * as Userview from './views/userView'
import * as Orderview from './views/orderView'
import * as Ordermodel from './models/order'
import {renderLoader, clearLoader, renderFalseLogin} from './views/base'
import {validate} from './models/validateUser'
import * as mediaModel from './models/media'
import * as mediaView from './views/mediaView'
import * as methodModel from './models/method'
import * as methodView from './views/methodviews'
const state = {}
//check token of user
const retainToken = localStorage.getItem('token')
if(retainToken) {
    state.token = retainToken;
    console.log(state.token)
}
const controlLogin = async ()=> {
    //login
    const getLogin = Userview.getLogin()
    const user = new Usermodel.User(getLogin.email, getLogin.password)
    await user.login()
    //if login successful
   if(user.token) {
    //set token in local storage
       localStorage.setItem('token', user.token)

    //clear UI
       Userview.clear()

    //display user name on main nav
       Userview.displayUserName(user.name)
       state.user = user.name
    //set main-nav active
       document.querySelector('.main-nav').classList.remove('disbaleAll')
   }
   //render err if any
   if(user.err) {
       Userview.displayErrLogin(user.err)
   }
    
}
const retainLogin = async () => {
    const data = await validate(`/user/logins`, retainToken)
    if(!data) {
    const removeMainNav = document.querySelector('.main-nav')
    removeMainNav.classList.add('disbaleAll')
     const a =  renderFalseLogin()
     a.addEventListener('click', () => {
         controlLogin()
        
     })
     return
    }
        
    Userview.displayUserName(data.name)
    
}
//check retain login user
window.onload = async function  () {
    await retainLogin()
}

// document.querySelector('.dangnhap').addEventListener('click', () => {
//     Userview.dislayLoginForm()
//     document.querySelector('.submit').addEventListener('click', async ( e) => {
//         controlLogin()
        
//     })
// })


//////////////////////////////---WorkOrder-----///////////////////////////////////////////////

document.querySelector('.order').addEventListener('click', async () => {
    
    Orderview.displayOrder()
    document.getElementById('data').addEventListener('change',(e) => {
            document.getElementById('filename').textContent = e.target.files[0].name
            document.getElementById('sends').style.display='inline'
        })
    document.getElementById('data-form').addEventListener('submit', async (e) => {
            e.preventDefault()
            let data = document.getElementById("data").files[0];
            let formData = new FormData(); 
            formData.append("nhut", data);
            let parent = document.querySelector('.header-text-box')
            renderLoader(parent)
           const message =  await Ordermodel.submitData(retainToken, formData)
            if(message) {
                clearLoader()
               Orderview.displayPrint()
               document.querySelector('.message').addEventListener('click', async (e) => {
                parent = document.querySelector('.message')
                renderLoader(parent)
                  const data = await Ordermodel.print(retainToken)
                  if(data) {
                      Orderview.clear()
                      clearLoader()
                     Orderview.displayDownload()
                        
                  }
                    
               })
            } 
    })
})
/////////////////////////////----Get all media-----////////////////////////////////
//===get all media===================//////
const controlRequestMedia = async () => {
    //create new meida request obj
    const mediaRequest = new mediaModel.Media(state.token)

    //render loader
    renderLoader(document.querySelector('.left-box'))

    //make request for all media
    await mediaRequest.requestAllMedia()

    //prepare UI for rendering
    clearLoader()

    //render media
    clearLoader()
    mediaView.renderMedia(mediaRequest.media)
}
document.querySelector('.media').addEventListener('click', ()=> {
       controlRequestMedia()
})


////////////////////===get media by id===//////////////////////////

const controlGetMediaById = async (id, token) => {
    //create new meida request obj
    const mediaRequest = new mediaModel.MediaByID(id, token)

    //render loader
    renderLoader(document.querySelector('.container'))

    //make request for all media
    await mediaRequest.getMedia()

    //prepare UI for rendering
    clearLoader()

    //render media
    clearLoader()
    mediaView.rederMediaDetail(mediaRequest.mediaDetail)
}



////////////////////////////=====Method====/////////////////////////
//===get all media===================//////
const controlRequestMethod = async () => {
    //create new meida request obj
    const methodRequest = new methodModel.Method(state.token)
    state.methodRequest = methodRequest
    //render loader
    renderLoader(document.querySelector('.left-box'))

    //make request for all media
    await state.methodRequest.getAllMethod()
    //prepare UI for rendering
    clearLoader()

    //render media
    clearLoader()
    methodView.renderMethod(state.methodRequest.methods)
    
}
document.querySelector('.method').addEventListener('click', ()=> {
       controlRequestMethod()
})


////////////////////===get method by id===//////////////////////////

const controlGetMethodById = async (id) => {
    //create new meida request obj
    //const methodRequest = new methodModel.MediaByID(id, token)

    //render loader
    renderLoader(document.querySelector('.container'))

    //make request for all media
    await state.methodRequest.getMethodById(id)

    //prepare UI for rendering
    clearLoader()

    //render media
    clearLoader()
    methodView.rederMethodDetail(state.methodRequest.methodDetail)
}

['hashchange', 'load'].forEach((e) => {
    window.addEventListener(e, ()=>{
        if(window.location.hash.includes('media')) {
            const id = window.location.hash.replace('#media', '')
            if(id) {
                controlGetMediaById(id, state.token)
            }
        }
        if(window.location.hash.includes('method')) {
            const id = window.location.hash.replace('#method', '')
            if(id) {
                controlGetMethodById(id)
            }
        }
    })
    
})
document.querySelector('.container').addEventListener('click', e=> {
    if(e.target.matches('.inc')){
     
       state.methodRequest.calculateMedia('inc', e.target.id)
        methodView.updateMediaQuatity(state.methodRequest.useInMedia)
    }
    if(e.target.matches('.dec')){
     
        state.methodRequest.calculateMedia('dec', e.target.id)
        methodView.updateMediaQuatity(state.methodRequest.useInMedia)
        
     }

     if(e.target.matches('.sum-amount')) {
        const quantityUnitElement = Array.from(document.querySelectorAll('.mediaQuantity'))
        const quantityUnit = quantityUnitElement.map(el => el.textContent)
        const optionElement  = Array.from(document.querySelectorAll('.quantity-option'))
        const quantityOption = optionElement.map(el => el.options[el.selectedIndex].value)
        const totalQauntity = quantityUnit.map((el, ind) => {
            return quantityOption[ind] * el
        })
        console.log(totalQauntity)
     }
})

// document.getElementById('data').addEventListener('change',(e) => {
//     document.getElementById('filename').textContent = e.target.files[0].name
   
//     document.getElementById('sends').style.display='inline'
// })
// document.querySelector('form').addEventListener('submit', (e)=> {
//     e.preventDefault()
//     let data = document.getElementById("data").files[0];
//     let formData = new FormData(); 
//     formData.append("nhut", data);
//     document.getElementById("wait").textContent = "Vui lòng đợi trong giây lát........."
//     fetch('/order', {
//                     method: "POST", 
//                     body: formData, 
//                     headers: {
//                         Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDcyNzQ4NmRhZjVkODIyNGMyYjU2MWMiLCJpYXQiOjE1Njc3ODIwMjJ9.6OmJRxlQxbCdn1F1hrCDscPuIm9bMTrpGBTjQo94zbM'
//                     }
//                     }).then((res) => {
//                         if(res.status === 200) {
//            return res.json()
//         }
//     }).then((data) => {
//         if(data.mes) {   
//         document.getElementById("wait").textContent = data.mes
//         document.getElementById("Done").innerHTML = "<a href='#'>Bắt đầu in</a>"
//         }
//         if(data.err) {
    
//             document.getElementById("wait").textContent = data.err
//         }
//     })
    
// })

// document.getElementById("Done").addEventListener('click', (e)=> {
//     document.getElementById("wait").textContent = ''
//     e.target.innerHTML = "Vui lòng đợi trong giây lát..."
//     fetch('/order', {method: "GET"}).then((res) => {
       
//         if(res.status === 200) {
//            return res.json()
//         }
//     }).then((data) => {
//         if(data) {
//         document.getElementById("Download").innerHTML = "<a href='/download'>Tải xuống</a>"
//         }
//     }).catch((e) =>{
//         document.getElementById("Download").textContent = e.message
//     })
    
// })

// document.getElementById("Download").addEventListener('click', (e)=> {
//     document.getElementById("Done").textContent =''
// })

// document.querySelector('.meth').addEventListener('click', (e) => {
//     fetch('/method/5d5d678a5db3cb10ac09915b', {method: "GET"}).then((res) => {
//         if(res.status === 200) {
//            return res.json()
//         }
//     }).then((data) => {
//         console.log(data)
//     })
// })