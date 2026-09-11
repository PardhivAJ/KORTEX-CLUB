import { describe, expect, it } from "vitest";
import { initials, formatNumber, statusClass } from "../utils/formatters";
import { validEmail, validStudentEmail } from "../utils/validators";

describe("formatters", () => {
  it("creates initials", () => expect(initials("Aarav Mehta")).toBe("AM"));
  it("formats Indian numbers", () => expect(formatNumber(4280)).toBe("4,280"));
  it("maps status class", () => expect(statusClass("Present")).toContain("emerald"));
});
describe("validators", () => {
  it("validates email", () => expect(validEmail("2420080001@klh.edu.in")).toBe(true));
  it("validates student email format", () => expect(validStudentEmail("2420080001@klh.edu.in")).toBe(true));
  it("rejects non-numeric student email", () => expect(validStudentEmail("student@klh.edu.in")).toBe(false));
  it("rejects invalid email", () => expect(validEmail("wrong")).toBe(false));
});