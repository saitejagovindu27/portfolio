import re

# ===== FIX INDEX.HTML =====
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix logo to link to top
html = html.replace(
    '<div class="logo">Sai Teja Govind</div>',
    '<div class="logo"><a href="index.html" onclick="window.scrollTo({top:0, behavior:\'smooth\'}); return false;" style="color:inherit; text-decoration:none;">Sai Teja Govind</a></div>'
)

# 2. Replace entire featured work cards section with consistent structure
old_cards_section = '''    <div class="scroll-stack-scroller" id="scroll-stack">
      <div class="scroll-stack-inner">

        <div class="scroll-stack-card card">
          <div class="card-content">
            <h3>Smart Map</h3>
            <p>Mapping &amp; Workflow System</p>
            <a href="smartmap-case-study.html" class="btn-primary">View Case Study \u2192</a>
          </div>
          <img src="assets/smartmap/screen1.png" class="card-bg" alt="SmartMap" onerror="this.style.display='none'" />
        </div>

        <div class="scroll-stack-card card">
          <div class="card-content">
            <h3>Data Intelligence Platform</h3>
            <p>Dashboard UX</p>
            <a href="data-platform-case-study.html" class="btn-primary">View Case Study \u2192</a>
          </div>
          <img src="assets/data-platform/screen1.png" class="card-bg" alt="Data Intelligence" onerror="this.style.display='none'" />
        </div>

        <div class="scroll-stack-card card">
          <div class="card-content">
            <h3>Smart MRV</h3>
            <p>Sustainability Platform Landing</p>
            <a href="mrv-case-study.html" class="btn-primary">View Case Study \u2192</a>
          </div>
          <img src="assets/mrv/screen1.png" class="card-bg" alt="Smart MRV" onerror="this.style.display='none'" />
        </div>

        <div class="scroll-stack-card work-card">
          <div class="card-inner">
            <div class="card-content">
              <h2>Bananaz</h2>
              <p>Brand Identity &amp; Digital Experience \u2014 Visual system, packaging design, and digital presence.</p>
              <span class="coming-soon-tag">Coming Soon</span>
            </div>
            <div class="card-visual">
              <img src="assets/bananaz/screen1.png" alt="Bananaz" onerror="this.style.display='none'" />
            </div>
          </div>
        </div>
        </div>

        <div class="scroll-stack-end"></div>
      </div>
    </div>'''

new_cards_section = '''    <div class="scroll-stack-scroller" id="scroll-stack">
      <div class="scroll-stack-inner">

        <div class="scroll-stack-card work-card">
          <div class="card-inner">
            <div class="card-content">
              <h3>Smart Map</h3>
              <p>Mapping & Workflow System \u2014 UAE government spatial platform redesign.</p>
              <a href="smartmap-case-study.html" class="btn-primary">View Case Study \u2192</a>
            </div>
            <div class="card-visual">
              <img src="assets/smartmap/screen1.png" alt="SmartMap" onerror="this.style.display='none'" />
            </div>
          </div>
        </div>

        <div class="scroll-stack-card work-card">
          <div class="card-inner">
            <div class="card-content">
              <h3>Data Intelligence</h3>
              <p>Dashboard UX \u2014 Consolidating 14 dashboards into one platform.</p>
              <a href="data-platform-case-study.html" class="btn-primary">View Case Study \u2192</a>
            </div>
            <div class="card-visual">
              <img src="assets/data-platform/screen1.png" alt="Data Intelligence" onerror="this.style.display='none'" />
            </div>
          </div>
        </div>

        <div class="scroll-stack-card work-card">
          <div class="card-inner">
            <div class="card-content">
              <h3>Smart MRV</h3>
              <p>Sustainability Platform \u2014 Translating environmental data into clarity.</p>
              <a href="mrv-case-study.html" class="btn-primary">View Case Study \u2192</a>
            </div>
            <div class="card-visual">
              <img src="assets/mrv/screen1.png" alt="Smart MRV" onerror="this.style.display='none'" />
            </div>
          </div>
        </div>

        <div class="scroll-stack-card work-card">
          <div class="card-inner">
            <div class="card-content">
              <h3>Bananaz</h3>
              <p>Brand Identity & Digital Experience \u2014 Visual system and packaging.</p>
              <span class="card-status">Coming Soon</span>
            </div>
            <div class="card-visual">
              <img src="assets/bananaz/screen1.png" alt="Bananaz" onerror="this.style.display='none'" />
            </div>
          </div>
        </div>

        <div class="scroll-stack-end"></div>
      </div>
    </div>'''

# Normalize and replace
html_n = html.replace('\r\n', '\n')
old_n = old_cards_section.replace('\r\n', '\n')
new_n = new_cards_section.replace('\r\n', '\n')

if old_n in html_n:
    html_n = html_n.replace(old_n, new_n)
    print("Cards section replaced successfully.")
else:
    print("WARNING: Could not find old cards section. Trying regex...")
    # Fallback: replace everything between scroll-stack-scroller and closing
    pattern = r'(<div class="scroll-stack-scroller".*?</div>\s*</div>\s*</div>)'
    # Just write the whole section
    html_n = re.sub(
        r'    <div class="scroll-stack-scroller".*?</div>\s*    </div>',
        new_n,
        html_n,
        flags=re.DOTALL
    )
    print("Used regex fallback.")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_n)
print("index.html updated.")


# ===== FIX STYLES.CSS =====
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

css_n = css.replace('\r\n', '\n')

# Remove old .card rules if they still exist
css_n = re.sub(r'\n\.card \{[^}]*\}\n', '\n', css_n)
css_n = re.sub(r'/\* hover border removed to fix animation blinking \*/', '', css_n)
css_n = re.sub(r'\.card img\.card-bg \{[^}]*\}', '', css_n)

# Remove old .card-content h3 and p if they conflict
css_n = re.sub(r'\.card-content h3 \{[^}]*\}', '', css_n)
css_n = re.sub(r'\.card-content p \{[^}]*\}', '', css_n)
css_n = re.sub(r'\.card-content \{[^}]*\}', '', css_n)

# Remove old .coming-soon-tag if it exists
css_n = re.sub(r'\.coming-soon-tag \{[^}]*\}', '', css_n)

# Remove old .work-card block if exists (we'll rewrite)
css_n = re.sub(r'/\* WORK CARDS \*/.*?\.coming-soon-tag \{[^}]*\}', '', css_n, flags=re.DOTALL)

# Remove @keyframes card-float if exists
css_n = re.sub(r'@keyframes card-float \{[^}]*\{[^}]*\}[^}]*\{[^}]*\}\s*\}', '', css_n)

# Clean up multiple blank lines
css_n = re.sub(r'\n{4,}', '\n\n\n', css_n)

# Add the definitive card system
card_css = '''
/* =========================================
   FEATURED WORK CARDS
========================================= */
.featured {
  padding: 120px 10%;
  max-width: 1200px;
  margin: 0 auto;
}
.featured h2 {
  text-align: left;
}

.work-card {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  background: rgba(10, 20, 40, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  color: white;
  text-decoration: none;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  padding: 48px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}

.card-content {
  width: 50%;
  z-index: 2;
  text-align: left;
}
.card-content h3 {
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.02em;
  font-family: 'Satoshi', sans-serif;
  margin-bottom: 12px;
  color: #FFFFFF;
}
.card-content p {
  font-size: 18px;
  color: #A1A1AA;
  line-height: 1.6;
  margin-bottom: 24px;
}

.card-visual {
  width: 50%;
  height: 320px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.card-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.card-status {
  font-size: 12px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.scroll-stack-card {
  transform-origin: top center;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
  width: 100%;
  margin-bottom: 80px;
  box-sizing: border-box;
  transform: translateZ(0);
  position: relative;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.6s ease;
}

'''

# Insert before /* APPROACH */
css_n = css_n.replace('/* APPROACH */', card_css + '/* APPROACH */')

# Fix btn-primary to be consistent white
old_btn = '.btn-primary {\n  padding: 14px 28px;\n  background: white;\n  color: #0b1220;\n  border: none;\n  border-radius: 12px;\n  font-weight: 600;\n  cursor: pointer;\n  text-decoration: none;\n  font-size: 16px;\n  display: inline-block;\n}'
new_btn = '.btn-primary {\n  padding: 14px 24px;\n  background: #ffffff;\n  color: #0b1220;\n  border: none;\n  border-radius: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  text-decoration: none;\n  font-size: 16px;\n  display: inline-block;\n  transition: transform 0.3s ease, background 0.3s ease;\n}'

if old_btn in css_n:
    css_n = css_n.replace(old_btn, new_btn)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css_n)
print("styles.css updated.")

print("\nAll fixes applied!")
