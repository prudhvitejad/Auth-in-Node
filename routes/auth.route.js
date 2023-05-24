const express = require("express");
const router = express.Router();
const Controller = require('../Controllers/Auth.Controller');

//create new user in DB
router.post("/auth/register",Controller.register);

//sign up page 
router.get("/auth/register",Controller.signupPage);

//authenticate a current user(Login route)
router.post("/auth/login",Controller.login);

//log in page
router.get("/auth/login",Controller.loginPage);

//generate refresh-token
router.post("/auth/refresh-token",Controller.refreshtoken);

//logout a user
router.delete("/auth/logout",Controller.logout);

module.exports = router;