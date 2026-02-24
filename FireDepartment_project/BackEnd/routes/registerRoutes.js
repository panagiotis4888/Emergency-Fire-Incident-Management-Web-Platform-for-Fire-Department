const express = require("express");
const db = require("../database");
const router = express.Router();

router.post("/userregister", (req, res) => {
    const {
        username, email, password, confirmPassword, firstname, lastname, birthdate, gender,
        afm, prefecture, municipality, address, lat, lon, job, telephone, agreement
    } = req.body;

    const country = "Greece";

    // Validate required fields
    if (!username || !email || !password || !confirmPassword || !firstname || !lastname || !birthdate) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }

    const values = [
        username, email, password, firstname, lastname, birthdate, gender,
        job, afm, country, address, lat, lon, telephone, municipality,
        prefecture
    ];

    db.registerUser(values, (err, result) => {
        console.log(err, result);
        if (err) {
            console.error("Error inserting data:", err.message);
            return res.status(500).json({ error: "Database error." });
        }
        res.status(201).json({ message: "User registered successfully!" });
    });
});

router.post("/volunteerregister", (req, res) => {
    const {
        username, email, password, confirmPassword, firstname, lastname, birthdate, gender,
        afm, volunteer_type, height, weight, prefecture, municipality, address, lat, lon,
        job, telephone, agreement
    } = req.body;

    console.log('regtest', lat, lon);

    const country = "Greece";

    if (!username || !email || !password || !confirmPassword || !firstname || !lastname || !birthdate) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }

    const values = [
        username, email, password, firstname, lastname, birthdate, gender,
        job, afm, country, address, lat, lon, telephone, municipality, prefecture,
        volunteer_type, height, weight
    ];

    db.registerVolunteer(values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err.message);
            return res.status(500).json({ error: "Database error." });
        }
        res.status(201).json({ message: "Volunteer registered successfully!" });
    });
});

module.exports = router
