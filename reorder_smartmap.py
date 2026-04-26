with open('smartmap-case-study.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract sections
# 1. How I Evaluated (with the image after it)
import re
eval_pattern = r'(    <!-- SECTION: How I Evaluated -->.*?<img src="assets/smartmap/screen1.png".*?/>\n)'
eval_match = re.search(eval_pattern, content, flags=re.DOTALL)
if eval_match:
    eval_text = eval_match.group(1)
    # Remove eval_text from content
    content = content.replace(eval_text, '')
    
    # Extract The Problem
    prob_pattern = r'(    <!-- SECTION: The Problem -->.*?<img src="assets/smartmap/screen2.png".*?/>\n)'
    prob_match = re.search(prob_pattern, content, flags=re.DOTALL)
    
    if prob_match:
        prob_text = prob_match.group(1)
        # Put eval_text AFTER prob_text
        content = content.replace(prob_text, prob_text + '\n' + eval_text)
        
        with open('smartmap-case-study.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully repositioned sections.")
    else:
        print("Could not find The Problem section.")
else:
    print("Could not find How I Evaluated section.")
