import tempfile
import unittest
from pathlib import Path

from exmachina.workspace import scan_workspace


class WorkspaceTests(unittest.TestCase):
    def test_scan_workspace_prioritizes_code_directories_over_large_doc_trees(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            (root / "openclaw-pack").mkdir()
            for index in range(300):
                (root / "openclaw-pack" / f"doc_{index:03d}.md").write_text("# doc\n", encoding="utf-8")

            (root / "exmachina").mkdir()
            (root / "exmachina" / "main.py").write_text("print('ok')\n", encoding="utf-8")
            (root / "tests").mkdir()
            (root / "tests" / "test_sample.py").write_text("def test_ok():\n    assert True\n", encoding="utf-8")

            snapshot = scan_workspace(root)

            self.assertIn("Python", snapshot.detected_languages)
            self.assertIn("tests", snapshot.test_paths)


if __name__ == "__main__":
    unittest.main()
