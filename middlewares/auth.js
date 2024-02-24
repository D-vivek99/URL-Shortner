const { getUser } = require("../service/auth");

// AUTHENTICATION:
async function checkForAuthentication(req, res, next){
  // const authorizationHeaderValue = req.headers["authorization"];
  const tokenCookie = req.cookies?.token;
  req.user = null;

  // if(!authorizationHeaderValue || !authorizationHeaderValue.startWith("Bearer")) return next();
  if(!tokenCookie) return next();

  // const token = authorizationHeaderValue.split("Bearer ")[1];
  const token = tokenCookie;
  const user = getUser(token);

  req.user = user;
  return next();
}

// AUTHORIZATION:
function restrictTo(roles = []){
  return function(req, res, next){
    if(!req.user) return res.redirect("/login");

    if(!roles.includes(req.user.role)) return res.end("Un-authorized");

    return next();
  }
}

/**
  async function restrictToLoggedInUserOnly(req, res, next){
    // with cookies
    // const uid = req.cookies?.uid;
    // if(!uid) return res.redirect("/login");
    
    // const user = getUser(uid);
        // if(!user) return res.redirect("/login");

        // req.user = user;
        // next();
        
        
    // with header => "Authorization: Bearer <token>"
    const uid = req.headers["authorization"];
    if(!uid) return res.redirect("/login");
    
    const token = uid.split("Bearer ")[1];  // uid = "Bearer hgsvdfhbi523v_csdch" => split with "Bearer " => ['', 'hgsvdfhbi523v_csdch']
    const user = getUser(token);
    if(!user) return res.redirect("/login");
    
    req.user = user;
    next();
  }

  async function checkAuth(req, res, next) {
    const uid = req.headers["authorization"];
    const token = uid.split("Bearer ")[1];
    const user = getUser(token);
    
    req.user = user;
    next();
  }
*/

module.exports = {
  checkForAuthentication,
  restrictTo
};