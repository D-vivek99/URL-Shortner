const jwt = require("jsonwebtoken");
const secret = "Vivek#24^6yt";

function setUser(user){
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
    }, secret);
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser
};