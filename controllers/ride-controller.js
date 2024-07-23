const Ride = require("../models/ride-model");
const axios = require('axios');
const User = require("../models/user-model");
const { getDistance } = require("../utils/getDistance");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const addRideDetails = async (req, res) => {
    try {
        const { userId, phoneNo, src, dst, departureTime, timeFlexibility, dateOfDeparture, comments } = req.body;

        let src_coords, dst_coords;
        
        const src_response = await axios.get('https://api.olamaps.io/places/v1/geocode', {
            params: {
              address : src,
              api_key: process.env.OLA_MAPS_API
            }
        });
 
        if (src_response.data.status === 'ok') {
            src_coords = src_response.data.geocodingResults[0].geometry.location;
        }else {
            return res.status(400).send({ message: "Invalid or empty address parameter."});
        }

        const dst_response = await axios.get('https://api.olamaps.io/places/v1/geocode', {
            params: {
              address : dst,
              api_key: process.env.OLA_MAPS_API
            }
        });

        if (dst_response.data.status === 'ok') {
            dst_coords = dst_response.data.geocodingResults[0].geometry.location;
        }else {
            return res.status(400).send({ message: "Invalid or empty address parameter."});
        }

        const newRide = new Ride({
            userId,
            phoneNo,
            src,
            src_coords,
            dst,
            dst_coords,
            departureTime, 
            timeFlexibility, 
            dateOfDeparture,
            comments
        });

        const savedRide = await newRide.save();

        const user = await User.findOne({ userId });

        if (user) {
            user.rides.push(savedRide._id);
            await user.save();
            res.status(201).send({ message: "Ride details saved successfully.", ride: savedRide });
        } else {
            res.status(404).send({ message: "User not found." });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to add the Ride details. Please try again later." });
    }
};

const updateRideDetails = async (req, res) => {
    try {
        const { userId, phoneNo, src, dst, departureTime, timeFlexibility, dateOfDeparture, comments } = req.body;

        let src_coords, dst_coords;
        
        const src_response = await axios.get('https://api.olamaps.io/places/v1/geocode', {
            params: {
              address : src,
              api_key: process.env.OLA_MAPS_API
            }
        });
 
        if (src_response.data.status === 'ok') {
            src_coords = src_response.data.geocodingResults[0].geometry.location;
        }else {
            return res.status(400).send({ message: "Invalid or empty address parameter."});
        }

        const dst_response = await axios.get('https://api.olamaps.io/places/v1/geocode', {
            params: {
              address : dst,
              api_key: process.env.OLA_MAPS_API
            }
        });

        if (dst_response.data.status === 'ok') {
            dst_coords = dst_response.data.geocodingResults[0].geometry.location;
        }else {
            return res.status(400).send({ message: "Invalid or empty address parameter."});
        }

        const rideId = req.params.id;

        const updatedRide = await Ride.findByIdAndUpdate(
            rideId, 
            {
                phoneNo,
                src,
                src_coords,
                dst,
                dst_coords,
                departureTime,
                timeFlexibility,
                dateOfDeparture,
                comments
            },
            { new: true } 
        );

        if (!updatedRide) {
            return res.status(404).send({ message: 'Ride not found' });
        }

        res.status(200).send({ message: 'Ride updated successfully.', ride: updatedRide });
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to add the Ride details. Please try again later." });
    }
};

const getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find();
        res.status(200).send(rides);
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

const getMyRides = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findOne({ userId });

        if (user) {
            const rideIds = user.rides;
            const rides = await Ride.find({ _id: { $in: rideIds } });
            res.status(200).send(rides);
        } else {
            res.status(404).send({ message: "User not found." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error." });
    }
}

const getStarredRides = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findOne({ userId });

        if (user) {
            const rideIds = user.starredRides;
            const rides = await Ride.find({ _id: { $in: rideIds } });
            res.status(200).send(rides);
        } else {
            res.status(404).send({ message: "User not found." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error." });
    }
}

const updateStar = async (req, res) => {
    try {
        const userId = req.body.userId;
        const rideId = req.params.id;

        const user = await User.findOne({ userId });
        const ride = await Ride.findOne({ _id: rideId });

        if (!user || !ride) {
            return res.status(404).send({ error: 'User or Ride not found.' });
        }

        if (user.starredRides.includes(ride._id)) {
            user.starredRides = user.starredRides.filter(id => !id.equals(ride._id));
        } else {
            user.starredRides.push(ride._id);
        }
        
        await user.save();
        res.status(200);

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error." });
    }
}

const getFilteredRides = async (req, res) => {
    try {
        const {
            srcFilter,
            srcRadius,
            dstFilter,
            dstRadius,
            dateOfDepartureFilter,
            departureTimeFilter
        } = req.body;

        let srcCoords;
        let dstCoords;

        if (srcFilter) {
            const srcResponse = await axios.get('https://api.olamaps.io/places/v1/geocode', {
                params: {
                    address: srcFilter,
                    api_key: process.env.OLA_MAPS_API
                }
            });

            if (srcResponse.data.status === 'ok') {
                srcCoords = srcResponse.data.geocodingResults[0].geometry.location;
            } else {
                return res.status(400).send({ message: "Invalid or empty source address parameter." });
            }
        }

        if (dstFilter) {
            const dstResponse = await axios.get('https://api.olamaps.io/places/v1/geocode', {
                params: {
                    address: dstFilter,
                    api_key: process.env.OLA_MAPS_API
                }
            });

            if (dstResponse.data.status === 'ok') {
                dstCoords = dstResponse.data.geocodingResults[0].geometry.location;
            } else {
                return res.status(400).send({ message: "Invalid or empty destination address parameter." });
            }
        }

        let rides = await Ride.find();

        if (srcCoords) {
            rides = rides.filter(ride => getDistance(srcCoords, ride.src_coords) <= parseInt(srcRadius));
        }

        if (dstCoords) {
            rides = rides.filter(ride => getDistance(dstCoords, ride.dst_coords) <= parseInt(dstRadius));
        }

        if (dateOfDepartureFilter) {
            rides = rides.filter(ride => ride.dateOfDeparture === dateOfDepartureFilter);
        }

        if (departureTimeFilter) {
            rides = rides.filter(ride => {
                const [rideHours, rideMinutes] = ride.departureTime.split(':').map(Number);
                const [filterHours, filterMinutes] = departureTimeFilter.split(':').map(Number);
                const timeInMinutes = rideHours * 60 + rideMinutes;
                const filterTimeInMinutes = filterHours * 60 + filterMinutes;
                const flexibility = ride.timeFlexibility;

                return Math.abs(timeInMinutes - filterTimeInMinutes) <= flexibility;
            });
        }

        return res.status(200).send(rides);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error." });
    }
};

module.exports = { addRideDetails, updateRideDetails, getAllRides, getMyRides, getStarredRides, updateStar, getFilteredRides };
