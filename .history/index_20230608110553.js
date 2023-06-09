const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

// middle wares
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gfg0jvx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const servicesCollection = client.db("geniusCarService").collection("servicesList");

        //get all uploaded services
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        //get specific service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const services = await servicesCollection.findOne(query)
            res, send(services)
        })


    } finally {


    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("genius car is running")
})

app.listen(port, () => {
    console.log(`Genius car server is running on ${port}`)
})