const { MongoClient, ObjectId } = require('mongodb');

// get all vendors
const getAllVendors = async (req, res) => {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db(process.env.MONGO_DB_NAME);
    
        // Query the vendors collection
        const vendors = await db.collection('vendors').find().toArray();
    
        // Close the MongoDB connection
        client.close();
    
        res.json(vendors);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}

// get a single vendor by :id
const getVendor = async (req, res) => {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db(process.env.MONGO_DB_NAME);
    
        const vendorId = req.params.id;
    
        // Query the vendors collection for a specific vendor
        const vendor = await db.collection('vendors').findOne({ _id: new ObjectId(vendorId) });
    
        // Close the MongoDB connection
        client.close();
    
        if (vendor) {
          res.json(vendor);
        } else {
          res.status(404).json({ error: 'Vendor not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}

const getProductsWithVendorId = async (req, res) => {
  try{
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.MONGO_DB_NAME);
    const vendorId = req.params.id 
    console.log("vendor id: ", vendorId)
    const products = await db.collection('products').find({vendor: new ObjectId(_id = vendorId)}).toArray();
    client.close()

    // Send the products as a response
    res.status(200).json({ products });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// export the functions
module.exports = {
    getAllVendors, 
    getVendor,
    getProductsWithVendorId
}

