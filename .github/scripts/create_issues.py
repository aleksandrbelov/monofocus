#!/usr/bin/env python3
"""Create GitHub issues from MonoFocus ticket markdown files.

Reads every MONO-*.md file under tickets/, parses the title, type, priority,
and sprint, then creates a GitHub Issue for each ticket that does not yet
exist in the repository.  Existing issues are detected by searching for the
MONO-XXX identifier in open *and* closed issue titles so the script is safe
to re-run at any time.

Required environment variables:
    GITHUB_TOKEN       – Personal access token or Actions GITHUB_TOKEN with
                         issues: write permission.
    GITHUB_REPOSITORY  – Owner/repo string, e.g. "aleksandrbelov/monofocus".

Optional environment variables:
    DRY_RUN            – Set to "true" to print what would happen without
                         making any API calls (default: "false").
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
GITHUB_REPOSITORY = os.environ.get("GITHUB_REPOSITORY", "")
DRY_RUN = os.environ.get("DRY_RUN", "false").lower() == "true"

REPO_ROOT = Path(__file__).parent.parent.parent
TICKETS_DIR = REPO_ROOT / "tickets"
API_BASE = "https://api.github.com"

# Small pause between issue-creation requests to respect GitHub's secondary
# rate limit (max ~1 write per second for unauthenticated; authenticated apps
# should stay under ~30 writes/minute to be safe).
API_RATE_LIMIT_DELAY = 0.5  # seconds

# Sprint assignments derived from DEVELOPMENT_PLAN.md.
# Tickets not explicitly listed fall back to "backlog".
SPRINT_2_TICKETS = {1, 2, 7, 8, 9, 16}
SPRINT_3_TICKETS = {3, 4, 5, 6, 10, 11, 12, 13, 14, 15, 17, 18, 19}
SPRINT_4_TICKETS = set(range(20, 35))
SPRINT_5_TICKETS = set(range(35, 53))
SPRINT_6_TICKETS = set(range(53, 62))

SPRINT_MAP: dict[str, str] = {}
for _num in SPRINT_2_TICKETS:
    SPRINT_MAP[f"MONO-{_num:03d}"] = "sprint-2"
for _num in SPRINT_3_TICKETS:
    SPRINT_MAP[f"MONO-{_num:03d}"] = "sprint-3"
for _num in SPRINT_4_TICKETS:
    SPRINT_MAP[f"MONO-{_num:03d}"] = "sprint-4"
for _num in SPRINT_5_TICKETS:
    SPRINT_MAP[f"MONO-{_num:03d}"] = "sprint-5"
for _num in SPRINT_6_TICKETS:
    SPRINT_MAP[f"MONO-{_num:03d}"] = "sprint-6"

# Label colours (GitHub hex, no leading #)
LABEL_COLORS: dict[str, str] = {
    "priority: critical": "d73a4a",
    "priority: high":     "e4e669",
    "priority: medium":   "0075ca",
    "priority: low":      "cfd3d7",
    "sprint-2":           "0e8a16",
    "sprint-3":           "1d76db",
    "sprint-4":           "5319e7",
    "sprint-5":           "e99695",
    "sprint-6":           "f9d0c4",
    "backlog":            "ededed",
    "type: bug":          "d73a4a",
    "type: feature":      "a2eeef",
    "type: testing":      "0075ca",
    "type: documentation":"fef2c0",
    "type: performance":  "e4e669",
    "type: refactor":     "d4c5f9",
    "type: launch":       "f9d0c4",
}

LABEL_DESCRIPTIONS: dict[str, str] = {
    "priority: critical": "Blocking release",
    "priority: high":     "Required for production quality",
    "priority: medium":   "Improves quality, not blocking",
    "priority: low":      "Nice-to-have / post-MVP",
    "sprint-2":           "Sprint 2 – Stabilisation & TestFlight",
    "sprint-3":           "Sprint 3 – Quality & Developer Experience",
    "sprint-4":           "Sprint 4 – User Experience Enhancements",
    "sprint-5":           "Sprint 5 – System Integration & Intelligence",
    "sprint-6":           "Sprint 6 – Production Launch",
    "backlog":            "Unscheduled / backlog",
    "type: bug":          "Something is broken",
    "type: feature":      "New functionality",
    "type: testing":      "Test coverage work",
    "type: documentation":"Docs or comments",
    "type: performance":  "Performance or optimisation work",
    "type: refactor":     "Code restructuring without behaviour change",
    "type: launch":       "App Store / launch-related task",
}

# ---------------------------------------------------------------------------
# GitHub REST API helpers
# ---------------------------------------------------------------------------


def _request_object(method: str, path: str, data: dict | None = None) -> dict:
    """Execute a GitHub API write request and return the parsed JSON object."""
    url = f"{API_BASE}{path}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
    }
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode())
            assert isinstance(result, dict), (
                f"Expected JSON object from {method} {path}, got {type(result).__name__}"
            )
            return result
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode()
        raise RuntimeError(
            f"GitHub API {method} {path} → HTTP {exc.code}: {error_body}"
        ) from exc


def _request_list(path: str) -> list[dict]:
    """Execute a GitHub API GET request and return the parsed JSON array."""
    url = f"{API_BASE}{path}"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode())
            assert isinstance(result, list), (
                f"Expected JSON array from GET {path}, got {type(result).__name__}"
            )
            return result
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode()
        raise RuntimeError(
            f"GitHub API GET {path} → HTTP {exc.code}: {error_body}"
        ) from exc


def _paginate(path: str) -> list[dict]:
    """Collect all pages from a GitHub list endpoint."""
    results: list[dict] = []
    page = 1
    while True:
        sep = "&" if "?" in path else "?"
        batch = _request_list(f"{path}{sep}per_page=100&page={page}")
        if not batch:
            break
        results.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return results


# ---------------------------------------------------------------------------
# Label management
# ---------------------------------------------------------------------------


def fetch_existing_labels(repo: str) -> set[str]:
    """Return the set of label names already in the repository."""
    items = _paginate(f"/repos/{repo}/labels")
    return {item["name"] for item in items}


def ensure_label(repo: str, name: str, existing: set[str]) -> None:
    """Create *name* in the repository if it does not already exist."""
    if name in existing:
        return
    color = LABEL_COLORS.get(name, "ededed")
    description = LABEL_DESCRIPTIONS.get(name, "")
    try:
        _request_object("POST", f"/repos/{repo}/labels", {
            "name": name,
            "color": color,
            "description": description,
        })
        existing.add(name)
        print(f"    ✚ Created label: {name}")
        # Throttle successive write requests to avoid GitHub secondary rate limits.
        if "API_RATE_LIMIT_DELAY" in globals() and API_RATE_LIMIT_DELAY > 0:
            time.sleep(API_RATE_LIMIT_DELAY)
    except RuntimeError as exc:
        # HTTP 422 means the label already exists (e.g. a race condition);
        # treat it as success so we don't block issue creation.
        if "HTTP 422" in str(exc):
            existing.add(name)
            # Even on 422 we just performed a write, so respect the rate-limit delay.
            if "API_RATE_LIMIT_DELAY" in globals() and API_RATE_LIMIT_DELAY > 0:
                time.sleep(API_RATE_LIMIT_DELAY)
        else:
            print(f"    ⚠ Could not create label '{name}': {exc}")


# ---------------------------------------------------------------------------
# Issue management
# ---------------------------------------------------------------------------


def fetch_existing_issue_ids(repo: str) -> dict[str, int]:
    """Return a mapping of MONO-XXX ticket ID → issue number for all issues."""
    items = _paginate(f"/repos/{repo}/issues?state=all")
    result: dict[str, int] = {}
    for item in items:
        # Pull requests are returned by the issues endpoint too; skip them.
        if "pull_request" in item:
            continue
        match = re.search(r"MONO-\d+", item.get("title", ""))
        if match:
            result[match.group(0)] = item["number"]
    return result


def create_issue(
    repo: str,
    ticket: dict,
    existing_labels: set[str],
) -> int:
    """Create a GitHub issue for *ticket* and return its issue number."""
    labels: list[str] = []

    for label in (
        f"priority: {ticket['priority']}",
        f"type: {ticket['type']}",
        ticket["sprint"],
    ):
        ensure_label(repo, label, existing_labels)
        labels.append(label)

    result = _request_object("POST", f"/repos/{repo}/issues", {
        "title": ticket["title"],
        "body": ticket["body"],
        "labels": labels,
    })
    assert "number" in result, f"GitHub issue response missing 'number' field: {result}"
    return result["number"]


# ---------------------------------------------------------------------------
# Ticket markdown parsing
# ---------------------------------------------------------------------------

# Priority keywords searched (in order) in the **Priority:** line.
# The first match becomes the canonical label suffix.
_PRIORITY_KEYWORDS = ["critical", "high", "medium", "low"]

# Map keywords found in the **Type:** line to label suffixes.
# Listed longest/most-specific first to avoid false matches (e.g. "performance"
# before "perf", "test" before "t").
_TYPE_KEYWORDS = [
    ("bug",         "bug"),
    ("test",        "testing"),
    ("doc",         "documentation"),
    ("performance", "performance"),
    ("optimiz",     "performance"),
    ("refactor",    "refactor"),
    ("launch",      "launch"),
]


def parse_ticket(filepath: Path) -> dict | None:
    """Parse a ticket markdown file and return a metadata dict, or None on failure."""
    try:
        text = filepath.read_text(encoding="utf-8")
    except OSError as exc:
        print(f"  ✗ Cannot read {filepath.name}: {exc}")
        return None

    # Title: first level-1 heading.
    title_match = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    if not title_match:
        print(f"  ✗ No title heading in {filepath.name}")
        return None
    title = title_match.group(1).strip()

    # Ticket ID from title or filename.
    id_match = re.search(r"MONO-\d+", title) or re.search(r"MONO-\d+", filepath.name)
    if not id_match:
        print(f"  ✗ No MONO-XXX identifier in {filepath.name}")
        return None
    ticket_id = id_match.group(0)

    # Priority (default: medium).
    priority = "medium"
    m = re.search(r"\*\*Priority:\*\*\s*(.+)$", text, re.MULTILINE | re.IGNORECASE)
    if m:
        raw = m.group(1).lower()
        for keyword in _PRIORITY_KEYWORDS:
            if keyword in raw:
                priority = keyword
                break

    # Type (default: feature).
    issue_type = "feature"
    m = re.search(r"\*\*Type:\*\*\s*(.+)$", text, re.MULTILINE | re.IGNORECASE)
    if m:
        raw = m.group(1).lower()
        for keyword, label in _TYPE_KEYWORDS:
            if keyword in raw:
                issue_type = label
                break

    # Sprint: prefer explicit **Sprint:** field, fall back to SPRINT_MAP.
    sprint = SPRINT_MAP.get(ticket_id, "backlog")
    m = re.search(r"\*\*Sprint:\*\*\s*(\d+)", text, re.MULTILINE | re.IGNORECASE)
    if m:
        sprint_num = int(m.group(1))
        if 2 <= sprint_num <= 6:
            sprint = f"sprint-{sprint_num}"

    return {
        "ticket_id": ticket_id,
        "title":     title,
        "body":      text,
        "priority":  priority,
        "type":      issue_type,
        "sprint":    sprint,
    }


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def main() -> None:
    if not GITHUB_TOKEN:
        print("Error: GITHUB_TOKEN environment variable is not set.")
        sys.exit(1)
    if not GITHUB_REPOSITORY:
        print("Error: GITHUB_REPOSITORY environment variable is not set.")
        sys.exit(1)

    ticket_files = sorted(TICKETS_DIR.glob("MONO-*.md"))
    if not ticket_files:
        print(f"No ticket files found in {TICKETS_DIR}")
        sys.exit(0)

    print(f"Found {len(ticket_files)} ticket file(s) in {TICKETS_DIR.relative_to(REPO_ROOT)}")

    if DRY_RUN:
        print("\n── DRY RUN – no changes will be made ──\n")
        for tf in ticket_files:
            ticket = parse_ticket(tf)
            if ticket:
                print(
                    f"  [{ticket['ticket_id']}] {ticket['title'][:70]}\n"
                    f"    sprint={ticket['sprint']}  priority={ticket['priority']}"
                    f"  type={ticket['type']}"
                )
        return

    print("\nFetching existing issues…")
    existing_issues = fetch_existing_issue_ids(GITHUB_REPOSITORY)
    print(f"  {len(existing_issues)} issue(s) with MONO-XXX IDs already exist.")

    print("Fetching existing labels…")
    existing_labels = fetch_existing_labels(GITHUB_REPOSITORY)
    print(f"  {len(existing_labels)} label(s) found.\n")

    created = 0
    skipped = 0
    failed  = 0

    for tf in ticket_files:
        ticket = parse_ticket(tf)
        if ticket is None:
            failed += 1
            continue

        ticket_id = ticket["ticket_id"]

        if ticket_id in existing_issues:
            print(f"  → {ticket_id}: skipped (issue #{existing_issues[ticket_id]} exists)")
            skipped += 1
            continue

        try:
            number = create_issue(GITHUB_REPOSITORY, ticket, existing_labels)
            print(f"  ✔ {ticket_id}: created issue #{number} — {ticket['title'][:60]}")
            created += 1
            # Brief pause to stay within GitHub's secondary rate limit
            # (≤ ~30 write operations per minute for authenticated requests).
            time.sleep(API_RATE_LIMIT_DELAY)
        except RuntimeError as exc:
            print(f"  ✗ {ticket_id}: failed to create issue — {exc}")
            failed += 1

    print(f"\nDone.  Created: {created}  Skipped: {skipped}  Failed: {failed}")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
