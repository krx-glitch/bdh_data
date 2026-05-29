param(
    [int]$Port = 8080
)

$ErrorActionPreference = "Stop"
$Root = (Get-Location).Path
$RootPrefix = $Root.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar

function Get-MimeType {
    param([string]$Path)

    switch -Regex ($Path.ToLowerInvariant()) {
        "\.html?$" { return "text/html; charset=utf-8" }
        "\.css$" { return "text/css; charset=utf-8" }
        "\.js$" { return "application/javascript; charset=utf-8" }
        "\.jpe?g$" { return "image/jpeg" }
        "\.png$" { return "image/png" }
        "\.webp$" { return "image/webp" }
        "\.svg$" { return "image/svg+xml" }
        "\.mp4$" { return "video/mp4" }
        "\.mov$" { return "video/quicktime" }
        default { return "application/octet-stream" }
    }
}

function Write-Response {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$Status,
        [string]$Reason,
        [byte[]]$Body,
        [string]$ContentType = "text/plain; charset=utf-8"
    )

    $header = "HTTP/1.1 $Status $Reason`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nConnection: close`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    try {
        $Stream.Write($headerBytes, 0, $headerBytes.Length)
        if ($Body.Length -gt 0) {
            $Stream.Write($Body, 0, $Body.Length)
        }
    } catch [System.IO.IOException] {
        # Browsers can cancel image/script requests while navigating; keep serving.
    }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
Write-Host "Serving $Root at http://localhost:$Port/"
Write-Host "Press Ctrl+C to stop the preview."

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $client.ReceiveTimeout = 3000
            $client.SendTimeout = 5000
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
            $requestLine = $reader.ReadLine()

            if ([string]::IsNullOrWhiteSpace($requestLine)) {
                continue
            }

            $parts = $requestLine -split " "
            if ($parts.Length -lt 2 -or $parts[0] -ne "GET") {
                $body = [System.Text.Encoding]::UTF8.GetBytes("Method not allowed")
                Write-Response $stream 405 "Method Not Allowed" $body
                continue
            }

            while ($reader.Peek() -gt -1) {
                $line = $reader.ReadLine()
                if ([string]::IsNullOrEmpty($line)) { break }
            }

            $urlPath = [System.Uri]::UnescapeDataString(($parts[1] -split "\?")[0])
            if ($urlPath -eq "/") { $urlPath = "/index.html" }
            $relativePath = $urlPath.TrimStart("/") -replace "/", [System.IO.Path]::DirectorySeparatorChar
            $candidate = Join-Path $Root $relativePath

            if (Test-Path -LiteralPath $candidate -PathType Leaf) {
                $resolved = (Resolve-Path -LiteralPath $candidate).Path
                if ($resolved.StartsWith($RootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
                    $bytes = [System.IO.File]::ReadAllBytes($resolved)
                    Write-Response $stream 200 "OK" $bytes (Get-MimeType $resolved)
                } else {
                    $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
                    Write-Response $stream 404 "Not Found" $body
                }
            } else {
                $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
                Write-Response $stream 404 "Not Found" $body
            }
        } catch [System.IO.IOException] {
            # Ignore incomplete or abandoned browser connections.
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
