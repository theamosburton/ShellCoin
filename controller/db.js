const { MongoClient } = require('mongodb');

const url = process.env.dbURL;
const dbName = 'shellcoin';
const client = new MongoClient(url);

async function connect() {
    try {
        await client.connect();
        const db = client.db(dbName);
        return {status:true, conn:db};
    } catch (err) {
        return {status:false, conn:err};
    }
}

module.exports = { Database:{connect,
    client}
    
};