const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require('./helpers/init_mongodb');
const {verifyAccessToken} = require('./helpers/jwt_helper');
//require('./helpers/init_redis');


const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// view engine
app.set('view engine', 'ejs');

const authRoutes = require("./routes/auth.route.js");
app.use(authRoutes);

app.get("/", verifyAccessToken, async(req,res,next) => {
    res.send("Hello World");
});

app.use(async(req,res,next) => {
    next(createError.NotFound("This route doesn't exist"));
});

app.use((err,req,res,next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> {
    console.log(`App is listening at port ${PORT}`);
})
