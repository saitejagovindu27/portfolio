import re

# ===== 1. UPDATE INDEX.HTML =====
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the Featured Work cards section
old_cards = '''        <div class="scroll-stack-card card">
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
        </div>'''

new_cards = '''        <div class="scroll-stack-card work-card">
          <div class="card-inner">
            <div class="card-content">
              <h2>Smart Map</h2>
              <p>Mapping & Workflow System \u2014 UAE government spatial platform redesign serving two fundamentally different user types.</p>
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
              <h2>Data Intelligence</h2>
              <p>Dashboard UX \u2014 Consolidating 14 siloed dashboards into one unified decision-making platform.</p>
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
              <h2>Smart MRV</h2>
              <p>Sustainability Platform Landing \u2014 Translating complex environmental data into a conversion-focused experience.</p>
              <a href="mrv-case-study.html" class="btn-primary">View Case Study \u2192</a>
            </div>
            <div class="card-visual">
              <img src="assets/mrv/screen1.png" alt="Smart MRV" onerror="this.style.display='none'" />
            </div>
          </div>
        </div>'''

# Normalize line endings for matching
html_norm = html.replace('\r\n', '\n')
old_norm = old_cards.replace('\r\n', '\n')
html_norm = html_norm.replace(old_norm, new_cards)

# Fix Bananaz card too
old_bananaz = re.search(r'        <div class="scroll-stack-card card">\s*<div class="card-content">\s*<h3>Bananaz</h3>.*?</div>', html_norm, re.DOTALL)
if old_bananaz:
    html_norm = html_norm.replace(old_bananaz.group(0), '''        <div class="scroll-stack-card work-card">
          <div class="card-inner">
            <div class="card-content">
              <h2>Bananaz</h2>
              <p>Brand Identity & Digital Experience \u2014 Visual system, packaging design, and digital presence.</p>
              <span class="coming-soon-tag">Coming Soon</span>
            </div>
            <div class="card-visual">
              <img src="assets/bananaz/screen1.png" alt="Bananaz" onerror="this.style.display='none'" />
            </div>
          </div>
        </div>''')
    # Remove the orphan img tag that was after
    html_norm = html_norm.replace('          <img src="assets/bananaz/screen1.png" class="card-bg" alt="Bananaz" onerror="this.style.display=\'none\'" />\n', '')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_norm)

print("HTML updated successfully.")


# ===== 2. UPDATE STYLES.CSS =====
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

css_norm = css.replace('\r\n', '\n')

# Remove old .card and .card-content and .card-bg rules
old_css_block = """.card {
  height: 380px;
  border-radius: 30px;
  background: linear-gradient(135deg, #0b1225, #111a35);
  padding: 40px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255,255,255,0.05);
  text-decoration: none;
  color: white;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  transition: none !important;
}
/* hover border removed to fix animation blinking */
.card-content {
  flex: 1;
  z-index: 2;
}
.card-content h3 {
  font-size: 40px;
  margin-bottom: 12px;
  font-family: 'Satoshi', sans-serif;
}
.card-content p {
  color: #94a3b8;
  font-size: 20px;
  margin-bottom: 24px;
}
.card img.card-bg {
  position: absolute;
  right: -5%;
  top: 10%;
  height: 120%;
  width: 60%;
  object-fit: cover;
  opacity: 0.8;
  mask-image: linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
  z-index: 1;
  pointer-events: none;
}"""

new_css_block = """/* WORK CARDS */
.work-card {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(to bottom right, rgba(15, 25, 50, 0.7), rgba(10, 20, 40, 0.4));
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.08);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  transform: translateZ(0);
  color: white;
  text-decoration: none;
}
.work-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 40px 100px rgba(0,0,0,0.9);
}
.work-card,
.card-inner {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}

.card-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  padding: 48px;
  animation: card-float 6s ease-in-out infinite;
  will-change: transform;
}
@keyframes card-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.card-content {
  width: 50%;
  z-index: 2;
}
.card-content h2 {
  font-size: 48px;
  font-weight: 600;
  letter-spacing: -0.02em;
  font-family: 'Satoshi', sans-serif;
  margin-bottom: 16px;
}
.card-content p {
  font-size: 18px;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  margin-bottom: 24px;
}

.card-visual {
  width: 50%;
  height: 320px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.4);
  font-size: 14px;
  overflow: hidden;
  position: relative;
}
.card-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.coming-soon-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 99px;
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.25);
  color: #3b82f6;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}"""

css_norm = css_norm.replace(old_css_block, new_css_block)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css_norm)

print("CSS updated successfully.")
