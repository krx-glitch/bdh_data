$files = Get-ChildItem -Path "." -Filter "*.html"

$newFontSize = @"
            "fontSize": {
                    "h3": ["clamp(24px, 3vw, 32px)", {"lineHeight": "1.2", "letterSpacing": "0.02em", "fontWeight": "700"}],
                    "label-caps": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "600"}],
                    "h1": ["clamp(48px, 8vw, 80px)", {"lineHeight": "1.0", "letterSpacing": "-0.04em", "fontWeight": "800"}],
                    "body-md": ["16px", {"lineHeight": "1.5", "letterSpacing": "0", "fontWeight": "400"}],
                    "body-lg": ["clamp(16px, 2vw, 18px)", {"lineHeight": "1.6", "letterSpacing": "0", "fontWeight": "400"}],
                    "h2": ["clamp(32px, 5vw, 48px)", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}]
            }
"@

$newSpacing = @"
            "spacing": {
                    "unit": "8px",
                    "gutter": "24px",
                    "margin-edge": "clamp(16px, 4vw, 32px)",
                    "container-max": "1280px",
                    "section-gap": "clamp(60px, 10vw, 120px)"
            }
"@

$jsScript = @"
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
</body>
"@

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # 1. Update fontSize and spacing
    $content = [regex]::Replace($content, '"fontSize"\s*:\s*\{.*?\}', $newFontSize, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $content = [regex]::Replace($content, '"spacing"\s*:\s*\{.*?\}', $newSpacing, [System.Text.RegularExpressions.RegexOptions]::Singleline)

    # 2. Extract links
    $match = [regex]::Match($content, '<div class="hidden md:flex[^>]*>(.*?)</div>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($match.Success) {
        $desktopLinksHtml = $match.Groups[1].Value
        $aTags = [regex]::Matches($desktopLinksHtml, '(<a[^>]*>.*?</a>)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        
        $mobileLinksHtml = ""
        foreach ($tag in $aTags) {
            $modifiedTag = $tag.Groups[1].Value.Replace("font-label-caps", "font-h3").Replace("text-label-caps", "text-h3")
            $mobileLinksHtml += $modifiedTag + "`n"
        }

        # 3. Build Overlay
        $mobileOverlay = @"
<!-- Mobile Menu Overlay -->
<div id="mobile-menu" class="fixed inset-0 bg-surface/95 backdrop-blur-xl z-[45] flex flex-col pt-24 px-margin-edge pb-8 transform translate-x-full transition-transform duration-300 md:hidden overflow-y-auto">
    <div class="flex flex-col gap-8 items-center text-center mt-8">
        $mobileLinksHtml
        <button class="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-h3 text-body-md w-full max-w-xs mt-8 shadow-lg shadow-primary/20 interactive-3d" onclick="window.location.href='admissions.html'">
            Join a Class
        </button>
    </div>
</div>
"@
        
        # Remove existing md:hidden button
        $content = [regex]::Replace($content, '<button class="md:hidden[^>]*>.*?</button>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)

        # Set z-index
        $content = $content.Replace('<div class="flex justify-between items-center px-margin-edge py-4 w-full max-w-container-max mx-auto">', '<div class="flex justify-between items-center px-margin-edge py-4 w-full max-w-container-max mx-auto relative z-[50]">')

        # Add Hamburger
        $hamburgerBtn = @"
    <div class="flex items-center gap-4 md:hidden">
        <button id="mobile-menu-btn" class="text-primary hover:text-on-surface transition-colors p-2 z-[60]">
            <span class="material-symbols-outlined text-4xl">menu</span>
        </button>
    </div>
"@
        $replacement = "$hamburgerBtn</div>`n$mobileOverlay`n</nav>"
        $content = [regex]::Replace($content, '</div>\s*</nav>', $replacement, [System.Text.RegularExpressions.RegexOptions]::Singleline)

        # Hide desktop button on mobile
        $content = [regex]::Replace($content, '(<nav[^>]*>.*?)(<button[^>]*>.*?Join a Class.*?</button>)(.*?</nav>)', {
            param($m)
            $newBtn = $m.Groups[2].Value.Replace('class="', 'class="hidden md:block ')
            return $m.Groups[1].Value + $newBtn + $m.Groups[3].Value
        }, [System.Text.RegularExpressions.RegexOptions]::Singleline)

        # 4. Inject JS
        if (-not $content.Contains("<script>`n    document.addEventListener('DOMContentLoaded'")) {
            $content = $content.Replace("</body>", $jsScript)
        }

        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Updated $($file.Name)"
    } else {
        Write-Host "Skipping $($file.Name), no desktop menu found"
    }
}
