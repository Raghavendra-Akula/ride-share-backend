const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const verifyRideDetails = async (req, res, next) => {
    if (!/^\d{10}$/.test(req.body.phoneNo)) {
        return res.status(400).send({ message: "Please provide a valid 10-digit Phone Number." });
    }

    const currentDate = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD');

    if (req.body.dateOfDeparture < currentDate) {
        return res.status(400).send({ message: "Please provide a valid Date of Departure (should be today or later)." });
    }

    const currentTime = dayjs().tz('Asia/Kolkata').format('HH:mm');

    if (req.body.dateOfDeparture === currentDate) {
        if (req.body.departureTime <= currentTime) {
            return res.status(400).send({ message: "Please provide a valid Departure Time (should be after current time)." });
        }
    }

    next();
};

const verifyFilterDetails = async (req, res, next) => {
    const { srcRadius, dstRadius, dateOfDepartureFilter, departureTimeFilter } = req.body;

    if (srcRadius < 0) {
        return res.status(400).json({ error: "Source Search Radius must be a non-negative number." });
    }

    if (dstRadius < 0) {
        return res.status(400).json({ error: "Destination Search Radius must be a non-negative number." });
    }

    if (dateOfDepartureFilter) {
        const currentDate = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD');

        if (dateOfDepartureFilter < currentDate) {
            return res.status(400).send({ message: "Please provide a valid Date of Departure (should be today or later)." });
        }
    }

    if (departureTimeFilter) {
        const currentDate = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD');
        const currentTime = dayjs().tz('Asia/Kolkata').format('HH:mm');

        if (dateOfDepartureFilter === currentDate) {
            if (departureTimeFilter <= currentTime) {
                return res.status(400).send({ message: "Please provide a valid Departure Time (should be after current time)." });
            }
        }
    }

    next();
}


module.exports = {verifyRideDetails, verifyFilterDetails};
