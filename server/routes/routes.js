const router = require('express').Router();
const login = require("../models/login");
const bcrypt = require('bcrypt');
const devicedata = require("../models/device");
const devicedetail = require("../models/devicedetail");


// Home Route
router.get("/", (req, res) => {
    res.status(200).json({ message: "Home page" })
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userrec = await login.findOne({ username: username });
        if (userrec) {
            const comppass = await bcrypt.compare(password, userrec.password);
            if (comppass) {
                res.status(200).json(userrec)
            } else {
                res.status(400).json({ message: "Wrong Password!" })
            }
        } else {
            res.status(400).json({ message: "Wrong Credentials!" })
        }
    } catch (error) {
        res.status(400).json({ message: message.error })
    }
});


// Get all devices data
router.get("/getdevicesdata", async (req, res) => {
    try {
        const devicerec = await devicedata.find();
        const activedevicerec = await devicedata.find({ deviceStatus: "Live" }).count();
        res.status(200).json({ devicerec, activedevicerec });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Device data entry Route
router.post("/adddevice", async (req, res) => {
    try {
        const { deviceId, deviceName, deviceStatus } = req.body;
        const dataRec = await new devicedata({
            deviceId: deviceId,
            deviceName: deviceName,
            deviceStatus: deviceStatus,
        });
        await dataRec.save();

        const devicedetailrec = await new devicedetail({
            deviceId: deviceId,
            deviceCurrent: 0,
            deviceVoltage: 0,
            deviceConsumption: 0,
            lastDataPoint: new Date()
        });
        await devicedetailrec.save();
        res.status(201).json(dataRec);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// url to insert device details
router.post("/adddevicedetail", async (req, res) => {
    try {
        const { dId, deviceCurrent, deviceVoltage, deviceConsumption } = req.body;
        const devicedetailrec = await new devicedetail({
            deviceId: dId,
            deviceCurrent: deviceCurrent,
            deviceVoltage: deviceVoltage,
            deviceConsumption: deviceConsumption,
            lastDataPoint: new Date()
        });
        await devicedetailrec.save();
        res.status(201).json(devicedetailrec);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Get individual device data
router.get("/getsingledata/:dId", async (req, res) => {
    try {
        const dId = req.params.dId;
        const device = await devicedata.find({ deviceId: dId });
        const devicesrec = await devicedetail.find({ deviceId: dId }, { lastDataPoint: 1 }).sort({ lastDataPoint: -1 }).limit(1);

        let devicefinaldata = device[0].toObject();
        devicefinaldata["lastDataPoint"] = devicesrec[0].lastDataPoint

        const totalvalues = await devicedetail.aggregate([
            {
                $match: { 'deviceId': dId }
            },
            {
                $group:
                {
                    _id: "$deviceId",
                    avgcurrent: { $avg: "$deviceCurrent" },
                    avgvoltage: { $avg: "$deviceVoltage" },
                    totalConsumption: { $sum: "$deviceConsumption" }
                }
            }
        ]);

        res.status(200).json({ devicefinaldata, totalvalues: totalvalues[0] });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// ------------ Test URL's ----------------

// url to register new user
router.post('/reg', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashpass = await bcrypt.hash(password, 10)
        const checkuser = await login.findOne({ username: username });
        if (!checkuser) {
            const newuser = new login({
                username: username,
                password: hashpass
            });
            await newuser.save();
            res.status(201).json(newuser)
        } else {
            res.status(400).json({ message: "user already exists!" })
        }
    } catch (error) {
        res.status(400).json({ message: message.error })
    }
});

// url to view all the users
router.get('/getusers', async (req, res) => {
    try {
        const userdata = await login.find()
        res.status(200).json(userdata)
    } catch (error) {
        res.status(400).json({ message: message.error })
    }
});




module.exports = router;