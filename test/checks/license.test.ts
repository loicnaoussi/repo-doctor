import { describe, expect, it, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { hasLicense } from "../../src/checks/license.js";

function tempRepo(): string {
    return mkdtempSync(join(tmpdir(), "repo-doctor-license-"));
}

const dirs: string[] = [];
afterEach(() => {
    while (dirs.length > 0) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe("hasLicense", () => {
    it("passes when a LICENSE file exists", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(join(root, "LICENSE"), "MIT");

        expect(hasLicense.run(root)).toEqual({
            id: "has-license",
            status: "pass",
            message: expect.stringContaining("LICENSE"),
        });
    });

    it("recognizes common name variants case-insensitively", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(join(root, "license.md"), "MIT");

        expect(hasLicense.run(root).status).toBe("pass");
    });

    it("fails when no license file is present — the negative control", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(join(root, "README.md"), "# hello");

        const result = hasLicense.run(root);
        expect(result.status).toBe("fail");
        expect(result.message).toContain("No LICENSE file found");
    });
});
