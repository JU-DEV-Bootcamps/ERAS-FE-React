// Runs Vitest with the arguments given (npm run test, npm run test:ci).
// On Windows, a working directory with a lower-case drive letter (c:\..., as Git Bash passes it) makes Vitest
// load itself twice and fail with "failed to find the current suite". Starting it from the same folder with an
// upper-case drive letter avoids that; on other systems the folder is unchanged.
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const cwd = process.cwd().replace(/^[a-z]:/, (drive) => drive.toUpperCase());
const vitest = join(cwd, 'node_modules', 'vitest', 'vitest.mjs');
const result = spawnSync(process.execPath, [vitest, ...process.argv.slice(2)], { cwd, stdio: 'inherit' });
process.exit(result.status ?? 1);
