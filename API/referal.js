const { Database } = require("../controller/db");

function checkReferal(req, res){
    const referal = req.query.ref;
    return true;
}

module.exports = {checkReferal};