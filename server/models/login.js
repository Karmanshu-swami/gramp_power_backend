const mongoose = require('mongoose');

const userdata = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
});

const usersdb = mongoose.model("usersdb", userdata);
module.exports = usersdb;