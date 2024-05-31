const Database = require('./db');
var Login = {};
Login.initiliaze = () =>{

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