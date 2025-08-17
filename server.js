const express = require('express');
const mongoose = require('mongoose');
const authenticateToken = require('./config/authHandler');

const app = express();

// Get the DB connection URI from the config file
const { mongoURI } = require('./config/key');
const key = require('./config/key');
const Product = require('./models/Product');
const { get } = require('express/lib/response');

console.log('MongoDB URI:', mongoURI);

// Connect to MongoDB
mongoose.connect(
    mongoURI,
).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});


//middleware
app.use(express.json());  // parse our json data
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //parse the form data

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


app.use('/products',  require('./routes/product'));
app.use('/users', require('./routes/user'));
app.use('/orders', authenticateToken, require('./routes/orders'));

app.post('/add', (req, res) => {
    const { num1, num2 } = req.body;
    console.log(req.body);
    res.send(`The result of addition is: ${num1 + num2}`);
})

app.get('/add', (req, res) => {
    const val = 4 + 5;
    res.send(`The result of addition is: ${val}`);
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
})



// favorites

// 1. favorites -> user_id , array of products that are marked as favorites
// 2. user_id , product_id


// 1. -> {
//     user, 
//     favorites : []
// }

// addtofav (user_id, product_id) - -> find(user_id) -> get the favorites.push(product_id) -> save
// getFavorites (user_id) - > find(user_id) -> return favorites
// getfavcountforaproduct(prod_id) 

// Prod_1 =>2
// prod_2 -> 1
// prod_3 -> 1

// {
//     user : <user_id1>,
//     favorites : [<product_id1>, <product_id2>, ...]
// }
// ->elemMatch

// {
//     user : <user_id2>,
//     favorites : [<product_id1>, <product_id3>, ...]
// }

// 2. ->{
//     user : <user_id2>,
//     fav : <p_id2>
// }

// {
//     user : <user_id1>,
//     fav : <p_id1>
// }

// addtofav -> just add a new entry
// get -> findAll(user) -> return the prods



// product -> fav_user

// {
//     prod_id : '1',
//     fav_user : ['user_id1', 'user_id2']
// }


// addtofav -> just add a new entry
// get -> findAll(user) -> return the prods



// product -> fav_user

// {
//     prod_id : '1',
//     fav_user : ['user_id1', 'user_id2']
// } 
// {
//     user_id: 'user_id1',
//     favorites: ['prod_id1', 'prod_id2']
// }

// addToFav(user_id , prod_id) -> 
// 1. update my product entry -> find(prod_id).fav_user.push(user_id)
// 2. update my user entry -> find(user_id).favorites.push(prod_id)


// getFavorites(user_id) -> find(user_id).favorites

// getFavCountForProduct(prod_id) -> find(prod_id).fav_user.length


// app.get('/test/:value' , (req , res) => {
//     const value = req.params.value;
//     // console.log('Test route accessed with value:', value);
//     res.send(`Test route accessed with value: ${value}`);
// })

// app.get('/sendmail' , (req , res) => {
//     //subject, msg, to whom, from whom
//     console.log(process.env.SENDGRID_API_KEY);
//     console.log('SendGrid Mail:', process.env.SENDGRID_MAIL);

//     const htmlContent = `
//     <h1>Welcome to SendGrid</h1>
//     <p>This is a test email sent using SendGrid.</p>
//     `

//     const msg = {
//         to: "fkelexwbuiguxsehkt@enotj.com",
//         from: process.env.SENDGRID_MAIL, // Use the email from environment variable
//         subject: 'Sending with SendGrid is Fun',
//         text: 'hey, sent successfully',
//         html: htmlContent
//     };

//     sgmail.send(msg)
//     .then(() => {
//         console.log('Email sent successfully');
//     })
//     .catch((error) => {
//         console.error('Error sending email:', error);
//     });

//     res.send('Email sent successfully');
// });


// 1. create the api key
// 2. verify the sender email

// '/products/addProduct'
// '/products/addMultipleProducts'
// '/products/removeProduct'
// '/products/addProducttoCart'
// '/products/addProduct'