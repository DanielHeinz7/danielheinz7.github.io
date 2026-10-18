"""Compress the licensed source fonts for the web; retain TTFs for PDF generation."""
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
for weight in ('400', '700'):
    source = root / f'public/fonts/schibsted-{weight}.ttf'
    with TTFont(source) as font:
        font.flavor = 'woff2'
        output = source.with_suffix('.woff2')
        font.save(output)
        print(output.relative_to(root))
