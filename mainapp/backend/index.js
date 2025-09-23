import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import tourRoute from "./routes/tour.js";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import reviewRoute from "./routes/review.js";
import bookingRoute from "./routes/booking.js";

dotenv.config();

const mainapp1 = express();
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: true,
  credentials: true,
};
// database connection
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB database connected");
  } catch (err) {
    console.log("MongoDB database not connected");
  }
};
// //FOR TESTING
// mainapp1.get("/",(req,res)=>{
//     res.send("api is working");
// });

mainapp1.use(express.json());
mainapp1.use(cors(corsOptions));
mainapp1.use(cookieParser());
mainapp1.use(
  csurf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  })
);
mainapp1.use("/api/v1/auth", authRoute);
mainapp1.use("/api/v1/tours", tourRoute);
mainapp1.use("/api/v1/users", userRoute);
mainapp1.use("/api/v1/review", reviewRoute);
mainapp1.use("/api/v1/booking", bookingRoute);

mainapp1.listen(port, () => {
  connect();
  console.log("Server listing on port", port);
});
