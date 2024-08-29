# bunpare

[![npm version](https://img.shields.io/npm/v/bunpare?color=yellow)](https://npmjs.com/package/bunpare)
[![npm downloads](https://img.shields.io/npm/dm/bunpare?color=yellow)](https://npmjs.com/package/bunpare)

`bunpare` is a tool to configure git for Bun's lockfile.

**This library has zero dependencies!**

## Prerequisites

- [Bun](https://bun.sh/) must be installed and available in your PATH.
- [git](https://git-scm.com/) must be installed and available in your PATH.
- The script must be run inside a Git repository.

## CLI

Run the script in your project directory:

```bash
bunx bunpare
```

## Configure per project

You can execute the script automatically when you run `bun install` by adding the following to your `package.json`:

```json
{
	// ...
	"scripts": {
		"prepare": "bunx bunpare"
	}
	// ...
}
```

## What it does

[Configure for `git diff` Bun's lockfile](https://bun.sh/docs/install/lockfile) automatically

## License

[MIT](./LICENSE)
