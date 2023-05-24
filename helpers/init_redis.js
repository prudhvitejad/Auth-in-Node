const redis = require("redis");

const client = redis.createClient(); // connects to default(host=localhost i.e., 127.0.0.1 and port=6379)

/*
//to connect to the other than default host and port
const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
});
*/

/*
    The connect() method is used to connect the NodeJS to the Redis Server. 
    This method returns a promise, so that’s why we have to handle it either using the then and catch or using the async and await keyword.
*/
(async () => {
    await client.connect();
})();

client.on('connect', () => {
    console.log("Client connected to redis...");
});

client.on('ready', () => {
    console.log("Client connected to redis and ready to use...");
});

client.on('error', (err) => {
    console.log(err.message);
});

client.on('end', () => {
    console.log('Client disconnected from redis');
});

process.on('SIGINT', () => {
    client.quit();
});

module.exports = client;