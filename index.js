import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import connectDB from "./config/Database.js";
import userRoute from "./routes/userroute.js";
import ImageRoute from "./routes/imageroute.js";
import cookieParser from "cookie-parser"; 
dotenv.config({});



const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use("/api/user", userRoute);
app.use("/api/image", ImageRoute);

const PORT = process.env.PORT || 5000
  
app.listen(PORT , ()=>{
    connectDB();
    console.log(`Server running on port ${PORT}`);
})