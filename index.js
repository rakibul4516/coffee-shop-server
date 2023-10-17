const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


//mongo connect

//mdrakibulislam4516
//ZqrInIyax4sCPIoW

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ufdhagf.mongodb.net/?retryWrites=true&w=majority`;

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

        // CRUD operation implement
        const database = client.db('coffeeDB').collection('coffees')
        const userDatabase = client.db('coffeeDB').collection('user')

        //Get method
        app.get('/coffees', async (req, res) => {
            const cursor = database.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        //Post method
        app.post('/coffees', async (req, res) => {
            const coffees = req.body;
            const result = await database.insertOne(coffees);
            res.send(result);

        });
        //Delete method 
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(query)
            const result = await database.deleteOne(query);
            res.send(result)
        })

        //update method 
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(query)
            const result = await database.findOne(query);
            res.send(result)
        })

        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffees = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    supplier: updatedCoffee.supplier,
                    teste: updatedCoffee.teste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo
                }
            };
            const result = await database.updateOne(filter,coffees,options)
            res.send(result)
        })


        //Data Store of users

        //post method 
        app.post('/users',async(req,res)=>{
            console.log(req.body)
            const newUser = req.body;
            const result = await userDatabase.insertOne(newUser);
            res.send(result)
        })
        //get method
        app.get('/users',async(req,res) =>{
            const cursor = userDatabase.find();
            const result = await cursor.toArray()
            res.send(result)
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






app.get('/', async (req, res) => {
    res.send('Hello I am form coffe server')
})

app.listen(port, () => {
    console.log('coffee server is running into port no:', port)
})