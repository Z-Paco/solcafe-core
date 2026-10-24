// Lists empty prose slots in content/copy.ts. Informational only: always
// exits 0 so it can run in prebuild without ever failing a build.
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

try {
  const { copy } = await import(
    pathToFileURL(resolve(process.cwd(), "content/copy.ts")).href
  );
  const empty = Object.entries(copy).filter(([, slot]) => !slot.text);
  const total = Object.keys(copy).length;
  console.log(`\ncopy:check  ${total - empty.length}/${total} slots written, ${empty.length} empty`);
  for (const [id, slot] of empty) {
    console.log(`  - ${id}: ${slot.brief}`);
  }
  if (empty.length) console.log("\nWrite them in content/copy.ts (options in COPY_PROPOSALS.md).\n");
} catch (err) {
  console.warn("copy:check could not read content/copy.ts:", err?.message ?? err);
}
process.exit(0);
