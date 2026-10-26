# Infografía «Cómo trabajo hoy» (kit)

Página que muestra con qué trabajas en Claude Code: herramientas, IAs, conectores, skills, scripts y proyectos, con panel de salud, panel de uso y botones que abren tus archivos. Diseño Aurora 2.

| Archivo | Qué es |
|---|---|
| `index.html`, `app.js`, `logos.js` | La página. No se editan. |
| `data.js` | **Tu contenido**: nombre, rol, rutas (`base`, `home`) y tus herramientas y proyectos. |
| `actualizar.py` | Detecta tus skills, MCP, scripts, proyectos y chats y escribe `auto.js` y `chats.js`. |
| `servicios/` | Abridor (`abrir.ps1`, `abrir.vbs`), servicio local 127.0.0.1:8799 (`abrir-servicio.py`), panel de uso (`uso-tokens.py`) e `instalar.ps1`. |

Instalar: completa `data.js`, luego

```
python actualizar.py
powershell -NoProfile -ExecutionPolicy Bypass -File servicios\instalar.ps1
```

y abre `index.html`.
