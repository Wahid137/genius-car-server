const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
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

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    console.log(token)
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const servicesCollection = client.db("geniusCarService").collection("servicesList");
        const orderCollection = client.db("geniusCarService").collection("orders")

        // send token 
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
        })

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
            res.send(services)
        })

        //place order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })

        //get orders for specific email query

        app.get('/orders', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = await orderCollection.find(query)
            const orders = await cursor.toArray();
            res.send(orders)
        })

        //delete order

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })

        //update status

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updatedDoc);
            res.send(result)
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