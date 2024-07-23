const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    rides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
    starredRides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }] 
}, {
    timestamps: true
});

const User = mongoose.model("User",userSchema);

module.exports = User;