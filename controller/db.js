const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'shellcoin';
const client = new MongoClient(url);

async function connect() {
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        return db;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    connect,
    client
};