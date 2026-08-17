#!/usr/bin/env node
import { allChecks } from "./checks/index.js";
import { formatReport } from "./report.js";

const root = process.argv[2];
if (!root) {
    console.error("Usage: repo-doctor <path-to-repo>");
    process.exit(2);
}

const results = allChecks.map((check) => check.run(root));
console.log(formatReport(results));

const failed = results.some((result) => result.status === "fail");
process.exit(failed ? 1 : 0);
