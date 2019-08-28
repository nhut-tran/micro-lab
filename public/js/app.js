console.log('CLient JS')
document.getElementById('data').addEventListener('change',(e) => {
    document.getElementById('filename').textContent = e.target.files[0].name
   
    document.getElementById('sends').style.display='inline'
})
document.querySelector('form').addEventListener('submit', (e)=> {
    e.preventDefault()
    let data = document.getElementById("data").files[0];
    let formData = new FormData();
    formData.append("nhut", data);
    document.getElementById("wait").textContent = "Vui lòng đợi trong giây lát........."
    fetch('/order', {method: "POST", body: formData}).then((res) => {
        if(res.status === 200) {
           return res.json()
        }
    }).then((data) => {
        if(data.mes) {  
        document.getElementById("wait").textContent = data.mes
        document.getElementById("Done").innerHTML = "<a href='#'>Bắt đầu in</a>"
        }
        if(data.err) {
    
            document.getElementById("wait").textContent = data.err
        }
    })
    
})

document.getElementById("Done").addEventListener('click', (e)=> {
    document.getElementById("wait").textContent = ''
    e.target.innerHTML = "Vui lòng đợi trong giây lát..."
    fetch('/order', {method: "GET"}).then((res) => {
       
        if(res.status === 200) {
           return res.json()
        }
    }).then((data) => {
        if(data) {
        document.getElementById("Download").innerHTML = "<a href='/download'>Tải xuống</a>"
        }
    }).catch((e) =>{
        document.getElementById("Download").textContent = e.message
    })
    
})

document.getElementById("Download").addEventListener('click', (e)=> {
    document.getElementById("Done").textContent =''
})