
export const getLogin = () => {
    const email = document.getElementById('email').value;
    const password= document.getElementById('password').value;
    return {
        email,
        password    
    }
}
//displaylogin form
export const dislayLoginForm = () => {
    
    document.querySelector('.container').insertAdjacentHTML("beforeend",
    
    `<form class="login-form">
        <label for='email'>Tên đăng nhập: </label><input type="email" class="email" id="email"><br>
        <label for='password'>Mật khẩu: </label><input type="password" id="password">
        <input class="submit" type="button" value="dang nhap">
    </form>
    `

    )
    
}
export const displayErrLogin = (err) => {
    if(err){
       
       const errLogin =  document.createElement('p')
       errLogin.classList.add('err-login')
       errLogin.textContent = 'Tên đăng nhâp hoặc mật khẩu không đúng'
       document.querySelector('.login-form').appendChild(errLogin)

    }
}
//display user name after login succes
export const displayUserName = (name) => {
   
    // document.querySelector('.dangnhap').innerHTML = `<a href=/user/me>Xin chao ${name}</a>`
    // document.querySelector('.dangnhap').className = 'user'
    document.querySelector('.main-nav').insertAdjacentHTML("beforeend", `<li class="user">
    <a href=/user/me>Xin chao ${name}</a>
    <ul class="user-info">
    <li><a href="/user/logout">Thông tin tài khoản</a><li/>
    <li><a href="/user/logout">Đăng xuất</a><li/>
    </li>
    
</ul>`)
}
export const clear = () => {
    const removeEl = document.querySelector('.login-form')
   removeEl.parentNode.removeChild(removeEl)
}