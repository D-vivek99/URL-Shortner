const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");

const { connectMongoDB } = require("./connection");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const staticRoute = require("./routes/staticRoute");

const app = express();
const PORT = 1111;

// TODO: connect to MongoDB
connectMongoDB("mongodb://localhost:27017/short-url").then(() => console.log("Connected to MongoDB"));

// TODO: middlewares
app.use(express.urlencoded({extended: false}));     // to work with forms in HTML
app.use(express.json());     // for working with JSON type data in body
app.use(cookieParser());
app.use(checkForAuthentication);

// Letting express know that EJS is being used as 'View Engine' (Template engine).
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// localStorage.setItem("user", req.user)

// Route
app.use("/", staticRoute);
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);



app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({shortId}, {$push: {visitHistory: {timestamp: Date.now()}}});

    res.redirect(entry.redirectURL);
});


// TODO: Start the server
app.listen(PORT, () => console.log("Server started at PORT:", PORT));