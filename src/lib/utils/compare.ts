export function floatEquals(a: number, b: number, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}
