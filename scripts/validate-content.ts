/**
 * Validates everything in content/ with the same zod schemas the app uses.
 *
 *   npm run validate
 *
 * Exits with code 1 (and lists every problem) if anything is wrong.
 */
import { validateAllContent } from "../src/lib/content";

const { errors, warnings, careers, simulations, profiles } = validateAllContent();

if (errors.length > 0) {
  console.error(`\n✖ Found ${errors.length} problem${errors.length === 1 ? "" : "s"} in content/:\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error("");
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`\n⚠ ${warnings.length} warning${warnings.length === 1 ? "" : "s"} (not blocking):\n`);
  for (const w of warnings) console.warn(`  • ${w}`);
}

const sceneCount = simulations.reduce((n, s) => n + s.days.reduce((m, d) => m + d.scenes.length, 0), 0);
console.log(`\n✔ Content is valid`);
console.log(`  ${careers.length} careers (${careers.filter((c) => c.status === "live").length} live)`);
console.log(`  ${careers.filter((c) => c.launchWave === 1).length} launching first`);
console.log(`  ${profiles.length} career profiles`);
console.log(`  ${simulations.length} simulations, ${sceneCount} scenes`);
for (const s of simulations) console.log(`    - ${s.id}: ${s.days.length} days`);
console.log("");
