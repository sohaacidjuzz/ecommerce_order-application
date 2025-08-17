
// order -> {
// user_id, 
// products[
//     {
//         product_id,
//         quantity -> verify at checkout 5
//         instock -> good
//     }
// ],
// totalAmount, 
// status
// }


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1 
        },
        instock: {
            type: Boolean,
            default: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['incart', 'placed', 'shipped', 'delivered', 'cancelled'],
        default: 'incart'
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
