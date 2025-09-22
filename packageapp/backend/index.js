const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')

//middleware
app.use(cors());
app.use(express.json());


//pw -user123

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//mongodb configuration
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;

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

    //create a collection of documents
    const Packagecollection = await client.db("PackageInventory").collection("Packages");


    //insert a package to the database post method

    app.post("/upload-Package",async(req,res) => { 
        const data = req.body;
        const result = await Packagecollection.insertOne(data);
        res.send(result);
    });


    //get all data from the database

    app.get("/all-Packages",async(reg,res)=>{
        const packages =  Packagecollection.find();
        const result = await packages.toArray();
        res.send(result);
    })


    //update a package data : patch or update methods

    app.patch("/Package/:id",async(req,res) => {
        const id = req.params.id;
        //console.log(id);
        const updatePackageData = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updateDoc ={
            $set: {
                ...updatePackageData
            }
        }

        //update
        const result = await Packagecollection.updateOne(filter,updateDoc,options );
        res.send(result); 
    })


    //delete package data

    app.delete("/Package/:id",async(req,res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const result = await Packagecollection.deleteOne(filter);
        res.send(result);
    })

    //To get single package data

    app.get("/package/:id", async(req,res) => {
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)};
      const result = await Packagecollection.findOne(filter);
      res.send(result);
    })

   // Send a ping to confirm a successful connection

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})