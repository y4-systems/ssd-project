import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/budgetRoute.js";
import {
  setupSecurity,
  getCorsOptions,
} from "../../middleware/securityHeaders.js";

dotenv.config();

const app = express();
const environment = process.env.NODE_ENV || "development";

// Setup security headers and middleware
setupSecurity(app, environment);

// CORS configuration
app.use(cors(getCorsOptions(environment)));

// Body parsing with size limits
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

const PORT = process.env.PORT || 7000;
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("Database Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

app.use("/api", route);
