const mongoose = require("mongoose");
const S = mongoose.Schema;
module.exports = mongoose.model("Booking", new S({
  listing: { type: S.Types.ObjectId, ref: "Listing", required: true },
  user: { type: S.Types.ObjectId, ref: "User", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, min: 1, default: 1 },
  totalPrice: { type: Number, required: true },
}, { timestamps: true }));
