const { MongoClient, ObjectId } = require('mongodb');

// get all products
const getAllProducts = async (req, res) => {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db(process.env.MONGO_DB_NAME);
    
        // Query the products collection
        const products = await db.collection('products').find().toArray();
    
        // Close the MongoDB connection
        client.close();
    
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}
const getProduct = async (req, res) => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.MONGO_DB_NAME);
    const productId = req.params.id.toString();

    if (!ObjectId.isValid(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });

    // Close the MongoDB connection
    client.close();

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
const getOrdersOfProduct = async (req, res) => {
  try{
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.MONGO_DB_NAME);
    const productId = req.params.id.toString();
    const orders = await db
      .collection('orders')
      .find({
        cart_item: { $elemMatch: { product: new ObjectId(productId) } },
      })
      .toArray();
    client.close()

    // Send the orders as a response
    res.status(200).json({ orders });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

}


// export the functions
module.exports = {
    getAllProducts,
    getProduct,
    getOrdersOfProduct
}

