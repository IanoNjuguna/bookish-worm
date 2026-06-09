# Contributing to Doba Protocol

Doba Protocol is building a decentralized, peer-to-peer value network for
creators. By contributing to this repository, you are helping to
build a fairer digital economy.

As an open-source project licensed under the GNU AGPL-3.0, all contributions
you make will also be licensed under those terms.

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free
environment for everyone. By participating in this project, you agree to abide
by standard open-source citizenship: be respectful, constructive, and collaborative.

## Getting Started

Before you start, please read the [`ARCHITECTURE`](ARCHITECTURE.md) doc to understand our technical approach.

### 1. Find Something to Work On

* Look through our **Issues** tab for open tasks.
* Issues labeled `good first issue` are great jumping-off points for new contributors.
* If you want to propose a new feature or fix a bug you found, please **open an issue first** to discuss it with the core team before writing code.

If you're not sure where to start, check out our socials and ask.

### 2. Fork and Clone

Fork the repository to your own GitHub account, then clone it locally:

```bash
git clone [https://github.com/YOUR-USERNAME/doba-protocol.git](https://github.com/YOUR-USERNAME/doba-protocol.git)
cd doba-protocol
```

### 3. Branching

Create a new branch for each feature or fix:

```bash
git checkout -b feature/your-feature-name
```

### 4. Commit Messages

Follow conventional commits:

```text
feat: add new feature
fix: fix a bug
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code refactoring
test: adding or correcting tests
chore: build process or auxiliary tools and libraries
```

### 5. Pull Requests

Once your changes are ready, open a PR:

Start with a clear title summarizing the changes.
In the description, explain:
What was changed.
Why it was changed.
How it was tested.
Link any related issues.
Keep PRs focused. Small, incremental PRs are easier to review and merge.

### 6. Testing

All code must pass existing tests and should include new tests if applicable.

Run tests with:

```bash
pnpm test
```
