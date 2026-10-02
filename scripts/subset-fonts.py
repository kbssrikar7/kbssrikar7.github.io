"""Subsets the Geist fonts to what the site renders: Basic Latin, Latin-1,
general punctuation, a few arrows and the command key. Weight axis is limited
to 400-700 (the site never asks for anything else). Output is committed to
src/fonts so the build does not depend on this script; rerun it only if the
site starts using characters outside this set (anything else falls back to the
system font)."""
from fontTools import subset
import io
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC = 'node_modules/geist/dist/fonts/'
UNICODES = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + list(range(0x2010, 0x2028)) + [0x2030, 0x2039, 0x203A, 0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2318]

for name, path in [('GeistSans', 'geist-sans/Geist-Variable.woff2'), ('GeistMono', 'geist-mono/GeistMono-Variable.woff2')]:
    font = TTFont(SRC + path)
    font = instancer.instantiateVariableFont(font, {'wght': (400, 700)})
    buf = io.BytesIO()
    font.save(buf)
    buf.seek(0)
    font = TTFont(buf)
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk', 'ss01', 'ss02', 'ss03', 'tnum', 'zero']
    opts.notdef_outline = True
    s = subset.Subsetter(opts)
    s.populate(unicodes=UNICODES)
    s.subset(font)
    out = f'src/fonts/{name}-Variable.woff2'
    font.flavor = 'woff2'
    font.save(out)
    print(out)
