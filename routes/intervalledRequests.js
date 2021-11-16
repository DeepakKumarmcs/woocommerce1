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

            let ordersArr = []
      let order = {
        'order_key':"12312vdfgfgg345",
        'billing':{
          'first_name':"Deepak",
          'last_name':"Kumar"
        },
        'line_items':[
          {
            "id": 315,
            "name": "Woo Single #1",
            "product_id": 93,
            "variation_id": 0,
            "quantity": 2,
            "tax_class": "",
            "subtotal": "6.00",
            "subtotal_tax": "0.45",
            "total": "6.00",
            "total_tax": "0.45",
            "taxes": [
              {
                "id": 75,
                "total": "0.45",
                "subtotal": "0.45"
              }
            ],
            "meta_data": [],
            "sku": "",
            "price": 3
          }
        ]
      }
      ordersArr.push(order)
    // }
      // console.log("orders ",orders)
      // Now this is to store into db, select the table you want to insert into.
      ordersArr.forEach(async element => {
        console.log("element ",element);
        // Now this is to store into db, select the table you want to insert into.
        let temp= await query(`insert into orders (order_key, fullName, line_items) VALUES('${element.order_key}', '${element.billing.first_name +' '+element.billing.last_name }', '${JSON.stringify(element.line_items)}') 
        ON DUPLICATE KEY UPDATE line_items = '${JSON.stringify(element.line_items)}'` ); // here your raw query to store the data.
      })
          
    }, null, true);
          job.start();
          
    }
}
