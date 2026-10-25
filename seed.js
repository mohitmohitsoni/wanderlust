require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const Booking = require("./models/booking");
const User = require("./models/user");

const data = [
  ["Beach villa in Goa", "Steps from the sand with a private pool.", 8500, "Goa", "India", "amazing pools", [73.83, 15.49]],
  ["Himalayan cabin", "Wood cabin with valley views.", 4200, "Manali", "India", "mountains", [77.19, 32.24]],
  ["Heritage haveli", "Restored palace-style stay.", 6900, "Jaipur", "India", "castles", [75.79, 26.91]],
  ["City studio", "Compact studio in the centre.", 3100, "Bengaluru", "India", "iconic cities", [77.59, 12.97]],
  ["Lakeside tent", "Glamping by the water.", 2800, "Udaipur", "India", "camping", [73.71, 24.58]],
  ["Farm stay", "Organic farm with home-cooked meals.", 2200, "Coorg", "India", "farms", [75.74, 12.34]],
  ["Snow dome", "Heated dome under the northern lights.", 14000, "Tromsø", "Norway", "arctic", [18.96, 69.65]],
  ["Glass dome", "Sleep under the stars.", 9800, "Reykjavik", "Iceland", "domes", [-21.94, 64.15]],
  ["Cosy room", "Private room in a family home.", 1500, "Mysuru", "India", "rooms", [76.64, 12.3]],
  ["Rooftop loft", "Trending loft with skyline view.", 7600, "Mumbai", "India", "trending", [72.88, 19.08]],
];

(async () => {
  await mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/wanderlust-booking");
  await Promise.all([Listing.deleteMany({}), Review.deleteMany({}), Booking.deleteMany({})]);
  let owner = await User.findOne({ username: "demo" });
  if (!owner) owner = await User.register(new User({ username: "demo", email: "demo@example.com" }), "demo1234");
  await Listing.insertMany(data.map(([title, description, price, location, country, category, c], i) => ({
    title, description, price, location, country, category, owner: owner._id,
    image: { url: `https://picsum.photos/seed/wander${i}/800/600`, filename: "seed" },
    geometry: { type: "Point", coordinates: c },
  })));
  console.log("Seeded 10 listings. Demo login: demo / demo1234");
  await mongoose.disconnect();
})();
