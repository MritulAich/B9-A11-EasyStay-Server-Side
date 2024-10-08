const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.ku98crh.mongodb.net/?appName=Cluster0`;

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


        const roomCollection = client.db('hotelDB').collection('rooms');
        

        app.get('/rooms', async (req, res) => {
            const cursor = roomCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/rooms/:id', async (req, res) => {
            const roomId = req.params.id;
            try {
              const room = await roomCollection.findOne({ _id: roomId });
              if (room) {
                res.json(room);
              } else {
                res.status(404).send('Room not found');
              }
            } catch (error) {
              res.status(500).send('Error room');
            }
          });


        app.delete('/rooms/:id', async (req, res) => {
            const roomId = req.params.id;
            const query = { _id: roomId }
            const result = await roomCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/rooms/:id', async (req, res) => {
            const roomId = req.params.id;
            const query = { _id: roomId }
            const result = await roomCollection.findOne(query);
            res.send(result);
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
    res.send('easy-stay server-side is running')
})
app.listen(port, () => {
    console.log(`easy-stay server is running on port: ${port}`);
})