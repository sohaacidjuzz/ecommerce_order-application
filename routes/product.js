// Manage APIs for prodcuts

const express = require('express');
const router = express.Router();
const authHandler = require('../config/authHandler');

const productController = require('../controllers/productController');


//get all the products
router.get('/getAllProducts' , productController.getAllProducts);

//Add an API for adding a product
router.post('/addProduct', productController.addProduct);

router.post('/addMultipleProducts', productController.addMultipleProducts);

router.post('/addProductToFavorites/:productId' , authHandler , productController.addProductToFav)



module.exports = router;



// addProduct