import glob
import re

import_map = '''    <script type="importmap">
      {
        "imports": {
          "three": "https://unpkg.com/three@0.160.0/build/three.module.js"
        }
      }
    </script>
</head>'''

for f in ['smartmap-case-study.html', 'bananaz-case-study.html', 'data-platform-case-study.html', 'mrv-case-study.html']:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'importmap' not in content:
        content = content.replace('</head>', import_map)
    
    if 'id="beams-container"' not in content:
        content = content.replace('<canvas id="fluid"></canvas>', '<div id="beams-container" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; pointer-events: none;"></div>\n  <canvas id="fluid"></canvas>')
    
    if 'js/beams.js' not in content:
        content = content.replace('</body>', '  <script type="module" src="js/beams.js"></script>\n</body>')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f'Updated {f}')
