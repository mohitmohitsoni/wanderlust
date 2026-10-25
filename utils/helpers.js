exports.wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const DEFAULT = { type: "Point", coordinates: [77.209, 28.6139] };
exports.geocode = async (query) => {
  const token = process.env.MAP_TOKEN;
  if (!token) return DEFAULT;
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?limit=1&access_token=${token}`;
    const data = await (await fetch(url)).json();
    return data.features?.[0]?.geometry || DEFAULT;
  } catch {
    return DEFAULT;
  }
};
