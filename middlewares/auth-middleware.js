const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

const verifyRegister = async (req, res, next)=>{
    try{
        if (!req.body.name)  { 
            return res.status(400).send({message: "Please provide Name."});
        }
        if (!req.body.userId) {
            return res.status(400).send({message: "Please provide User ID."});
        }
        if (!req.body.email) {
            return res.status(400).send({message: "Please provide Email."});
        }
        if (!req.body.password) { 
            return res.status(400).send({message: "Please provide password."});
        }
        const userById = await User.findOne({userId: req.body.userId});
        if (userById) {
            return res.status(400).send({message: "User ID already exists."});
        }
        const userByEmail = await User.findOne({email: req.body.email});
        if (userByEmail) {
            return res.status(400).send({message: "Email ID already exists."});
        }
        const email = /^[a-zA-Z0-9]+@smail.iitm.ac.in$/;
        if (!email.test(req.body.email)) {
            return res.status(400).send({ message: "Please provide institute Email ID." });
        }

        const password = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        if (!(req.body.password.match(password))) {
            return res.status(400).send({message: "Password must meet the following criteria: - Contain at least one digit (0-9) - Contain at least one special character (!@#$%^&*) - Be 8 to 16 characters long"});
        }
        
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: "Internal server error."});
    }
}

const verifyJWT = (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        res.status(403).send({message: "No token provided."});
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload)=>{
        if(err){
            res.status(403).send({message: "Token provided is invalid or expired."});
            return;
        }
        req.body.userId = payload.userId;
        next();
    })
}

module.exports = {verifyRegister, verifyJWT};