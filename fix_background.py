import re

# ===== UPDATE INDEX.HTML =====
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove OGL scripts
html = html.replace('    <!-- OGL for Light Rays -->\r\n    <script>var exports = {};</script>\r\n    <script src="https://cdn.jsdelivr.net/npm/ogl@0.0.32/dist/ogl.min.js"></script>\r\n', '')
html = html.replace('    <!-- OGL for Light Rays -->\n    <script>var exports = {};</script>\n    <script src="https://cdn.jsdelivr.net/npm/ogl@0.0.32/dist/ogl.min.js"></script>\n', '')

# Remove Three.js importmap
html = re.sub(r'\s*<script type="importmap">.*?</script>', '', html, flags=re.DOTALL)

# Remove beams container
html = re.sub(r'\s*<div id="beams-container"[^>]*></div>', '', html)

# Remove light-rays and hero-noise divs
html = html.replace('    <div class="light-rays"></div>\r\n', '')
html = html.replace('    <div class="hero-noise"></div>\r\n', '')
html = html.replace('    <div class="light-rays"></div>\n', '')
html = html.replace('    <div class="hero-noise"></div>\n', '')

# Remove lightRays.js and beams.js script tags
html = html.replace('  <script src="js/lightRays.js"></script>\r\n', '')
html = html.replace('  <script type="module" src="js/beams.js"></script>\r\n', '')
html = html.replace('  <script src="js/lightRays.js"></script>\n', '')
html = html.replace('  <script type="module" src="js/beams.js"></script>\n', '')

# Add the new background layers right after <body>
bg_layers = '''
  <!-- BACKGROUND SYSTEM -->
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="bg-grid-micro" aria-hidden="true"></div>
  <div class="bg-glow" aria-hidden="true"></div>
'''

html = html.replace('<body id="top">\r\n', '<body id="top">\n' + bg_layers)
html = html.replace('<body id="top">\n', '<body id="top">\n' + bg_layers)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html updated.")


# ===== UPDATE CASE STUDY FILES =====
case_files = ['smartmap-case-study.html', 'bananaz-case-study.html', 'data-platform-case-study.html', 'mrv-case-study.html']
for fname in case_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove importmap
    content = re.sub(r'\s*<script type="importmap">.*?</script>', '', content, flags=re.DOTALL)
    # Remove beams container
    content = re.sub(r'\s*<div id="beams-container"[^>]*></div>', '', content)
    # Remove beams.js
    content = content.replace('  <script type="module" src="js/beams.js"></script>\n', '')
    content = content.replace('  <script type="module" src="js/beams.js"></script>\r\n', '')

    # Add background layers after <body>
    bg_case = '''
  <!-- BACKGROUND SYSTEM -->
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="bg-grid-micro" aria-hidden="true"></div>
  <div class="bg-glow" aria-hidden="true"></div>
'''
    content = content.replace('<body>\r\n', '<body>\n' + bg_case)
    content = content.replace('<body>\n', '<body>\n' + bg_case)

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  {fname} updated.")


# ===== UPDATE STYLES.CSS =====
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove old light-rays CSS
css = re.sub(r'\.light-rays\s*\{[^}]*\}\s*', '', css)
css = re.sub(r'@keyframes rotateRays\s*\{[^}]*\}\s*', '', css)

# Remove hero-noise CSS
css = re.sub(r'\.hero-noise\s*\{[^}]*\}\s*', '', css)

# Remove hero radial gradient background (will use global now)
css = css.replace('  background: radial-gradient(circle at 20% 20%, #0b1225, #050a19 80%);', '  background: transparent;')

# Add new background system CSS after the body rule
bg_css = '''
/* =========================================
   BACKGROUND SYSTEM (DEPTH GRID)
========================================= */
.bg-grid {
  position: fixed;
  inset: 0;
  z-index: -3;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 80px 80px;
}
.bg-grid-micro {
  position: fixed;
  inset: 0;
  z-index: -3;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.15;
}
.bg-glow {
  position: fixed;
  inset: 0;
  z-index: -4;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 0%, rgba(59,130,246,0.12), transparent 60%),
    radial-gradient(circle at 80% 50%, rgba(14,165,233,0.08), transparent 60%);
}

'''

# Insert after body closing brace
css = css.replace('/* HEADER */', bg_css + '/* HEADER */')

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("styles.css updated.")

print("\nAll done!")
