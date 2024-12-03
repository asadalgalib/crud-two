const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdm7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // add client and ping to the nodemon
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const databse = client.db('firstDB');
        const dataCollection = databse.collection('coffees');
        const userCollection = client.db('firstDB').collection('users');

        app.get('/', (req, res) => {
            res.send('app is running')
        })

        // create data
        app.post('/coffee', async (req, res) => {
            const quirey = req.body;
            const result = await dataCollection.insertOne(quirey);
            res.send(result);
        })

        // Read all data
        app.get('/coffee', async (req, res) => {
            const cursor = dataCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Read single data
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const cursor = { _id: new ObjectId(id) };
            const result = await dataCollection.findOne(cursor);
            res.send(result);
        })

        // Update data
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const update = req.body;
            console.log(update);
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateCoffee = {
                $set: {
                    name: update.name,
                    chef: update.chef,
                    supplier: update.supplier,
                    taste: update.taste,
                    category: update.category,
                    details: update.details,
                    photo: update.photo
                }
            }
            const result = await dataCollection.updateOne(filter, updateCoffee, option)
            res.send(result);
        })

        // Delete data
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await dataCollection.deleteOne(filter);
            res.send(result);
        })

        // users relataded apis

        // creat users
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log('user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        // read all users
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // delete a user 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(filter);
            res.send(result);
        })

        app.patch('/users', async (req, res) => {
            const email = req.body.email;
            const filter = { email };
            const data = req.body;
            const update = {
                $set: {
                    lastSignInTime: data?.lastSignInTime
                }
            }
            const result = await userCollection.updateOne(filter,update)
            res.send(result)
        })

        app.listen(port, () => {
            console.log(`app is runnig on PORT : ${port}`);
        })


    } finally {

    }
}
run().catch(console.dir);

// --------------------------------------------------------------------------------


