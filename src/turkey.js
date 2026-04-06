/**
 * Pure utility functions extracted from MTurk.html for testability.
 * These are duplicated inline in MTurk.html for self-contained deployment.
 */

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
    hash = hash & hash;
  }
  return hash;
}

function HSVtoRGB(h, s, v) {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDist(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function mean(values) {
  let total = 0;
  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }
  return total / values.length;
}

function getAvgDist(point, corners) {
  const distances = corners.map((corner) => getDist(point, corner));
  return mean(distances);
}

function className2Color(className, colorMap) {
  const [h, s, v] = colorMap[className];
  const rgb = HSVtoRGB(h, s, v);
  return [rgb.r.toString(), rgb.g.toString(), rgb.b.toString()];
}

function rgba(r, g, b, a) {
  return `rgba(${r},${g},${b},${a})`;
}

export {
  hashCode,
  HSVtoRGB,
  capitalize,
  getDist,
  mean,
  getAvgDist,
  className2Color,
  rgba,
};
