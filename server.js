const express = require('express');
const app = express();
app.use(express.json());
const routes = require('./server/routes/routes');

// environment variables and file setup
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: "config.env" });

// mongodb connection
const connectDB = require('./server/database/connectdb');
connectDB();

// port declaration
const port = process.env.PORT;

// Load routes
app.use('/api', routes);

// server start script
app.listen(port, () => {
    console.log(`Successfully connected to the port ${port}`);
})