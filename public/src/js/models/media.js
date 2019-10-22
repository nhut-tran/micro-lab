import axios from "axios"

export function Media (token) {
    this.token = token
}

Media.prototype.requestAllMedia =  async function () {
    try {
            const res = await axios ({
                method: 'get',
                url: '/media/all',
                headers: {
                    authorization: `Bearer ${this.token}`
                }
            })

            this.media = res.data
    } catch (e) {
        console.log(e)

    }
   
}

export function MediaByID (id, token) {
    this.token = token
    this.id = id
}

MediaByID.prototype.getMedia = async function () {
    try {
        const res = await axios ({
            method: 'get',
            url: `/media/${this.id}`,
            headers: {
                authorization: `Bearer ${this.token}`
            }
        })

        this.mediaDetail = res.data
} catch (e) {
    console.log(e)

}
}