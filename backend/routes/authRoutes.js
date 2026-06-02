const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Register a new user with email/password and return a JWT.
// Data is stored in a MongoDB users collection.

// REGISTER
router.post("/register", async (req, res) => {

    try {

        const db = getDB();

        const users = db.collection("users");

        const {name,  email, password } = req.body;

        // VALIDATION
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        // EMAIL VALIDATION
        const emailRegex =
            /^[a-zA-Z0-9\._+-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {

            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });

        }

        // PASSWORD VALIDATION
        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });

        }

        // CHECK EXISTING USER
        const existingUser =  await users.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // INSERT USER
        const result = await users.insertOne({

            name, email, password: hashedPassword, createdAt: new Date()

        });

        // CREATE TOKEN
        const token = jwt.sign(

            {
                id: result.insertedId
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        res.status(201).json({

            success: true,

            message: "Registration successful",

            token

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});


// LOGIN
router.post("/login", async (req, res) => {

    try {

        const db = getDB();

        const users = db.collection("users");

        const {
             email, 
             password 
            } = req.body;

        // VALIDATION
        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "All fields are required"

            });

        }

        // FIND USER
        const user = await users.findOne({ email });

        if (!user) {

            return res.status(400).json({

                success: false,

                message: "Invalid credentials"

            });

        }

        // COMPARE PASSWORD
        const isMatch =  await bcrypt.compare( 
            password, 
            user.password 
            );

        if (!isMatch) {

            return res.status(400).json({

                success: false,

                message: "Invalid credentials"

            });

        }

        // CREATE TOKEN
        const token = jwt.sign(

            {
                id: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        res.status(200).json({

            success: true,

            message: "Login successful",

            token

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});


// DASHBOARD
router.get( "/dashboard", authMiddleware, async (req, res) => {

        try {

            const db = getDB();

            const users = db.collection("users");

            const user = await users.findOne({_id: new ObjectId(req.user.id)

                });

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message: "User not found"

                });

            }

            res.status(200).json({

                success: true,

                message: "Dashboard loaded",

                user: {

                    id: user._id,

                    name: user.name,

                    email: user.email

                }

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                success: false,

                message: "Server Error"

            });

        }

    }
);

module.exports = router;