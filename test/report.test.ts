import { describe, expect, it } from "vitest";
import { formatReport } from "../src/report.js";

describe("formatReport", () => {
    it("marks a pass with a check and reports a clean summary", () => {
        const output = formatReport([
            { id: "has-license", status: "pass", message: "Found LICENSE." },
        ]);
        expect(output).toContain("✓ has-license: Found LICENSE.");
        expect(output).toContain("1/1 checks passed.");
    });

    it("marks a fail with a cross and counts it in the summary", () => {
        const output = formatReport([
            { id: "has-license", status: "pass", message: "Found LICENSE." },
            { id: "has-readme", status: "fail", message: "No README.md found." },
        ]);
        expect(output).toContain("✗ has-readme: No README.md found.");
        expect(output).toContain("1/2 checks failed.");
    });
});
