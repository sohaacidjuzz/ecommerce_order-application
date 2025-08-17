const mongoose = require('mongoose');
const Order = require('../models/Order');

exports.getOrderById = async (req, res)  => {

    const orderId = req.params.orderId;

    try {

      const allOrders = await Orders.findById(orderId).populate(
        "products.product_id"
      );

      return res.status(200).json(allOrders);

    } catch (err) {

      console.log(err);

      return res.status(200).json("Something went wrong");

    }

  }


exports.getAllOrders = async (req, res) => {
    try {
        let orders = await Order.find({
            user_id: req.user.id
        }).populate('products.product_id');

        orders = orders.filter(order => order.status !== 'incart');

        res.json(orders);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.addItemToCart = async (req , res) => {
    const product_id = req.body.productId;
    const quantity = Number(req.body.quantity);
    const price = Number(req.body.price);

    try{
    //prod is present
    let order = await Order.findOneAndUpdate({
        user_id : req.user.id,
        status : 'incart',
        'products.product_id' : product_id
     },
     {
        $inc: {
            "products.$.quantity" : quantity,
            totalAmount : price * quantity
        }
     }, 
     {new: true}
    );

    if(!order){
        order = await Order.findOneAndUpdate({
            user_id : req.user.id,
            status : 'incart',
        },
        {
            $push: {
                products : {
                    product_id, quantity
                }
            },
            $inc: {
                totalAmount : price * quantity
            }
        }, 
        {new: true ,upsert : true}
        );
    }

    return res.json(order);

    }
    catch(err){
        res.send(err);
    }
}

exports.getCart = async (req, res) => {
    try {
        let orders = await Order.findOne({
            user_id: req.user.id,
            status: 'incart'
        }).populate('products.product_id');

        res.json(orders);
    }catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.updateCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let order = await Order.findOneAndUpdate({ 
            user_id: req.user.id,
            status: 'incart',
            'products.product_id': productId
        }, {
            $set: {
                'products.$.quantity': quantity
            }
        }, { new: true });
        
        return res.json(order);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

exports.placeOrder = async (req, res) => {
    try {
        let order = await Order.findOneAndUpdate({
            user_id: req.user.id,
            status: 'incart'
        }, {
            status: 'placed'
        }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'No items in cart to place order' });
        }

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}


exports.moveToWishlist = async (req, res) => {
    const { productId } = req.body;
    try {
        let order = await Order.findOneAndUpdate({
            user_id: req.user.id,
            status: 'incart',
            'products.product_id': productId
        }, {
            $pull: {
                products: { product_id: productId }
            }
        }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        res.json(order);
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ message: 'Server Error' });
    }
}

// findOneAndUpdate

// find -> true -> update
// find -> false -> create -> update



        // let order = await Order.findOne({
        //     user_id: req.user.id,
        //     status : 'incart'
        // })

        // if(!order){

        //     order = new Order({
        //         user_id : req.user.id,
        //         products : [{
        //             product_id : productId,
        //             quantity : quantity
        //         }],
        //         status : 'incart',
        //         amount : price * quantity
        //     })

        //     await order.save();
        //     return res.json(order);
        // }
            //add in cart
            // 1-> if product already there update the quantity
            // 2 -> add a product


                    // let product = order.products.filter(prod => prod.product_id === productId);

        // if(product){
        //     product.quantity += 1;
        // }else {
        //     // create a new one
        // }


    // 1. map/filter
    // 2. findoneandupdate
    // 3.











// 1. user should be able to add items in the cart
//     ->if already present update the count
//     ->if not then include it with count of 1
//     -> update the price
// 2. user should be able to increment/decrement the count
// 3. user can delete an item from the cart
// 4. they can move it to wishlist
// 5. can get all the orders for a particular user.
// 6. we should be able to update the status of an order.


// cart -> final snapshot -> order

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




// 100M -> 20M -> 1M users have it in the cart

// prouct status changes to out of stockn -> search in 20M complex search for this product id -> 1M -> complex edit to update the status



// status  -> {
//     incart,
//     placed,
//     shipped,
//     delivered,
//     cancelled
// }



