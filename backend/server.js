require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const vendorRoutes = require("./routes/vendor");


// create Express app
const app = express();

// middleware
// use express.json() so that the body/data comes in can be attached to the request. 
// thus, we can access this data in the request handler functions
app.use(express.json()); // gets the request

// enable cors
app.use(cors());

// routes
app.use('/api/order', orderRoutes); 
app.use('/api/product', productRoutes); 
app.use('/api/vendor', vendorRoutes); 


// connect to db
mongoose
  .connect(process.env.MONGO_URI)  
  // .connect returns a promise
  .then(() => {
    // listen for requests only in case of the connection to the db
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

