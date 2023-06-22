const { MongoClient, ObjectId } = require('mongodb');

// get all orders
const getAllOrders = async (req, res) => {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db(process.env.MONGO_DB_NAME);
    
        // Query the orders collection
        const orders = await db.collection('orders').find().toArray();
    
        // Close the MongoDB connection
        client.close();
    
        res.json(orders);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}

// get a single order by :id
const getOrder = async (req, res) => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.MONGO_DB_NAME);

    const orderId = req.params.id.toString();

    if (!ObjectId.isValid(orderId)) {
      // Return an error response if the orderId is not a valid ObjectId
      res.status(400).json({ error: 'Invalid order ID' });
      return;
    }

    // Query the orders collection for a specific order
    const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });

    // Close the MongoDB connection
    client.close();

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


const getOrdersByYear = async (req, res) => {
  const year = req.params.year;

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.MONGO_DB_NAME);

    const ordersCollection = db.collection('orders');

    // Construct the query
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(Number(year) + 1, 0, 1);

    const query = {
      payment_at: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    // Execute the query and retrieve the orders
    const orders = await ordersCollection.find(query).toArray();

    // Close the MongoDB connection
    client.close();

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getOrdersByTime = async (req, res) => {

  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db(process.env.MONGO_DB_NAME);

  const year = req.params.year;
  const month = req.params.month;

  try {
    const ordersCollection = db.collection('orders');

    // Construct the query
    const query = {
      payment_at: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    };

    // Execute the query and retrieve the orders
    const orders = await ordersCollection.find(query).toArray();

    // Close the MongoDB connection
    client.close();

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getOrdersByTimeAndProduct = async (req, res) => {

  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db(process.env.MONGO_DB_NAME);

  const year = req.params.year;
  const month = req.params.month;
  const productId = req.params.product.toString();

  try {
    const ordersCollection = db.collection('orders');

    // Construct the query
    const query = {
      payment_at: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
      cart_item: {
        $elemMatch: { product: new ObjectId(productId) } 
      }
    };

    // Execute the query and retrieve the orders
    const orders = await ordersCollection.find(query).toArray();

    // Close the MongoDB connection
    client.close();

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// export the functions
module.exports = {
    getAllOrders, 
    getOrder,
    getOrdersByYear,
    getOrdersByTime,
    getOrdersByTimeAndProduct
}