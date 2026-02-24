const express = require("express");
const db = require("../database");
const geolib = require('geolib');
const router = express.Router();

// prefix: incidentAPI
router.get('/incident/:id', (req, res) => {
    const incidentId = req.params.id;

    db.getIncidentDetails(incidentId, (err, row) => {
        if (err) {
            console.error('Error fetching incident:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        console.log(row)

        if (!row) {
            return res.status(404).json({ success: false, message: 'Incident not found' });
        }

        res.status(200).json({ success: true, incident: row });
    });
});

router.post("/incident", (req, res) => {
    const {
        incident_type, description, user_type, address, lat, lon, prefecture, municipality, telephone
    } = req.body;

    if (!["fire", "accident"].includes(incident_type) || !["guest", "admin", "user", "volunteer"].includes(user_type)) {
        return res.status(406).json({ message: "Invalid input" });
    }

    const status = user_type === "admin" ? "running" : "submitted";
    const danger = "unknown";
    const start_datetime = new Date().toISOString();
    const vehicles = 0;
    const firemen = 0;

    const values = [
        incident_type, description, user_type, address, lat, lon, prefecture, municipality,
        status, danger, start_datetime, vehicles, firemen, String(telephone)
    ];

    db.createIncident(values, (err, result) => {
        if (err) {
            console.error("Error creating incident:", err);
            return res.status(500).json({ message: "Error creating incident" });
        }
        res.status(201).json({ message: "Incident created", incident_id: result.incidentId });
    });
});


router.post("/incidents", (req, res) => {
    const status = req.body.status;
    console.log(status);
    const payload = {};

    db.queryIncidents(status, (err, results) => {
        if (err) {
            console.error("Error fetching incidents:", err);
            return res.status(500).json({ message: "Error fetching incidents" });
        }
        console.log(results)
        payload.incidents = results;
        const username = req.body.username;
        const usertype = req.body.usertype;

        if (usertype === 'guest') {
            res.send(payload);
            return;
        }

        if (username) {
            (usertype == 'user' ? db.getUserDetails : usertype == 'volunteer' ? db.getVolunteerDetails : db.getAdminDetails)(username, (err, results) => {
                payload.user_position = { lat: results.lat, lon: results.lon };
                console.log('i am at', payload.user_position);

                let min_fire_distance = Infinity;
                let min_accident_distance = Infinity;


                payload.incidents.forEach((incident) => {
                    const d = geolib.getDistance({ latitude: results.lat, longitude: results.lon }, { latitude: incident.lat, longitude: incident.lon });
                    console.log(d);
                    if (incident.incident_type == 'fire') {
                        if (d < min_fire_distance) {
                            min_fire_distance = d;
                        }
                    }
                    else {
                        if (d < min_accident_distance) {
                            min_accident_distance = d;
                        }
                    }
                });

                console.log(min_fire_distance)
                min_fire_distance = geolib.convertDistance(min_fire_distance, 'km');

                let threat_level;
                if (min_fire_distance < 10) {
                    threat_level = 'HIGH DANGER';
                } else if (min_fire_distance < 20) {
                    threat_level = 'Caution'
                } else {
                    threat_level = 'Safe'
                }

                payload.status = threat_level;
                payload.nearest_fire_km = min_fire_distance;
                res.status(200).json(payload);
            });
        } else {
            res.status(200).json(payload);
        }
    });
});

router.delete("/incident/:id", (req, res) => {
    const incidentId = req.params.id;

    db.deleteIncident(incidentId, (err, result) => {
        if (err) {
            console.error("Error deleting incident:", err);
            return res.status(500).json({ message: "Error deleting incident" });
        }
        res.status(200).json({ message: "Incident deleted" });
    });
});

router.get('/submitted_incident_count', (req, res) => {
    db.countSubmittedIncidents((err, result) => {
        console.log(result);

        res.send(result);
    });
});

router.put('/incidentfake/:id', (req, res) => {
    const incidentId = req.params.id;
    const { status } = req.body; // Extract status from the body

    console.log(status)
    if (!status) {
        return res.status(400).json({ message: 'Missing status' });
    }

    db.getIncidentStatus(incidentId, (err, result) => {
        console.log(result)
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error checking incident status' });
        }

        if (!result) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        const currentStatus = result.status;

        if (currentStatus === 'running' && status === 'fake') {
            return res.status(400).json({ message: 'Cannot fake the incident because it is running' });
        }

        const currentDateTime = new Date();

        db.updateIncidentStatus([status, currentDateTime, incidentId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error updating incident' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Incident not found' });
            }

            res.json({ message: `Incident status updated to ${status}` });
        });
    });
});

router.put('/incidentrunning/:id', (req, res) => {
    const incidentId = req.params.id;
    const { status, danger } = req.body;

    console.log(status, danger);
    if (!status || !danger) {
        return res.status(400).json({ message: 'Missing status or danger level' });
    }

    const validDangerLevels = ['low', 'medium', 'high'];
    if (!validDangerLevels.includes(danger)) {
        return res.status(406).json({ message: 'Invalid danger level' });
    }

    db.getIncidentStatus(incidentId, (err, result) => {
        console.log('test', err, result);
        if (err) {
            console.error('Error checking incident status:', err);
            return res.status(500).json({ message: 'Error checking incident status' });
        }

        if (!result) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        const currentStatus = result.status;

        if (currentStatus === 'running' && status === 'fake') {
            return res.status(400).json({ message: 'Cannot fake the incident because it is running' });
        }

        const currentDateTime = new Date().toISOString();

        const values = [status, danger, currentDateTime, incidentId];

        db.updateIncidentRunning(values, (err, result) => {
            if (err) {
                console.error('Error updating incident:', err);
                return res.status(500).json({ message: 'Error updating incident' });
            }

            if (result.changes === 0) {
                return res.status(404).json({ message: 'Incident not found' });
            }

            res.json({ message: `Incident status updated to ${status} with danger level ${danger}` });
        });
    });
});

router.put('/incidentfinish/:id', (req, res) => {
    const incidentId = req.params.id;
    const { finalResult } = req.body;

    if (!finalResult) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    db.getIncidentStatus(incidentId, (err, result) => {
        if (err) {
            console.error('Error checking incident status:', err);
            return res.status(500).json({ message: 'Error checking incident status' });
        }

        if (!result) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        const currentStatus = result.status;

        // If the incident is not 'running', return an error
        if (currentStatus !== 'running') {
            return res.status(400).json({ message: 'This incident cannot be finished as it is not running.' });
        }

        const values = ['finished', Date.now(), finalResult, incidentId];

        // Update the incident with the final status, end time, and result
        db.finishIncident(values, (err, result) => {
            if (err) {
                console.error('Error updating incident:', err);
                return res.status(500).json({ message: 'Error updating incident' });
            }

            if (result.changes === 0) {
                return res.status(404).json({ message: 'Incident not found' });
            }

            res.json({ message: 'Incident finished successfully' });
        });
    });
});

router.get('/geteditincident/:id', (req, res) => {
    const incidentId = req.params.id;
    console.log(incidentId)
    if (!incidentId) {
        return res.status(400).json({ error: 'Incident ID is required' });
    }

    db.getIncidentDetails(incidentId, (err, result) => {
        if (err) {
            console.error('Error fetching incident details:', err);
            return res.status(500).json({ error: 'Error fetching incident details' });
        }

        if (!result) {
            return res.status(404).json({ error: 'Incident not found' });
        }

        res.json({ incident: result });
    });
});

router.put('/editincident/:id', (req, res) => {
    const incidentId = req.params.id;
    const { danger, description, firemen, vehicles } = req.body;

    if (!danger || !description || !firemen || !vehicles) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['low', 'medium', 'high'].includes(danger)) {
        res.sendStatus(400);
        return;
    }

    const values = [danger, description, firemen, vehicles, incidentId];

    db.updateIncidentDetails(values, (err, result) => {
        if (err) {
            console.error('Error updating incident:', err);
            return res.status(500).json({ error: 'Error updating incident' });
        }

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Incident not found' });
        }

        res.json({ message: 'Incident updated successfully' });
    });
});

router.post('/apply/:id', (req, res) => {
    const incidentId = req.params.id;
    const volunteerId = req.body.volunteer_id;  // Example user ID
    const volunteerName = req.body.username;
    console.log(volunteerId)

    db.queryIncidents('running', (err, results) => {
        const target_incident = results.find(row => row.incident_id == incidentId);
        db.getVolunteerDetails(volunteerName, (err, result) => {
            const vol_type = result.volunteer_type;
            if (vol_type == 'simple' && target_incident.simple_volunteer_count < target_incident.firemen || vol_type == 'driver' && target_incident.driver_volunteer_count < target_incident.vehicles) {
                db.applyToIncident(incidentId, volunteerId, (err) => {
                    if (err) {
                        console.error("Error applying to incident:", err);
                        return res.status(500).json({ success: false, message: "Failed to apply to incident" });
                    }
                    res.status(200).json({ success: true, message: "Application successful" });
                });
            } else {
                res.sendStatus(411);
            }
        })
    })
});

router.get('/apply', (req, res) => {
    db.getUnapprovedApplications((err, results) => {
        if (err) {
            console.error("Error getting applications: ", err);
            return res.status(500).json({ success: false, message: "Failed to apply to incident" });
        }
        res.status(200).json({ requests: results })
    });
})

router.post('/apply/:id/accept', (req, res) => {
    const incidentId = req.params.id;
    const volunteerId = req.body.volunteer_id;  // Example user ID
    const admin_id = req.body.admin_id;
    console.log(volunteerId)

    // check if it participations are saturated
    db.getVolunteerCounts(incidentId, (err, result) => {
        if (err) {
            res.sendStatus(400);
            return;
        }
        db.findVolunteer(volunteerId, (err2, result2) => {
            if (err2 || !result2) {
                res.sendStatus(401);
                return;
            }
            if (result2.volunteer_type === 'simple' && result.firemen === result.simple_volunteer_count
                || result2.volunteer_type === 'driver' && result.vehicles === result.driver_volunteer_count) {
                res.sendStatus(402);
                return;
            }
            db.acceptParticipation(admin_id, incidentId, volunteerId, (err) => {
                if (err) {
                    console.error("Error accepting request:", err);
                    return res.status(500).json({ success: false, message: "Failed to accept request" });
                }
                res.status(200).json({ success: true, message: "Accept successful" });
            });
        });
    })


});

router.post('/apply/:id/delete', (req, res) => {
    const incidentId = req.params.id;
    const volunteerId = req.body.volunteer_id;  // Example user ID
    console.log(volunteerId)

    db.declineParticipation(incidentId, volunteerId, (err) => {
        if (err) {
            console.error("Error deleting participation request:", err);
            return res.status(500).json({ success: false, message: "Failed to decline request" });
        }
        res.status(200).json({ success: true, message: "Delete successful" });
    });
});


module.exports = router

