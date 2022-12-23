const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    deviceId: {
        type: String
    },
    deviceName: {
        type: String
    },
    deviceStatus: {
        type: String
    }
});

const deviceData = mongoose.model("devicedata", deviceSchema);
module.exports = deviceData;