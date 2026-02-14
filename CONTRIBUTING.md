# Contributing Guidelines

Never commit to the main branch, always create new branch then open a PR with your changes

## Branch Naming Convention

Format: `<type>/<name>/<description>`

- `feature/<name>/` - New features (e.g., `feature/john/add-calendar-view`)
- `fix/<name>/` - Bug fixes (e.g., `fix/jane/login-validation-error`)

## Commit Convention

- Commit your changes with clear, descriptive commit messages

**Examples:**
```
feat: add user profile page
fix: resolve authentication token expiration
```

## Example Workflow

```bash
# 1. Create a new branch
git checkout -b feature/alice/add-study-timer

# 2. Make your changes and commit
git add .
git commit -m "feat: add pomodoro study timer component"

# 3. Push your branch
git push origin feature/alice/add-study-timer

# 4. Open a pull request on GitHub
# - Add a clear title and description
# - Request review from team leads

# 5. Once approved, merge via GitHub UI
```

