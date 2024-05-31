const Database = require('./db');
<<<<<<< HEAD
const cookieOnly = require('cookie');
var Login = {};
Login.initiliaze = () =>{
=======

class Login{
    connect = Database.connect;
    client = Database.client;
    constructor(data){
        if (!connect.status) {
            return {loginStatus:false, log:"Database Connection Error"};
        }else if(this.checkUserExists(data)){
            return this.loginUser(data);
        }else{
            const addUser = this.addUser(data);
            if (addUser.status) {
                return this.loginUser(data);
            }else{
                return {loginStatus:false, log:addUser.log};
            }
            
        }
    }

    checkUserExists(data){
       // do some stuff
    }

    addUser(data){

    }

    loginUser(data){
        return {loginStatus:true, log:"Logged In Successfully"}
    }

>>>>>>> ecf1e0b24ef363eb48eecdba6a58f493bd5279f5

}

Login.preLogin = (req, res) => {
    const setCookieHeader = cookieOnly.serialize('referedBy', req.query.ref, {
        path: '/',
        httpOnly: true,
        maxAge: 3600 * 24 * 30 * 365 // Cookie will expire in 1 years
    });
    res.setHeader('Set-Cookie', setCookieHeader);
}

module.exports = {Login}