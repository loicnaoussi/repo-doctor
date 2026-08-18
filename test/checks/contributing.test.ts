import { describe, expect, it, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { hasContributing } from "../../src/checks/contributing.js";

function tempRepo(): string {
    return mkdtempSync(join(tmpdir(), "repo-doctor-contributing-"));
}

const dirs: string[] = [];
afterEach(() => {
    while (dirs.length > 0) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe("hasContributing", () => {
    it("passes when CONTRIBUTING.md has real content", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(
            join(root, "CONTRIBUTING.md"),
            "# Contributing\n\nRun `pnpm install` then `pnpm test` before opening a PR.",
        );

        expect(hasContributing.run(root).status).toBe("pass");
    });

    it("recognizes common name variants case-insensitively", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(
            join(root, "contributing.txt"),
            "Run pnpm install, then pnpm test, before opening a PR.",
        );

        expect(hasContributing.run(root).status).toBe("pass");
    });

    it("fails when no CONTRIBUTING file is present — the negative control", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(join(root, "README.md"), "# hello");

        const result = hasContributing.run(root);
        expect(result.status).toBe("fail");
        expect(result.message).toContain("No CONTRIBUTING file found");
    });

    it("fails when CONTRIBUTING exists but is too short to guide anyone", () => {
        const root = tempRepo();
        dirs.push(root);
        writeFileSync(join(root, "CONTRIBUTING.md"), "# todo");

        const result = hasContributing.run(root);
        expect(result.status).toBe("fail");
        expect(result.message).toContain("too short");
    });
});
