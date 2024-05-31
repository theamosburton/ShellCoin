const Database = require('./db');

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


}

module.exports = {Login}