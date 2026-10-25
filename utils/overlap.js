// Two stays overlap when each starts before the other ends.
// Check-out day is free for the next guest, so the comparison is strict.
module.exports = function hasOverlap(aIn, aOut, bIn, bOut) {
  return aIn < bOut && aOut > bIn;
};
