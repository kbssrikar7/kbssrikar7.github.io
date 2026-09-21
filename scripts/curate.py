"""
Rank and categorise GitHub repos for the portfolio grid using TypeSafe System One.

Run locally only - CI has no API key by design:
    npm run curate            # write src/data/projects.curated.json
    npm run curate -- --dry-run   # print the ordering, write nothing

The model supplies ranking signal (score / bucket / demoable). It never authors
prose - all copy lives in src/data/projects.manual.ts and always wins on merge.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import subprocess
import sys
import time
from pathlib import Path

from typesafe_sdk import Choice, Noul, NoulCriteria, Score, TypeSafeClient

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "projects.curated.json"
USER = "kbssrikar7"

# Not projects: the profile README, and a Homebrew tap that just packages another repo.
EXCLUDE = {USER, "homebrew-headphonesafety"}

SCORE_LEVELS = [
    "Coursework, a tutorial follow-along, or a scaffold with no substantive original work.",
    "A small working utility with limited depth - worth listing, not worth featuring.",
    "A solid, complete project with real functionality, but not differentiating against the rest of this portfolio.",
    "A substantial project with genuine engineering depth: multiple components, real data, and deliberate architecture.",
    "A flagship: distinctive scope, production-grade practice such as testing or CI/CD, and a result worth leading a conversation with.",
]

BUCKETS = {
    "applied-ml": "Machine learning, deep learning, computer vision, or LLM/RAG systems where the modelling or retrieval work is the core contribution.",
    "full-stack": "Web or mobile applications where the product surface, API design, auth, and data layer are the core contribution.",
    "embedded-iot": "Firmware, hardware, PCB design, or device fleet management, where physical devices and constrained environments are central.",
    "systems-tooling": "Native desktop applications, CLI tools, developer infrastructure, CI/CD, or low-level audio and OS integration.",
}


def load_env() -> None:
    env = ROOT / ".env.local"
    if not env.exists():
        sys.exit("Missing .env.local with TYPESAFE_API_KEY=...")
    for line in env.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip("\"'"))
    if not os.environ.get("TYPESAFE_API_KEY"):
        sys.exit("TYPESAFE_API_KEY not set in .env.local")


def gh(*args: str) -> str:
    return subprocess.run(
        ["gh", *args], capture_output=True, text=True, check=True
    ).stdout


def fetch_repos() -> list[dict]:
    raw = json.loads(gh("api", f"users/{USER}/repos?per_page=100&sort=updated"))
    return [
        r
        for r in raw
        if not r["fork"] and not r["private"] and r["name"] not in EXCLUDE
    ]


def readme_excerpt(name: str, limit: int = 2500) -> str:
    try:
        data = json.loads(gh("api", f"repos/{USER}/{name}/readme"))
        text = base64.b64decode(data["content"]).decode("utf-8", "replace")
    except Exception:
        return ""
    # Strip badge lines - they carry no signal and eat the budget.
    lines = [
        ln
        for ln in text.splitlines()
        if "shields.io" not in ln and "badge" not in ln.lower()
    ]
    return "\n".join(lines)[:limit]


def live_status(url: str | None) -> int | None:
    """Actually probe the advertised homepage - several of them are dead."""
    if not url:
        return None
    try:
        out = subprocess.run(
            ["curl", "-s", "-o", "/dev/null", "-L", "--max-time", "20", "-w", "%{http_code}", url],
            capture_output=True,
            text=True,
            check=True,
        ).stdout.strip()
        return int(out)
    except Exception:
        return None


def repo_signals(name: str, branch: str) -> dict:
    """Cheap structural evidence that the project is engineered, not just committed."""
    try:
        tree = json.loads(gh("api", f"repos/{USER}/{name}/git/trees/{branch}?recursive=1"))
        paths = [t["path"] for t in tree.get("tree", [])]
    except Exception:
        return {"has_ci": False, "has_tests": False, "has_dockerfile": False, "file_count": 0}
    low = [p.lower() for p in paths]
    return {
        "has_ci": any(p.startswith(".github/workflows/") for p in low),
        "has_tests": any("test" in p or "spec" in p for p in low),
        "has_dockerfile": any(p.endswith("dockerfile") or "docker-compose" in p for p in low),
        "file_count": len(paths),
    }


def build_state(repo: dict, siblings: list[str]) -> dict:
    name = repo["name"]
    homepage = (repo.get("homepage") or "").strip() or None
    status = live_status(homepage)
    return {
        "name": name,
        "description": repo.get("description") or "",
        "topics": repo.get("topics") or [],
        "primary_language": repo.get("language"),
        "stars": repo["stargazers_count"],
        "last_pushed": (repo.get("pushed_at") or "")[:10],
        "size_kb": repo.get("size", 0),
        "hosted_demo_url": homepage,
        "hosted_demo_http_status": status,
        "hosted_demo_reachable": status is not None and 200 <= status < 400,
        **repo_signals(name, repo.get("default_branch") or "main"),
        "readme_excerpt": readme_excerpt(name),
        # Sibling context so "does this duplicate a stronger project" is answerable.
        "other_projects_in_this_portfolio": siblings,
    }


QUESTIONS = {
    "worthiness": Score(
        instructions=(
            "You are curating the project grid of a job-seeking portfolio for a new-graduate "
            "software engineer targeting full-stack, machine learning, and infrastructure roles. "
            "Rate how strongly `name` deserves a featured slot. Reward original engineering, "
            "technical depth, and evidence the system works end to end - a reachable hosted demo "
            "(`hosted_demo_reachable`), CI (`has_ci`), and tests (`has_tests`) are all evidence. "
            "Penalise work done from a well-known public dataset or tutorial where the main "
            "contribution is applying standard library models to a solved problem, and penalise a "
            "project that substantially overlaps a stronger entry in "
            "`other_projects_in_this_portfolio`."
        ),
        criteria=SCORE_LEVELS,
    ),
    "bucket": Choice(
        instructions=(
            "Assign `name` to the single category a hiring engineer would file it under, based on "
            "where the hard engineering work actually lives rather than on incidental technologies. "
            "A machine learning project with a small web frontend is still applied machine learning."
        ),
        criteria=BUCKETS,
    ),
    "demoable": Noul(
        instructions=(
            "Should this project's card advertise a working hosted demo that a visitor can click "
            "and successfully use right now? Treat `hosted_demo_reachable` and "
            "`hosted_demo_http_status` as the decisive evidence."
        ),
        criteria=NoulCriteria(
            true="There is a hosted URL that currently loads and functions without the visitor "
            "running anything locally, and any backend it needs is publicly reachable.",
            false="There is no hosted URL, or the URL is dead or unreachable, or the project is a "
            "library, firmware, hardware design, notebook, or desktop application with no hosted "
            "surface.",
        ),
    ),
}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="print ordering, write nothing")
    args = ap.parse_args()

    load_env()
    repos = fetch_repos()
    print(f"Curating {len(repos)} repos with TypeSafe System One\n")

    siblings_all = [
        f"{r['name']}: {(r.get('description') or '').strip()[:120]}" for r in repos
    ]

    results: dict[str, dict] = {}
    tokens_in = tokens_out = 0
    started = time.time()

    with TypeSafeClient() as client:
        for repo in repos:
            name = repo["name"]
            siblings = [s for s in siblings_all if not s.startswith(f"{name}:")]
            t0 = time.time()
            resp = client.system_one(
                state=build_state(repo, siblings), questions=QUESTIONS, model="jev-latest"
            )
            ms = int((time.time() - t0) * 1000)

            score = resp.scores["worthiness"]
            bucket = resp.choices["bucket"]
            noul = resp.nouls["demoable"]

            tokens_in += resp.usage.input_tokens
            tokens_out += resp.usage.output_tokens

            results[name] = {
                "score": score.score,
                "scoreConfidence": score.confidence,
                "scoreProbabilities": score.probabilities,
                "bucket": bucket.choice,
                "bucketConfidence": bucket.confidence,
                "demoable": noul.noul >= 0.5,
                "demoableProbability": noul.noul,
            }

            print(
                f"  {score.score:4.2f} (conf {score.confidence:.2f})  "
                f"{bucket.choice:<16} demo={noul.noul:.2f}  {name}  [{ms}ms]"
            )

    elapsed = time.time() - started
    order = sorted(results.items(), key=lambda kv: kv[1]["score"], reverse=True)

    print(f"\n--- ranking ---")
    for i, (name, r) in enumerate(order, 1):
        tier = "FEATURED" if r["score"] >= 3.5 else "grid" if r["score"] >= 2.5 else "archive"
        print(f"  {i:2}. {r['score']:4.2f}  {tier:<9} {name}")

    print(
        f"\n{len(repos)} repos in {elapsed:.1f}s "
        f"({elapsed / max(len(repos), 1):.2f}s each) | "
        f"tokens in={tokens_in} out={tokens_out}"
    )

    if args.dry_run:
        print("\n(dry run - nothing written)")
        return

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "model": "jev-latest",
                "projects": results,
            },
            indent=2,
        )
        + "\n"
    )
    print(f"\nwrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
