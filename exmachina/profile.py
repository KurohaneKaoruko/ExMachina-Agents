from __future__ import annotations

import json
from importlib import resources
from pathlib import Path
from typing import Any


def load_profile(profile_path: str | None = None) -> dict[str, Any]:
    if profile_path:
        profile_file = Path(profile_path)
        profile = json.loads(profile_file.read_text(encoding="utf-8-sig"))
        return _resolve_profile_references(profile, profile_file.parent)

    data_root = resources.files("exmachina").joinpath("data")
    profile = json.loads(data_root.joinpath("default_profile.json").read_text(encoding="utf-8-sig"))
    return _resolve_profile_references(profile, data_root)


def _resolve_profile_references(profile: dict[str, Any], root: Any) -> dict[str, Any]:
    conductor_file = profile.get("conductor_file")
    if conductor_file:
        profile["conductor"] = json.loads(root.joinpath(conductor_file).read_text(encoding="utf-8-sig"))

    resolved_link_bodies: dict[str, Any] = {}
    for name, spec in profile.get("link_bodies", {}).items():
        body_file = spec.get("body_file")
        if body_file:
            body_spec = json.loads(root.joinpath(body_file).read_text(encoding="utf-8-sig"))
            merged_spec = {**body_spec, **spec}
        else:
            merged_spec = spec

        resolved_link_bodies[name] = merged_spec

    profile["link_bodies"] = resolved_link_bodies

    for spec in profile.get("link_bodies", {}).values():
        conductor_file = spec.get("conductor_file")
        if conductor_file:
            spec["conductor"] = json.loads(root.joinpath(conductor_file).read_text(encoding="utf-8-sig"))

        child_files = spec.get("child_agent_files", [])
        if child_files:
            spec["child_agents"] = [
                json.loads(root.joinpath(reference).read_text(encoding="utf-8-sig"))
                for reference in child_files
            ]
    return profile
