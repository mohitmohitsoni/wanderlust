if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/wanderlust-booking";
const secret = process.env.SESSION_SECRET || "dev-secret-change-me";

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  store: MongoStore.create({ mongoUrl: dbUrl, touchAfter: 24 * 3600 }),
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 },
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => res.redirect("/listings"));
app.use("/listings", require("./routes/listings"));
app.use("/listings/:id/reviews", require("./routes/reviews"));
app.use("/", require("./routes/bookings"));
app.use("/", require("./routes/users"));

app.use((req, res) => res.status(404).render("error", { status: 404, message: "Page not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  const status = err.name === "CastError" ? 404 : err.status || 500;
  res.status(status).render("error", { status, message: status === 404 ? "Not found" : "Something went wrong" });
});

const PORT = process.env.PORT || 8080;
mongoose.connect(dbUrl).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}).catch((e) => { console.error("DB connection failed:", e.message); process.exit(1); });
