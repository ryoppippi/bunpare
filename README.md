# bunpare

`bunpare` is a tool to configure git for Bun's lockfile.

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

Install `bunpare`:

```bash
bun i -D bunpare
```

Then, add `bunpare` to prepare script in package.json:

```json
{
	// ...
	"scripts": {
		"prepare": "bunpare"
	}
	// ...
}
```

## What it does

[Configure for `git diff` Bun's lockfile](https://bun.sh/docs/install/lockfile) automatically

## License

[MIT](./LICENSE)
