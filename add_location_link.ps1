$files = Get-ChildItem -Path "." -Filter "*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newLink = "`n<a class=`"text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps hover:scale-105 transition-transform duration-200`" href=`"contact.html`">Location</a>"
    $content = $content -replace 'href="instructors.html">Instructors</a>', "href=`"instructors.html`">Instructors</a>$newLink"
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
