const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 2000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.koeqpiv.mongodb.net/?retryWrites=true&w=majority`;


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

        const ToysCollection = client.db("ToySportzDB").collection("ToySport");



        const indexKey = {
            name: 1,

        };
        const indexOption = { name: "name" };
        const result = await ToysCollection.createIndex(indexKey, indexOption)
        app.get("/jobSearchName/:text", async (req, res) => {
            const text = req.params.text;
            const result = await ToysCollection
                .find({ name: text })
                .toArray();
            res.send(result);
        });


        app.get('/toy', async (req, res) => {
            const cursor = ToysCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get('/addToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await ToysCollection.findOne(query);
            res.send(user)

        })


        app.get('/addToy', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { sellerEmail: req.query.email }
            }
            const result = await ToysCollection.find(query).limit(20).toArray();
            res.send(result)
        })



        app.get('/addToy', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { sellerEmail: req.query.email };
            }

            const sortParam = req.query?.sort === 'asen' ? 1 : -1;
            const result = await ToysCollection.find(query)
                .sort({ price: sortParam })
                .limit(20)
                .toArray();
            res.send(result);
        });


        app.post('/addToy', async (req, res) => {
            const newaddToy = req.body;

            const result = await ToysCollection.insertOne(newaddToy)
            res.send(result);

        })

        app.delete('/addToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await ToysCollection.deleteOne(query);
            res.send(result)
        })

        app.put('/addToy/:id', async (req, res) => {
            const id = req.params.id;
            const updateSports = req.body;
            console.log(id, updateSports);
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const Sports = {
                $set: {
                    price: updateSports.price,
                    quantity: updateSports.quantity,
                    description: updateSports.description,
                }
            }
            const result = await ToysCollection.updateOne(filter, Sports, option)
            res.send(result)
        });




        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Toysportz server is running')
})

app.listen(port, () => {
    console.log(`Toysportz server is running on port ${port}`)
})
