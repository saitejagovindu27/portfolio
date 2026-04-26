import glob
import re

header_html = '''  <!-- GLOBAL FLUID CURSOR -->
  <canvas id="fluid"></canvas>

  <!-- HEADER -->
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <a href="index.html" style="color: inherit; text-decoration: none;">SG</a>
      </div>
      <nav class="nav">
        <a href="index.html#work">Work</a>
        <a href="index.html#process">Process</a>
        <a href="index.html#contact">Contact</a>
      </nav>
    </div>
  </header>'''

for f in ['smartmap-case-study.html', 'bananaz-case-study.html', 'data-platform-case-study.html', 'mrv-case-study.html']:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace <div class="case-header">...</div> with the new header
    content = re.sub(r'<div class="case-header">.*?</div>', header_html, content, flags=re.DOTALL)
    
    # Add script before </body>
    if 'js/splashCursor.js' not in content:
        content = content.replace('</body>', '  <script src="js/splashCursor.js"></script>\n</body>')
    
    # Ensure lenis is loaded in <head>
    if 'lenis.min.js' not in content:
        content = content.replace('</head>', '    <script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>\n</head>')

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f'Updated {f}')
