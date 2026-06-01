/**
 * Color utility functions for the QuoteWise app.
 */

/**
 * Append an alpha value to a hex color string.
 * Returns a hex color with alpha channel (e.g., '#FF620014' for 8% opacity).
 *
 * @param {string} hex - 6-digit hex color (e.g., '#FF6200')
 * @param {number} opacity - Opacity from 0 to 1 (e.g., 0.08 for 8%)
 * @returns {string} 8-digit hex color with alpha
 */
export function withAlpha(hex, opacity) {
  if (!hex || typeof hex !== 'string') {
    return '#00000000';
  }
  // Strip existing alpha if present
  const cleanHex = hex.slice(0, 7);
  const alpha = Math.round(opacity * 255);
  const alphaHex = alpha.toString(16).padStart(2, '0');
  return `${cleanHex}${alphaHex}`;
}
