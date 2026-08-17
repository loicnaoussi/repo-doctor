import { describe, expect, it, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { hasReadme } from "../../src/checks/readme.js";

function tempRepo(): string {
    return mkdtempSync(join(tmpdir(), "repo-doctor-readme-"));
}

const dirs: string[] = [];
afterEach(() => {
    while (dirs.length > 0) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe("hasReadme", () => {
    it("passes when README.md has real content", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(
            join(root, "README.md"),
            "# my-project\n\nA tool that does one specific thing well.",
        );

        expect(hasReadme.run(root).status).toBe("pass");
    });

    it("fails when no README file is present — the negative control", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(join(root, "LICENSE"), "MIT");

        const result = hasReadme.run(root);
        expect(result.status).toBe("fail");
        expect(result.message).toContain("No README file found");
    });

    it("fails when README exists but is too short to say anything", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(join(root, "README.md"), "# todo");

        const result = hasReadme.run(root);
        expect(result.status).toBe("fail");
        expect(result.message).toContain("too short");
    });
});
