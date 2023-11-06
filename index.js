const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


// MongoDB 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.28tvm1z.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        // Blogs APIS 
        const blogCollection = client.db('BlogDB').collection('blogs')

        // Add blog API 
        app.post('/blogs', async (req, res) => {
            const newblogs = req.body;
            console.log(newblogs);
            const result = await blogCollection.insertOne(newblogs)
            res.send(result)
        })

        // Get Data for All Blog API 
        app.get('/allblogs', async(req, res)=>{
            const allblogs = await blogCollection.find().toArray();
            console.log(allblogs);
            res.send(allblogs)
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



app.get('/', (req, res) => {
    res.send('Blog Srever Running')
})
app.listen(port, () => {
    console.log(`Blog Srever runing ${port}`);
})