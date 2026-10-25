const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const hasOverlap = require("../utils/overlap");
const { wrap } = require("../utils/helpers");
const { isLoggedIn } = require("../middleware");

const DAY = 86400000;

router.post("/listings/:id/bookings", isLoggedIn, wrap(async (req, res) => {
  const { id } = req.params;
  const back = `/listings/${id}`;
  const listing = await Listing.findById(id);
  if (!listing) { req.flash("error", "Listing not found."); return res.redirect("/listings"); }
  if (listing.owner.equals(req.user._id)) { req.flash("error", "You can't book your own listing."); return res.redirect(back); }

  const b = req.body.booking || {};
  const checkIn = new Date(b.checkIn), checkOut = new Date(b.checkOut);
  const guests = Math.min(Math.max(parseInt(b.guests) || 1, 1), 10);
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);

  if (isNaN(checkIn) || isNaN(checkOut)) { req.flash("error", "Choose valid dates."); return res.redirect(back); }
  if (checkIn < today) { req.flash("error", "Check-in can't be in the past."); return res.redirect(back); }
  if (checkOut <= checkIn) { req.flash("error", "Check-out must be after check-in."); return res.redirect(back); }

  // Same overlap rule as utils/overlap.js, expressed as a database query.
  const clash = await Booking.findOne({ listing: id, checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } });
  if (clash) { req.flash("error", "Those dates are already booked."); return res.redirect(back); }

  const nights = Math.round((checkOut - checkIn) / DAY);
  await Booking.create({ listing: id, user: req.user._id, checkIn, checkOut, guests, totalPrice: nights * listing.price });
  req.flash("success", `Booked ${nights} night(s)!`);
  res.redirect("/bookings");
}));

router.get("/bookings", isLoggedIn, wrap(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing").sort({ checkIn: 1 });
  res.render("bookings/index", { bookings });
}));

router.delete("/bookings/:bookingId", isLoggedIn, wrap(async (req, res) => {
  await Booking.findOneAndDelete({ _id: req.params.bookingId, user: req.user._id });
  req.flash("success", "Booking cancelled.");
  res.redirect("/bookings");
}));

module.exports = router;
