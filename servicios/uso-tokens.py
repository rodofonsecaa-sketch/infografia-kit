"""Suma los tokens de Claude Code por dia leyendo los historiales (~/.claude/projects/*/*.jsonl) y escribe uso.js en la infografia.
Usa cache por archivo (tamano) para que las siguientes corridas sean rapidas."""
import os, json, glob, datetime
HOME = os.path.expanduser("~")
RAIZ = os.path.join(HOME, ".claude", "projects")
SALIDA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uso.js")
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uso-tokens.cache.json")

def dia_local(ts):
    d = datetime.datetime.fromisoformat(ts.replace("Z", "+00:00"))
    return d.astimezone().strftime("%Y-%m-%d")

def leer(path):
    msgs = {}
    with open(path, encoding="utf-8", errors="ignore") as f:
        for ln in f:
            if '"usage"' not in ln or '"assistant"' not in ln: continue
            try: r = json.loads(ln)
            except Exception: continue
            m = r.get("message") or {}
            u = m.get("usage")
            if not u or not r.get("timestamp"): continue
            msgs[m.get("id") or r.get("uuid")] = (dia_local(r["timestamp"]), u.get("input_tokens", 0) or 0, u.get("output_tokens", 0) or 0,
                                                  u.get("cache_creation_input_tokens", 0) or 0, u.get("cache_read_input_tokens", 0) or 0)
    dias = {}
    for d, i, o, cc, cr in msgs.values():
        x = dias.setdefault(d, [0, 0, 0, 0, 0])
        x[0] += i; x[1] += o; x[2] += cc; x[3] += cr; x[4] += 1
    return dias

def ias():
    f = os.path.join(HOME, ".claude", "scripts", "cascada.log"); por = {}
    if os.path.exists(f):
        for ln in open(f, encoding="utf-8-sig", errors="ignore"):
            c = ln.rstrip().split(chr(9))
            if len(c) >= 4 and c[2]: por[c[2]] = por.get(c[2], 0) + 1
    return por

def main():
    try: cache = json.load(open(CACHE))
    except Exception: cache = {}
    nuevo, tot, proy = {}, {}, {}
    for p in glob.glob(os.path.join(RAIZ, "*", "*.jsonl")) + glob.glob(os.path.join(RAIZ, "*", "*", "subagents", "*.jsonl")):
        k = p
        try: tam = os.path.getsize(p)
        except OSError: continue
        if k in cache and cache[k]["t"] == tam: ent = cache[k]
        else:
            try: ent = {"t": tam, "d": leer(p)}
            except OSError: continue
        nuevo[k] = ent
        rel = os.path.relpath(p, RAIZ).split(os.sep)
        pn = rel[1] if len(rel) > 2 else os.path.splitext(rel[1])[0]
        for d, v in ent["d"].items():
            x = tot.setdefault(d, [0, 0, 0, 0, 0])
            for j in range(5): x[j] += v[j]
            y = proy.setdefault(pn, {}).setdefault(d, [0, 0, 0, 0, 0])
            for j in range(5): y[j] += v[j]
    json.dump(nuevo, open(CACHE, "w"))
    out = {"generado": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), "campos": ["entrada", "salida", "cache_escritura", "cache_lectura", "mensajes"], "dias": dict(sorted(tot.items())), "sesiones": proy, "ias": ias()}
    open(SALIDA, "w", encoding="utf-8").write("window.USO=" + json.dumps(out, ensure_ascii=False) + ";\n")
    print(len(tot), "dias", sum(v[4] for v in tot.values()), "mensajes")

if __name__ == "__main__":
    main()
