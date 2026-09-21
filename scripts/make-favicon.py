"""
Generate public/favicon.ico from the icon that app/icon.tsx renders.

Modern browsers use the <link rel="icon" href="/icon.png"> tag Next emits, but
some older crawlers request /favicon.ico blindly and take a 404 as "no icon".
This produces a real multi-size .ico for them.

Run after a build, since it reads the rendered PNG:
    npm run build && npm run favicon

Committed output, because CI installs no Python. Re-run it if the mark in
app/icon.tsx changes - nothing detects that drift automatically.
"""

import pathlib
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE = ROOT / "out" / "icon.png"
TARGET = ROOT / "public" / "favicon.ico"
SIZES = [(16, 16), (32, 32), (48, 48)]

if not SOURCE.exists():
    sys.exit(f"{SOURCE.relative_to(ROOT)} not found - run `npm run build` first")

icon = Image.open(SOURCE).convert("RGBA")
icon.save(TARGET, format="ICO", sizes=SIZES)

kb = TARGET.stat().st_size / 1024
print(f"wrote {TARGET.relative_to(ROOT)} ({kb:.1f}KB) at {', '.join(f'{w}x{h}' for w, h in SIZES)}")
