# Wanderlust Booking

Full-stack travel listing and booking platform.
**Author:** YOUR NAME HERE

Stack: Node.js, Express, MongoDB (Mongoose), EJS, Passport, Cloudinary, Mapbox.

## Features
- Sign up / log in (Passport, sessions stored in MongoDB)
- Create, edit, delete listings with image upload (Cloudinary) and automatic geocoding (Mapbox)
- Category filters and text search
- Reviews with ownership checks
- Bookings with date picker, live price total and double-booking prevention
- "My bookings" page with cancel
- Unit tests for the date-overlap rule (`npm test`)

## Run locally
1. Install Node 18+ and MongoDB.
2. `npm install`
3. Copy `.env.example` to `.env` and fill in values (Cloudinary and Mapbox are optional locally).
4. `npm run seed` (demo login: `demo` / `demo1234`)
5. `npm start`, then open http://localhost:8080

## Structure
`app.js` setup and middleware, `routes/` HTTP routes, `models/` Mongoose schemas, `views/` EJS templates, `utils/overlap.js` booking rule, `test/` tests.

## Deploy
Render web service + MongoDB Atlas. Set `DB_URL`, `SESSION_SECRET`, `MAP_TOKEN` and the Cloudinary variables in Render's environment settings. Start command: `npm start`.
