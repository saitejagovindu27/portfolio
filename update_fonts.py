import glob

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("font-family: 'Outfit', sans-serif;", "font-family: 'Satoshi', sans-serif;")
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace import
old_import = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700;800&display=swap');"
new_import = "@import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&display=swap');\n@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');"
css_content = css_content.replace(old_import, new_import)

# Replace Outfit usages
css_content = css_content.replace("'Outfit'", "'Satoshi'")

# Add the global h1, h2, h3 rule
global_rule = '''
body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3 {
  font-family: 'Satoshi', sans-serif;
  font-weight: 600;
}
'''
if 'h1, h2, h3 {' not in css_content:
    css_content = css_content.replace('body {\n  margin: 0;', global_rule + '\nbody {\n  margin: 0;')

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print('Updated fonts successfully.')
