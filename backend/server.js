// Load environment variables and configure the Express server.
const crypto = require('crypto');
global.crypto = crypto.webcrypto;

require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();


// MIDDLEWARE
app.use(cors({
    origin: "http://127.0.0.1:5500",

    methods: ["GET", "POST"],

    credentials: true
}));

app.use(express.json());


// ROUTES
app.use("/api/auth", authRoutes);


// START SERVER
const startServer = async () => {
    try{
        await connectDB();

    const PORT =
        process.env.PORT || 5000;

    app.listen(PORT, () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    });
    }catch(error){
        console.log("Failed to connect to database", error);
        process.exit(1);
    }

};

startServer();