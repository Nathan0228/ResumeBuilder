/**
 * CSS color conversion utilities for PDF export.
 *
 * Tailwind CSS v4 uses oklch() color syntax internally.
 * html2canvas <1.5 cannot parse oklch() and throws:
 *   "Attempting to parse an unsupported color function 'oklch'"
 *
 * This module converts oklch() color strings to rgb() strings.
 * Used to inject a print-safe stylesheet before PDF generation.
 */

// ─── Color conversion ────────────────────────────────────────────────────────

function linearToSrgb(v) {
  if (v <= 0.0031308) return Math.round(12.92 * v * 255);
  return Math.round((1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255);
}

function oklchToRgb(l, c, h) {
  // oklch → oklab
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  // oklab → linear sRGB (Bradford D65)
  const lr = 1.0006101070508304 * l + 0.0043706944816137 * a + 0.0003989501259504 * b;
  const lg = 0.0033158683966905 * l + 0.9787646738233183 * a + 0.0340337499199820 * b;
  const lb = 0.0023951915251021 * l + 0.0151800398706058 * a + 0.9845965429792067 * b;
  // linear sRGB → sRGB (gamma)
  const r = Math.min(255, Math.max(0, linearToSrgb(lr)));
  const g = Math.min(255, Math.max(0, linearToSrgb(lg)));
  const b2 = Math.min(255, Math.max(0, linearToSrgb(lb)));
  return 'rgb(' + r + ', ' + g + ', ' + b2 + ')';
}

/**
 * Converts a single oklch() value to rgb().
 * @param {string} str e.g. "oklch(58% 0.14 251)"
 * @returns {string|null} e.g. "rgb(67, 97, 238)" or null if not matched
 */
function parseOklchToRgb(str) {
  const m = str.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)\s*\)/);
  if (!m) return null;
  let l = parseFloat(m[1]);
  if (m[1].endsWith('%')) l /= 100;
  return oklchToRgb(l, parseFloat(m[2]), parseFloat(m[3]));
}

// ─── Tailwind oklch → rgb stylesheet converter ───────────────────────────────

/**
 * Returns a CSS string where all Tailwind oklch() values are replaced with rgb().
 * Covers common Tailwind color tokens that appear in the resume builder.
 */
export function generateRgbStylesheet() {
  // Map of Tailwind class → rgb value for common resume colors.
  // These are computed from Tailwind v4's default palette.
  const colorMap = {
    // Indigo scale
    'oklch(0.395 0.228 281.68)': 'rgb(67, 97, 238)',
    'oklch(0.445 0.211 281.68)': 'rgb(79, 70, 229)',
    'oklch(0.455 0.199 281.68)': 'rgb(99, 102, 241)',
    'oklch(0.509 0.165 281.68)': 'rgb(109, 114, 247)',
    'oklch(0.566 0.131 281.68)': 'rgb(121, 128, 254)',
    'oklch(0.623 0.095 281.68)': 'rgb(138, 143, 255)',
    // Slate/Gray scales
    'oklch(0.974 0.004 264.36)': 'rgb(248, 250, 252)',
    'oklch(0.929 0.006 264.54)': 'rgb(241, 245, 249)',
    'oklch(0.885 0.01 264.55)': 'rgb(226, 232, 240)',
    'oklch(0.83 0.014 258.34)': 'rgb(203, 213, 225)',
    'oklch(0.777 0.019 258.34)': 'rgb(148, 163, 184)',
    'oklch(0.708 0.022 258.34)': 'rgb(100, 116, 139)',
    'oklch(0.631 0.025 257.33)': 'rgb(71, 85, 105)',
    'oklch(0.543 0.027 257.33)': 'rgb(51, 65, 85)',
    'oklch(0.446 0.03 256.44)': 'rgb(30, 41, 59)',
    'oklch(0.341 0.034 256.44)': 'rgb(15, 23, 42)',
    // Blue gray
    'oklch(0.663 0.022 261.18)': 'rgb(100, 116, 139)',
    'oklch(0.618 0.022 261.18)': 'rgb(71, 85, 105)',
    'oklch(0.563 0.024 261.18)': 'rgb(51, 65, 85)',
    'oklch(0.505 0.026 261.18)': 'rgb(34, 47, 68)',
    // Additional grays
    'oklch(0.922 0.006 264.54)': 'rgb(241, 245, 249)',
    'oklch(0.963 0.004 264.36)': 'rgb(248, 250, 252)',
    'oklch(0.982 0.003 264.36)': 'rgb(255, 255, 255)',
    'oklch(0.868 0.014 261.18)': 'rgb(226, 232, 240)',
    // Red scale (for error/hover)
    'oklch(0.557 0.184 27.33)': 'rgb(239, 68, 68)',
    'oklch(0.639 0.13 27.33)': 'rgb(220, 38, 38)',
    // Green scale (for saved status)
    'oklch(0.705 0.191 145.88)': 'rgb(34, 197, 94)',
    'oklch(0.627 0.146 151.03)': 'rgb(22, 163, 74)',
    // Amber/Yellow
    'oklch(0.769 0.188 84.25)': 'rgb(234, 179, 8)',
    // Rose
    'oklch(0.641 0.178 11.05)': 'rgb(244, 63, 94)',
  };

  const rules = [];

  // Generate class-based rules for all mapped colors
  for (const [oklch, rgb] of Object.entries(colorMap)) {
    // Match the oklch value in any CSS property context
    rules.push(
      `[style*="${oklch}"] { background-color: ${rgb} !important; }`,
      `[style*="${oklch}"] { color: ${rgb} !important; }`,
      `[style*="${oklch}"] { border-color: ${rgb} !important; }`,
      `[style*="${oklch}"] { fill: ${rgb} !important; }`
    );
  }

  // For inline styles directly applied via style attributes,
  // we need a different approach: convert oklch() to rgb() in the element's style string.
  // This is handled in applyPrintStyles() below.

  return rules.join('\n');
}

// ─── Print style injection ────────────────────────────────────────────────────

const PRINT_STYLE_ID = 'resume-pdf-print-styles';

/**
 * Converts oklch() to rgb() in a CSS text string.
 */
function convertOklchToRgb(cssText) {
  return cssText.replace(/oklch\([^)]+\)/g, (match) => {
    const converted = parseOklchToRgb(match);
    return converted !== null ? converted : match;
  });
}

/**
 * Injects a print-safe <style> tag into the document and returns a cleanup fn.
 *
 * The injected <style> forces rgb() values for Tailwind classes used in the
 * resume preview. This only affects PDF generation — the page remains unchanged.
 *
 * @returns {Function} Cleanup function — call after html2canvas finishes.
 */
export function injectPrintStyles() {
  // Remove any previous injection
  const existing = document.getElementById(PRINT_STYLE_ID);
  if (existing) existing.remove();

  // Convert all <style> elements in the document that contain oklch()
  const styleEls = document.querySelectorAll('style');
  const originals = [];

  styleEls.forEach((el, i) => {
    const text = el.textContent;
    if (text && text.includes('oklch(')) {
      originals[i] = text;
      el.textContent = convertOklchToRgb(text);
    }
  });

  // Also patch inline styles on every element in the document
  const originalsInline = [];
  const elements = document.querySelectorAll('[style]');
  elements.forEach((el, i) => {
    const style = el.getAttribute('style');
    if (style && style.includes('oklch(')) {
      originalsInline[i] = style;
      el.setAttribute('style', convertOklchToRgb(style));
    }
  });

  // Inject a comprehensive rgb() override stylesheet for Tailwind classes
  const sheet = document.createElement('style');
  sheet.id = PRINT_STYLE_ID;
  sheet.textContent = generateRgbStylesheet();
  document.head.appendChild(sheet);

  // Return cleanup function
  return function cleanupPrintStyles() {
    // Remove injected stylesheet
    const injected = document.getElementById(PRINT_STYLE_ID);
    if (injected) injected.remove();

    // Restore original <style> contents
    styleEls.forEach((el, i) => {
      if (originals[i] !== undefined) {
        el.textContent = originals[i];
      }
    });

    // Restore original inline styles
    elements.forEach((el, i) => {
      if (originalsInline[i] !== undefined) {
        el.setAttribute('style', originalsInline[i]);
      }
    });
  };
}
