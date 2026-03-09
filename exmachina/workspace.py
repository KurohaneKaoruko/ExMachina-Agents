from __future__ import annotations

from collections import Counter
from pathlib import Path

from .models import WorkspaceSnapshot


EXTENSION_LANGUAGE_MAP = {
    ".py": "Python",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".rs": "Rust",
    ".go": "Go",
    ".java": "Java",
    ".kt": "Kotlin",
    ".swift": "Swift",
    ".cpp": "C++",
    ".c": "C",
    ".cs": "C#",
    ".md": "Markdown",
    ".json": "JSON",
    ".toml": "TOML",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".html": "HTML",
    ".css": "CSS"
}

NOTABLE_NAMES = {
    "pyproject.toml",
    "package.json",
    "Cargo.toml",
    "README.md",
    "README.zh-CN.md",
    "Makefile",
    "tests",
    "src"
}


def scan_workspace(path: str | Path) -> WorkspaceSnapshot:
    root = Path(path).resolve()
    if not root.exists():
        raise ValueError(f"工作区不存在：{root}")
    if not root.is_dir():
        raise ValueError(f"工作区必须是目录：{root}")

    top_level_entries = sorted(item.name for item in root.iterdir())[:20]
    notable_paths: list[str] = []
    test_paths: list[str] = []
    languages = Counter()

    files_seen = 0
    for entry in root.rglob("*"):
        if files_seen >= 200:
            break
        if entry.is_dir():
            if entry.name.lower() in {"tests", "test"}:
                test_paths.append(str(entry.relative_to(root)))
            if entry.name in NOTABLE_NAMES and entry.name not in notable_paths:
                notable_paths.append(str(entry.relative_to(root)))
            continue

        files_seen += 1
        if entry.name in NOTABLE_NAMES and str(entry.relative_to(root)) not in notable_paths:
            notable_paths.append(str(entry.relative_to(root)))

        suffix = entry.suffix.lower()
        language = EXTENSION_LANGUAGE_MAP.get(suffix)
        if language:
            languages[language] += 1

        relative_name = str(entry.relative_to(root))
        lowered = relative_name.lower().replace("\\", "/")
        if "/tests/" in lowered or lowered.startswith("tests/") or lowered.startswith("test/"):
            parent = str(entry.parent.relative_to(root))
            if parent not in test_paths:
                test_paths.append(parent)

    detected_languages = [language for language, _ in languages.most_common(5)]

    return WorkspaceSnapshot(
        root=str(root),
        detected_languages=detected_languages,
        top_level_entries=top_level_entries,
        notable_paths=sorted(set(notable_paths))[:20],
        test_paths=sorted(set(test_paths))[:10],
    )
