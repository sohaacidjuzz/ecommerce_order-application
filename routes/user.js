require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hash = require('bcryptjs');
const jwt = require('jsonwebtoken');   
const authenticateToken = require('../config/authHandler');
const userController = require('../controllers/userController');
// const auth = require('../middleware/auth');

router.post('/register' , userController.userRegister);

router.post('/login' , userController.userLogin);

router.get('/profile', authenticateToken, userController.getUserProfile);

router.put('/verify/:username' , userController.verifyUser);

// router.get('/logout')


module.exports = router;


// 1. check if the user is a new user -> route it to the login page id already exists
// 2. encrypt the password
// 3. create and save the user in the database
// 4. send a welcome email.


// router.get('/getAllUsers', (req, res) => {
//     // Logic to get all users
//     res.send('List of all users');
// });