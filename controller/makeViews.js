const { SSOLogin } = require("./login");

var loadViews = {};

loadViews.dashboard = async (req)=>{
    var isLogged = await SSOLogin.authenticateLogin(req);
    var data;
    if (isLogged.status) {
        var name = isLogged.log.name;
        var profilePic = isLogged.log.profilePic;
        data = {
            webLogin: `<div class="menus loginMenu profileButton" onclick="goToAccount()" id="loginButton">
                        <div class="imgDiv">
                            <img class="profileImage" src="${profilePic}" alt="">
                        </div>
                        <div class="nameDiv" >${name}</div>
                    </div>`,
            mobMenus:`<div class="menus loginMenu link" onclick="goToAccount()" id="loginButton"><a class="link" href="/account">My Account</a></div> 
            <div class="menus loginMenu link" onclick="logout()" id="loginButton"><a class="link" href="/API/logout">Logout</a></div>`,
            mobImage:``
        };
    }else{
        data = {
            webLogin: `<div class="menus loginMenu link" id="loginButton"><a class="link" href="/login">Log In</a></div>`,
            mobImage:``,
            mobMenus:`<div class="menus loginMenu link" id="loginButton"><a class="link" href="/login">Log In</a></div>`
        };
    }
    return data;
}

module.exports = {loadViews};