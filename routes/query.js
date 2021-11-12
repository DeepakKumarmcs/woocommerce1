const connection = require('./dbConnection');


const query = (queryString, params) => {
    return connection.promise().query(queryString, params);

}

module.exports = query;