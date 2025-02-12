# Contributing to Abso

We love your input! We want to make contributing to Abso as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Adding support for new AI providers

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing style
5. Issue that pull request!

## Local Development Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/abso.git
cd abso
```

2. Install dependencies

```bash
bun install
```

3. Build the project

```bash
bun run build
```

4. Run tests

```bash
bun test
```

## Adding a New Provider

To add support for a new AI provider:

1. Create a new file in `src/providers/[provider-name].ts`
2. Implement the provider interface (refer to existing providers for examples)
3. Add provider configuration in `src/types.ts`
4. Add provider routing in `src/utils/modelRouting.ts`
5. Create an example in `examples/[provider-name].ts`
6. Update documentation to reflect the new provider

## Code Style

- Use modern TypeScript/JavaScript features
- Follow the existing code style (no semicolons, modern JS conventions)
- Use native `fetch` for HTTP requests
- Utilize Bun for running scripts and testing
- Use `chalk` and `ora` for CLI output styling

## License

By contributing, you agree that your contributions will be licensed under the same license that covers the project.

## References

- [Project README](README.md)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Bun Documentation](https://bun.sh/docs)

## Questions?

Don't hesitate to open an issue for any questions or concerns!
