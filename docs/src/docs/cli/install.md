Install the Avon CLI on your machine.

## Requirements

- macOS, Linux, or Windows with WSL
- Network access to your institution’s package or install source

## Install

Use the install path your Avon operator provides for your environment. Typical shape:

```sh
# Example - replace with the install command for your deployment
curl -fsSL https://example.invalid/install-avon-cli | sh
```

Or, if your environment publishes a package:

```sh
# Example
npm install -g @avon/cli
```

Confirm the binary is on your `PATH`:

```sh
avon --version
```

## Update

Re-run the install steps for your environment, or use the package manager update command if you installed via a package.

## Next

See [Commands](/cli/commands) for the main entry points.
