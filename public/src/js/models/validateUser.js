import axios from 'axios'
export async function validate (url, token) {
    try {
        const response = await axios ({
            method: 'post',
             url,
             headers: {
                authorization: `Bearer ${token}`
             },
        })
            return response.data
    } catch (e) {
        if(e.response) {
            return e.response.data.err
        }
    }
}