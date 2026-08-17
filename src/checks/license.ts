import { findEntry } from "../fs-helpers.js";
import type { Check } from "./types.js";

const LICENSE_NAMES = ["LICENSE", "LICENSE.md", "LICENSE.txt", "COPYING", "COPYING.md"];

/** A repository with no license file leaves every reuse question unanswered by default. */
export const hasLicense: Check = {
    id: "has-license",
    description: "A LICENSE file states the terms under which the code may be reused.",
    run(root) {
        const found = findEntry(root, LICENSE_NAMES);
        return found
            ? { id: this.id, status: "pass", message: `Found ${found}.` }
            : {
                  id: this.id,
                  status: "fail",
                  message:
                      "No LICENSE file found. Without one, GitHub treats the code as " +
                      "all-rights-reserved by default — even for a public repo.",
              };
    },
};
