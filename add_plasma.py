import re

case_files = ['smartmap-case-study.html', 'bananaz-case-study.html', 'data-platform-case-study.html', 'mrv-case-study.html']

for fname in case_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add OGL if not present
    if 'ogl' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="styles.css">',
            '<link rel="stylesheet" href="styles.css">\n    <!-- OGL for Plasma -->\n    <script>var exports = {};</script>\n    <script src="https://cdn.jsdelivr.net/npm/ogl@0.0.32/dist/ogl.min.js"></script>'
        )
    
    # Add plasma-layer div if not present
    if 'plasma-layer' not in content:
        content = content.replace(
            '<!-- BACKGROUND SYSTEM -->',
            '<!-- BACKGROUND SYSTEM -->\n  <div id="plasma-layer" aria-hidden="true"></div>'
        )
    
    # Add plasma.js script if not present
    if 'plasma.js' not in content:
        content = content.replace(
            '<script src="js/splashCursor.js"></script>',
            '<script src="js/splashCursor.js"></script>\n  <script src="js/plasma.js"></script>'
        )
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  {fname} updated.")

print("Done.")
