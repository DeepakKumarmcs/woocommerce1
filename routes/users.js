var express = require('express');
var router = express.Router();
var axios = require('axios');
var query = require("./query");

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
      url: 'https://www.koabhome.com', // Your store URL
      consumerKey: 'ck_23frhhei43', // Your consumer key
      consumerSecret: 'cs_3637yyye', // Your consumer secret
      version: 'wc/v3' // WooCommerce WP REST API version
    });

    // Use that connection to make a get request
    const orders = WooCommerce.get("orders") // We will get the data from the api.
    .then((response) => {
      console.log("response " ,response);
      return response;
    })
    .catch((error) => {
      console.log("error ",error);
      return error;
    });

    // orders variable has the data we got from get request.
    console.log("data ",orders);

    // Now this is to store into db, select the table you want to insert into.
    let temp= await query(`insert into db query` ); // here your raw query to store the data.

    
    res.status(200).send(temp[0]);
  }catch(error) {
    console.log("error ",error)
    res.status(406).send(error)
  }
});

module.exports = router;
