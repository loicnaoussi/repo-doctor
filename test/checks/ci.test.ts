import { describe, expect, it, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { hasCi } from "../../src/checks/ci.js";

function tempRepo(): string {
    return mkdtempSync(join(tmpdir(), "repo-doctor-ci-"));
}

const dirs: string[] = [];
afterEach(() => {
    while (dirs.length > 0) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe("hasCi", () => {
    it("passes when a workflow file with real content exists", () => {
        const root = tempRepo();
        dirs.push(root);
        const workflowsDir = join(root, ".github", "workflows");
        mkdirSync(workflowsDir, { recursive: true });
        writeFileSync(
            join(workflowsDir, "ci.yml"),
            "name: ci\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n",
        );

        expect(hasCi.run(root).status).toBe("pass");
    });

    it("fails when there is no .github/workflows directory — the negative control", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(join(root, "README.md"), "# hello");

        const result = hasCi.run(root);
        expect(result.status).toBe("fail");
        expect(result.message).toContain("No .github/workflows directory found");
    });

    it("fails when .github/workflows exists but has no workflow file", () => {
        const root = tempRepo();
        dirs.push(root);
        mkdirSync(join(root, ".github", "workflows"), { recursive: true });

        const result = hasCi.run(root);
        expect(result.status).toBe("fail");
        expect(result.message).toContain("contains no .yml or .yaml workflow file");
    });

    it("fails when the workflow file is too short to run a real job", () => {
        const root = tempRepo();
        dirs.push(root);
        const workflowsDir = join(root, ".github", "workflows");
        mkdirSync(workflowsDir, { recursive: true });
        writeFileSync(join(workflowsDir, "ci.yml"), "name: ci");

        const result = hasCi.run(root);
        expect(result.status).toBe("fail");
        expect(result.message).toContain("too short");
    });
});
