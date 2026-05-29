@echo off
setlocal
set PORT=8080

echo ======================================================
echo          BHOPAL DANCE HOUSE - SITE PREVIEW
echo ======================================================
echo.
echo  Starting local preview server...
echo  Please keep this window open while viewing the site.
echo.

:: Check if port is already in use, if so, increment
powershell -Command "while (Get-NetTCPConnection -LocalPort %PORT% -ErrorAction SilentlyContinue) { $global:PORT++; Write-Host 'Port %PORT% busy, trying next...' }"

:: Start the server in the background and open browser
start "" "http://localhost:%PORT%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$listener = New-Object System.Net.HttpListener; ^
$listener.Prefixes.Add('http://localhost:%PORT%/'); ^
try { $listener.Start(); } catch { Write-Host 'Error: Could not start server. Please close other preview windows.'; pause; exit; } ^
Write-Host '--- Server is Live at http://localhost:%PORT%/ ---'; ^
Write-Host 'Press Ctrl+C to stop the preview.'; ^
while ($listener.IsListening) { ^
    $context = $listener.GetContext(); ^
    $request = $context.Request; ^
    $response = $context.Response; ^
    $path = $request.Url.LocalPath; ^
    if ($path -eq '/') { $path = '/index.html' } ^
    $fullPath = Join-Path $PWD $path; ^
    if (Test-Path $fullPath -PathType Leaf) { ^
        $buffer = [System.IO.File]::ReadAllBytes($fullPath); ^
        if ($path.EndsWith('.html')) { $response.ContentType = 'text/html; charset=utf-8' } ^
        elseif ($path.EndsWith('.css')) { $response.ContentType = 'text/css' } ^
        elseif ($path.EndsWith('.js')) { $response.ContentType = 'application/javascript' } ^
        elseif ($path.EndsWith('.jpg') -or $path.EndsWith('.jpeg')) { $response.ContentType = 'image/jpeg' } ^
        elseif ($path.EndsWith('.png')) { $response.ContentType = 'image/png' } ^
        elseif ($path.EndsWith('.mov')) { $response.ContentType = 'video/quicktime' } ^
        elseif ($path.EndsWith('.mp4')) { $response.ContentType = 'video/mp4' } ^
        elseif ($path.EndsWith('.svg')) { $response.ContentType = 'image/svg+xml' } ^
        $response.ContentLength64 = $buffer.Length; ^
        $response.OutputStream.Write($buffer, 0, $buffer.Length); ^
    } else { $response.StatusCode = 404; } ^
    $response.Close(); ^
}"

pause
