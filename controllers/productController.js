//add business logic for product apis
const mongoose = require('mongoose');
const fs = require('fs/promises');
const { ObjectId } = require('mongodb');

// Import the Product model
const Product = require('../models/Product');
const User = require('../models/User');

exports.getAllProducts = async (req , res)=>{
try{
    const products = await Product.find({});
    res.status(200).json(products);
}
catch(err){
    console.error('Error fetching products:', err);
    res.status(500).send('Error fetching products');
}
}

exports.addProduct = async (req, res) => {
        try {
        const product = new Product({
            productId: new mongoose.Types.ObjectId(),
            productName: 'Sample Product',
            productPrice: 100,
        });
        await product.save();
        console.log('Product saved successfully:', product);
    } catch (err) {
        console.error('Error saving product:', err);
    }
    res.send('Product added successfully');
}


exports.addMultipleProducts = async (req, res) => {
    
    let data = [];
    // fs.readFile('./data/product.json', 'utf8', (err , fileData)=>{
    //     if(err){
    //         console.error('Error reading file:', err);
    //         return res.status(500).send('Error reading product data');
    //     }
    // }).then((fileData) => {
    //     data = JSON.parse(fileData);
    //     console.log(data);
    // })


    try{
    const fileData = await fs.readFile('./data/product.json', 'utf8');
    data = JSON.parse(fileData);
    console.log(data);

    await Product.insertMany(data);
    }
    catch(err){
        console.error('Error reading file:', err);
        return res.status(500).send('Error reading product data');
    }

    res.send('Multiple products added successfully');
}


exports.addProductToFav = async (req, res) => {
    // 1. push prod to userentry
    // 2. push user to prodentry

    const user = req.user;
    const productId = req.params.productId;
    console.log("product_id:", productId);

    try{

    // push product to user favorites

    console.log('User found:', typeof(user.id));
    const user_db = await User.findOne({ _id: user.id});

    console.log('User found in DB:', user_db);

    if(user_db.favorites.includes(productId)) {
        return res.status(400).send('Product already in favorites');
    }

    user_db.favorites.push(productId);
    await user_db.save();

    // push user to product's fav_user
    const product = await Product.findById(productId);
    console.log('Product found:', product);
    product.fav_user.push(user.id);
    await product.save();

    res.send('Product added to favorites successfully');

    } catch (error) {
        console.error('Error adding product to favorites:', error);
        res.status(500).send('Error adding product to favorites');
    }
}

// ->start/begin
// -> success (commit)
// -> abort()
// -> end

exports.removeProductFromFavorites = async (req, res) => {
    
    const userId = req.user.id;
    const productId = req.params.productId;

    await User.updateOne(
       { _id : userId},
       {$pull : {favorites : productId}}
    );


    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(
        (fav) => fav.toString() !== productId
    );

    await user.save();
}



// {'123'
//    fav -> ['a' , 'b' , 'd' , 'e']
// }


// user.favorites.filter(
//         (fav) => fav.toString() !== productId
//     );


//     'a' -> a!==d -> true
//     'b' -> b!==d -> true
//     'd' -> d!==d -> false
//     'e' -> e!==d -> true