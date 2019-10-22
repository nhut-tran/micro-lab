
export const submitData = async (token, formData) => {
      return  fetch('/order', {
            method: "POST", 
            body: formData, 
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((res) => {
            
             return res.json()
        
        }).then((data)=> {
            return data.mes
           
        }).catch(e => {
            console.log(e)
        })
}

export const print = async (token) => {
    return  fetch('/order', {
        method: "GET", 
        headers: {
            authorization: `Bearer ${token}`
        }
    }).then((res) => {
        
         return res.json()
    
    }).then((data)=> {
        return data.mes
       
    }).catch(e => {
        console.log(e)
    })
}

export const download = async (token) => {
    return  fetch('/order', {
        method: "GET", 
        headers: {
            authorization: `Bearer ${token}`
        }
    }).then((res) => {
        
         return res.json()
    
    }).then((data)=> {
        return data.mes
       
    }).catch(e => {
        console.log(e)
    })
}


