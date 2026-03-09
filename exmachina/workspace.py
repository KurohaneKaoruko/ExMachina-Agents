from __future__ import annotations

import os
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

IGNORED_DIR_NAMES = {
    ".git",
    ".hg",
    ".svn",
    ".venv",
    "venv",
    "__pycache__",
    "node_modules",
    "dist",
    "build",
    ".next",
}
PRIORITY_DIR_NAMES = {"src", "app", "lib", "server", "client", "backend", "frontend", "tests", "test", "exmachina"}
MAX_SCANNED_FILES = 600


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
    for current_root, dirnames, filenames in os.walk(root):
        dirnames[:] = [name for name in dirnames if name not in IGNORED_DIR_NAMES]
        dirnames.sort(key=lambda name: (name not in PRIORITY_DIR_NAMES, name))
        current_path = Path(current_root)
        relative_dir = current_path.relative_to(root)

        for dirname in dirnames:
            relative_path = (relative_dir / dirname) if relative_dir != Path(".") else Path(dirname)
            relative_str = str(relative_path).replace("\\", "/")
            if dirname.lower() in {"tests", "test"} and relative_str not in test_paths:
                test_paths.append(relative_str)
            if dirname in NOTABLE_NAMES and relative_str not in notable_paths:
                notable_paths.append(relative_str)

        for filename in sorted(filenames):
            if files_seen >= MAX_SCANNED_FILES:
                break

            entry = current_path / filename
            files_seen += 1
            relative_name = str(entry.relative_to(root)).replace("\\", "/")
            if filename in NOTABLE_NAMES and relative_name not in notable_paths:
                notable_paths.append(relative_name)

            suffix = entry.suffix.lower()
            language = EXTENSION_LANGUAGE_MAP.get(suffix)
            if language:
                languages[language] += 1

            lowered = relative_name.lower()
            if "/tests/" in lowered or lowered.startswith("tests/") or lowered.startswith("test/"):
                parent = str(entry.parent.relative_to(root)).replace("\\", "/")
                if parent not in test_paths:
                    test_paths.append(parent)

        if files_seen >= MAX_SCANNED_FILES:
            break

    detected_languages = [language for language, _ in languages.most_common(5)]

    return WorkspaceSnapshot(
        root=str(root),
        detected_languages=detected_languages,
        top_level_entries=top_level_entries,
        notable_paths=sorted(set(notable_paths))[:20],
        test_paths=sorted(set(test_paths))[:10],
    )
