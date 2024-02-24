/**
 * METHOD-1 (Stateful Authentication)
// const sessionIdToUserMap = new Map();

// function setUser(id, user){
    //     sessionIdToUserMap.set(id, user);
    // }
    
    // function getUser(id){
        //     return sessionIdToUserMap.get(id);
        // }
        
        // module.exports = {
//     setUser,
//     getUser
// };
*/

// ===================================================

// METHOD-2 (Stateless Authentication)
const jwt = require("jsonwebtoken");
const secret = "Vivek#24^6yt";

function setUser(user){
    // here, user is basically the pay-load
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