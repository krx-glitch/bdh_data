import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

new_font_size = """            "fontSize": {
                    "h3": ["clamp(24px, 3vw, 32px)", {"lineHeight": "1.2", "letterSpacing": "0.02em", "fontWeight": "700"}],
                    "label-caps": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "600"}],
                    "h1": ["clamp(48px, 8vw, 80px)", {"lineHeight": "1.0", "letterSpacing": "-0.04em", "fontWeight": "800"}],
                    "body-md": ["16px", {"lineHeight": "1.5", "letterSpacing": "0", "fontWeight": "400"}],
                    "body-lg": ["clamp(16px, 2vw, 18px)", {"lineHeight": "1.6", "letterSpacing": "0", "fontWeight": "400"}],
                    "h2": ["clamp(32px, 5vw, 48px)", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}]
            }"""

new_spacing = """            "spacing": {
                    "unit": "8px",
                    "gutter": "24px",
                    "margin-edge": "clamp(16px, 4vw, 32px)",
                    "container-max": "1280px",
                    "section-gap": "clamp(60px, 10vw, 120px)"
            }"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update fontSize and spacing in Tailwind config
    content = re.sub(r'"fontSize"\s*:\s*\{.*?\}', new_font_size, content, flags=re.DOTALL)
    content = re.sub(r'"spacing"\s*:\s*\{.*?\}', new_spacing, content, flags=re.DOTALL)

    # 2. Extract links from desktop menu
    links_match = re.search(r'<div class="hidden md:flex[^>]*>(.*?)</div>', content, re.DOTALL)
    if not links_match:
        print(f"Skipping {file}, no desktop menu found")
        continue
    
    desktop_links_html = links_match.group(1)
    a_tags = re.findall(r'(<a[^>]*>.*?</a>)', desktop_links_html, re.DOTALL)
    
    mobile_links = []
    for tag in a_tags:
        # Increase font size for mobile overlay
        tag = tag.replace('font-label-caps', 'font-h3').replace('text-label-caps', 'text-h3')
        mobile_links.append(tag)
        
    mobile_links_html = "\n".join(mobile_links)

    # 3. Add mobile menu overlay before </nav>
    mobile_overlay = f"""
<!-- Mobile Menu Overlay -->
<div id="mobile-menu" class="fixed inset-0 bg-surface/95 backdrop-blur-xl z-[45] flex flex-col pt-24 px-margin-edge pb-8 transform translate-x-full transition-transform duration-300 md:hidden overflow-y-auto">
    <div class="flex flex-col gap-8 items-center text-center mt-8">
        {mobile_links_html}
        <button class="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-h3 text-body-md w-full max-w-xs mt-8 shadow-lg shadow-primary/20 interactive-3d" onclick="window.location.href='admissions.html'">
            Join a Class
        </button>
    </div>
</div>
"""
    
    # Remove existing mobile menu button if any (e.g., from about.html)
    content = re.sub(r'<button class="md:hidden[^>]*>.*?</button>', '', content, flags=re.DOTALL)
    
    # Ensure nav inner container has relative and z-index so it sits above the overlay
    content = content.replace('<div class="flex justify-between items-center px-margin-edge py-4 w-full max-w-container-max mx-auto">',
                              '<div class="flex justify-between items-center px-margin-edge py-4 w-full max-w-container-max mx-auto relative z-[50]">')
    
    hamburger_btn = """
    <div class="flex items-center gap-4 md:hidden">
        <button id="mobile-menu-btn" class="text-primary hover:text-on-surface transition-colors p-2 z-[60]">
            <span class="material-symbols-outlined text-4xl">menu</span>
        </button>
    </div>
"""
    
    # Replace the closing </div></nav> with hamburger, closing </div>, and overlay
    replacement = f'{hamburger_btn}</div>\n{mobile_overlay}\n</nav>'
    content = re.sub(r'</div>\s*</nav>', replacement, content)
    
    # Optional: ensure desktop join class button is hidden on mobile so we don't have two buttons
    # Just add hidden md:block to Join a Class buttons if they are inside nav
    # Wait, using regex for this is tricky. We can just let it be, but the mobile menu might look cluttered with two Join Class buttons.
    # We can hide all Join a Class buttons inside the nav on mobile:
    content = re.sub(r'(<nav[^>]*>.*?)(<button[^>]*>.*?Join a Class.*?</button>)(.*?</nav>)', lambda m: m.group(1) + m.group(2).replace('class="', 'class="hidden md:block ') + m.group(3), content, flags=re.DOTALL)

    # 4. Inject JS before </body>
    js_script = """
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        let isMenuOpen = false;

        if(mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                isMenuOpen = !isMenuOpen;
                if(isMenuOpen) {
                    mobileMenu.classList.remove('translate-x-full');
                    mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined text-4xl">close</span>';
                } else {
                    mobileMenu.classList.add('translate-x-full');
                    mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined text-4xl">menu</span>';
                }
            });
        }
    });
</script>
"""
    if '<script>' in js_script:
        content = content.replace('</body>', f'{js_script}\n</body>')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        print(f"Updated {file}")
