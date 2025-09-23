const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./utils/database");
const {
  setupSecurity,
  getCorsOptions,
} = require("../../middleware/securityHeaders.js");

const app = express();
const environment = process.env.NODE_ENV || "development";

// Setup security headers and middleware
setupSecurity(app, environment);

// CORS configuration
app.use(cors(getCorsOptions(environment)));

// Body parsing with security limits
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

const port = process.env.PORT || 5003;

//import routes
const userRoute = require("./routes/user/user.routes");
const occasionRoute = require("./routes/events/occasion.routes");
const eventbookingRouter = require("./routes/events/eventbooking.routes");

//define routes
app.use("/api/users/", userRoute);
app.use("/api/occasions/", occasionRoute);
app.use("/api/eventbookings/", eventbookingRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Occasion renting system!");
});

app.listen(port, () => {
  console.log(`Node JS Server Started port ${port}`);
  dbConnection.connectDB();
});
