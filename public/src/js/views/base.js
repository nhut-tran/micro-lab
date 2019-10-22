

export const renderLoader = (parent) => {
   parent.innerHTML =  `<div class="loader">
            <img src="/dist/images/oval.svg"><br>
            <p>Vui lòng đợi đợi trong giây lát...</p>
    </div>`
}

export const clearLoader = () => {
    const loader = document.querySelector('.loader')
    if(loader) {
        loader.parentNode.removeChild(loader)
    }
}

export const renderFalseLogin = (fn) => {
    document.querySelector('.container').insertAdjacentHTML("beforeend", `<form class="login-form">
    <label for='email'>Tên đăng nhập: </label><input type="email" class="email" id="email"><br>
    <label for='password'>Mật khẩu: </label><input type="password" id="password"><br>
    <input class="submit" type="button" value="dang nhap">
</form>
`
    )
    return document.querySelector('.submit')
}

export const displayHeader = () => {
    
        document.querySelector('.container').insertAdjacentHTML("beforeend", `<header>
        <nav>
           <div class="row">
               <ul class="main-nav">
                   <li><a href="#">Trang chủ</a></li>
                   <li class="order"><a href="#">In Quan Trắc</a></li>
                   <li><a href="#">Tạo dữ liệu</a></li>
                   <li><a href="#">Giới Thiệu</a></li>
                   <li class="media"><a href="#">Tra cuy hoa chat</a></li>
                   <li class="dangnhap"><a href="#">Dang nhap</a></li>
               </ul>
           </div>
       </nav>
    </header>`
        )
    
}
