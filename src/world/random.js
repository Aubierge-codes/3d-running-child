// Deterministic pseudo-random generator so procedurally placed objects land in
// the same spot on every load. Same seed -> same sequence.
export function seededRandom(seed) {
  let value = seed
  return function () {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}
