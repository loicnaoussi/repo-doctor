import { hasLicense } from "./license.js";
import type { Check } from "./types.js";

export type { Check, CheckResult } from "./types.js";

/** Every check `repo-doctor` runs, in report order. */
export const allChecks: readonly Check[] = [hasLicense];
