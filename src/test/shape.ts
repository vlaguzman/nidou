/**
 * Structural fingerprint of a value: keys, array lengths and primitive types, ignoring text.
 * Two locales with the same shape have the same fields and item counts, so a missing translation fails.
 */
export function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    // Components (icons) and other class instances are opaque.
    if (Object.getPrototypeOf(value) !== Object.prototype) return "opaque";
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  }
  return typeof value;
}
