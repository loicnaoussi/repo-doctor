# repo-doctor

A checkup for public repositories: what a new contributor would hit first.

## Why

Most open-source repos are not badly built — they're just missing the small,
boring things a first-time contributor needs: a license, a CONTRIBUTING
guide, a CI pipeline that actually runs, a README that says what the project
does before it says how to install it. None of that is hard to add. It's just
easy to forget, and nothing tells you it's missing until someone tries to
contribute and gives up.

`repo-doctor` runs a set of small, focused checks against a repository and
reports what's missing, in plain language — before a contributor finds out
the hard way.

## Status

Early and public by design. Every check ships with a test that proves it can
both pass and fail — the same discipline I picked up auditing
[hiero-hackers/sdk-automations](https://github.com/hiero-hackers/sdk-automations):
a check that cannot fail is not a check.

## Usage

```bash
pnpm install
pnpm build
node dist/cli.js /path/to/some/repo
```

Checks so far: a LICENSE file, a README with real content, and a
CONTRIBUTING guide. (The CLI is still growing — see the commit history for
what's checked so far.)

## License

MIT
