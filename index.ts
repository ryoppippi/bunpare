#!/usr/bin/env bun
/* @see https://bun.sh/docs/install/lockfile */

import process from 'node:process';
import path from 'node:path';
import logSymbols from 'log-symbols';

const GIT_ATTRIBUTES_CONFIG = `*.lockb binary diff=lockb`;

function warn(message: string) {
	console.warn(logSymbols.warning, message);
}

function success(message: string) {
	// eslint-disable-next-line no-console
	console.log(logSymbols.success, message);
}

/* check if running on bun runtime */
if (globalThis.Bun == null && process?.versions?.bun == null) {
	console.warn(logSymbols.warning, 'Bun is not installed or not running in a bun shell');
	process.exit(1);
}

// eslint-disable-next-line import/first
import { $ } from 'bun';

/* if git command not found, skip */
try {
	await $`which git`.quiet();
}
catch {
	warn('Git is not installed or not in PATH');
	process.exit(1);
}

/* if not git repository, skip */
const isInsideGitWorkTree: unknown = await $`git rev-parse --is-inside-work-tree`.json();

if (typeof isInsideGitWorkTree !== 'boolean' || !isInsideGitWorkTree) {
	warn('Not a git repository');
	process.exit(1);
}

const gitRoot = await $`git rev-parse --show-toplevel`.text().then(t => t.trim());

if (gitRoot == null) {
	warn('Failed to get git root');
	process.exit(1);
}

/* Add the following to your local or global .gitattributes file */
const gitAttributesPath = path.join(gitRoot, './.gitattributes');
const gitAttributesFile = Bun.file(gitAttributesPath);

/* if .gitattributes does not exist, create it */
if (!await gitAttributesFile.exists()) {
	await $`touch ${gitAttributesPath}`;
	success('Created .gitattributes file');
}

/* Read .gitattributes file */
const gitAttributes = await gitAttributesFile.text();

if (!gitAttributes.includes(GIT_ATTRIBUTES_CONFIG)) {
	await $`echo ${GIT_ATTRIBUTES_CONFIG} >> ${gitAttributesPath}`;
	success('Added diff.lockb configuration to .gitattributes');
}

/* Run git config to local repo */
await $`git config diff.lockb.textconv bun`;
await $`git config diff.lockb.binary true`;

success(`Successfully configured git diff.lockb at ${gitRoot}`);
