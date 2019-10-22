export const displayOrder = () => {
    document.querySelector('.container').innerHTML =
    `<div class="header-text-box">
    <h1> Quan Trắc Vi Sinh</h1>
        <div>
            <form class="data-form" id="data-form" enctype="multipart/form-data" action="" method="post">
                
                 <input  id="data" type="file" style="display:none;"/>  <input id="send" type="submit" value="Gửi file" style="display:none;"/> <br>
                 <label id ="filename" class="btn-full" for="data">Chọn file dữ liệu</label>
                 <label id="sends" class="btn-full" for="send" style="display:none">Gửi dữ liệu</label>
            </form>
        </div>
        
</div>`

}

export const displayPrint = () => {
    document.querySelector(".container").insertAdjacentHTML('beforeend', `<div class = "message"><a id="print" class="btn-full">Bat Dau in</a></div>`)
    
}

export const displayDownload = () => {
    document.querySelector(".container").insertAdjacentHTML('beforeend', `<div class = "message"><a  id="Download" href="/download" class="btn-full">Tai Xuong</a></div>`)
    return document.querySelector('#Download')
} 
export const redirect = () => {
   
        location.replace('/')
}
export const clear = () => {
    const removeEl = document.querySelector('.message')
    if(removeEl) {
        removeEl.parentNode.removeChild(removeEl)
    }
}
