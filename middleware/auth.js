const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;
  if (!userUid) return res.redirect("/login");

  try {
    const user = await getUser(userUid);  // If async
    if (!user) return res.redirect("/login");
    req.user = user;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

async function checkAuth(req, res, next) {
  const userUid = req.cookies?.uid;

  const user = getUser(userUid);

  req.user = user;
  next();
}


module.exports = {
    restrictToLoggedInUserOnly,
    checkAuth,
}