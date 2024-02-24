const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
    const allURLs = await URL.find({createdBy: req.user._id});
    return res.render("home", {
        urls: allURLs,
        user: req.user
    });
});

router.get("/about", (req, res) => {
    return res.render("about", {user: req.user});
});

router.get("/signup", async (req, res) => {
    return res.render("signup");
});

router.get("/login", async (req, res) => {
    return res.render("login");
});

router.get("/logout", (req, res) => {
    return res.clearCookie("token").redirect("/");
});

router.get("/admin/urls", restrictTo(["ADMIN"]), async(req, res) => {
    const allURLs = await URL.find({});
    return res.render("home", {
        urls: allURLs,
        user: req.user
    });
})

module.exports = router;