"""Detecta skills, MCP, scripts y carpetas de proyectos y escribe auto.js.
La infografía suma como "Nuevo" lo que no esté ya en data.js. Corre solo al iniciar cada sesión de Claude."""
import json, os, re, datetime
from pathlib import Path

# BASE = carpeta de proyectos, tomada de "base" en data.js (si está vacía, la carpeta que contiene Infografia)
_b = re.search(r'base:\s*"([^"]*)"', Path(__file__).with_name("data.js").read_text(encoding="utf-8")).group(1)
BASE = Path(_b) if _b else Path(__file__).resolve().parent.parent
WS = BASE
HOME = Path.home() / ".claude"
OUT = Path(__file__).with_name("auto.js")

IGNORAR_RAIZ = {"Infografia", "_archivo", "respaldos"}
SALTAR = {"node_modules", ".git", ".venv", "venv", "__pycache__", "respaldos", "backups", "_archivo", ".next", "dist", "build"}
VER = [".html", ".pdf", ".mp4", ".pptx", ".pbip", ".rbxlx", ".docx", ".xlsx"]


def rel(p):
    return p.relative_to(BASE).as_posix()


def visibles(carpeta, maximo=3, profundidad=3):
    hallados = []
    for raiz, dirs, archivos in os.walk(carpeta):
        nivel = len(Path(raiz).relative_to(carpeta).parts)
        dirs[:] = [d for d in dirs if d not in SALTAR and not d.endswith((".SemanticModel", ".Report"))]
        if nivel >= profundidad:
            dirs[:] = []
        for a in archivos:
            ext = Path(a).suffix.lower()
            if ext in VER and not (ext == ".html" and ((Path(raiz) / "hyperframes.json").exists() or "Dev-respaldo" in Path(raiz).parts)):
                hallados.append((VER.index(ext), nivel, Path(raiz) / a))
    hallados.sort(key=lambda x: (x[0], x[1], str(x[2])))
    return [{"t": f.stem[:40], "r": rel(f)} for _, _, f in hallados[:maximo]]


def proyectos():
    carpetas = [d for d in BASE.iterdir() if d.is_dir() and d.name not in IGNORAR_RAIZ and not d.name.startswith(".")]
    out = []
    for d in sorted(carpetas, key=lambda x: x.name.lower()):
        try:
            out.append({"n": d.name.replace("-", " "), "ruta": rel(d), "tag": "Detectado",
                        "d": "Carpeta detectada automáticamente.", "ver": visibles(d)})
        except OSError:
            pass
    return out


def descripcion(skill_md):
    try:
        for linea in skill_md.read_text(encoding="utf-8").splitlines()[:15]:
            if linea.startswith("description:"):
                d = linea.split(":", 1)[1].strip().strip('"')
                return d[:220] + ("…" if len(d) > 220 else "")
    except OSError:
        pass
    return "Skill instalada."


def skills():
    d = HOME / "skills"
    return [{"id": s.name, "n": s.name, "d": descripcion(s / "SKILL.md"), "r": (s / "SKILL.md").as_posix()}
            for s in sorted(d.iterdir())
            if s.is_dir() and s.name != "synced" and (s / "SKILL.md").exists()] if d.exists() else []


def mcp():
    servidores = {}
    for f in (WS / ".mcp.json", Path.home() / ".claude.json"):
        try:
            for k in json.loads(f.read_text(encoding="utf-8")).get("mcpServers", {}):
                servidores[k] = f.as_posix()
        except (OSError, ValueError):
            pass
    return [{"id": k, "n": k, "d": "Servidor MCP configurado.", "r": servidores[k]} for k in sorted(servidores)]


def scripts():
    d = HOME / "scripts"
    return [{"id": f.name, "n": f.name, "d": "Script de orquestación.", "r": f.as_posix()}
            for f in sorted(d.glob("*.ps1"))] if d.exists() else []


def conectores():
    """Estado real de los conectores de claude.ai según Claude Code: activo o pendiente (falta autorizar)."""
    est = {}
    try:
        for k in json.loads((Path.home() / ".claude.json").read_text(encoding="utf-8")).get("claudeAiMcpEverConnected", []):
            est[k.replace("claude.ai ", "")] = "activo"
    except (OSError, ValueError):
        pass
    try:
        for k in json.loads((HOME / "mcp-needs-auth-cache.json").read_text(encoding="utf-8")):
            est[k.replace("claude.ai ", "")] = "pendiente"
    except (OSError, ValueError):
        pass
    return est


datos = {"generado": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
         "skills": skills(), "mcp": mcp(), "scripts": scripts(), "proyectos": proyectos(), "conectores": conectores()}
OUT.write_text("window.AUTO = " + json.dumps(datos, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
import sys
sys.path.insert(0, str(Path(__file__).with_name("generador")))
from chats import chats_js
OUT.with_name("chats.js").write_text(chats_js(OUT.with_name("data.js").read_text(encoding="utf-8")), encoding="utf-8")
print(f"auto.js: {len(datos['skills'])} skills, {len(datos['mcp'])} MCP, {len(datos['scripts'])} scripts, {len(datos['proyectos'])} proyectos")

