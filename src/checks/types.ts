/** One finding from a single check, applied to one repository. */
export interface CheckResult {
    readonly id: string;
    readonly status: "pass" | "fail";
    /** What a contributor would see, and what to do about it. Written for a human, not a log. */
    readonly message: string;
}

/** A check reads the repository at `root` and reports exactly one result. */
export interface Check {
    readonly id: string;
    readonly description: string;
    run(root: string): CheckResult;
}
