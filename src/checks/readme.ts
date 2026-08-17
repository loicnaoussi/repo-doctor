import { readFileSync } from "node:fs";
import { findEntry } from "../fs-helpers.js";
import type { Check } from "./types.js";

const README_NAMES = ["README.md", "README", "README.txt", "README.rst"];

/** A minimum length below which a README says nothing a contributor could act on. */
const MIN_MEANINGFUL_LENGTH = 40;

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
        if (contents.length < MIN_MEANINGFUL_LENGTH) {
            return {
                id: this.id,
                status: "fail",
                message: `${found} exists but is only ${contents.length} characters — too short to say what the project does.`,
            };
        }
        return { id: this.id, status: "pass", message: `Found ${found}.` };
    },
};
