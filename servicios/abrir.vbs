' Lanzador sin ventana para el protocolo abrir: (evita el error 0xc0000142 de powershell oculto).
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
If WScript.Arguments.Count = 0 Then WScript.Quit 1
uri = Replace(WScript.Arguments(0), """", "")
ps1 = fso.BuildPath(fso.GetParentFolderName(WScript.ScriptFullName), "abrir.ps1")
log = sh.ExpandEnvironmentStrings("%TEMP%") & "\abrir.log"
Set f = fso.OpenTextFile(log, 8, True)
f.WriteLine Now & " | " & uri
f.Close
rc = sh.Run("cmd /c powershell.exe -NoProfile -ExecutionPolicy Bypass -File """ & ps1 & """ """ & uri & """ >> """ & log & """ 2>&1", 0, True)
Set f = fso.OpenTextFile(log, 8, True)
f.WriteLine "   rc=" & rc
f.Close
