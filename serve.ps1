# Local preview: run this file, then open http://127.0.0.1:8788/
$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot
Write-Host "Site root: $PWD"
Write-Host "Open: http://127.0.0.1:8788/   (Ctrl+C to stop)"
if (Get-Command python -ErrorAction SilentlyContinue) { python -m http.server 8788 --directory . }
elseif (Get-Command py -ErrorAction SilentlyContinue) { py -m http.server 8788 --directory . }
else { Write-Host "Python not found. Use any static server, e.g. npx serve ." }
