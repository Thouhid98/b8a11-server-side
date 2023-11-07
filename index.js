const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


// MongoDB 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        app.get('/allblogs', async (req, res) => {
            const allblogs = await blogCollection.find().toArray();
            console.log(allblogs);
            res.send(allblogs)
        })

        // Get Recent Posts By Date 
        app.get('/latestblogs', async (req, res) => {
            const recentblogs = await blogCollection.find().sort({ date: -1 }).limit(6).toArray();
            console.log(recentblogs);
            res.send(recentblogs)
        })

        // Blog details Api 
        app.get('/blogdetails/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.send(result);
        })

        // Route to get blogs by category
        // app.get('/blogs/:category', async (req, res) => {
        //     const { category } = req.params;
        //     console.log(category);
        //     const blogs = await BlogPost.find({ category });
        //     res.json(blogs);

        // });


        // User Related APIS 
        const userCollection = client.db('BlogDB').collection('user');

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })


        // Add to WishList 
        const wishListCollection = client.db('BlogDB').collection('wishlist');

        app.post('/addtoWishlist', async (req, res) => {
            const newwishList = req.body;
            console.log(newwishList);
            const result = await wishListCollection.insertOne(newwishList);
            res.send(result);
        })

        // show wishlist to wishlist Page 
        // app.get('/fetchwishlist/:email', async (req, res) => {
        //     const email = req.params.email;
        //     console.log(email);
        //     const query = { email: email };
        //     const result = await wishListCollection.find(query).toArray();
        //     res.send(result);
        // })

        // Wishlist API2 
        app.get('/fetchwishlist/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: 'thouhid@vai.com' };
            const result = await wishListCollection.find(query).toArray();
            res.send(result);
        })

        // Wishlist API2 Delete
        app.delete('/fetchwishlist/:email/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: id }
            const result = await wishListCollection.deleteOne(query);
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



app.get('/', (req, res) => {
    res.send('Blog Srever Running')
})
app.listen(port, () => {
    console.log(`Blog Srever runing ${port}`);
})