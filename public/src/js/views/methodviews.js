

const insertMethod = (method) => {
    const hmtl = `
                <div>
                    <a href="#method${method._id}">${method.name}</a>
                </div>
                `
    document.querySelector('.left-box').insertAdjacentHTML('beforeend', hmtl)
}

//render method on left-box
export const renderMethod = (data) => {
    data.forEach(insertMethod)
}
//render media use in
const renderMethodMedia = (media) => {
  const markup =  `<div id="${media.mediaName.name}">
                        <p>${media.mediaName.name}</p>
                        <p><span class="mediaQuantity">${media.mediaQuantity}</span> ${media.mediaUnit}</p>
                        <span>Giá</span><input class = "amount"/>
                        <span>Lương sử dụng (ml)</span>
                        <select class="quantity-option">
                            <option value="5">5</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="18">18</option>
                            <option value="20">20</option>
                        </select>
                        <div><img class="inc" id= "${media.mediaName.name}" src="/dist/images/inc.svg"> <img class="dec" id="${media.mediaName.name}" src="dist/images/dec.svg"></div>
                   </div>`
  return markup
}
//render step
const renderMethodStep = (step) => {
 const markup = `<p class="step">${step.name}: ${
     step.media.map(renderMethodMedia).join('')
    }</p>`
 return markup
    
}
export const rederMethodDetail = (method) => {
    const markup = `
        <div>
            <div><h3>${method.name}</h3></div>
            <div><h3>Loại Phương Pháp: ${method.type='DL' ? 'Định lượng': 'Định tính'}<h3></div>
            <div><h3>Thời gian:</h3>
                <p>Sớm Nhất: ${method.duration.short}</p>
                <p>Dài Nhất: ${method.duration.long}</p>
            </div>
            <div><h3>Chủng đối chứng</h3>
           
                <p>Chủng đối chứng dương: ${method.controlStrain.positive}</p>
                
                <p>Chủng đối chứng âm: ${method.controlStrain.negative}</p>
            </div>
            <div><h3>Khoảng đọc đĩa</h3>
                <p>Khoảng trên: ${method.ReadingInterval.top}</p>
                <p>Khoảng dưới: ${method.ReadingInterval.bottom}</p>
            </div>
            <div class="steps"><h3>Quy trình</h3>
               ${method.steps.map(renderMethodStep).join('')}
            </div>
            <button class="sum-amount">Tinh tong tien cho 1 mau</button>
        </div>
    
    `
    document.querySelector('.container').insertAdjacentHTML('beforeend', markup)
}

export const updateMediaQuatity = (media) => {
    Array.from(document.querySelectorAll('.mediaQuantity')).forEach((e, ind) => {
        e.textContent = media[ind].quantity
    })
}
