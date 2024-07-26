const express = require("express");
const connectDB = require("./config/dbconfig");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth-router.js");
const rideRouter = require("./routes/ride-router.js");
const userRouter = require("./routes/user-router.js");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

const PORT = 8000;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ride", rideRouter);
app.use("/api/v1/user", userRouter);

app.get("/",(req, res)=>{
    res.send("Hello!!");
});

mongoose.connection.once("open",()=>{
    console.log("Connected to DB");
    app.listen(process.env.PORT || PORT, '0.0.0.0', ()=>{
        console.log("Server is UP and running");
    })
});