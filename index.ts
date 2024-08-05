/* @see https://bun.sh/docs/install/lockfile */
import process from 'node:process';
import path from 'node:path';
import { $ } from 'bun';
import { consola } from 'consola';

const GIT_ATTRIBUTES_CONFIG = `*.lockb binary diff=lockb`;

/* check if running on bun runtime */
if (globalThis.Bun == null && process?.versions?.bun == null) {
	consola.warn('Bun is not installed or not running in a bun shell');
	process.exit(1);
}

/* if git command not found, skip */
try {
	await $`which git`;
}
catch {
	consola.warn('Git is not installed or not in PATH');
	process.exit(1);
}

/* if not git repository, skip */
const isInsideGitWorkTree: unknown = await $`git rev-parse --is-inside-work-tree`.json();

if (typeof isInsideGitWorkTree !== 'boolean' || !isInsideGitWorkTree) {
	consola.warn('Not a git repository');
	process.exit(1);
}

const gitRoot = await $`git rev-parse --show-toplevel`.text().then(t => t.trim());

if (gitRoot == null) {
	consola.warn('Failed to get git root');
	process.exit(1);
}

/* Add the following to your local or global .gitattributes file */
const gitAttributesPath = path.join(gitRoot, './.gitattributes');
const gitAttributesFile = Bun.file(gitAttributesPath);

/* if .gitattributes does not exist, create it */
if (!await gitAttributesFile.exists()) {
	await $`touch ${gitAttributesPath}`;
	consola.success('Created .gitattributes file');
}

/* Read .gitattributes file */
const gitAttributes = await gitAttributesFile.text();

if (!gitAttributes.includes(GIT_ATTRIBUTES_CONFIG)) {
	await $`echo ${GIT_ATTRIBUTES_CONFIG} >> ${gitAttributesPath}`;
	consola.success('Added diff.lockb configuration to .gitattributes');
}

/* Run git config to local repo */
await $`git config diff.lockb.textconv bun`;
await $`git config diff.lockb.binary true`;

consola.success(`Successfully configured git diff.lockb at ${gitRoot}`);
