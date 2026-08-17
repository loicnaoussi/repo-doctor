import type { CheckResult } from "./checks/types.js";

/** A short, human-readable summary of every result — what a contributor would want to read first. */
export function formatReport(results: readonly CheckResult[]): string {
    const lines = results.map((result) => {
        const mark = result.status === "pass" ? "✓" : "✗";
        return `${mark} ${result.id}: ${result.message}`;
    });
    const failed = results.filter((result) => result.status === "fail").length;
    const summary =
        failed === 0
            ? `${results.length}/${results.length} checks passed.`
            : `${failed}/${results.length} checks failed.`;
    return [...lines, "", summary].join("\n");
}
