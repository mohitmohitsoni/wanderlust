const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { wrap, geocode } = require("../utils/helpers");
const { isLoggedIn, isOwner } = require("../middleware");
const { upload } = require("../cloudConfig");

const PLACEHOLDER = "https://picsum.photos/seed/wanderlust/800/600";
const imageFrom = (file) => (file && file.path ? { url: file.path, filename: file.filename } : null);

router.get("/", wrap(async (req, res) => {
  const { category, q } = req.query;
  const filter = {};
  if (category && Listing.CATEGORIES.includes(category)) filter.category = category;
  if (q && q.trim()) {
    const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = ["title", "location", "country"].map((f) => ({ [f]: { $regex: safe, $options: "i" } }));
  }
  const listings = await Listing.find(filter);
  res.render("listings/index", { listings, categories: Listing.CATEGORIES, category, q: q || "" });
}));

router.get("/new", isLoggedIn, (req, res) => res.render("listings/new", { categories: Listing.CATEGORIES }));

router.post("/", isLoggedIn, upload.single("image"), wrap(async (req, res) => {
  const data = req.body.listing;
  const listing = new Listing(data);
  listing.owner = req.user._id;
  listing.image = imageFrom(req.file) || { url: PLACEHOLDER, filename: "placeholder" };
  listing.geometry = await geocode(`${data.location}, ${data.country}`);
  await listing.save();
  req.flash("success", "Listing created!");
  res.redirect(`/listings/${listing._id}`);
}));

router.get("/:id", wrap(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) { req.flash("error", "Listing not found."); return res.redirect("/listings"); }
  res.render("listings/show", { listing, mapToken: process.env.MAP_TOKEN || "" });
}));

router.get("/:id/edit", isLoggedIn, isOwner, wrap(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing, categories: Listing.CATEGORIES });
}));

router.put("/:id", isLoggedIn, isOwner, upload.single("image"), wrap(async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing, { new: true, runValidators: true });
  const img = imageFrom(req.file);
  if (img) listing.image = img;
  listing.geometry = await geocode(`${listing.location}, ${listing.country}`);
  await listing.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:id", isLoggedIn, isOwner, wrap(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted.");
  res.redirect("/listings");
}));

module.exports = router;
