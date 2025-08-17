const mongoose = require('mongoose');

const User = require('../models/User');
const Hash = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendMail: sm } = require('../helper/sendMailHelper');

exports.userRegister = async (req, res) => {
    const { name, email, password } = req.body;


    // sharmadeeksha@gmail.com
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }

    console.log('User registration data:', req.body);

    // 1. Check if the user already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
        // rerouting
    }

    const hashedPassword = await Hash.hash(password, 12);

    // 2. Create a new user
    const newUser = new User({
        name, email, password: hashedPassword
    });

    const savedUser = await newUser.save();
    console.log('User saved:', savedUser);

    //generate a username
    const username = savedUser.email.split('@')[0];

    // const link  = `http://localhost:3000/users/verify/${}`;

    const htmlContent = `    
    <h1>Welcome to Our Platform</h1>
    <p>Hi ${name},</p>
    <p>Thank you for registering. We are excited to have you on board!</p>
    `;

    // 3. Send a welcome email
    const result = await sm(email, "Hey", htmlContent, "Welcome to our platform!");
    console.log('Email send result:', result);
    if (result[0].statusCode === 202) {
        console.log('Email sent successfully');
    } else {
        console.error('Error sending email:', result);
    }

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    // isverified -> true?
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }

    // 1. check if the user exists
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
        // reroute it to register page
    }

    const match = await Hash.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Generate a JWT token
    const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: '24h' }
    )

    res.json({ token });
}

exports.getUserProfile = async (req, res) => {
    res.json({
        user: req.user
    });
}

// 1. valid user, valid email -> true
// 2. valid user, invalid email -> false




exports.verifyUser = async (req, res) => {
    const userId = req.params.userId;
    console.log('Verifying user with ID:', userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isVerified = true;
        await user.save();
        res.send('User verified successfully');

    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}





// user -> register -> email (link) -> verify








// CRUD

// 1- create
// 2. Read
// 3. Update
// 4. delete


