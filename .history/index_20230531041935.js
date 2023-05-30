const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        const user = {
            user: "testing",
            email: "test@gmail.com"
        }
        const result = await servicesCollection.insertOne(user)
        console.log(result);

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