const test = require("node:test");
const assert = require("node:assert");
const hasOverlap = require("../utils/overlap");
const d = (s) => new Date(s);

test("overlapping ranges clash", () => {
  assert.ok(hasOverlap(d("2026-12-01"), d("2026-12-05"), d("2026-12-03"), d("2026-12-08")));
});
test("same-day turnover is allowed", () => {
  assert.ok(!hasOverlap(d("2026-12-01"), d("2026-12-05"), d("2026-12-05"), d("2026-12-08")));
});
test("fully contained range clashes", () => {
  assert.ok(hasOverlap(d("2026-12-01"), d("2026-12-10"), d("2026-12-03"), d("2026-12-04")));
});
