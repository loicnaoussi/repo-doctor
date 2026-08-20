import { readFileSync } from "node:fs";
import { findEntry, isMeaningfulContent } from "../fs-helpers.js";
import type { Check } from "./types.js";

const CONTRIBUTING_NAMES = ["CONTRIBUTING.md", "CONTRIBUTING", "CONTRIBUTING.txt"];

/** Without this file, a would-be contributor has to guess at process, tests, and review — or just leaves. */
export const hasContributing: Check = {
    id: "has-contributing",
    description:
        "A CONTRIBUTING guide tells a first-time contributor how to actually send a change.",
    run(root) {
        const found = findEntry(root, CONTRIBUTING_NAMES);
        if (!found) {
            return {
                id: this.id,
                status: "fail",
                message:
                    "No CONTRIBUTING file found. Without one, a first-time contributor has to " +
                    "guess how to set up, test, and submit a change.",
            };
        }
        const contents = readFileSync(found, "utf8").trim();
        if (!isMeaningfulContent(contents)) {
            return {
                id: this.id,
                status: "fail",
                message: `${found} exists but is only ${contents.length} characters — too short to guide a contributor.`,
            };
        }
        return { id: this.id, status: "pass", message: `Found ${found}.` };
    },
};
