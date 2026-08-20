import { readFileSync } from "node:fs";
import { findEntry, isMeaningfulContent } from "../fs-helpers.js";
import type { Check } from "./types.js";

const README_NAMES = ["README.md", "README", "README.txt", "README.rst"];

/** An empty or near-empty README is worse than none: it looks answered but isn't. */
export const hasReadme: Check = {
    id: "has-readme",
    description: "A README explains what the project does before it explains how to install it.",
    run(root) {
        const found = findEntry(root, README_NAMES);
        if (!found) {
            return { id: this.id, status: "fail", message: "No README file found." };
        }
        const contents = readFileSync(found, "utf8").trim();
        if (!isMeaningfulContent(contents)) {
            return {
                id: this.id,
                status: "fail",
                message: `${found} exists but is only ${contents.length} characters — too short to say what the project does.`,
            };
        }
        return { id: this.id, status: "pass", message: `Found ${found}.` };
    },
};
