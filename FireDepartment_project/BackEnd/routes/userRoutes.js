const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/getuserdetails", (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    db.getUserDetails(username, (err, result) => {
        if (err) {
            console.error("Error fetching user details:", err);
            return res.status(500).json({ error: "Error fetching user details" });
        }

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result);
    });
});

router.post("/updateuserdetails", (req, res) => {
    const { username, firstname, lastname, birthdate, gender, job, country, address, municipality, prefecture } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    const values = [firstname, lastname, birthdate, gender, job, country, address, municipality, prefecture, username];

    db.updateUserDetails(values, (err, result) => {
        if (err) {
            console.error("Error updating user details:", err);
            return res.status(500).json({ error: "Error updating user details" });
        }

        if (result.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Profile updated successfully" });
    });
});

module.exports = router
