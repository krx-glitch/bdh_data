import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# New tailwind config
new_colors = """            "colors": {
                    "primary": "#f05a28",
                    "on-primary": "#ffffff",
                    "primary-container": "#e8245e",
                    "on-primary-container": "#ffffff",
                    "secondary": "#6b2d86",
                    "on-secondary": "#ffffff",
                    "secondary-container": "#9b287b",
                    "on-secondary-container": "#ffffff",
                    "tertiary": "#f05a28",
                    "on-tertiary": "#ffffff",
                    "tertiary-container": "#e8245e",
                    "on-tertiary-container": "#ffffff",
                    "surface-container-lowest": "#0e0e0e",
                    "surface-container-low": "#1c1b1b",
                    "surface-container": "#201f1f",
                    "surface-container-high": "#2a2a2a",
                    "surface-container-highest": "#353534",
                    "surface": "#131313",
                    "on-surface": "#e5e2e1",
                    "surface-variant": "#353534",
                    "on-surface-variant": "#e5bcc4",
                    "background": "#131313",
                    "on-background": "#e5e2e1",
                    "outline": "#ac878f",
                    "outline-variant": "#5c3f45",
                    "error": "#ffb4ab",
                    "on-error": "#690005",
                    "error-container": "#93000a",
                    "on-error-container": "#ffdad6",
                    "inverse-surface": "#e5e2e1",
                    "inverse-on-surface": "#313030",
                    "inverse-primary": "#ffb1c3",
                    "secondary-fixed": "#6b2d86",
                    "secondary-fixed-dim": "#9b287b",
                    "on-secondary-fixed": "#ffffff",
                    "on-secondary-fixed-variant": "#ffffff"
            },"""

# Regex to find the colors object in tailwind config
colors_pattern = re.compile(r'"colors":\s*\{.*?\}(?=\s*,\s*"borderRadius"|\s*\})', re.DOTALL)

# Regex to find the logo text in nav
logo_pattern = re.compile(r'<a href="index\.html"[^>]*>\s*Bhopal Dance House\s*</a>', re.DOTALL)
new_logo = """<a href="index.html" class="hover:scale-105 transition-transform duration-200 block flex items-center">
                <img src="logo.png" alt="Bhopal Dance House Logo" class="h-12 w-auto" />
            </a>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace colors
    new_content = colors_pattern.sub(new_colors, content)
    
    # Replace logo
    new_content = logo_pattern.sub(new_logo, new_content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file}")
