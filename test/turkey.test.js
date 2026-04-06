import { describe, it, expect } from "vitest";
import {
  hashCode,
  HSVtoRGB,
  capitalize,
  getDist,
  mean,
  getAvgDist,
  className2Color,
  rgba,
} from "../src/turkey.js";

describe("hashCode", () => {
  it("returns a number for any string", () => {
    expect(typeof hashCode("hello")).toBe("number");
  });

  it("returns 0 for empty string", () => {
    expect(hashCode("")).toBe(0);
  });

  it("returns the same hash for the same string", () => {
    expect(hashCode("person")).toBe(hashCode("person"));
  });

  it("returns different hashes for different strings", () => {
    expect(hashCode("cat")).not.toBe(hashCode("dog"));
  });

  it("returns a 32-bit integer (no overflow)", () => {
    const hash = hashCode("a very long class name with many characters");
    expect(Number.isFinite(hash)).toBe(true);
    expect(hash === (hash | 0)).toBe(true);
  });
});

describe("HSVtoRGB", () => {
  it("converts pure red (h=0, s=1, v=1)", () => {
    const result = HSVtoRGB(0, 1, 1);
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("converts pure green (h=0.333, s=1, v=1)", () => {
    const result = HSVtoRGB(1 / 3, 1, 1);
    expect(result.g).toBe(255);
    expect(result.r).toBeLessThan(5);
    expect(result.b).toBeLessThan(5);
  });

  it("converts pure blue (h=0.667, s=1, v=1)", () => {
    const result = HSVtoRGB(2 / 3, 1, 1);
    expect(result.b).toBe(255);
    expect(result.r).toBeLessThan(5);
    expect(result.g).toBeLessThan(5);
  });

  it("converts white (s=0, v=1)", () => {
    const result = HSVtoRGB(0, 0, 1);
    expect(result).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("converts black (v=0)", () => {
    const result = HSVtoRGB(0, 1, 0);
    expect(result).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("returns integer RGB values", () => {
    const result = HSVtoRGB(0.5, 0.5, 0.5);
    expect(Number.isInteger(result.r)).toBe(true);
    expect(Number.isInteger(result.g)).toBe(true);
    expect(Number.isInteger(result.b)).toBe(true);
  });

  it("keeps all values in 0-255 range", () => {
    for (let h = 0; h <= 1; h += 0.1) {
      for (let s = 0; s <= 1; s += 0.5) {
        for (let v = 0; v <= 1; v += 0.5) {
          const result = HSVtoRGB(h, s, v);
          expect(result.r).toBeGreaterThanOrEqual(0);
          expect(result.r).toBeLessThanOrEqual(255);
          expect(result.g).toBeGreaterThanOrEqual(0);
          expect(result.g).toBeLessThanOrEqual(255);
          expect(result.b).toBeGreaterThanOrEqual(0);
          expect(result.b).toBeLessThanOrEqual(255);
        }
      }
    }
  });
});

describe("capitalize", () => {
  it("capitalizes the first letter", () => {
    expect(capitalize("dot")).toBe("Dot");
  });

  it("preserves already capitalized strings", () => {
    expect(capitalize("Polygon")).toBe("Polygon");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("preserves the rest of the string", () => {
    expect(capitalize("bounding box")).toBe("Bounding box");
  });
});

describe("getDist", () => {
  it("returns 0 for identical points", () => {
    expect(getDist([5, 5], [5, 5])).toBe(0);
  });

  it("calculates horizontal distance", () => {
    expect(getDist([0, 0], [3, 0])).toBe(3);
  });

  it("calculates vertical distance", () => {
    expect(getDist([0, 0], [0, 4])).toBe(4);
  });

  it("calculates diagonal distance (3-4-5 triangle)", () => {
    expect(getDist([0, 0], [3, 4])).toBe(5);
  });

  it("is symmetric", () => {
    const d1 = getDist([1, 2], [3, 4]);
    const d2 = getDist([3, 4], [1, 2]);
    expect(d1).toBe(d2);
  });

  it("handles negative coordinates", () => {
    expect(getDist([-3, 0], [0, 4])).toBe(5);
  });
});

describe("mean", () => {
  it("returns the single value for single-element array", () => {
    expect(mean([42])).toBe(42);
  });

  it("calculates average of two numbers", () => {
    expect(mean([2, 4])).toBe(3);
  });

  it("calculates average of multiple numbers", () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
  });

  it("handles floating point numbers", () => {
    expect(mean([0.1, 0.2, 0.3])).toBeCloseTo(0.2);
  });

  it("returns NaN for empty array", () => {
    expect(mean([])).toBeNaN();
  });
});

describe("getAvgDist", () => {
  it("returns distance to the single corner", () => {
    const dist = getAvgDist([0, 0], [[3, 4]]);
    expect(dist).toBe(5);
  });

  it("returns average distance to multiple corners", () => {
    const dist = getAvgDist([0, 0], [
      [3, 0],
      [0, 4],
    ]);
    expect(dist).toBe((3 + 4) / 2);
  });

  it("returns 0 when point is at all corners", () => {
    const dist = getAvgDist([5, 5], [
      [5, 5],
      [5, 5],
    ]);
    expect(dist).toBe(0);
  });

  it("handles a square of corners", () => {
    const dist = getAvgDist([0, 0], [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ]);
    const expected = Math.sqrt(2);
    expect(dist).toBeCloseTo(expected);
  });
});

describe("className2Color", () => {
  it("returns an array of three string RGB values", () => {
    const colorMap = { person: [0, 1, 1] };
    const result = className2Color("person", colorMap);
    expect(result).toHaveLength(3);
    result.forEach((val) => {
      expect(typeof val).toBe("string");
      expect(Number(val)).toBeGreaterThanOrEqual(0);
      expect(Number(val)).toBeLessThanOrEqual(255);
    });
  });

  it("returns red for h=0, s=1, v=1", () => {
    const colorMap = { red: [0, 1, 1] };
    const [r, g, b] = className2Color("red", colorMap);
    expect(r).toBe("255");
    expect(g).toBe("0");
    expect(b).toBe("0");
  });

  it("returns consistent colors for the same class", () => {
    const colorMap = { cat: [0.5, 0.8, 0.9] };
    const first = className2Color("cat", colorMap);
    const second = className2Color("cat", colorMap);
    expect(first).toEqual(second);
  });
});

describe("rgba", () => {
  it("formats rgba string correctly", () => {
    expect(rgba(255, 0, 0, 1.0)).toBe("rgba(255,0,0,1)");
  });

  it("handles fractional alpha", () => {
    expect(rgba(128, 128, 128, 0.5)).toBe("rgba(128,128,128,0.5)");
  });

  it("handles string inputs", () => {
    expect(rgba("255", "128", "0", 0.75)).toBe("rgba(255,128,0,0.75)");
  });
});
