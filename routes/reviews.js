const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const { wrap } = require("../utils/helpers");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, wrap(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) { req.flash("error", "Listing not found."); return res.redirect("/listings"); }
  const review = new Review({ ...req.body.review, author: req.user._id });
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrap(async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "Review deleted.");
  res.redirect(`/listings/${req.params.id}`);
}));

module.exports = router;
