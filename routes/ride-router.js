const express = require("express");

const { verifyRideDetails, verifyFilterDetails } = require("../middlewares/ride-middleware");
const { addRideDetails, getAllRides, getMyRides, getStarredRides, updateStar, updateRideDetails, getFilteredRides, deleteRideById } = require("../controllers/ride-controller");
const { verifyJWT } = require("../middlewares/auth-middleware");


const rideRouter = express.Router();

rideRouter.route("/get-all")
    .get([verifyJWT], getAllRides);

rideRouter.route("/get-mine")
    .get([verifyJWT], getMyRides);

rideRouter.route("/get-starred")
    .get([verifyJWT], getStarredRides);

rideRouter.route("/add")
    .post([verifyJWT, verifyRideDetails], addRideDetails);

rideRouter.route("/update/:id")
    .post([verifyJWT, verifyRideDetails], updateRideDetails);

rideRouter.route("/update-star/:id")
    .get([verifyJWT], updateStar);

rideRouter.route("/filter")
    .post([verifyJWT, verifyFilterDetails], getFilteredRides);

rideRouter.route("/delete/:id")
    .get([verifyJWT], deleteRideById);


module.exports = rideRouter;