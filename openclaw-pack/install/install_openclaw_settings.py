from __future__ import annotations

import argparse
import json
from pathlib import Path


def merge_named_list(current: list, incoming: list, key: str) -> list:
    merged = []
    seen = {}
    for item in current + incoming:
        if isinstance(item, dict) and key in item:
            seen[item[key]] = item
        else:
            merged.append(item)
    merged.extend(seen[name] for name in seen)
    return merged


def deep_merge(base: dict, patch: dict) -> dict:
    merged = dict(base)
    for key, value in patch.items():
        if key == "bindings" and isinstance(value, list) and isinstance(merged.get(key), list):
            merged[key] = merge_named_list(merged[key], value, "agentId")
            continue
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            if key == "agents":
                merged_agents = dict(merged[key])
                patch_agents = value
                for agent_key, agent_value in patch_agents.items():
                    if agent_key == "list" and isinstance(agent_value, list) and isinstance(merged_agents.get(agent_key), list):
                        merged_agents[agent_key] = merge_named_list(merged_agents[agent_key], agent_value, "id")
                    elif isinstance(agent_value, dict) and isinstance(merged_agents.get(agent_key), dict):
                        merged_agents[agent_key] = deep_merge(merged_agents[agent_key], agent_value)
                    else:
                        merged_agents[agent_key] = agent_value
                merged[key] = merged_agents
                continue
            merged[key] = deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def main() -> int:
    parser = argparse.ArgumentParser(description="Merge ExMachina OpenClaw settings template into an existing OpenClaw config.")
    parser.add_argument("--config", required=True, help="Target OpenClaw config path, e.g. ~/.openclaw/openclaw.json")
    parser.add_argument("--settings", default="openclaw.settings.json", help="Path to the exported ExMachina settings template")
    args = parser.parse_args()

    config_path = Path(args.config).expanduser().resolve()
    settings_path = Path(args.settings).expanduser().resolve()

    settings_bundle = json.loads(settings_path.read_text(encoding="utf-8"))
    patch = settings_bundle.get("settings_patch", {})

    if config_path.exists():
        current = json.loads(config_path.read_text(encoding="utf-8"))
    else:
        current = {}

    merged = deep_merge(current, patch)
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"已合并 ExMachina 设置到：{config_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
