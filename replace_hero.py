import sys

with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '/* HERO */'
end_marker = '/* SECTIONS */'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    replacement = """/* HERO */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10%;
  background: radial-gradient(circle at 20% 20%, #0b1225, #050a19 80%);
  overflow: hidden;
}

.light-rays {
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from 180deg at 50% 0%,
    rgba(255,255,255,0.12),
    rgba(255,255,255,0.02),
    rgba(255,255,255,0.12)
  );
  filter: blur(100px);
  animation: rotateRays 20s linear infinite;
  pointer-events: none;
  z-index: 2;
}

@keyframes rotateRays {
  0% { transform: rotate(0deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1.2); }
}

.hero-noise {
  position: absolute;
  inset: 0;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  opacity: 0.05;
  pointer-events: none;
  z-index: 3;
}

#fluid {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 5;
  max-width: 600px;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(59,130,246,0.2);
  color: #3b82f6;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 64px;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  color: white;
  max-width: 700px;
  line-height: 1.1;
  letter-spacing: -1px;
  opacity: 0;
  transform: translateY(40px);
  animation: revealText 1s ease forwards;
}

.hero-sub {
  margin-top: 20px;
  font-size: 18px;
  color: #9ca3af;
  opacity: 0;
  transform: translateY(30px);
  animation: revealText 1s ease forwards 0.3s;
}

@keyframes revealText {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta {
  margin-top: 30px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary.magnetic, .btn-secondary.magnetic {
  will-change: transform;
}

.btn-primary {
  display: inline-block;
  background: white;
  color: black;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 500;
  transition: 0.2s;
  text-decoration: none;
  font-family: Inter, sans-serif;
  cursor: pointer;
  border: none;
}
.btn-primary:hover {
  box-shadow: 0 10px 30px rgba(255,255,255,0.2);
}

.btn-secondary {
  display: inline-block;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 14px 28px;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  transition: 0.2s;
  text-decoration: none;
  font-family: Inter, sans-serif;
  cursor: pointer;
}
.btn-secondary:hover {
  background: rgba(255,255,255,0.1);
}

.hero-visual {
  perspective: 1000px;
  z-index: 5;
}

.hero-card {
  width: 320px;
  height: 420px;
  border-radius: 24px;
  background: linear-gradient(145deg, #0f172a, #1e293b);
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
  position: relative;
  overflow: hidden;
}

.card-inner {
  padding: 30px;
  color: white;
  position: relative;
  z-index: 2;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.15), transparent 50%);
  z-index: 1;
  pointer-events: none;
}

"""
    new_content = content[:start_idx] + replacement + content[end_idx:]
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Success")
else:
    print("Markers not found")
