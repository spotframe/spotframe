import os
import glob
import yaml

from pathlib import Path
from watchdog.observers import Observer


class Files:
    def __init__(self, path):

        for file in glob.glob(f"{path}/*"):
            setattr(
                self,
                self._stem_file(file),
                self._load_file(file),
            )

        observer = Observer()
        observer.schedule(self._Changes(self), path)
        observer.start()

    def _load_file(self, path):
        with open(path, "r") as file:
            return yaml.safe_load(file)

    def _stem_file(self, path):
        return Path(path).resolve().stem

    class _Changes:
        def __init__(self, super_self):
            self.super = super_self

        def dispatch(self, event):
            setattr(
                self.super,
                self.super._stem_file(event.src_path),
                self.super._load_file(event.src_path),
            )


file = None


def init_app(app=None):
    global file
    file = Files("./DSL")
