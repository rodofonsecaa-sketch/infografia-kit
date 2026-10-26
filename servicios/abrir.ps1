param([string]$Uri)
$inf = Split-Path $PSScriptRoot -Parent
$base = ([regex]::Match((Get-Content (Join-Path $inf 'data.js') -Raw -Encoding UTF8), 'base:\s*"([^"]*)"').Groups[1].Value -replace '/', '\').TrimEnd('\')
if (-not $base) { $base = Split-Path $inf -Parent }
# Accion fija abrir:actualizar -> lee todo Claude en VS Code (actualizar.py) y abre la infografia local. Sin argumentos externos.
if ($Uri -match '^abrir:/*actualizar(-local)?/?$') {
  python (Join-Path $inf 'actualizar.py') | Out-Null
  if ($Uri -notmatch 'local') { Invoke-Item (Join-Path $inf 'index.html') }
  exit 0
}
# Acciones fijas abrir:dash-<id> -> levantan un dashboard Streamlit (si no corre) y lo abren en el navegador. Tabla cerrada, sin argumentos externos.
$dash = @{
  # 'dash-<id>' = @('<carpeta del proyecto>', '<app>.py', <puerto>)
}
if ($Uri -match '^abrir:/*([a-z-]+)/?$' -and $dash.ContainsKey($Matches[1])) {
  $d = $dash[$Matches[1]]
  $dir = Join-Path $base $d[0]
  if (-not (Get-NetTCPConnection -LocalPort $d[2] -State Listen -ErrorAction SilentlyContinue)) {
    Start-Process python -ArgumentList '-m','streamlit','run',$d[1],'--server.address','127.0.0.1','--server.port',$d[2],'--server.headless','true' -WorkingDirectory $dir -WindowStyle Minimized
    Start-Sleep -Seconds 7
  }
  Start-Process ('http://127.0.0.1:' + $d[2])
  exit 0
}
# Abre archivos y carpetas desde enlaces abrir:<ruta> (infografia). Solo dentro de las raices permitidas; nunca ejecuta programas.
$ruta = [Uri]::UnescapeDataString(($Uri -replace '^abrir:/*', '')) -replace '/', '\'
$full = [IO.Path]::GetFullPath($ruta.TrimEnd('\'))
$raices = @($base, (Join-Path $env:USERPROFILE '.claude'), (Join-Path $env:USERPROFILE '.orca'))
if (-not ($raices | Where-Object { $full.StartsWith($_, [StringComparison]::OrdinalIgnoreCase) })) { exit 1 }
if (-not (Test-Path -LiteralPath $full)) { exit 1 }
$ext = [IO.Path]::GetExtension($full).ToLower()
if ((Test-Path -LiteralPath $full -PathType Leaf) -and $ext -in '.exe', '.msi', '.lnk', '.scr', '.com', '.url') { exit 1 }
$texto = '.ps1', '.py', '.js', '.cmd', '.bat', '.vbs', '.sh', '.ts', '.md', '.json', '.tmdl', '.log', '.txt', '.css', '.yml', '.yaml', '.toml', '.sql'
if ((Test-Path -LiteralPath $full -PathType Leaf) -and $texto -contains $ext) {
  Start-Process code -ArgumentList "`"$full`"" -WindowStyle Hidden
} else {
  Invoke-Item -LiteralPath $full
}
