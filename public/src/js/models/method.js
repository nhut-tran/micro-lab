import axios from 'axios'

export function Method (token) {
    this.token = token
}

Method.prototype.getAllMethod = async function () {
     try {
            const res = await axios ({
                method: 'get',
                url: '/method',
                headers: {
                    authorization: `Bearer ${this.token}`
                }
            })

                this.methods = res.data
                
        } catch (e) {
            console.log(e)
        }
}

Method.prototype.getMethodById = async function (id) {
    try {
        const res = await axios ({
            method: 'get',
            url: `/method/${id}`,
            headers: {
                authorization: `Bearer ${this.token}`
            }
        })
        this.methodDetail = res.data
    const useInMedias = this.methodDetail.steps.map(step => step.media.map((media) => {return {name: media.mediaName.name,
                                                                                                quantity: media.mediaQuantity,
                                                                                                price: 0,
                                                                                                quantityOption: 15,
                                                                                                unit: media.mediaUnit}}))
        this.useInMedia = Array.prototype.concat.apply([], useInMedias)
        
    } catch(e) {

        console.log(e)
    }
}

Method.prototype.calculateMedia =  function (action, name) {
    const index =  this.useInMedia.findIndex(e => e.name === name)
    if(action === 'inc') {
        
        this.useInMedia[index].quantity = this.useInMedia[index].quantity + 1
    } else if (action === 'dec') {
        if( this.useInMedia[index].quantity > 0) {
        this.useInMedia[index].quantity = this.useInMedia[index].quantity - 1

        }
    }
   
 }

 Method.prototype.sumAmount = function() {
     
 }