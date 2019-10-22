import axios from 'axios';

export const User = function (email, password) {
    this.email = email,
    this.password = password
    
}
User.prototype.login = async function () {
    try {
         const response = await axios ({
            method: 'post',
             url: '/user/login',
             data: {
                 email: this.email,
                 password: this.password
             }, 
        })
       
            this.token = response.data.token
            this.name = response.data.user.name
        
    } catch(e) {
            if(e.response) {
                this.err= e.response.data.err
               
            }
     }
}

    
    
   


