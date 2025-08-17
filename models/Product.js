const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // productId : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     required: true,
    // }, 
    name: String,
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    fav_user: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }]
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;




// 123 -> Number
// cjakcadk -> String
// true/false ->Boolean


// "njkcndnnwnfvewnfn38uro1lfewnfn" -> object_id
