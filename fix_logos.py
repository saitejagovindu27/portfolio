import glob

for fname in ['smartmap-case-study.html', 'bananaz-case-study.html', 'data-platform-case-study.html', 'mrv-case-study.html']:
    try:
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix logo to link to homepage
        content = content.replace(
            '<div class="logo">Sai Teja Govind</div>',
            '<div class="logo"><a href="index.html" style="color:inherit; text-decoration:none;">Sai Teja Govind</a></div>'
        )
        
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  {fname} logo fixed.")
    except Exception as e:
        print(f"  {fname} error: {e}")

print("Done.")
