import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isMeaningfulContent } from "../fs-helpers.js";
import type { Check } from "./types.js";

const WORKFLOWS_DIR = join(".github", "workflows");
const WORKFLOW_EXTENSIONS = [".yml", ".yaml"];

/** A CI workflow that never actually runs is worse than none — it advertises a safety net that isn't there. */
export const hasCi: Check = {
    id: "has-ci",
    description: "A CI workflow runs tests automatically on every push and pull request.",
    run(root) {
        const dir = join(root, WORKFLOWS_DIR);
        if (!existsSync(dir)) {
            return {
                id: this.id,
                status: "fail",
                message:
                    "No .github/workflows directory found. Without CI, a broken change can sit " +
                    "unnoticed until someone finds it by hand.",
            };
        }
        const workflow = readdirSync(dir, { withFileTypes: true }).find(
            (entry) =>
                entry.isFile() && WORKFLOW_EXTENSIONS.some((ext) => entry.name.endsWith(ext)),
        );
        if (!workflow) {
            return {
                id: this.id,
                status: "fail",
                message: ".github/workflows exists but contains no .yml or .yaml workflow file.",
            };
        }
        const path = join(dir, workflow.name);
        const contents = readFileSync(path, "utf8").trim();
        if (!isMeaningfulContent(contents)) {
            return {
                id: this.id,
                status: "fail",
                message: `${path} exists but is only ${contents.length} characters — too short to run a real job.`,
            };
        }
        return { id: this.id, status: "pass", message: `Found ${path}.` };
    },
};
