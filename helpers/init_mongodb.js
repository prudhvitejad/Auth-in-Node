const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME, // below options are optional except dbName
        useNewUrlParser: true,  
        useUnifiedTopology: true,
    })
    .then( () => {
        console.log('mongodb is connected.');
    })
    .catch( (err) => {
        console.log(err.message);
    })

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db.');
})

mongoose.connection.on('error', (err) => {
    console.log(err.message);
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected.')
})

/*
simply closing our node application without disconnecting mongoose is not recommended,
if we simply close our node application without disconnecting mongoose then the 
mongoose connection is dangling somewhere in the middle.
So we need to properly close mongoose connection before we quit our application
*/

process.on('SIGINT', async () => {    // this event is always fired when we press Ctrl+c
    await mongoose.connection.close();  // this line will call mongoose.connection.on('disconnected')
    process.exit(0);
})
