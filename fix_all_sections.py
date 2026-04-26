import re

# ===== FIX INDEX.HTML =====
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix Hero Card — top-center overlay with gradient
old_hero = '''    <div class="hero-visual">
      <div class="hero-card" id="tiltCard">
        <img src="assets/profile.jpg" alt="Sai Teja" style="width: 100%; height: 100%; object-fit: cover; object-position: center top; position: absolute; top: 0; left: 0; border-radius: 24px; z-index: 1;" />
        <div class="card-inner">
          <h3 style="font-size: 28px; font-family: 'Satoshi', sans-serif; margin-bottom: 4px; font-weight: 700; text-shadow: 0 2px 20px rgba(0,0,0,0.8);">Sai Teja</h3>
          <p style="color: #cbd5e1; text-shadow: 0 2px 16px rgba(0,0,0,0.8); font-size: 15px;">UI/UX Designer</p>
          <div class="card-glow"></div>
        </div>
      </div>
    </div>'''

new_hero = '''    <div class="hero-visual">
      <div class="profile-card" id="tiltCard">
        <img src="assets/profile.jpg" alt="Sai Teja" />
        <div class="profile-overlay">
          <h2>Sai Teja</h2>
          <p>UI/UX Designer</p>
        </div>
      </div>
    </div>'''

html = html.replace(old_hero.replace('\n', '\r\n'), new_hero.replace('\n', '\r\n'))
html = html.replace(old_hero, new_hero)

# 2. Fix Approach Section — structured pills
old_approach = '''  <!-- APPROACH -->
  <section id="process" class="section approach fade-in">
    <h2>How I Approach Complex Systems</h2>
    <div class="approach-container fade-in">
      <div class="approach-center" data-parallax="0.05">User-Centered Design</div>
      <div class="approach-float f1" data-parallax="0.3">UX Research</div>
      <div class="approach-float f2" data-parallax="0.15">Product Thinking</div>
      <div class="approach-float f3" data-parallax="0.4">Visual Design</div>
      <div class="approach-float f4" data-parallax="0.25">Accessibility</div>
      <div class="approach-float f5" data-parallax="0.35">Prototyping</div>
      <div class="approach-float f6" data-parallax="0.2">Information Architecture</div>
    </div>
  </section>'''

new_approach = '''  <!-- APPROACH -->
  <section id="process" class="section fade-in">
    <h2>How I Approach Complex Systems</h2>
    <div class="process-container">
      <div class="process-glow"></div>
      <div class="process-center">User-Centered Design</div>
      <div class="pill p1">UX Research</div>
      <div class="pill p2">Prototyping</div>
      <div class="pill p3">Visual Design</div>
      <div class="pill p4">Product Thinking</div>
      <div class="pill p5">Accessibility</div>
      <div class="pill p6">Information Architecture</div>
      <div class="connection-line cl1"></div>
      <div class="connection-line cl2"></div>
      <div class="connection-line cl3"></div>
      <div class="connection-line cl4"></div>
    </div>
  </section>'''

html = html.replace(old_approach.replace('\n', '\r\n'), new_approach.replace('\n', '\r\n'))
html = html.replace(old_approach, new_approach)

# 3. Fix Contact Section
old_contact = '''  <!-- CONTACT -->
  <section id="contact" class="contact fade-in">
    <h2>Let\'s Connect</h2>
    <p style="color: #94a3b8; font-size: 18px;">Open to solving complex product challenges in SaaS and data systems.</p>

    <div class="contact-actions">
      <a href="mailto:govindusaiteja@gmail.com" class="btn-primary">Email Me</a>
      <a href="https://linkedin.com/in/saaiteja" target="_blank">LinkedIn</a>
      <a href="https://drive.google.com/file/d/1LGX02i3yq-JSN4P4GGxipDK1RtpTfTCP/view?usp=sharing" target="_blank">Resume</a>
      <a href="https://www.behance.net/saiteja83" target="_blank">Behance \u2197</a>
    </div>
  </section>'''

new_contact = '''  <!-- CONTACT -->
  <section id="contact" class="connect-section fade-in">
    <h2>Let\'s Connect</h2>
    <p>Open to solving complex product challenges in SaaS and data systems.</p>

    <div class="connect-actions">
      <a href="https://linkedin.com/in/saaiteja" target="_blank" class="primary-btn">LinkedIn</a>
      <a href="https://drive.google.com/file/d/1LGX02i3yq-JSN4P4GGxipDK1RtpTfTCP/view?usp=sharing" target="_blank" class="secondary-btn">Resume</a>
      <a href="mailto:govindusaiteja@gmail.com" class="secondary-btn">Get in touch</a>
      <a href="https://www.behance.net/saiteja83" target="_blank" class="secondary-btn">Behance \u2197</a>
    </div>
  </section>'''

html = html.replace(old_contact.replace('\n', '\r\n'), new_contact.replace('\n', '\r\n'))
html = html.replace(old_contact, new_contact)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html updated.")


# ===== FIX STYLES.CSS =====
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Fix grid opacity (softer)
css = css.replace(
    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);\r\n  background-size: 80px 80px;",
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);\r\n  background-size: 80px 80px;"
)
css = css.replace(
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);\r\n  background-size: 20px 20px;\r\n  opacity: 0.15;",
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);\r\n  background-size: 20px 20px;\r\n  opacity: 0.08;"
)

# 2. Add plasma dark overlay + canvas scale
css = css.replace(
    "#plasma-layer canvas {\r\n  filter: blur(40px);\r\n}",
    "#plasma-layer canvas {\r\n  filter: blur(60px);\r\n  transform: scale(1.2);\r\n}\r\n#plasma-layer::after {\r\n  content: '';\r\n  position: absolute;\r\n  inset: 0;\r\n  background: rgba(2, 6, 23, 0.6);\r\n  pointer-events: none;\r\n}"
)

# 3. Replace old hero-card / card-inner / card-glow with profile-card
old_hero_css = '''.hero-card {
  width: 320px;
  height: 420px;
  border-radius: 24px;
  background: linear-gradient(145deg, #0f172a, #1e293b);
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
  position: relative;
  overflow: hidden;
}'''
# Try both line ending styles
css = css.replace(old_hero_css.replace('\n', '\r\n'), '')
css = css.replace(old_hero_css, '')

old_card_glow = '''.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.15), transparent 50%);
  z-index: 1;
  pointer-events: none;
}'''
css = css.replace(old_card_glow.replace('\n', '\r\n'), '')
css = css.replace(old_card_glow, '')

# 4. Replace old approach CSS
old_approach_css = '''/* APPROACH */
.approach {
  background: radial-gradient(circle at center, rgba(0,100,255,0.15), transparent);
  border-radius: 30px;
  padding: 60px;
}
.approach-container {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, #0b1225, #111a35);
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.approach-center {
  background: #3b82f6;
  color: white;
  padding: 20px 40px;
  border-radius: 99px;
  font-size: 20px;
  font-weight: 600;
  z-index: 10;
  box-shadow: 0 20px 40px rgba(59,130,246,0.3);
  transform: translateY(var(--parallax-y, 0px));
}
.approach-float {
  position: absolute;
  padding: 12px 24px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 99px;
  color: #e2e8f0;
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite alternate;
}
.f1 { top: 12%; left: 8%; animation-delay: 0s; }
.f2 { top: 18%; right: 12%; animation-delay: 1s; }
.f3 { bottom: 18%; left: 5%; animation-delay: 2s; }
.f4 { bottom: 12%; right: 8%; animation-delay: 0.5s; }
.f5 { top: 55%; left: 5%; animation-delay: 1.5s; }
.f6 { bottom: 35%; right: 5%; animation-delay: 2.5s; }

@keyframes float {
  from { transform: translateY(calc(var(--parallax-y, 0px) + 0px)) rotate(0deg); }
  to { transform: translateY(calc(var(--parallax-y, 0px) - 15px)) rotate(2deg); }
}'''

new_approach_css = '''/* APPROACH / PROCESS */
.process-container {
  position: relative;
  height: 500px;
  border-radius: 24px;
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
}
.process-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0.4;
  pointer-events: none;
}
.process-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.process-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 18px 36px;
  border-radius: 999px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 0 40px rgba(59,130,246,0.4);
  z-index: 3;
  white-space: nowrap;
}
.pill {
  position: absolute;
  padding: 12px 20px;
  border-radius: 999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  color: #e2e8f0;
  font-size: 15px;
  font-weight: 500;
  z-index: 2;
  will-change: transform;
  transition: transform 0.4s ease, background 0.4s ease;
  animation: pill-float 6s ease-in-out infinite;
}
.pill:hover {
  transform: translateY(-4px) scale(1.03);
  background: rgba(255,255,255,0.1);
}
.p1 { top: 20%; left: 12%; animation-delay: 0s; }
.p2 { top: 42%; left: 8%; animation-delay: 0.8s; }
.p3 { top: 68%; left: 15%; animation-delay: 1.6s; }
.p4 { top: 18%; right: 12%; animation-delay: 0.4s; }
.p5 { top: 45%; right: 8%; animation-delay: 1.2s; }
.p6 { top: 72%; right: 10%; animation-delay: 2s; }

@keyframes pill-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.connection-line {
  position: absolute;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(59,130,246,0.3), transparent);
  z-index: 1;
  pointer-events: none;
  animation: pulseLine 3s infinite;
}
.cl1 { height: 80px; top: 35%; left: 25%; transform: rotate(25deg); }
.cl2 { height: 80px; top: 35%; right: 25%; transform: rotate(-25deg); }
.cl3 { height: 60px; bottom: 25%; left: 20%; transform: rotate(-15deg); }
.cl4 { height: 60px; bottom: 25%; right: 20%; transform: rotate(15deg); }

@keyframes pulseLine {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}'''

css = css.replace(old_approach_css.replace('\n', '\r\n'), new_approach_css.replace('\n', '\r\n'))
css = css.replace(old_approach_css, new_approach_css)

# 5. Replace old contact CSS
old_contact_css = '''/* CONTACT */
.contact {
  background: linear-gradient(180deg, #0b1225, #050a19);
  border-top: 1px solid rgba(255,255,255,0.08);
  text-align: center;
  padding: 100px 20px;
  margin-bottom: 0;
  max-width: 100%;
}
.contact h2 {
  text-align: center;
}
.contact-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}
.contact-actions a {
  padding: 14px 26px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: 0.3s;
}
.contact-actions a:hover {
  background: rgba(255,255,255,0.1);
}
.contact-actions a.btn-primary {
  background: white;
  color: black;
  border-color: white;
}
.contact-actions a.btn-primary:hover {
  background: #f1f5f9;
}'''

new_contact_css = '''/* CONTACT / CONNECT */
.connect-section {
  max-width: 1100px;
  margin: 0 auto;
  text-align: left;
  padding: 80px 24px;
}
.connect-section h2 {
  font-size: 42px;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
  text-align: left;
}
.connect-section p {
  font-size: 18px;
  color: rgba(255,255,255,0.7);
  max-width: 600px;
  margin-bottom: 32px;
}
.connect-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.primary-btn {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 14px 22px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  box-shadow: 0 8px 25px rgba(59,130,246,0.35);
  transition: all 0.3s ease;
  cursor: pointer;
}
.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(59,130,246,0.5);
}
.secondary-btn {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.2);
  background: transparent;
  color: white;
  padding: 14px 22px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}
.secondary-btn:hover {
  background: rgba(255,255,255,0.08);
}'''

css = css.replace(old_contact_css.replace('\n', '\r\n'), new_contact_css.replace('\n', '\r\n'))
css = css.replace(old_contact_css, new_contact_css)

# 6. Add profile-card CSS before SECTIONS
profile_css = '''
/* PROFILE CARD */
.profile-card {
  position: relative;
  width: 320px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}
.profile-card img {
  width: 100%;
  height: auto;
  display: block;
}
.profile-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.1), transparent);
  z-index: 1;
  pointer-events: none;
}
.profile-overlay {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
}
.profile-overlay h2 {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
}
.profile-overlay p {
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  margin-top: 4px;
}

'''

css = css.replace('/* SECTIONS */', profile_css + '/* SECTIONS */')
# If /* SECTIONS */ doesn't exist, insert before .section
if profile_css not in css:
    css = css.replace('.section, .featured', profile_css + '.section, .featured')

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("styles.css updated.")

print("\nAll 4 sections fixed!")
