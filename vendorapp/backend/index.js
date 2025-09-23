const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const {
  preventNoSQLInjection,
  createRateLimit,
  securityHeaders,
} = require("../../middleware/security.js");

const app = express();
const Routes = require("./routes/route.js");

const PORT = process.env.PORT || 5001;

dotenv.config();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Custom security headers
app.use(securityHeaders);

// Rate limiting
app.use(createRateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Body parsing with security limits
app.use(express.json({ limit: "5mb" }));

// NoSQL injection prevention
app.use(preventNoSQLInjection());

// CORS configuration with specific origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));

app.use("/", Routes);

app.listen(PORT, () => {
  console.log(`Server started at port no. ${PORT}`);
});
