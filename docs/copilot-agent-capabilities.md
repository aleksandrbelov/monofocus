# GitHub Copilot Agent — Capabilities FAQ

## Can the GitHub Copilot agent create issues?

**No.**

The GitHub Copilot coding agent does not have a tool to create GitHub issues.
It can *read* issues (search, list, get details and comments), but there is no
`create_issue` capability available to it. The agent is also explicitly
prohibited from opening new pull requests.

### What the agent *can* do with issues

| Action | Available |
|--------|-----------|
| Search issues | ✅ |
| List issues in a repo | ✅ |
| Read issue details and comments | ✅ |
| Read issue labels and sub-issues | ✅ |
| **Create a new issue** | ❌ |
| Edit or close an issue | ❌ |

### What the agent *can* do instead

If you need issues to track planned work, the agent can:

- Create ticket files in the repository (e.g. `tickets/MONO-XXX-title.md`)
  following the project's existing ticketing convention.
- Update `TODO.md` or planning documents such as `DEVELOPMENT_PLAN.md`.
- Push those changes via a pull request for a human to review and, if desired,
  convert into real GitHub issues.
