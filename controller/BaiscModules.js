const { log } = require("node:console");
const { Database } = require("./db");
let crypto = require('node:crypto');
async function createNewID(collectionName, prefix) {
    const database = await Database.connect();
    if(database.status){
        const conn = database.conn;
        const collection = conn.collection(collectionName);

        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const newID = year + month + day;
        const formattedDate = `${year}-${month}-${day}`;
        const query = { date: formattedDate };
        const results = await collection.find(query).toArray();
        let noOfRow;
        if (!results || results.length === 0) {
            noOfRow = 0;
        } else {
            let x = results.length;
            noOfRow = x;
        }
        let paddedNoOfRow;
        if(noOfRow < 10){
            paddedNoOfRow = '000000000' + noOfRow;
        }else if (noOfRow > 9) {
            paddedNoOfRow = '00000000'+noOfRow;
        }else if (noOfRow > 99) {
            paddedNoOfRow = '0000000'+noOfRow;
        }else if (noOfRow > 999) {
            paddedNoOfRow = '000000'+noOfRow;
        }else if (noOfRow > 9999) {
            paddedNoOfRow = '00000'+noOfRow;
        }else if (noOfRow > 99999) {
            paddedNoOfRow = '0000'+noOfRow;
        }else if (noOfRow > 999999) {
            paddedNoOfRow = '000'+noOfRow;
        }else if (noOfRow > 9999999) {
            paddedNoOfRow = '00'+noOfRow;
        }else if (noOfRow > 99999999) {
            paddedNoOfRow = '0'+noOfRow;
        }else if (noOfRow > 999999999) {
            paddedNoOfRow = noOfRow;
        }
        const newIDWithPadding = prefix + newID + paddedNoOfRow;
        return {status:true, log:newIDWithPadding};
    }else{
        return {status:false, log:database.conn};
    }
}
const authKey = process.env.authSecret;
const iv = crypto.randomBytes(16);
function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', authKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Decryption function
function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', authKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function randomString() {
    const randomBytes = crypto.randomBytes(8); // 8 bytes = 64 bits
    return randomBytes.toString('base64'); // convert to Base64 string
}
module.exports = {createNewID, encrypt, decrypt, randomString}
