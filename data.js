// Datos de la infografía. Para sumar algo nuevo: agrega una línea {n, d, e} en la categoría que corresponda.
// e = activo | respaldo | pendiente | descartado. Rutas relativas a "base"; las que parten con C:/ son absolutas.
// En proyectos: ruta = carpeta, ver = archivos para visualizar [{t: etiqueta, r: ruta}].
// Ítem completo: {n:"Nombre", ap:{a:"A qué se dedica", c:["Cómo me ayuda 1","Cómo me ayuda 2"], u:"Cuándo lo uso"}, logo:"claude", tag:"IA", d:"Descripción corta", e:"activo"}
window.DATA = {
  titulo: "Cómo trabajo hoy",
  autor: "Nombre Apellido",
  rol: "Mi área",
  actualizado: "2026-10-26",
  linea: [
    {f:"2026-10-26", t:"Armé mi infografía"}
  ],

  abridor: false,
  base: "",
  home: "",
  estados: {activo:"Activo", respaldo:"Respaldo", pendiente:"Pendiente", descartado:"Descartado"},

  // Flujo de orquestación (vista "Cómo se mueve una tarea")
  flujo: {
    roles: [
      {id:"analista", nombre:"Analista", hace:"Lee, resume, investiga, desglosa tareas", cadena:[["Claude","—"]]},
      {id:"programador", nombre:"Programador", hace:"Código, scripts, SQL, DAX, tests", cadena:[["Claude","—"]]},
      {id:"revisor", nombre:"Revisor", hace:"Segunda opinión, casos borde, seguridad", cadena:[["Claude","—"]]}
    ],
    auditor: [
      ["Código","Lo ejecuto con casos de prueba conocidos"],
      ["Cifras","Las cuadro contra la fuente"],
      ["Hechos y nombres","Los verifico antes de usarlos"]
    ]
  },

  // Marco de trabajo
  marco: {
    tallas: [
      ["S","Pequeña","Ajuste puntual. Se hace directo y se verifica."],
      ["M","Mediana","Cambio acotado. Plan breve y prueba de lo afectado."],
      ["L","Grande","Varios archivos o lógica crítica. Plan completo y revisión antes de publicar."]
    ],
    ciclo: ["Pedido","Clasificar S/M/L","Planificar","Construir","Cuadrar datos","Revisar","Publicar"],
    principios: [
      "Cuadrar los datos contra la fuente. Nunca inventar un dato.",
      "Respaldo antes de sobrescribir.",
      "Sin secretos en el código.",
      "Reutilizar antes de crear.",
      "La IA propone; yo decido.",
      "Ante la duda, detenerse y preguntar."
    ],
    docs: [],
    carpeta: ""
  },

  categorias: [
    {id:"claude", nombre:"Claude", grupo:"Herramientas", color:"#d9773f", desc:"Todo lo que tengo armado dentro de Claude", items:[]},
    {id:"ia", nombre:"IAs externas", grupo:"Herramientas", color:"#e4572e", desc:"Otras IAs que uso", items:[]},
    {id:"orq", nombre:"Scripts de orquestación", grupo:"Herramientas", color:"#e8a317", desc:"Scripts que reparten el trabajo", items:[]},
    {id:"ahorro", nombre:"Ahorro de tokens", grupo:"Herramientas", color:"#2fb39a", desc:"Cómo cuido el cupo de uso", items:[]},
    {id:"mcp", nombre:"MCP y conectores", grupo:"Herramientas", color:"#1f9e89", desc:"Herramientas conectadas a Claude", items:[]},
    {id:"api", nombre:"APIs y servicios", grupo:"Herramientas", color:"#3b6fd8", desc:"Datos y servicios en la nube", items:[]},
    {id:"img", nombre:"Imagen", grupo:"Creación", color:"#d6408b", desc:"Generar y editar imágenes", items:[]},
    {id:"aud", nombre:"Audio", grupo:"Creación", color:"#8a5cf0", desc:"Voz, música y sonido", items:[]},
    {id:"vid", nombre:"Video", grupo:"Creación", color:"#e03c3c", desc:"Producción de video", items:[]},
    {id:"skills", nombre:"Skills", grupo:"Herramientas", color:"#b0763a", desc:"Recetas que Claude carga según la tarea", items:[]},
    {id:"dat", nombre:"Datos y desarrollo", grupo:"Herramientas", color:"#5a9e3a", desc:"Herramientas del día a día", items:[]},
    {id:"pro", nombre:"Proyectos", grupo:"Proyectos", color:"#0f8fb0", desc:"Lo que estoy construyendo", items:[]}
  ]
};
