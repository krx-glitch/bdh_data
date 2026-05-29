$files = Get-ChildItem -Path "." -Filter "*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace Courses links
    $content = $content -replace 'href="#">Courses<', 'href="courses.html">Courses<'
    
    # Replace About links
    $content = $content -replace 'href="#">About<', 'href="about.html">About<'
    
    # Replace Instructors links
    $content = $content -replace 'href="#">Instructors<', 'href="instructors.html">Instructors<'
    
    # Replace Location/Contact links
    $content = $content -replace 'href="#">Location: Arera Colony, Bhopal<', 'href="contact.html">Location: Arera Colony, Bhopal<'
    $content = $content -replace 'href="#">Contact Us<', 'href="contact.html">Contact Us<'
    
    # Update buttons
    $content = $content -replace '<button([^>]*)>(\s*)Join a Class', '<button$1 onclick="window.location.href=''admissions.html''">$2Join a Class'
    $content = $content -replace '<button([^>]*)>(\s*)Enroll Now', '<button$1 onclick="window.location.href=''admissions.html''">$2Enroll Now'
    $content = $content -replace '<button([^>]*)>(\s*)Book Trial Class', '<button$1 onclick="window.location.href=''admissions.html''">$2Book Trial Class'
    $content = $content -replace '<button([^>]*)>(\s*)View Courses', '<button$1 onclick="window.location.href=''courses.html''">$2View Courses'
    $content = $content -replace '<button([^>]*)>(\s*)Our Philosophy', '<button$1 onclick="window.location.href=''about.html''">$2Our Philosophy'
    $content = $content -replace '<button([^>]*)>(\s*)View Schedule', '<button$1 onclick="window.location.href=''courses.html''">$2View Schedule'
    $content = $content -replace '<button([^>]*)>(\s*)Book Orientation', '<button$1 onclick="window.location.href=''contact.html''">$2Book Orientation'
    $content = $content -replace '<button([^>]*)>(\s*)View All Styles', '<button$1 onclick="window.location.href=''courses.html''">$2View All Styles'

    # Update Logo to Home
    $content = $content -replace '<div class="font-h2 text-h3 font-extrabold text-primary tracking-tighter">(\s*)Bhopal Dance House(\s*)</div>', '<a href="index.html" class="font-h2 text-h3 font-extrabold text-primary tracking-tighter hover:scale-105 transition-transform duration-200 block">$1Bhopal Dance House$2</a>'
    $content = $content -replace '<a class="font-h2 text-h3 font-extrabold text-primary tracking-tighter" href="#">Bhopal Dance House</a>', '<a class="font-h2 text-h3 font-extrabold text-primary tracking-tighter hover:scale-105 transition-transform duration-200 block" href="index.html">Bhopal Dance House</a>'
    $content = $content -replace '<a class="font-h2 text-h3 text-primary mb-6 block" href="#">Bhopal Dance House</a>', '<a class="font-h2 text-h3 text-primary mb-6 block hover:scale-105 transition-transform duration-200" href="index.html">Bhopal Dance House</a>'
    $content = $content -replace '<a class="font-h2 text-h3 font-extrabold text-primary tracking-tighter hover:scale-105 transition-transform duration-200" href="#">Bhopal Dance House</a>', '<a class="font-h2 text-h3 font-extrabold text-primary tracking-tighter hover:scale-105 transition-transform duration-200 block" href="index.html">Bhopal Dance House</a>'
    
    # Extra links in about
    $content = $content -replace 'href="#">(\s*)LEARN MORE', 'href="courses.html">$1LEARN MORE'
    $content = $content -replace 'href="#">(\s*)PAST EVENTS', 'href="about.html">$1PAST EVENTS'
    $content = $content -replace 'href="#">(\s*)GET INVOLVED', 'href="contact.html">$1GET INVOLVED'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
