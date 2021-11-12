var CronJob = require('cron').CronJob;
// Setup:
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
var query = require("./query");

module.exports = {
    oneTimeStart: async function (req) {
        console.log("recieved the job ",req.body);
        // We make a woo connection here
        const WooCommerce = new WooCommerceRestApi({
            url: req.body.storeURL, // Your store URL
            consumerKey: req.body.consumerKey, // Your consumer key
            consumerSecret: req.body.consumerSecret, // Your consumer secret
            version: 'wc/v3' // WooCommerce WP REST API version
          });
        var job = new CronJob('59 * * * * *', async function() {
            
          
            // Use that connection to make a get request
            const orders = WooCommerce.get("orders") // We will get the data from the api.
            .then((response) => {
            //   console.log("response " ,response);
              return response;
            })
            .catch((error) => {
            //   console.log("error ",error);
              return error;
            });
          
            // orders variable has the data we got from get request.
            // console.log("data ",orders);
          
            // Now this is to store into db, select the table you want to insert into.
            let temp= await query(`insert into orders (order_key, fullName) VALUES('order_key_11212232b', 'Deepak') 
            ON DUPLICATE KEY UPDATE fullName = 'LAAAAAAAAAAA'` ); // here your raw query to store the data.
          }, null, true);
          job.start();
    }
}
