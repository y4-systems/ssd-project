const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // Added

// ===== Rate Limiting =====
// General limiter (all routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per IP
  message: { error: "Too many requests, please try again later." }
});

// Stricter limiter for write-heavy routes (POST/PATCH/DELETE)
const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 20, // 20 writes per IP
  message: { error: "Too many write requests, slow down." }
});

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(apiLimiter); // ✅ Global limiter applied to all requests

//pw -user123
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ===== MongoDB configuration =====
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://demo-user:user123@cluster0.aobbdul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function run() {
  try {
    await client.connect();

    const Packagecollection = await client
      .db("PackageInventory")
      .collection("Packages");

    // Insert a package
    app.post("/upload-Package", writeLimiter, async (req, res) => {
      // Protected
      const data = req.body;
      const result = await Packagecollection.insertOne(data);
      res.send(result);
    });

    // Get all packages
    app.get("/all-Packages", async (req, res) => {
      const packages = Packagecollection.find();
      const result = await packages.toArray();
      res.send(result);
    });

    // Update a package
    app.patch("/Package/:id", writeLimiter, async (req, res) => {
      // Protected
      const id = req.params.id;
      const updatePackageData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: { ...updatePackageData } };
      const result = await Packagecollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Delete package
    app.delete("/Package/:id", writeLimiter, async (req, res) => {
      // Protected
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await Packagecollection.deleteOne(filter);
      res.send(result);
    });

    // Get single package
    app.get("/package/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await Packagecollection.findOne(filter);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // keep client open
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
