const createError = require('http-errors');
const User = require('../models/user.model');
const {authSchema} = require('../helpers/validation_schema');
const {
    signAccessToken, 
    signRefreshToken, 
    verifyRefreshToken
} = require('../helpers/jwt_helper');
//const client = require('./helpers/init_redis');

module.exports = {

    //create new user in DB
    register : async(req,res,next) => {   
    
        try {
            const result = await authSchema.validateAsync(req.body);
    
             const doesExist = await User.findOne({email:result.email});
    
            if(doesExist) throw createError.Conflict(`${result.email} is already been registered`);
    
            /*
            const user = new User({email:email,password:password}); (OR) const user = new User({email,password});  
            Both are same but both key and values are same so we can use directly once otherwise we should use it using key-value separated by colon
            */
            const user = new User(result); 
            const savedUser = await user.save();
            const accessToken = await signAccessToken(savedUser.id);
            const refreshToken = await signRefreshToken(savedUser.id);
    
            res.send({accessToken,refreshToken});
    
        } catch(err) {
            if(err.isJoi === true) err.status = 422
            next(err);
        }
    },
    
    //sign up page 
    signupPage: async(req,res,next) => {    
        res.render('signup');
    },

    //authenticate a current user(Login route)
    login: async(req,res,next) => {      
        try {
            const result = await authSchema.validateAsync(req.body);
            const user = await User.findOne({email:result.email});
    
            if(!user)   
                throw createError.NotFound('User not registered');
            
            const isMatch = await user.isValidPassword(result.password);
            if(!isMatch) 
                throw createError.Unauthorized('Username/password not valid');
            
            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id);
    
            res.send({accessToken, refreshToken});
        }
        catch(err) {
            if(err.isJoi === true)
                return next(createError.BadRequest('Invalid Username/Password'));
    
            next(err);  
        }
    },

    //log in page
    loginPage: async(req,res,next) => {    
        //All the below works fine   
        //res.render('login');
        //res.render('login.ejs');
        //res.render('../views/login.ejs');
        res.render('../views/login');
    },

    //generate refresh-token
    refreshtoken: async(req,res,next) => {
        try {
            const {refreshToken} = req.body;
            if(!refreshToken) 
                throw createError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);
    
            const accessToken = await signAccessToken(userId);
            const refToken = await signRefreshToken(userId);
    
            res.send({accessToken:accessToken, refreshToken:refToken});
        } catch(err) {
            next(err);
        }
    },

    //logout a user
    logout: async(req,res,next) => {  
        try {
            const { refreshToken } = req.body;
            if(!refreshToken)
                throw createError.BadRequest();
            const userId = verifyRefreshToken(refreshToken);
    
            //to delete data from the redis DB
            /*
            client.DEL(userId, (err,val) => {
                if(err) {
                    console.log(err.message);
                    throw createError.InternalServerError();
                }
                console.log(val);
                res.sendStatus(204);
            });
            */
           res.statusCode(204);
           res.send("Successfully logged out");
    
        } catch(err) {
            next(err);
        }
    }
}