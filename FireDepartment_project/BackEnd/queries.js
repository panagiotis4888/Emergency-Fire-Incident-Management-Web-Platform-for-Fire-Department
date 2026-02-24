export const CREATE_ADMIN_TABLE_QUERY = `
    CREATE TABLE IF NOT EXISTS administrator (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
`;

export const INSERT_DEFAULT_ADMIN_QUERY = `
    INSERT INTO administrator (username, password) 
    VALUES (?, ?)
    ON CONFLICT(username) DO NOTHING
`

export const CREATE_VOLUNTEER_TABLE_QUERY = `
    CREATE TABLE volunteers (
    volunteer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  birthdate DATE NOT NULL,
  gender TEXT NOT NULL,
  afm TEXT NOT NULL,
  country TEXT NOT NULL,
  address TEXT NOT NULL,
  municipality TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  job TEXT NOT NULL,
  telephone TEXT NOT NULL,
  lat REAL,
  lon REAL,
  volunteer_type TEXT NOT NULL,
  height REAL,
  weight REAL
);

`
export const CREATE_INCIDENT_TABLE_QUERY = `
CREATE TABLE incidents (
  incident_id INTEGER PRIMARY KEY AUTOINCREMENT,
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_type TEXT NOT NULL,
  telephone TEXT,
  address TEXT NOT NULL,
  lat REAL,
  lon REAL,
  municipality TEXT,
  prefecture TEXT,
  start_datetime TEXT NOT NULL,
  end_datetime TEXT,
  danger TEXT,
  status TEXT,
  finalResult TEXT,
  vehicles INTEGER,
  firemen INTEGER
);
`

export const CREATE_USER_TABLE_QUERY = `
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  birthdate DATE NOT NULL,
  gender TEXT NOT NULL,
  afm TEXT NOT NULL,
  country TEXT NOT NULL,
  address TEXT NOT NULL,
  municipality TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  job TEXT NOT NULL,
  telephone TEXT NOT NULL,
  lat REAL,
  lon REAL
);

`
export const CREATE_MESSAGE_TABLE_QUERY = `
    CREATE TABLE messages (
  message_id INTEGER PRIMARY KEY AUTOINCREMENT,
  incident_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  is_seen BOOLEAN NOT NULL,
        sender_id INTEGER NOT NULL,
  sender_type TEXT NOT NULL,
  recipient_type TEXT NOT NULL,
        recipient_id INTEGER NOT NULL,
  date_time TEXT NOT NULL,
  FOREIGN KEY (incident_id) REFERENCES incidents (incident_id)
);
`

export const CREATE_PARTICIPANT_TABLE_QUERY = `
CREATE TABLE participants (
  incident_id INTEGER NOT NULL,
  volunteer_id INTEGER NOT NULL,
  approved_by_admin_id,
  FOREIGN KEY (incident_id) REFERENCES incidents (incident_id),
  UNIQUE (volunteer_id, incident_id)
);
`

export const INSERT_USER_QUERY = `
        INSERT INTO users 
        (username, email, password, firstname, lastname, birthdate, gender, 
        job, afm, country, address, lat, lon, telephone, municipality, 
        prefecture
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

export const SELECT_USER_PASSWORD = 'SELECT password, user_id FROM users WHERE username = ?'

export const SELECT_USER_DETAILS = `
    SELECT * FROM users WHERE username = ?
`;

export const UPDATE_USER_DETAILS = `
    UPDATE users 
    SET firstname = ?, lastname = ?, birthdate = ?, gender = ?, job = ?, country = ?, address = ?, municipality = ?, prefecture = ?
    WHERE username = ?
`;

export const FIND_VOLUNTEER = `
SELECT * FROM volunteers WHERE volunteer_id = ?
`

export const INSERT_VOLUNTEER_QUERY = `
    INSERT INTO volunteers 
    (username, email, password, firstname, lastname, birthdate, gender, job, afm, country, address, lat, lon, telephone, municipality, prefecture, volunteer_type, height, weight)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const SELECT_VOLUNTEER_PASSWORD = `
    SELECT password, volunteer_id FROM volunteers WHERE username = ?
`;

export const SELECT_VOLUNTEER_DETAILS = `
    SELECT * FROM volunteers WHERE username = ?
`;

export const SELECT_ADMIN_DETAILS = `
    SELECT * FROM admin WHERE username = ?
`;


export const UPDATE_VOLUNTEER_DETAILS = `
    UPDATE volunteers 
    SET firstname = ?, lastname = ?, birthdate = ?, gender = ?, job = ?, country = ?, address = ?, municipality = ?, prefecture = ?, lat = ?, lon = ?
    WHERE username = ?
`;

// Admin
export const SELECT_ADMIN_PASSWORD = `
    SELECT password, admin_id FROM administrator WHERE username = ?
`;

// Incidents
export const INSERT_INCIDENT_QUERY = `
    INSERT INTO incidents 
    (incident_type, description, user_type, address, lat, lon, prefecture, municipality, status, danger, start_datetime, vehicles, firemen, telephone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const SELECT_SOME_INCIDENTS = `
SELECT 
    incidents.*,
    COUNT(CASE WHEN volunteers.volunteer_type = 'simple' AND participants.approved_by_admin_id IS NOT NULL THEN 1 END) AS simple_volunteer_count,
    COUNT(CASE WHEN volunteers.volunteer_type = 'driver' AND participants.approved_by_admin_id IS NOT NULL THEN 1 END) AS driver_volunteer_count
FROM 
    incidents
LEFT JOIN 
    participants 
ON 
    incidents.incident_id = participants.incident_id
LEFT JOIN 
    volunteers 
ON 
    participants.volunteer_id = volunteers.volunteer_id
WHERE 
    incidents.status = ?
GROUP BY 
    incidents.incident_id;
`;

export const SELECT_ALL_INCIDENTS = `
    SELECT * FROM incidents;  
`;

export const DELETE_INCIDENT = `
    DELETE FROM incidents WHERE incident_id = ?
`;

export const SELECT_INCIDENT_STATUS = `
    SELECT status FROM incidents WHERE incident_id = ?
`;

export const UPDATE_INCIDENT_STATUS = `
    UPDATE incidents 
    SET status = ?, start_datetime = ? 
    WHERE incident_id = ?
`;

export const UPDATE_INCIDENT_RUNNING = `
    UPDATE incidents 
    SET status = ?, danger = ?, start_datetime = ? 
    WHERE incident_id = ?
`;

export const FINISH_INCIDENT = `
    UPDATE incidents 
    SET status = ?, end_datetime = ?, finalResult = ? 
    WHERE incident_id = ?
`;

export const SELECT_EDIT_INCIDENT_DETAILS = `
SELECT 
    incidents.*,
    COUNT(CASE WHEN volunteers.volunteer_type = 'simple' AND participants.approved_by_admin_id IS NOT NULL THEN 1 END) AS simple_volunteer_count,
    COUNT(CASE WHEN volunteers.volunteer_type = 'driver' AND participants.approved_by_admin_id IS NOT NULL THEN 1 END) AS driver_volunteer_count
FROM 
    incidents
LEFT JOIN 
    participants 
ON 
    incidents.incident_id = participants.incident_id
LEFT JOIN 
    volunteers 
ON 
    participants.volunteer_id = volunteers.volunteer_id
WHERE 
    incidents.incident_id = ?
GROUP BY 
    incidents.incident_id;
`;

export const UPDATE_INCIDENT_DETAILS = `
    UPDATE incidents 
    SET danger = ?, description = ?, firemen = ?, vehicles = ? 
    WHERE incident_id = ?
`;

export const INSERT_PARTICIPATION_QUERY = `
    INSERT INTO participants (incident_id, volunteer_id) VALUES (?, ?)
`

export const ACCEPT_PARTICIPATION_QUERY = `
    UPDATE participants
    SET approved_by_admin_id = ?
    WHERE incident_id = ?
    AND volunteer_id = ?
`

export const DELETE_PARTICIPATION_QUERY = `
    DELETE FROM participants WHERE incident_id = ? AND volunteer_id = ?
`

export const SELECT_UNAPPROVED_REQUESTS_QUERY = `
    SELECT * FROM participants WHERE approved_by_admin_id IS NULL
`

export const POST_INCIDENT_MESSAGE_QUERY = `
    INSERT INTO messages (
        incident_id,
        text,
        sender_id,
        sender_type,
        recipient_type,
        recipient_id,
        date_time,
        is_seen
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;

export const SELECT_ALL_INCIDENT_MESSAGES = `
SELECT * FROM messages
WHERE
    incident_id = ?
    AND (
        (recipient_type = 'public' AND ? = 'public') OR
        (
            recipient_type IN ('public', 'volunteers')
            AND ? = 'volunteers'
            AND EXISTS (
                SELECT 1
                FROM participants
                WHERE participants.incident_id = messages.incident_id
                AND participants.volunteer_id = ?
            )
        ) OR
        (recipient_type IN ('public', 'volunteers', 'admin') AND ? = 'admin')
    )
    AND recipient_id = -1;
`;

export const SELECT_SUBMITTED_INCIDENT_COUNT = `
SELECT COUNT(*) AS count FROM incidents WHERE status = 'submitted';
`;

export const SELECT_INCIDENT_VOLUNTEER_COUNTS = `
SELECT 
    incidents.vehicles,
    incidents.firemen,
    COUNT(CASE WHEN volunteers.volunteer_type = 'simple' AND participants.approved_by_admin_id IS NOT NULL THEN 1 END) AS simple_volunteer_count,
    COUNT(CASE WHEN volunteers.volunteer_type = 'driver' AND participants.approved_by_admin_id IS NOT NULL THEN 1 END) AS driver_volunteer_count
FROM 
    incidents
LEFT JOIN 
    participants 
ON 
    incidents.incident_id = participants.incident_id
LEFT JOIN 
    volunteers 
ON 
    participants.volunteer_id = volunteers.volunteer_id
WHERE 
    incidents.incident_id= ?
`;

