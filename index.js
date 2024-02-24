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

connectMongoDB("mongodb://localhost:27017/short-url").then(() => console.log("Connected to MongoDB"));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthentication);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Route
app.use("/", staticRoute);
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({shortId}, {$push: {visitHistory: {timestamp: Date.now()}}});
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log("Server started at PORT:", PORT));