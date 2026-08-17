import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The first top-level entry in `root` whose name case-insensitively matches
 * one of `names`, or `undefined`. GitHub itself resolves community-health
 * files this way (`LICENSE` vs `license.md` vs `License.txt` all count), so
 * a check that only tried the exact-case spelling would flag real projects
 * as missing a file they have.
 */
export function findEntry(root: string, names: readonly string[]): string | undefined {
    if (!existsSync(root)) return undefined;
    const wanted = new Set(names.map((name) => name.toLowerCase()));
    const entries = readdirSync(root, { withFileTypes: true });
    const match = entries.find((entry) => entry.isFile() && wanted.has(entry.name.toLowerCase()));
    return match ? join(root, match.name) : undefined;
}
