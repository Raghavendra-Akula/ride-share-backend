const express = require("express");

const { verifyJWT } = require("../middlewares/auth-middleware");
const { getUserById } = require("../controllers/user-controller");

const userRouter = express.Router();

userRouter.route("/:userId")
    .get([verifyJWT], getUserById);


module.exports = userRouter;