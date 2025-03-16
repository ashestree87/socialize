# Contributing to Socialize

Thank you for considering contributing to Socialize! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template when creating a new issue
- Include detailed steps to reproduce the bug
- Include screenshots if applicable
- Specify your environment (OS, browser, etc.)

### Suggesting Features

- Check if the feature has already been suggested in the Issues section
- Use the feature request template when creating a new issue
- Provide a clear description of the feature
- Explain why this feature would be useful to most users

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Submit a pull request

## Development Workflow

1. Clone your fork of the repository
2. Set up the development environment following the instructions in the README
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Write or update tests as necessary
6. Run the test suite to ensure all tests pass
7. Commit your changes following the commit message guidelines
8. Push your branch to your fork
9. Submit a pull request

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code (formatting, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(auth): add social login with Google

Implements Google OAuth login flow.

Closes #123
```

## Code Style

Follow the coding standards defined in the [.cursorrules](.cursorrules) file.

## Testing

- Write tests for all new features and bug fixes
- Ensure all tests pass before submitting a pull request
- Aim for high test coverage

## Documentation

- Update documentation for all new features
- Use clear and concise language
- Include code examples where appropriate

## Review Process

1. At least one core team member must approve your pull request
2. All automated tests must pass
3. Code must follow the project's style guidelines
4. Documentation must be updated if necessary

## Questions?

If you have any questions about contributing, feel free to open an issue or contact the maintainers directly. 