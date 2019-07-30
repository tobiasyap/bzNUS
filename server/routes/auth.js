const router = require("express").Router();
const passport = require("@passport-next/passport");

const Global = require("../config/Global");

const CLIENT_HOME_PAGE_URL = Global.CLIENT_HOME_PAGE_URL;

// Set up authentication route
router.get("/auth/nus", (req, res) => {
  console.log("authenticating");
  passport.authenticate("nus-openid")(req, res);
});

// Redirect to client homepage after sucessful authentication
router.get(
  "/auth/nus/return",
  passport.authenticate("nus-openid", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

// Allow retrival of user info when login is successful
router.get("/auth/login/success", (req, res) => {
  // req.user only exists if passport has authenticated
  if (req.user) {
    res.json({
      success: true,
      message: "user is authenticated",
      user: req.user
    });
  } else {
    res.redirect(req.baseUrl + "/auth/login/failed");
  }
});

router.get("/auth/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate"
  });
});

// After logging out, redirect back to client
router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

module.exports = router;
