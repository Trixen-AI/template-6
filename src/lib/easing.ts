/** CSS-style cubic-bezier timing function, solved for x with Newton's method plus bisection fallback. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const a = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1
  const b = (p1: number, p2: number) => 3 * p2 - 6 * p1
  const c = (p1: number) => 3 * p1
  const at = (t: number, p1: number, p2: number) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t
  const slope = (t: number, p1: number, p2: number) => 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1)

  const solve = (x: number) => {
    let t = x
    for (let i = 0; i < 8; i++) {
      const err = at(t, x1, x2) - x
      const d = slope(t, x1, x2)
      if (Math.abs(err) < 1e-6) return t
      if (Math.abs(d) < 1e-6) break
      t -= err / d
    }
    let lo = 0
    let hi = 1
    t = x
    while (hi - lo > 1e-6) {
      if (at(t, x1, x2) < x) lo = t
      else hi = t
      t = (lo + hi) / 2
    }
    return t
  }

  return (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : at(solve(x), y1, y2))
}
