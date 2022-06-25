const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const objectID = require('mongodb').ObjectId
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qaqbvwf.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
       const database = client.db('carMechanics');
       const serviceCollection = database.collection('services');
    //GET API
    app.get('/services', async (req,res)=>{
        const cursor = serviceCollection.find({ })
        const services = await cursor.toArray()
        res.send(services)
    })   

    //get a single service
    app.get('/services/:id', async(req,res)=>{
        const id = req.params.id
       
        const query = { _id: objectID(id)}
        const service = await serviceCollection.findOne(query)
        res.json(service)
    })

    //post api
    app.post('/services', async(req,res)=>{
   
    const service = req.body;

    console.log('hit the post api',service)
    const result = await serviceCollection.insertOne(service)
    console.log(result)
   res.json(result)
    })

    //Delete Api 
    app.delete('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: objectID(id)}
        const result = await serviceCollection.deleteOne(query)
        res.json(result)
    })


   }finally{
   //await client.close()
   }
}
run().catch(console.dir)
app.get('/',(req,res)=>{
    res.send('Running genius server')
})

app.listen(port,() => {
    console.log('Running Genius server on port ',port)
})

