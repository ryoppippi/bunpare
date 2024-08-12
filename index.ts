#!/usr/bin/env bun
/* @see https://bun.sh/docs/install/lockfile */

import process from 'node:process';
import path from 'node:path';
import { consola } from 'consola';

const GIT_ATTRIBUTES_CONFIG = `*.lockb binary diff=lockb`;

const { $ } = await import('bun')
	.catch(() => {
		consola.error('Bun is not installed');
		process.exit(1);
	});

/* if git command not found, causes an error */
await $`which git`.quiet();

/* if not git repository, causes an error */
await $`git rev-parse --is-inside-work-tree`.quiet();

/* if not git repository, causes an error */
const gitRoot = await $`git rev-parse --show-toplevel`.text().then(t => t.trim());

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
