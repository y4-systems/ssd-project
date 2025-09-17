const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./utils/database");

const app = express();

app.use(cors());
app.use(express.json());

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
