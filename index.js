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

        // Api for Featured blogs 
        app.get('/featuredblogs', async (req, res) => {
            const pipeline = [
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        shortdes: 1,
                        email:1,
                        ownerpic:1,
                        name:1,
                        photo: 1,
                        category: 1,
                        longdescription: 1,
                        length: { $strLenCP: '$longdes' },
                    },
                },
                {
                    $sort: { length: -1 },
                },
                {
                    $limit: 10,
                },
            ];
            const result = await blogCollection.aggregate(pipeline).toArray();
            console.log(result);
            res.send(result)
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
        app.get('/blogs/:category', async (req, res) => {
            const { category } = req.query;
            const query = category ? { category } : {};
            const blogs = await blogCollection.find(query).toArray();
            res.json(blogs);
        });




        // User Related APIS 
        const userCollection = client.db('BlogDB').collection('user');

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })


        // Update Brand Blogs Api
        app.get('/updateblog/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.send(result);
        })

        // Update API 
        // User Update His Blog 
        app.put('/updateblog/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const newupdateBlog = req.body;
            const allblogsUpdate = {
                $set: {
                    title: newupdateBlog.title,
                    shortdes: newupdateBlog.shortdes,
                    longdes: newupdateBlog.longdes,
                    date: newupdateBlog.date,
                    photo: newupdateBlog.photo,
                }
            }
            const result = await blogCollection.updateOne(filter, allblogsUpdate, options)
            res.send(result)
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
        app.get('/fetchwishlist/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const result = await wishListCollection.find(query).toArray();
            res.send(result);
        })

        // Wishlist API2 
        // app.get('/fetchwishlist/:email', async (req, res) => {
        //     const email = req.params.email;
        //     console.log(email);
        //     const query = { email: 'thouhid@vai.com' };
        //     const result = await wishListCollection.find(query).toArray();
        //     res.send(result);
        // })

        // Wishlist API2 Delete
        app.delete('/fetchwishlist/:email/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: id }
            const result = await wishListCollection.deleteOne(query);
            res.send(result);
        })

        // User Comment Collection 
        const commentCollection = client.db('BlogDB').collection('comments')

        app.post('/comments', async(req, res) => {
            const comment = req.body;
            console.log(comment);
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        })

        // Fetch comment from database 
        app.get('/getcomments', async(req, res)=>{
            const allcoments = await commentCollection.find().sort({ comment: -1 }).limit(3).toArray();
            console.log(allcoments);
            res.send(allcoments)
        })
      











        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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