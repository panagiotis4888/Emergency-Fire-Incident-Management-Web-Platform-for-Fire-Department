const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use(express.static(path.join(__dirname, "..", "FrontEnd")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "FrontEnd", "html", "index.html"));
});

app.use(
    cors({
        origin: "http://localhost:8080/",
        credentials: true,
    })
);

app.use(cookieParser(cookieParser));
app.use(express.json());

app.listen(8080, () => { console.log("http://localhost:8080") });

app.use("/", userRoutes);
app.use("/", volunteerRoutes);
app.use("/", registerRoutes);
app.use("/", loginRoutes);
app.use("/incidentsAPI", incidentRoutes);
app.use("/message", messageRoutes);
