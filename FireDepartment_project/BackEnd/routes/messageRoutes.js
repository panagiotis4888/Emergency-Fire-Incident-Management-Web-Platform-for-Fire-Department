const express = require("express");
const db = require("../database");
const router = express.Router();

router.post('/', (req, res) => {
    const { message, incident_id, sender_id, sender_type, recipient_type, recipient_id } = req.body;

    if (!incident_id || !message || !sender_id || !sender_type || !recipient_type || recipient_id === undefined) {
        return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    const dateTime = new Date().toISOString();
    const is_seen = false;

    db.postIncidentMessage(
        [incident_id, message, sender_id, sender_type, recipient_type, recipient_id, dateTime, is_seen],
        function(err) {
            if (err) {
                console.error('Error inserting message:', err);
                return res.status(500).json({ success: false, message: 'Failed to send message' });
            }
            res.status(200).json({ success: true, message: 'Message sent successfully' });
        }
    );
});

router.post('/incident_messages', (req, res) => {
    const { incident_id, recipient_type, volunteer_id } = req.body;
    console.log('what', incident_id, recipient_type, recipient_type, recipient_type)
    db.getIncidentMessages([incident_id, recipient_type, recipient_type, volunteer_id, recipient_type], (err, results) => {
        if (err) {
            console.log(err);
            res.sendStatus(401);
        }
        else {
            let is_in_incident = null;
            results.forEach((message) => {
                if(message.recipient_type === 'volunteers'){
                    is_in_incident = true;
                } 
            });
            res.send({ messages: results, is_in_incident});
        }
    });

});

module.exports = router
