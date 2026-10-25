const Listing = require("./models/listing");
const Review = require("./models/review");

exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please log in first.");
    return res.redirect("/login");
  }
  next();
};
exports.saveReturnTo = (req, res, next) => {
  if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
  next();
};
exports.isOwner = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) { req.flash("error", "Listing not found."); return res.redirect("/listings"); }
  if (!listing.owner.equals(req.user._id)) { req.flash("error", "You are not the owner."); return res.redirect(`/listings/${listing._id}`); }
  next();
};
exports.isReviewAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review || !review.author.equals(req.user._id)) { req.flash("error", "Not allowed."); return res.redirect(`/listings/${req.params.id}`); }
  next();
};
