const express = require("express");
const db = require("../database");
const router = express.Router();

router.get('/volunteer/:id', (req, res) => {
    const id = req.params.id;

    db.findVolunteer(id, (err, result) => {
        if(err || !result){
            res.sendStatus(400);
            return;
        }
        delete result.password;

        res.send(result);
    });
})

router.get("/getvolunteerdetails", (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    db.getVolunteerDetails(username, (err, result) => {
        if (err) {
            console.error("Error fetching volunteer details:", err);
            return res.status(500).json({ error: "Error fetching volunteer details" });
        }

        if (!result) {
            return res.status(404).json({ error: "Volunteer not found" });
        }
        
        delete result.password;
        res.json(result);
    });
});

router.post('/updatevolunteerdetails', (req, res) => {
    const user = req.body;

    const { username, firstname, lastname, birthdate, gender, job, country, address, municipality, prefecture, lat, lon} = user;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    db.updateVolunteerDetails([firstname, lastname, birthdate, gender, job, country, address, municipality, prefecture, lat, lon, username], (err, result) => {
        if (err) {
            console.error('Error updating user details:', err);
            return res.status(500).json({ error: 'Error updating user details' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    });
});
module.exports = router
