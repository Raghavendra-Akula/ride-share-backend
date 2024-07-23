const { default: mongoose } = require("mongoose");

const rideSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    phoneNo: { type: String, required: true },
    src: { type: String, required: true },
    src_coords: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    dst: { type: String, required: true },
    dst_coords: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    departureTime: { type: String, required: true },
    timeFlexibility: { type: Number, required: true },
    dateOfDeparture: { type: String, required: true },
    comments: { type: String }
}, {
    timestamps: true
});

const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;
