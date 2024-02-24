const URL = require("../models/url");
const User = require("../models/user");
var nanoId = require("nano-id");

async function handleGenerateNewShortURL (req, res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({error: "URL is required"});

    const shortID = nanoId(8);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    const allURLs = await URL.find({createdBy: req.user._id});
    const user = await User.findOne({_id: req.user._id});

    return res.render("home", {id: shortID, urls: allURLs, user});
};

async function handleGetAnalytics (req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({totalVisits: result.visitHistory.length, analytics: result.visitHistory});
};

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
}