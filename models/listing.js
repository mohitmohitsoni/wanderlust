const mongoose = require("mongoose");
const S = mongoose.Schema;
const Review = require("./review");
const Booking = require("./booking");
const CATEGORIES = ["trending", "rooms", "iconic cities", "mountains", "castles", "amazing pools", "camping", "farms", "arctic", "domes"];

const listingSchema = new S({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { url: String, filename: String },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, enum: CATEGORIES, default: "trending" },
  geometry: { type: { type: String, enum: ["Point"], default: "Point" }, coordinates: { type: [Number], required: true } },
  owner: { type: S.Types.ObjectId, ref: "User", required: true },
  reviews: [{ type: S.Types.ObjectId, ref: "Review" }],
});

listingSchema.post("findOneAndDelete", async (doc) => {
  if (!doc) return;
  await Review.deleteMany({ _id: { $in: doc.reviews } });
  await Booking.deleteMany({ listing: doc._id });
});

const Listing = mongoose.model("Listing", listingSchema);
Listing.CATEGORIES = CATEGORIES;
module.exports = Listing;
