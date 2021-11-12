var express = require('express');
var router = express.Router();
var query = require("./query");
var {oneTimeStart} = require('./intervalledRequests');
// Install:
// npm install --save @woocommerce/woocommerce-rest-api

// Setup:
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM



/* GET users listing. */
router.get('/', async function(req, res) {
  try {

    // We make a woo connection here
    const WooCommerce = new WooCommerceRestApi({
      url: req.body.storeURL, // Your store URL
      consumerKey: req.body.consumerKey, // Your consumer key
      consumerSecret: req.body.consumerSecret, // Your consumer secret
      version: 'wc/v3' // WooCommerce WP REST API version
    });
    // oneTimeStart(req);

    // Use that connection to make a get request
    const orders = await WooCommerce.get("orders") // We will get the data from the api.
    .then((response) => {
      // console.log("response " ,response);
      return response;
    })
    .catch((error) => {
      // console.log("error ",error);
      return error;
    });

    // orders variable has the data we got from get request.
    // console.log("data ",orders);
    // if(!orders){
      let ordersArr = []
      let order = {
        'order_key':"12312vdfgfgg345",
        'billing':{
          'first_name':"Deepak",
          'last_name':"Kumar"
        }
      }
      ordersArr.push(order)
    // }
    // console.log("orders ",orders)
    // Now this is to store into db, select the table you want to insert into.
    ordersArr.forEach(async element => {
      console.log("element ",element)
      let temp= await query(`insert into orders (order_key, fullName) VALUES('${element.order_key}', '${element.billing.first_name +' '+element.billing.last_name }') 
    ON DUPLICATE KEY UPDATE fullName = fullName` ); // here your raw query to store the data.
    });
    


    res.status(200).send("success");
  }catch(error) {
    console.log("error ",error)
    res.status(406).send(error)
  }
});

module.exports = router;
