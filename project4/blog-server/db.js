const MongoClient = require('mongodb').MongoClient;
const options = { useUnifiedTopology: true, writeConcern: { j: true } };
let client = null;

async function connect(url) {
    if (client == null) {
        try {
            client = new MongoClient(url, options);
            await client.connect();
        } catch (err) {
            console.log(err.message);
            process.exit(1);
        }
    }
}

// get database using pre-established connection
function db(dbName) {
    return client.db(dbName);
}

// close open connection
function close() {
    if (client) {
        client.close();
        client = null;
    }
}

// export connect(), db() and close() from the module
module.exports = {
    connect,
    db,
    close
};