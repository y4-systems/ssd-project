const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const port = 3001;
const host = "localhost";
const mongoose = require("mongoose");
const router = require("./routes/feedbackRouter");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3004",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); //cors origin blocking for security
app.use(express.json());

// Use environment variable for MongoDB URI
const uri = process.env.MONGO_URI;
const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("connected to mongoDB");
  } catch (error) {
    console.log("mongoDB error: ", error);
  }
};

connect();

//call back function
const server = app.listen(port, host, () => {
  console.log(`Node server is listing to ${server.address().port}`);
});

app.use("/api", router);
