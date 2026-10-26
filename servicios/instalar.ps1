param([string]$Protocolo = 'abrir', [string]$Sufijo = '')
# Instala los módulos locales de la infografía: protocolo abrir: (botones "Abrir en mi PC"),
# servicio local 127.0.0.1:8799 (panel de salud y botones) al iniciar sesión, y actualización cada minuto.
$ErrorActionPreference = 'Stop'
$srv = $PSScriptRoot
$inf = Split-Path $srv -Parent
$pyw = (Get-Command pythonw -ErrorAction SilentlyContinue).Source
if (-not $pyw) { $pyw = Join-Path (Split-Path (Get-Command python).Source) 'pythonw.exe' }
if (-not (Test-Path $pyw)) { throw "No encuentro pythonw.exe" }

# Protocolo abrir:
$k = "HKCU:\Software\Classes\$Protocolo"
New-Item "$k\shell\open\command" -Force | Out-Null
Set-ItemProperty $k '(default)' "URL:$Protocolo"
Set-ItemProperty $k 'URL Protocol' ''
Set-ItemProperty "$k\shell\open\command" '(default)' "wscript.exe //B //Nologo `"$srv\abrir.vbs`" `"%1`""

# Servicio local al iniciar sesión (si la tarea no se puede crear sin administrador, va a la carpeta Inicio)
$nSrv = "AbrirServicioInfografia$Sufijo"
$set = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0
try {
  Register-ScheduledTask $nSrv -Action (New-ScheduledTaskAction $pyw "`"$srv\abrir-servicio.py`"") `
    -Trigger (New-ScheduledTaskTrigger -AtLogOn -User "$env:USERDOMAIN\$env:USERNAME") -Settings $set -Force | Out-Null
  Start-ScheduledTask $nSrv
  $modo = "tarea $nSrv"
} catch {
  $ini = Join-Path ([Environment]::GetFolderPath('Startup')) "$nSrv.vbs"
  Set-Content $ini "CreateObject(""WScript.Shell"").Run """"""$pyw"""" """"$srv\abrir-servicio.py"""""", 0, False" -Encoding ASCII
  Start-Process $pyw "`"$srv\abrir-servicio.py`""
  $modo = "carpeta Inicio"
}

# Actualización cada minuto
$nAct = "InfografiaActualizar$Sufijo"
$set2 = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 2)
$tr = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask $nAct -Action (New-ScheduledTaskAction $pyw "`"$inf\actualizar.py`"" -WorkingDirectory $inf) -Trigger $tr -Settings $set2 -Force | Out-Null

"OK: protocolo $Protocolo`:, servicio ($modo), actualización cada minuto ($nAct)"
