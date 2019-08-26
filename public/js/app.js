console.log('CLient JS')

document.querySelector('form').addEventListener('submit', (e)=> {
    e.preventDefault()
    let data = document.getElementById("data").files[0];
    let formData = new FormData();
    formData.append("nhut", data);
    document.getElementById("wait").textContent = "doi chut"
    fetch('/order', {method: "POST", body: formData}).then((res) => {
        if(res.status === 200) {
           return res.json()
        }
    }).then((data) => {
        if(data) {
        document.getElementById("wait").textContent = data.mes
        document.getElementById("Done").innerHTML = "<a href='/order'>in quan trac</a>"
        }
        
    }).catch((e) =>{
        document.getElementById("wait").textContent = e.message
    })
    
    
})