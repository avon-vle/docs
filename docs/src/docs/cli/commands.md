Main Avon CLI commands. Exact flags may vary by version - run `avon <command> --help` for the full list on your install.

## Global

```sh
avon --version
avon --help
avon <command> --help
```

## Auth

```sh
avon login
avon logout
avon whoami
```

## Project and course

```sh
avon status
avon project list
avon project open
```

## Feedback and runs

```sh
avon test
avon test status
avon feedback
```

## Configuration

```sh
avon config get
avon config set <key> <value>
```

## Tips

- Prefer `avon <command> --help` over memorising flags.
- Use the same environment/URL your web app uses when prompted to log in.
- See [Install](/cli/install) if the `avon` binary is not found.
