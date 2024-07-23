const express = require("express");

const { verifyRegister } = require("../middlewares/auth-middleware");
const { registerHandler, emailVerifyHandler, loginHandler } = require("../controllers/auth-controller");

const authRouter = express.Router();

authRouter.route("/register")
    .post([verifyRegister], registerHandler);

authRouter.route("/verify/:userId/:token")
    .get(emailVerifyHandler);

authRouter.route("/login")
    .post(loginHandler);

module.exports = authRouter;