const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 7000;

// middleware 
app.use(cors());
app.use(express.json());

// connect mongodb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxj01.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        // console.log("connected");
        const database = client.db('bag_bang');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('orders');


        //Order Post Api
        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        //match order api 
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { email: id }
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);

        })

        //All Orders Api
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const allOrders = await cursor.toArray();
            res.send(allOrders);

        })

        //delete order api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        //Update status Order api
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: updateStatus.status

                },
            };

            const options = { upsert: true };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })

        //Product Post Api
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            res.json(result);
        })

        //Product get Api
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        })

        //get single Product Api
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);

        })

        //Delete Product delete Api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })



        //reviews post api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.json(result);
        })
        //reviews get Api
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        })


        //get  user role api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        //user Post Api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result);
        })

        //user put Api
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        //Update User Role  Api
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("BagBang Portal Running");
})

app.listen(port, () => {
    console.log("Running Port", port);
})