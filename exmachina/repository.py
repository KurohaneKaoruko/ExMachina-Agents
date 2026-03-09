from __future__ import annotations

from urllib.parse import urlparse

from .models import RepoReference


def parse_repository_reference(value: str) -> RepoReference:
    cleaned = value.strip()
    if not cleaned:
        raise ValueError("仓库链接不能为空。")

    if cleaned.startswith("git@") and ":" in cleaned:
        authority, path = cleaned.split(":", 1)
        host = authority.split("@", 1)[1]
        normalized_path = path.removesuffix(".git")
        normalized_url = f"https://{host}/{normalized_path}"
    else:
        parsed = urlparse(cleaned)
        if not parsed.scheme or not parsed.netloc:
            raise ValueError(f"无法解析仓库链接：{cleaned}")
        host = parsed.netloc
        path = parsed.path.lstrip("/")
        normalized_url = f"https://{host}/{path.removesuffix('.git')}"

    parts = [part for part in path.split("/") if part]
    if len(parts) < 2:
        raise ValueError(f"无法解析仓库路径：{cleaned}")

    owner = parts[0]
    name = parts[1].removesuffix(".git")
    branch = None
    subpath = None

    if len(parts) >= 4 and parts[2] in {"tree", "blob"}:
        branch = parts[3]
        if len(parts) > 4:
            subpath = "/".join(parts[4:])

    return RepoReference(
        provider=host,
        owner=owner,
        name=name,
        url=normalized_url,
        branch=branch,
        subpath=subpath,
    )
