const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const { wrap } = require("../utils/helpers");
const { saveReturnTo } = require("../middleware");

router.get("/signup", (req, res) => res.render("users/signup"));
router.post("/signup", wrap(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.register(new User({ username, email }), password);
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}));

router.get("/login", (req, res) => res.render("users/login"));
router.post("/login", saveReturnTo,
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.returnTo || "/listings");
  });

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out.");
    res.redirect("/listings");
  });
});

module.exports = router;
