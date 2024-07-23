const User = require("../models/user-model");

const getUserById = async (req, res)=>{
    try{
        const user = await User.findOne({userId: req.params.userId});
        if(!user){
            res.status(404).send({message: "UserId passed is invalid."});
        }else {
            res.status(200).send(user);
        } 
    }catch(err){
        console.log(err);
        res.status(500).send({message: "Internal server error."});
    }
}

module.exports = {getUserById};