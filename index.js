const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require(
require("dotenv").config(); // import env file if use environment variables after install || npm install dotenv --save|| ane Create a .env file in the root of your project:
const port = process.env.PORT || 5000;
const app = express();
// used Middleware
app.use(cors());
app.use(express.json());
// Connect With MongoDb Database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.urcdkb0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }

});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandsCollection = client.db("assignment-10").collection("brands");
    const faqCollection = client.db("assignment-10").collection("faq");
    const productsCollection = client.db("assignment-10").collection("products");
    const cartCollection = client.db("assignment-10").collection("cart");
    const userCollection = client.db("assignment-10").collection("user");



    app.get("/brand", async (req, res) => {
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });



    app.get("/faq", async (req, res) => {
      const cursor = faqCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });



    app.get("/faq/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await faqCollection.findOne(query);
      res.send(result);
    });



    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query);
      res.send(result);
    })

    app.post('/createProducts', async (req, res) => {
      const products = req.body;
      
      const result = await productsCollection.insertOne(products);
      res.send(result);
    })
    app.post('/createCart', async (req, res) => {
      const cart = req.body;
      
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    })
    app.get("/myCart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });




    app.delete("/myCart/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: id }
      const result = await cartCollection.deleteOne(query);
      console.log();
      res.send(result);
      });
     
  



    app.post('/user', async (req, res) => {
      const user = req.body;
    
      const result = await userCollection.insertOne(user);
      res.send(result);
  });



    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

  
  
  

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;

      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateProduct = req.body;

      const updatedProduct = {
        $set: {
          Name: updateProduct.Name,
          Photo: updateProduct.Photo,
          Brand: updateProduct.Brand,
          Type: updateProduct.Category,
          Price: updateProduct.Price,
          Rating: updateProduct.Rating

        }
      }


      const result = await productsCollection.updateOne(filter, updatedProduct, options);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Root Api to check activity
app.get("/", (req, res) => {
  res.send("Hello From My Server!");
});
app.listen(port, () => {
  console.log(` listening on port ${port}`);
});