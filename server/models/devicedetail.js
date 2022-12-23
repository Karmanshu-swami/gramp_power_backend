const mongoose = require('mongoose');

const devicedetail = mongoose.Schema({
    deviceId: {
        type: String
    },
    deviceCurrent: {
        type: Number
    },
    deviceVoltage: {
        type: Number
    },
    deviceConsumption: {
        type: Number
    },
    lastDataPoint: {
        type: Date
    }
});

module.exports = mongoose.model("devicedetails", devicedetail)