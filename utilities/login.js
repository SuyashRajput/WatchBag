const isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("warning", "Login to Continue!");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;
