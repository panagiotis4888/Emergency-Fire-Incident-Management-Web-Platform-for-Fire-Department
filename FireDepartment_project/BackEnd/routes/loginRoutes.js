const express = require("express");
const db = require("../database");
const router = express.Router();

router.post("/userlogin", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password." });
    }

    db.getUserPassword(username, (err, result) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).json({ message: "Error processing login. Please try again." });
        }

        if (result && result.password === password) {
            return res.status(200).json({ username:username, id: result.user_id });
        }
        res.status(401).json({ message: "Invalid username or password." });
    });
});

router.post("/volunteerlogin", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password." });
    }

    db.getVolunteerPassword(username, (err, result) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).json({ message: "Error processing login. Please try again." });
        }

        if (result && result.password === password) {
            return res.status(200).json({ username, id : result.volunteer_id});
        }
        res.status(401).json({ message: "Invalid username or password." });
    });
});

router.post("/adminlogin", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password." });
    }

    db.getAdminPassword(username, (err, result) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).json({ message: "Error processing login. Please try again." });
        }

        if (result && result.password === password) {
            return res.status(200).json({ username : username, id: result.admin_id});
        }
        res.status(401).json({ message: "Invalid username or password." });
    });
});

module.exports = router
