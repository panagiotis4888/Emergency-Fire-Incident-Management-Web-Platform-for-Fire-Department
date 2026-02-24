const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const queries = require('./queries.js');
const dbPath = path.join(__dirname, 'database.sqlite');

const DataBase = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to SQLite database:", err.message);
    } else {
        console.log("Connected to SQLite database!");
        init();
    }
});
// init
function insert_default_admin() {
    DataBase.run(queries.INSERT_DEFAULT_ADMIN_QUERY, ['admin', 'admiN12@*'], (err, res) => {
        if (!err) {
            console.log('default admin ok')
        }
    })
}

function initTables() {
    initAdminTable();
    insert_default_admin();
    initUserTable();
    initFirefighterTable();
    initAssignmentTable();
    initIncidentTable();
    initMessageTable();
}

function initUserTable() {
    DataBase.run(queries.CREATE_USER_TABLE_QUERY, (err, result) => {
        if (err) {
            console.error("Error creating user table:", err.message);
        } else {
            console.log("User table created successfully or already exists.");
        }
    });

}
function initFirefighterTable() {
    DataBase.run(queries.CREATE_VOLUNTEER_TABLE_QUERY, (err, result) => {
        if (err) {
            console.error("Error creating volunteer table:", err.message);
        } else {
            console.log("Volunteer table created successfully or already exists.");
        }
    });
}
function initAssignmentTable() {
    DataBase.run(queries.CREATE_PARTICIPANT_TABLE_QUERY, (err, result) => {
        if (err) {
            console.error("Error creating assignment table:", err.message);
        } else {
            console.log("Assignment table created successfully or already exists.");
        }
    });
}
function initIncidentTable() {
    DataBase.run(queries.CREATE_INCIDENT_TABLE_QUERY, (err, result) => {
        if (err) {
            console.error("Error creating incident table:", err.message);
        } else {
            console.log("Incident table created successfully or already exists.");
        }
    });
}
function initMessageTable() {
    DataBase.run(queries.CREATE_MESSAGE_TABLE_QUERY, (err, result) => {
        if (err) {
            console.error("Error creating message table:", err.message);
        } else {
            console.log("Message table created successfully or already exists.");
        }
    });
}

function initAdminTable() {
    DataBase.run(queries.CREATE_ADMIN_TABLE_QUERY, (err, result) => {
        if (err) {
            console.error("Error creating administrator table:", err.message);
        } else {
            console.log("Administrator table created successfully or already exists.");
        }
    });
}
function init() {
    DataBase.serialize(() => {
        initTables();
    });
}

function registerUser(values, callback) {
    DataBase.run(queries.INSERT_USER_QUERY, values, callback);
}

function registerVolunteer(values, callback) {
    DataBase.run(queries.INSERT_VOLUNTEER_QUERY, values, callback);
}

// Login functions
function getUserPassword(username, callback) {
    DataBase.get(queries.SELECT_USER_PASSWORD, [username], callback);
}

function getVolunteerPassword(username, callback) {
    DataBase.get(queries.SELECT_VOLUNTEER_PASSWORD, [username], callback);
}

function getAdminPassword(username, callback) {
    DataBase.get(queries.SELECT_ADMIN_PASSWORD, [username], callback);
}

// Get and update user/volunteer details
function getUserDetails(username, callback) {
    DataBase.get(queries.SELECT_USER_DETAILS, [username], callback);
}

function updateUserDetails(values, callback) {
    DataBase.run(queries.UPDATE_USER_DETAILS, values, function(err) {
        callback(err, { changes: this.changes });
    });
}

function getVolunteerDetails(username, callback) {
    DataBase.get(queries.SELECT_VOLUNTEER_DETAILS, [username], callback);
}

function getAdminDetails(username, callback) {
    DataBase.get(queries.SELECT_ADMIN_DETAILS, [username], callback);
}


function updateVolunteerDetails(values, callback) {
    DataBase.run(queries.UPDATE_VOLUNTEER_DETAILS, values, function(err) {
        callback(err, { changes: this.changes });
    });
}

function findVolunteer(id, callback){
    DataBase.get(queries.FIND_VOLUNTEER, [id], callback);
}

// Incident management
function createIncident(values, callback) {
    DataBase.run(queries.INSERT_INCIDENT_QUERY, values, function(err) {
        if (err) return callback(err);
        callback(null, { incidentId: this.lastID });
    });
}

function queryIncidents(status, callback) {
    DataBase.all(status == 'all' ? queries.SELECT_ALL_INCIDENTS : queries.SELECT_SOME_INCIDENTS, status == 'all' ? [] : [status], callback);
}

function deleteIncident(incidentId, callback) {
    DataBase.run(queries.DELETE_INCIDENT, [incidentId], function(err) {
        callback(err, { changes: this.changes });
    });
}

function getIncidentStatus(incidentId, callback) {
    DataBase.get(queries.SELECT_INCIDENT_STATUS, [incidentId], callback);
}

function updateIncidentStatus(values, callback) {
    DataBase.run(queries.UPDATE_INCIDENT_STATUS, values, function(err) {
        callback(err, { changes: this.changes });
    });
}

function updateIncidentRunning(values, callback) {
    DataBase.run(queries.UPDATE_INCIDENT_RUNNING, values, function(err) {
        callback(err, { changes: this.changes });
    });
}

function finishIncident(values, callback) {
    DataBase.run(queries.FINISH_INCIDENT, values, function(err) {
        callback(err, { changes: this.changes });
    });
}

function getIncidentDetails(incidentId, callback) {
    DataBase.get(queries.SELECT_EDIT_INCIDENT_DETAILS, [incidentId], callback);
}

function updateIncidentDetails(values, callback) {
    DataBase.run(queries.UPDATE_INCIDENT_DETAILS, values, function(err) {
        callback(err, { changes: this.changes });
    });
}

function applyToIncident(incidentId, volunteerId, callback) {
    DataBase.run(queries.INSERT_PARTICIPATION_QUERY, [incidentId, volunteerId], function(err) {
        callback(err);
    });
}

function declineParticipation(incident_id, volunteer_id, callback) {
    DataBase.run(queries.DELETE_PARTICIPATION_QUERY, [incident_id, volunteer_id], (err) => {
        callback(err);
    });
}

function acceptParticipation(admin_id, incident_id, volunteer_id, callback) {
    DataBase.run(queries.ACCEPT_PARTICIPATION_QUERY, [admin_id, incident_id, volunteer_id], (err) => {
        callback(err);
    });
}

function getUnapprovedApplications(callback) {
    DataBase.all(queries.SELECT_UNAPPROVED_REQUESTS_QUERY, callback);
}

function postIncidentMessage(params, callback) {
    DataBase.run(queries.POST_INCIDENT_MESSAGE_QUERY, params, callback);
}

function getIncidentMessages(params, callback){
    DataBase.all(queries.SELECT_ALL_INCIDENT_MESSAGES, params, callback);
}

function countSubmittedIncidents(callback){
    DataBase.get(queries.SELECT_SUBMITTED_INCIDENT_COUNT, [], callback);
}

function getVolunteerCounts(incidentId, callback){
    DataBase.get(queries.SELECT_INCIDENT_VOLUNTEER_COUNTS, [incidentId], callback);
}
module.exports = {
    registerUser,
    registerVolunteer,
    getUserPassword,
    getVolunteerPassword,
    getAdminPassword,
    getAdminDetails,
    getUserDetails,
    updateUserDetails,
    getVolunteerDetails,
    updateVolunteerDetails,
    createIncident,
    queryIncidents,
    deleteIncident,
    getIncidentStatus,
    updateIncidentStatus,
    updateIncidentRunning,
    finishIncident,
    getIncidentDetails,
    updateIncidentDetails,
    applyToIncident,
    declineParticipation,
    getUnapprovedApplications,
    acceptParticipation,
    postIncidentMessage,
    getIncidentMessages,
    countSubmittedIncidents,
    findVolunteer,
    getVolunteerCounts
};
