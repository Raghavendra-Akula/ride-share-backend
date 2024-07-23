const { configDotenv } = require("dotenv");
const { default: mongoose } = require("mongoose");

configDotenv();

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URI);
    }catch(err){
        console.log({message: err});
    }
}

module.exports = connectDB;