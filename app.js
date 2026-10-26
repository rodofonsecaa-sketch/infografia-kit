(function(){
let D=window.DATA,A=window.AUTO||{},ALL=[];const L=window.LOGOS||{_mono:{}},CFG=window.CFG||{};
const LOCAL=location.protocol==='file:';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s).toLowerCase().replace(/\\/g,'/').replace(/\/+$/,'');
const cat=id=>D.categorias.find(c=>c.id===id);
document.body.className=CFG.body||'';

const byName=(i,x)=>(i.ids||[]).includes(x.id)||norm(i.n)===norm(x.n);
const byRuta=(i,x)=>i.ruta&&norm(i.ruta)===norm(x.ruta);
const every=()=>D.categorias.flatMap(c=>c.items);
function init(){
D=window.DATA;A=window.AUTO||{};
[['skills',A.skills,byName],['mcp',A.mcp,byName],['orq',A.scripts,byName],['pro',A.proyectos,byRuta]].forEach(([id,list,f])=>{
  const c=cat(id);if(!c||!list)return;
  list.forEach(x=>{
    const hit=(id==='pro'?c.items:every()).filter(i=>f(i,x));
    if(!hit.length)c.items.push({n:x.n,d:x.d,e:'activo',tag:'Nuevo',ruta:x.ruta,ver:x.ver,inc:x.r?[x]:null});
    else if(x.r)hit.forEach(i=>(i.inc=i.inc||[]).push(x));
  });
});
ALL=[];D.categorias.forEach(c=>c.items.forEach(i=>{i.cat=c;i.k=ALL.length;ALL.push(i)}));
const SK=ALL.find(i=>/^Skills/.test(i.n)&&i.cat.id==='claude');if(SK&&A.skills)SK.inc=A.skills;
const CN=A.conectores||{},cn=p=>{const k=Object.keys(CN).find(k=>k===p||k.startsWith(p)||k.endsWith(p));return k&&CN[k]};
ALL.forEach(i=>{if(!['mcp','img','vid'].includes(i.cat.id))return;const ps=i.n.split(' · ').map(p=>[p,cn(p)]);if(!ps.every(x=>x[1]))return;
  const on=ps.filter(x=>x[1]==='activo');
  if(on.length===ps.length){i.e='activo';i.d=i.d.replace(/[;,] ?(conectad[oa]s, )?falta iniciar sesión para usarl[oa]s/,'').replace(/; disponibles, sin uso/,'')}
  else{i.e='pendiente';if(on.length)i.d+=' Ya activo: '+on.map(x=>x[0]).join(', ')+'.'}});
}
init();
const hhmm=d=>d.toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
function sello(){const s=$('#stamp');if(s)s.innerHTML='Última actualización <b>'+hhmm(new Date())+'</b> · datos '+esc(D.actualizado)+(A.generado?' · detección '+esc(A.generado):'')}
const carga=f=>new Promise(r=>{const s=document.createElement('script');s.src=f+'?t='+Date.now();s.onload=()=>{s.remove();r()};s.onerror=()=>{s.remove();r()};document.head.appendChild(s)});
function recargar(manual){
  const b=$('#refresh');if(b)b.classList.add('spin');
  if(manual&&D.abridor){if(LOCAL)fetch('http://127.0.0.1:8799/abrir?u=abrir:actualizar-local',{mode:'no-cors'}).catch(()=>{location.href='abrir:actualizar-local'});else{const a=document.createElement('a');a.href='abrir:actualizar-local';a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()}toast(LOCAL?'Leyendo todo Claude en VS Code…':'Actualizando en tu PC sin salir de esta página; los cambios llegan aquí en la próxima publicación');if(LOCAL)return setTimeout(()=>recargar(0),6000)}
  (LOCAL?Promise.all([carga('data.js'),carga('auto.js'),carga('chats.js'),carga('uso.js')]):Promise.resolve()).then(()=>{
    if(LOCAL&&window.DATA!==D)init();
    nav();if($('#sheet').hidden&&!$('#q').value.trim())go(view,1);
    sello();if(b)setTimeout(()=>b.classList.remove('spin'),500);
    if(manual)toast(LOCAL?'Datos recargados':'Vista actualizada; los datos nuevos llegan al republicar');
  });
}

const SC={activo:'var(--ok)',respaldo:'var(--info)',pendiente:'var(--warn)',descartado:'var(--off)'};
const lum=h=>{h=String(h).replace('#','');if(h.length!==6)return .5;const n=parseInt(h,16);return(.299*(n>>16&255)+.587*(n>>8&255)+.114*(n&255))/255};
const ini=n=>String(n).replace(/[^\p{L}\p{N} ]/gu,'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
function lg(s,c,n,cls){
  let hex,inner,m='';
  if(s&&L._color&&L._color[s]){hex=(L[s]||L._mono[s]||['#fff'])[0];inner=L._color[s];m=' full'}
  else if(s&&s!=='_mono'&&L[s]){hex=L[s][0];inner='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+L[s][1]+'"/></svg>'}
  else{const mm=s&&L._mono&&L._mono[s];hex=mm?mm[0]:c.color;inner='<b>'+esc(mm?mm[1]:ini(n))+'</b>';m=' mono'}
  return '<span class="lg'+m+(m===' full'?'':m?(lum(hex)<.22?' dk':''):lum(hex)>.78?' lt':' br')+(cls?' '+cls:'')+'" style="--c:'+hex+'" title="'+esc(n)+'">'+inner+'</span>';
}
const slugs=i=>[].concat(i.logo||[null]);
const lgs=(i,cls)=>slugs(i).slice(0,3).map(s=>lg(s,i.cat,i.n,cls)).join('');
const chip=e=>'<span class="chip" style="--sc:'+(SC[e]||'var(--mut)')+'">'+esc(D.estados[e]||e)+'</span>';
const tag=i=>i.tag?'<span class="tag">'+esc(i.tag)+'</span>':'';
const ext=r=>(r.split('.').pop()||'').toUpperCase();
const full=r=>/^[A-Za-z]:\//.test(r)?r:r.startsWith('~/')?(D.home||'')+r.slice(2):D.base+r;
const ab=()=>LOCAL&&D.abridor;
const url=r=>(ab()?'abrir:':'file:///')+encodeURI(full(r));
const PC=/\.(pbip|pbix|pptx|docx|xlsx|rbxlx)$/i;
const pc=r=>!LOCAL&&D.abridor&&PC.test(r);
const pclink=(r,t,cls)=>'<a class="btn'+(cls?' '+cls:'')+'" href="abrir:'+encodeURI(full(r))+'"'+(LOCAL?'':' target="_blank" rel="noopener"')+' title="Abre el archivo en tu PC">'+t+'</a>';
const link=(r,t,cls)=>pc(r)?pclink(r,t,cls):'<a class="btn'+(cls?' '+cls:'')+'" href="'+url(r)+'" data-r="'+esc(r)+'"'+(ab()?'':' target="_blank" rel="noopener"')+'>'+t+'</a>';
const alink=(a,t,cls)=>'<a class="btn art'+(cls?' '+cls:'')+'" href="'+esc(a.u)+'" target="_blank" rel="noopener">'+t+'</a>';
const OPEN=/\.(html?|pbip|pbix|pdf|mp4|pptx|docx|xlsx|rbxlx)$/i;
const mainTxt=(i,m)=>i.btn?'▶ '+i.btn:!/\.html?$/i.test(m.r)?'▶ Abrir en Power BI':/dashboard|reporte/i.test(i.n)?'▶ Abrir dashboard':/curso/i.test(i.n)?'▶ Abrir curso':/web|callumbra|umbra/i.test(i.n)?'▶ Abrir web':'▶ Abrir página';
const MAIN=/\.(html?|pbip|pbix)$/i;
const qa=i=>{const all=(i.ver||[]).filter(v=>OPEN.test(v.r)),m=i.go?null:all.find(v=>MAIN.test(v.r)),f=all.filter(v=>v!==m).slice(0,2),a=i.art||[];if(!i.go&&!m&&!i.ruta&&!f.length&&!a.length)return'';
  return '<span class="qa">'+(i.go?'<a class="btn pri sm" href="'+(i.go.u?esc(i.go.u)+'" target="_blank" rel="noopener':'abrir:'+esc(i.go.a))+'" title="'+(i.go.u?'Abre el sitio':'Levanta el proyecto y lo abre en el navegador')+'">▶ '+esc(i.go.t)+'</a>':'')+luz(i)+(m?link(m.r,mainTxt(i,m),'pri sm'):'')+f.map(v=>link(v.r,esc(v.t)+' <small>'+ext(v.r)+'</small>','sm')).join('')+(a.length?alink(a[0],'Artefacto ↗'+(a.length>1?' <small>+'+(a.length-1)+'</small>':''),'sm'):'')+(i.ruta?link(i.ruta,'Carpeta','sm ghost'):'')+'</span>'};

const qa2=i=>qa(i)||((i.src||[])[0]?'<span class="qa">'+link(i.src[0].r,esc(i.src[0].t),'sm')+'</span>':'');
const chatU=s=>'vscode://anthropic.claude-code/open?session='+encodeURIComponent(s.id);
const chatsDe=i=>(window.CHATS||{})[i.n]||[];
const chatsH=i=>{const l=chatsDe(i);if(!l.length)return'';return '<h4 class="shs">Chats de este proyecto <small>del más reciente al más antiguo · se abren en Claude Code (VS Code)</small></h4><ul class="chl">'+l.map((s,k)=>'<li><a class="chi" href="'+chatU(s)+'" title="Abrir este chat en VS Code"><span class="cht">'+(k===0?'<em>Último</em>':'')+esc(s.t)+'</span><span class="chm">'+esc(s.f)+(s.u?' · último pedido: “'+esc(s.u)+'”':'')+'</span></a></li>').join('')+'</ul>'};
const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const fdt=f=>{const m=/^(\d{4})-(\d\d)-(\d\d)/.exec(f||'');return m?(+m[3])+'-'+MES[m[2]-1]:''};
const chatQ=i=>{const s=chatsDe(i)[0];return s?'<a class="btn sm ghost chq" href="'+chatU(s)+'" title="'+esc(s.t+' · '+s.f)+'">💬 Retomar chat <small>'+fdt(s.f)+'</small></a>':''};
const recientes=()=>{const o=[];ALL.forEach(i=>chatsDe(i).forEach(s=>o.push([s,i])));const v=new Set();
  const l=o.sort((a,b)=>b[0].f<a[0].f?-1:1).filter(x=>!v.has(x[0].id)&&v.add(x[0].id)).slice(0,6);if(!l.length)return'';
  return '<section class="reci"><h3 class="qh">Actividad reciente <small>los últimos chats de mis proyectos · se abren en Claude Code</small></h3><div class="rgrid">'+l.map(([s,i])=>'<a class="rc" href="'+chatU(s)+'" style="--cc:'+i.cat.color+'" title="'+esc(s.u||s.t)+'"><span class="rp">'+lgs(i)+esc(i.n)+'</span><span class="rt">'+esc(s.t)+'</span><span class="rf">'+esc(s.f)+'</span></a>').join('')+'</div></section>'};
const PASOS=['Pido','Claude divide','IAs apoyan','Auditor revisa','Entrego'];
const card=i=>'<div class="card" role="button" tabindex="0" data-k="'+i.k+'" style="--cc:'+i.cat.color+'"><span class="logos">'+lgs(i)+'</span><span class="cb"><span class="h3">'+(i.rk&&view==='ia'?'<b class="rk">'+i.rk+'</b>':'')+esc(i.n)+'</span><span class="p">'+esc(i.d)+'</span></span><span class="meta">'+chip(i.e)+tag(i)+(i.ap?'<span class="tag how">Qué hace y cómo ayuda</span>':'')+(i.ruta||i.src||i.inc||i.art?'<span class="tag how">Ver cómo está hecho</span>':'')+'</span>'+qa(i)+'</div>';
const appi=i=>'<button class="appi" data-k="'+i.k+'"><span class="ic">'+lg(slugs(i)[0],i.cat,i.n)+(i.e!=='activo'?'<i class="badge" style="--sc:'+SC[i.e]+'"></i>':'')+'</span><span class="al">'+esc(i.n)+'</span></button>';
const list=items=>items.length?(CFG.apps?'<div class="apps">'+items.map(appi).join('')+'</div>':'<div class="grid">'+items.map(card).join('')+'</div>'):'<p class="empty">Nada por aquí.</p>';

const FEAT=[
  {v:'flujo',n:'Cómo fluye el trabajo',d:'De mi pedido a la entrega: Claude dirige, las IAs apoyan y un auditor revisa todo.',cc:'#d9773f',lg:[['claude']].concat(((window.DATA.flujo||{}).roles||[]).reduce(function(a,r){(r.cadena||[]).forEach(function(c){var k=({Groq:'groq',Gemini:'googlegemini',Nemotron:'nvidia',Codestral:'mistralai',Codex:'openai'})[c[0]];if(k&&a.indexOf(k)<0)a.push(k)});return a},[]).map(function(k){return [k]}))},
  {v:'marco',n:'Marco de trabajo',d:'Tallas S/M/L, el ciclo de cada tarea y los principios que no se negocian.',cc:'#1f9e89',lg:[[null,'S'],[null,'M'],[null,'L']]}
];
function vInicio(){
  const uniq=[...new Set(ALL.flatMap(slugs).filter(s=>s&&s!=='_mono'&&L[s]))];
  const herr=ALL.filter(i=>i.cat.grupo!=='Proyectos').length;
  const st=[[ALL.length,'en total ('+herr+' herramientas + '+(ALL.length-herr)+' proyectos)','todo'],[cat('ia').items.length,'IAs externas','ia'],[cat('mcp').items.length,'MCP y conectores','mcp'],[cat('pro').items.length,'proyectos','pro']];
  const strip=uniq.map(s=>lg(s,{color:'#888'},s)).join('');
  let h='<section class="hero"><p class="kick">'+esc(D.autor)+' · '+esc(D.rol)+'</p><h2 class="ht">'+esc(D.titulo)+'</h2><p class="lead">Claude dirige el trabajo, un equipo de IAs gratuitas lo apoya y yo decido. Todo lo que uso y construyo, en un solo lugar.</p><div class="stats">'+st.map(s=>'<button class="stat" data-v="'+s[2]+'"><b>'+s[0]+'</b><span>'+s[1]+' →</span></button>').join('')+'</div></section>';
  if(CFG.hero==='orbit')h+=orbit();
  if(CFG.hero==='chat')h+=chat();
  if(CFG.split)h='<div class="herow">'+h+'</div>';
  const favs=ALL.filter(i=>i.fav);
  if(favs.length)h+='<section class="quick"><h3 class="qh">Acceso rápido <small>lo que más abro · toca el nombre para ver el detalle</small></h3><div class="qgrid">'+favs.map(i=>'<div class="qk" style="--cc:'+i.cat.color+'"><button class="qn" data-k="'+i.k+'">'+lgs(i)+'<span>'+esc(i.n)+'</span></button>'+qa2(i)+chatQ(i)+'</div>').join('')+'</div></section>';
  h+=recientes();
  h+='<div class="marq" aria-hidden="true"><div class="mtrack">'+strip+strip+'</div></div><div class="tiles">';
  h+=FEAT.map(f=>'<button class="tile feat t-'+f.v+'" data-v="'+f.v+'" style="--cc:'+f.cc+'"><span class="mini">'+f.lg.map(x=>lg(x[0],{color:f.cc},x[1]||x[0])).join('')+'</span>'+(f.v==='flujo'?'<span class="pasos">'+PASOS.map((x,k)=>'<span><b>'+(k+1)+'</b>'+x+'</span>').join('')+'</span>':'')+'<span class="tn">'+f.n+'</span><span class="td">'+f.d+'</span><span class="go">Ver →</span></button>').join('');
  h+=D.categorias.map(c=>'<button class="tile t-'+c.id+(lum(c.color)>.55?' lt':'')+'" data-v="'+c.id+'" style="--cc:'+c.color+'"><span class="mini">'+[...new Map(c.items.map(i=>[slugs(i)[0]||i.n,i])).values()].slice(0,9).map(i=>lg(slugs(i)[0],c,i.n)).join('')+'</span><span class="tn">'+esc(c.nombre)+'</span><span class="td">'+esc(c.desc)+'</span><span class="tc">'+(c.cuenta||c.items.length)+'</span></button>').join('');
  return h+'</div><p class="note upd">Actualizado '+esc(D.actualizado)+(A.generado?' · detección automática '+esc(A.generado):'')+'</p>';
}
function orbit(){
  const used=new Set(['claude','anthropic']);
  const pick=(ids,max)=>{const o=[];ids.forEach(id=>cat(id).items.forEach(i=>slugs(i).forEach(s=>{if(s&&L[s]&&s!=='_mono'&&!used.has(s)&&o.length<max){used.add(s);o.push([s,i.cat])}})));return o};
  const R=[{t:'IAs y orquestación',its:pick(['ia','orq'],8),sz:44,sp:60},{t:'MCP, APIs y datos',its:pick(['mcp','api','dat'],13),sz:72,sp:90},{t:'Creación y proyectos',its:pick(['img','aud','vid','skills','pro'],16),sz:100,sp:130}];
  let h='<section class="orbit-w"><div class="orbit">';
  R.forEach((r,ri)=>{
    h+='<div class="ring" style="--sz:'+r.sz+'%;--sp:'+r.sp+'s">'+r.its.map((x,j)=>{const a=(j/r.its.length)*Math.PI*2+ri*.5;
      return '<button class="sat" data-v="'+x[1].id+'" style="left:'+(50+50*Math.cos(a)).toFixed(2)+'%;top:'+(50+50*Math.sin(a)).toFixed(2)+'%">'+lg(x[0],x[1],x[1].nombre)+'</button>'}).join('')+'</div>';
  });
  h+='<div class="core">'+lg('claude',cat('claude'),'Claude','big')+'<b>Claude</b><span>dirige</span></div></div><ul class="olegend">'+R.map((r,j)=>'<li><i style="--j:'+j+'"></i>'+r.t+'</li>').join('')+'</ul></section>';
  return h;
}
function chat(){
  const L2=[['u','Arma el resumen de recepciones de la semana y cuádralo contra SAP.'],
    ['c','Talla M. Plan: Groq resume el extract, Codestral escribe el SQL y Gemini Flash revisa.'],
    ['t','cascada.ps1 -Rol analista  →  groq gpt-oss-120b  ✓ 2,2 s'],
    ['t','cascada.ps1 -Rol programador  →  codestral  ✓ 2,5 s'],
    ['a','Auditor: SQL ejecutado con casos conocidos · totales cuadrados contra la fuente · ACEPTADO'],
    ['c','Listo. Cambié 2 archivos, corrí las pruebas afectadas. Queda pendiente que valides el formato.']];
  return '<section class="term" aria-label="Ejemplo de una sesión"><div class="tbar"><i></i><i></i><i></i><span>Claude Code · VS Code · ejemplo de una sesión</span></div><div class="tlog">'+
    L2.map((l,j)=>'<p class="tl '+l[0]+'" style="--d:'+(j*.9)+'s"><span class="who">'+({u:esc((window.DATA.autor||'').split(' ')[0]),c:'Claude',t:'IA',a:'Auditor'})[l[0]]+'</span>'+esc(l[1])+'</p>').join('')+'<p class="tl cur" style="--d:'+(L2.length*.9)+'s"><span class="who">›</span><span class="caret"></span></p></div></section>';
}
let fil='';
function usoPanel(){
  const U=window.USO;if(!U||!U.dias)return '';
  const ds=U.dias,hoy=new Date(),iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),add=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
  const ini=add(hoy,-((hoy.getDay()+2)%7)),dehoy=iso(hoy);
  const sum=f=>{const r=[0,0,0,0,0];Object.entries(ds).forEach(([k,v])=>{if(f(k))for(let j=0;j<5;j++)r[j]+=v[j]});return r};
  const fm=n=>n>=1e9?(n/1e9).toFixed(2).replace('.',',')+' G':n>=1e6?(n/1e6).toFixed(1).replace('.',',')+' M':n>=1e3?Math.round(n/1e3)+' k':String(Math.round(n));
  const fila=(t,sub,r)=>'<tr><td>'+t+(sub?'<small>'+sub+'</small>':'')+'</td><td>'+r[4]+'</td><td>'+fm(r[0]+r[1])+'</td><td>'+fm(r[2]+r[3])+'</td><td><b>'+fm(r[0]+r[1]+r[2]+r[3])+'</b></td></tr>';
  const ayer=iso(add(hoy,-1)),mes=dehoy.slice(0,7),an=dehoy.slice(0,4),s0=iso(ini);
  const tabla='<h3 class="sub">Gasto de tokens a la fecha</h3><div class="tkw"><table class="tk"><tr><th>Período</th><th>Mensajes</th><th>Entrada + salida</th><th>Caché</th><th>Total</th></tr>'+
    fila('Hoy',dehoy,sum(k=>k===dehoy))+fila('Ayer',ayer,sum(k=>k===ayer))+fila('Esta semana','desde el viernes '+s0.slice(5).split('-').reverse().join('/')+' (inicio del cupo)',sum(k=>k>=s0))+fila('Este mes',mes,sum(k=>k.startsWith(mes)))+fila('Este año',an,sum(k=>k.startsWith(an)))+'</table></div><p class="tkn">Se lee de los historiales de Claude Code (actualizado '+esc(U.generado)+'). Entrada + salida es lo que se escribe y se responde; caché es el contexto que se vuelve a leer en cada mensaje (la mayor parte del total).</p>';
  const u7=Object.keys(ds).sort().filter(k=>k<dehoy).slice(-7),n7=u7.length||1,p=sum(k=>u7.includes(k)).map(x=>x/n7);
  const tot=p[0]+p[1]+p[2]+p[3],ctx=Math.round((15107-3992)/4),
    mem=[['CLAUDE.md global más corto','medido','15,1 KB → 4,0 KB (~'+fm(ctx)+' tokens menos por mensaje)',ctx*p[4]],
         ['Respuestas cortas y lecturas acotadas','supuesto: −15 % de salida',null,p[1]*.15],
         ['Chats más cortos (/clear entre tareas)','supuesto: −20 % del caché',null,p[3]*.2]];
  const tot2=mem.reduce((s,m)=>s+m[3],0);
  const proy='<h3 class="sub">Proyección de ahorro</h3><div class="tkw"><table class="tk"><tr><th>Medida</th><th>Por día</th><th>Por semana</th><th>% del total</th></tr>'+
    mem.map(m=>'<tr><td>'+esc(m[0])+'<small>'+esc(m[1]+(m[2]?' · '+m[2]:''))+'</small></td><td>'+fm(m[3])+'</td><td>'+fm(m[3]*7)+'</td><td>'+(m[3]/tot*100).toFixed(1).replace('.',',')+' %</td></tr>').join('')+
    '<tr><td><b>Total proyectado</b></td><td><b>'+fm(tot2)+'</b></td><td><b>'+fm(tot2*7)+'</b></td><td><b>'+(tot2/tot*100).toFixed(1).replace('.',',')+' %</b></td></tr></table></div><p class="tkn">Base: promedio diario de los últimos '+n7+' días con uso ('+fm(tot)+' tokens al día, '+Math.round(p[4])+' mensajes). Solo la primera fila está medida; las otras dos son supuestos que se confirman al comparar semanas.</p>';
  return tabla+proy;
}
function vCat(id){
  const c=cat(id),its=c.items.filter(i=>!fil||i.e===fil);
  let iaNota='';
  if(id==='ia'&&window.USO&&USO.ias){
    const K=[['groq','Groq'],['flash','Gemini 3.5 Flash'],['codestral','Codestral'],['nemvl','Nemotron 3.5 Super'],['ultra','Nemotron 3 Ultra'],['laguna','Laguna'],['codex','Codex CLI']],q=i=>{const k=K.find(x=>i.n.includes(x[1]));return k?(USO.ias[k[0]]||0):0};
    its.sort((x,y)=>q(y)-q(x));its.forEach((i,n)=>{i.rk=n+1;i.nu=q(i)});
    iaNota='<p class="cnota">Ordenadas por uso real, de la que más uso a la que menos (según cascada.log): '+K.filter(k=>USO.ias[k[0]]).sort((x,y)=>USO.ias[y[0]]-USO.ias[x[0]]).map(k=>k[1]+' '+USO.ias[k[0]]).join(' · ')+'. Las que no aparecen aún no las he usado.</p>';
  }
  const es=[...new Set(c.items.map(i=>i.e))];
  return '<section class="vh" style="--cc:'+c.color+'"><span class="bar"></span><div><p class="kick">'+esc(c.grupo)+'</p><h2>'+esc(c.nombre)+'</h2><p>'+esc(c.desc)+' · '+(c.cuenta||c.items.length)+'</p></div></section>'+(c.nota?'<p class="cnota">'+esc(c.nota)+'</p>':'')+iaNota+
    (id==='skills'&&A.skills?'<div class="inst"><b>Las '+A.skills.length+' skills instaladas</b><div class="acts">'+A.skills.map(s=>link(s.r,esc(s.n)+' <small>SKILL.md</small>')).join('')+'</div></div>':'')+
    (es.length>1?'<div class="fil"><button class="fb'+(fil?'':' on')+'" data-f="">Todos</button>'+es.map(e=>'<button class="fb'+(fil===e?' on':'')+'" data-f="'+e+'">'+esc(D.estados[e]||e)+'</button>').join('')+'</div>':'')+list(its)+(id==='ahorro'?usoPanel():'');
}
function vTodo(){
  return '<section class="vh"><span class="bar"></span><div><h2>Todo</h2><p>'+ALL.length+' piezas: '+ALL.filter(i=>i.cat.grupo!=='Proyectos').length+' herramientas y '+ALL.filter(i=>i.cat.grupo==='Proyectos').length+' proyectos.</p></div></section>'+
    D.categorias.map(c=>'<h3 class="sec" style="--cc:'+c.color+'"><i></i>'+esc(c.nombre)+'</h3>'+list(c.items)).join('');
}
const CH={Groq:'groq',Gemini:'googlegemini',Nemotron:'nvidia',Codestral:'mistralai',Codex:'openai'};
const chs=n=>CH[Object.keys(CH).find(k=>n.startsWith(k))];
function vFlujo(){
  const F=D.flujo,ia=cat('ia'),cl=cat('claude');
  const step=(n,t,body,l)=>'<li class="step"><span class="num">'+n+'</span><div class="sb"><div class="st">'+(l||'')+'<h3>'+t+'</h3></div>'+body+'</div></li>';
  const roles='<div class="roles">'+F.roles.map(r=>'<div class="role"><div class="rh"><b>'+esc(r.nombre)+'</b><span>'+esc(r.hace)+'</span></div><ol class="chain">'+r.cadena.map(x=>'<li>'+lg(chs(x[0]),ia,x[0],'sm')+'<span>'+esc(x[0])+'</span><em>'+esc(x[1])+'</em></li>').join('')+'</ol></div>').join('')+'</div>';
  const checks='<div class="checks">'+F.auditor.map(a=>'<div class="chk"><b>'+esc(a[0])+'</b><span>'+esc(a[1])+'</span></div>').join('')+'</div>';
  const verd='<div class="verd">'+chip2('Aceptado','var(--ok)')+chip2('Corregido','var(--warn)')+chip2('Rechazado','var(--bad)')+'</div><p class="note">Rechazado vuelve a la cascada con otra IA, o lo resuelvo yo.</p>';
  return '<section class="vh"><span class="bar"></span><div><p class="kick">Orquestación</p><h2>Cómo fluye el trabajo</h2><p>Seis pasos, de mi pedido a la entrega.</p></div></section><ol class="flow">'+
    step(1,esc((window.DATA.autor||'').split(' ')[0])+' pide','<p>Un pedido en lenguaje natural, en el chat de Claude Code dentro de VS Code.</p>',lg('vscode',cl,'VS Code','sm'))+
    step(2,'Claude dirige','<p>Entiende, clasifica la tarea en S/M/L y decide qué IA hace cada parte.</p>',lg('claude',cl,'Claude','sm'))+
    step(3,'Cascada de IAs','<p><b>cascada.ps1</b> recorre la cadena del rol, de la IA más rápida a la siguiente.</p>'+roles+'<p class="note">Si una IA no responde en 30 s o da error, pasa a la siguiente. Agotada la cadena, resuelve Claude.</p>',lg('powershell',cat('orq'),'cascada','sm'))+
    step(4,'Auditor','<p>Ninguna respuesta se usa sin pasar por el auditor.</p>'+checks+verd,lg(null,{color:'#1f9e89'},'Auditor','sm'))+
    step(5,'Claude ejecuta','<p>Edita, corre y verifica en el workspace con lo que quedó aprobado.</p>',lg('claude',cl,'Claude','sm'))+
    step(6,'Entrega','<p>Resumen corto: qué cambió, archivos, pruebas y pendientes. La decisión final es mía.</p>',lg(null,{color:'#0f8fb0'},'Entrega','sm'))+'</ol>';
}
const chip2=(t,c)=>'<span class="chip" style="--sc:'+c+'">'+t+'</span>';
function vMarco(){
  const M=D.marco;
  return '<section class="vh" style="--cc:#1f9e89"><span class="bar"></span><div><p class="kick">Cómo trabajo</p><h2>Marco de trabajo</h2><p>Las reglas que sigue cada tarea, mía o de una IA.</p></div></section>'+
    '<h3 class="sub">El ciclo de cada tarea</h3><ol class="cycle">'+M.ciclo.map((s,j)=>'<li><span>'+(j+1)+'</span>'+esc(s)+'</li>').join('')+'</ol>'+
    '<h3 class="sub">Tamaño de la tarea</h3><div class="sizes">'+M.tallas.map(t=>'<div class="size"><b>'+t[0]+'</b><h4>'+esc(t[1])+'</h4><p>'+esc(t[2])+'</p></div>').join('')+'</div>'+
    '<h3 class="sub">Principios</h3><ul class="princ">'+M.principios.map(p=>'<li>'+esc(p)+'</li>').join('')+'</ul>'+
    '<h3 class="sub">Documentos</h3><div class="acts">'+link(M.carpeta,'Abrir carpeta','pri')+M.docs.map(d=>link(d.r,esc(d.t)+' <small>'+ext(d.r)+'</small>')).join('')+'</div>';
}
const nrm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function vBuscar(q){
  const ts=nrm(q).split(/\s+/).filter(Boolean),pts=i=>[i.n,i.d,i.tag,i.cat.nombre,i.ruta,i.ap&&i.ap.a,...((i.ap&&i.ap.c)||[]),...(i.ver||[]).map(v=>v.t)];
  const its=ALL.map(i=>{const h=nrm(pts(i).join(' ')),n=nrm(i.n);if(!ts.every(t=>h.includes(t)))return null;return[ts.reduce((s,t)=>s+(n.includes(t)?3:0)+(nrm(i.tag).includes(t)?1:0),0),i]}).filter(Boolean).sort((x,y)=>y[0]-x[0]).map(x=>x[1]);
  const ch=Object.entries(window.CHATS||{}).flatMap(([p,l])=>l.map(s=>[p,s])).filter(([p,s])=>ts.every(t=>nrm(p+' '+s.t+' '+s.u).includes(t))).slice(0,8);
  return '<section class="vh"><span class="bar"></span><div><h2>“'+esc(q)+'”</h2><p>'+its.length+' resultados'+(ch.length?' · '+ch.length+' chats':'')+'</p></div></section>'+list(its)+(ch.length?'<section class="reci"><h3 class="qh">Chats que coinciden <small>se abren en Claude Code</small></h3><div class="rgrid">'+ch.map(([p,s])=>'<a class="rc" href="'+chatU(s)+'"><span class="rp">'+esc(p)+'</span><span class="rt">'+esc(s.t)+'</span><span class="rf">'+esc(s.f)+'</span></a>').join('')+'</div></section>':'');
}

const VIEWS=['inicio','flujo','marco','salud','todo'].concat(D.categorias.map(c=>c.id));
let view='inicio';
function nb(v,t,ct,cc){return '<button class="nb" data-v="'+v+'"'+(cc?' style="--cc:'+cc+'"':'')+'><span class="dot"></span><span>'+esc(t)+'</span>'+(ct!=null?'<span class="ct">'+ct+'</span>':'')+'</button>'}
function nav(){
  const g={};D.categorias.forEach(c=>(g[c.grupo]=g[c.grupo]||[]).push(c));
  let h='<div class="navg">Visión</div>'+nb('inicio','Inicio')+nb('flujo','Cómo fluye',null,'#d9773f')+nb('marco','Marco de trabajo',null,'#1f9e89')+nb('salud','Salud y uso',null,'#2fb34a')+nb('todo','Todo',ALL.length);
  Object.keys(g).forEach(k=>{h+='<div class="navg">'+esc(k)+'</div>'+g[k].map(c=>nb(c.id,c.nombre,c.cuenta||c.items.length,c.color)).join('')});
  $('#nav').innerHTML=h;
}
function go(v,keep){
  if(!VIEWS.includes(v))v='inicio';
  if(v!==view)fil='';view=v;$('#q').value='';
  const m=$('#main');
  m.innerHTML=v==='inicio'?vInicio():v==='flujo'?vFlujo():v==='marco'?vMarco():v==='salud'?vSalud():v==='todo'?vTodo():vCat(v);
  document.querySelectorAll('.nb').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
  const on=$('.nb.on');if(on&&on.scrollIntoView&&getComputedStyle($('#nav')).flexDirection==='row')on.scrollIntoView({block:'nearest',inline:'center'});
  try{localStorage.setItem('inf-view',v)}catch(e){}
  try{history.replaceState(null,'','#'+v)}catch(e){}
  if(!keep)window.scrollTo({top:0});
  if(CFG.fx&&v==='inicio'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)m.querySelectorAll('.stat b').forEach(b=>{const n=+b.textContent;if(!n)return;const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/1100);b.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)});
}
if(CFG.fx)document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.tile,.card,.stat');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')});
function sheet(i){
  const c=i.cat;
  let h='<div class="sh-h">'+lgs(i,'big')+'</div><p class="sh-c">'+esc(c.nombre)+'</p><h2>'+esc(i.n)+'</h2><p class="sh-d">'+esc(i.d)+'</p><div class="meta">'+chip(i.e)+tag(i)+'</div>'+qa(i);
  if(i.ap)h+='<h4 class="shs">A qué se dedica</h4><p class="sh-d">'+esc(i.ap.a)+'</p><h4 class="shs">Cómo me ayuda</h4><ul class="inc">'+i.ap.c.map(x=>'<li><div><span>'+esc(x)+'</span></div></li>').join('')+'</ul><h4 class="shs">Cuándo la uso</h4><p class="sh-d">'+esc(i.ap.u)+'</p>';
  if(i.ruta)h+='<h4 class="shs">Carpeta y archivos</h4><div class="acts">'+link(i.ruta,'Abrir carpeta','pri')+(i.ver||[]).filter(v=>!PC.test(v.r)||!(window.PBIS||{})[i.n]).map(v=>link(v.r,esc(v.t)+' <small>'+ext(v.r)+'</small>')).join('')+((window.PBIS||{})[i.n]||[]).map(r=>link(r,'Abrir en mi PC · '+esc(r.split('/').pop()),'pc')).join('')+'<button class="btn" data-copy="'+esc(full(i.ruta))+'">Copiar ruta</button></div><p class="path">'+esc(full(i.ruta))+'</p>';
  h+=chatsH(i);
  if(i.inc&&i.inc.length)h+='<h4 class="shs">Incluye ('+i.inc.length+')</h4><ul class="inc">'+i.inc.map(x=>'<li><div><b>'+esc(x.n)+'</b><span>'+esc(x.d)+'</span></div>'+link(x.r,'Abrir <small>'+ext(x.r)+'</small>')+'</li>').join('')+'</ul>';
  if(i.art&&i.art.length)h+='<h4 class="shs">Artefactos publicados ('+i.art.length+')</h4><div class="acts">'+i.art.map(a=>alink(a,esc(a.t)+' ↗')).join('')+'</div>';
  if(i.src&&i.src.length)h+='<h4 class="shs">Cómo está construido</h4><div class="acts">'+i.src.map(s=>link(s.r,esc(s.t)+(/\.\w+$/.test(s.r)?' <small>'+ext(s.r)+'</small>':' <small>carpeta</small>'))).join('')+'</div>';
  $('#shc').innerHTML=h;$('.sh-p').classList.remove('wide');$('.sh-p').style.setProperty('--cc',c.color);
  $('#sheet').hidden=false;$('.sh-x').focus();
}
let tt;
function toast(t){const e=$('#toast');e.textContent=t;e.hidden=false;clearTimeout(tt);tt=setTimeout(()=>e.hidden=true,2600)}
function copy(t){
  const ok=()=>toast('Ruta copiada: '+t);
  try{navigator.clipboard.writeText(t).then(ok,()=>toast(t))}catch(e){toast(t)}
}
const FS=window.FILES||{};
const kb=s=>s>1048576?(s/1048576).toFixed(1)+' MB':Math.max(1,Math.round(s/1024))+' KB';
const cdn=u=>new Promise((ok,ko)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=ko;document.head.appendChild(s)});
let pila=[];
function ver(r,atras){
  const f=FS[r];if(!f){copy(full(r));return}
  if(!atras)pila.push(r);
  const nom=r.split('/').filter(Boolean).pop(),back=pila.length>1?'<button class="btn sm ghost" data-back>← Volver</button>':'';
  let h='<div class="vw-h">'+back+'<p class="sh-c">'+(f.k==='d'?'Carpeta':ext(r))+'</p><h2>'+esc(nom)+'</h2><p class="path">'+esc(full(r))+'</p>'+(!LOCAL&&D.abridor&&!f.z?'<div class="acts">'+pclink(r,'Abrir en mi PC','pri sm')+'</div>':'')+'</div>';
  if(f.k==='t')h+='<pre class="vw-t">'+esc(f.x)+'</pre>';
  else if(f.k==='d')h+='<ul class="vw-d">'+(f.l.length?f.l.map(([n,d])=>{const cr=r.replace(/\/$/,'')+'/'+n,ok=FS[cr];return '<li><button class="vw-i'+(ok?'':' off')+'" data-ver="'+esc(cr)+'"><span>'+(d?'📁':'📄')+'</span>'+esc(n)+(ok&&ok.s?'<small>'+kb(ok.s)+'</small>':'')+'</button></li>'}).join(''):'<li class="note">Carpeta vacía.</li>')+'</ul>';
  else if(f.k==='h')h+='<iframe class="vw-f" sandbox="allow-scripts allow-popups" title="'+esc(nom)+'"></iframe>';
  else if(f.k==='p')h+='<div class="vw-pdf"><p class="note">Cargando PDF…</p></div>';
  else if(f.k==='v')h+='<video class="vw-v" controls preload="metadata" src="'+esc(f.u)+'"></video>';
  else if(f.k==='i')h+='<img class="vw-v" alt="'+esc(nom)+'" src="'+esc(f.u)+'">';
  else h+='<div class="vw-o"><p><b>'+ext(r)+'</b> · '+kb(f.s||0)+(f.m?' · modificado '+esc(f.m):'')+'</p><p>'+esc(f.z||'Este formato no se puede mostrar dentro del navegador: usa «Abrir en mi PC» (funciona en tu computador, donde está instalado el abridor).')+'</p><button class="btn" data-copy="'+esc(full(r))+'">Copiar ruta</button></div>';
  $('#shc').innerHTML=h;$('.sh-p').classList.add('wide');$('#sheet').hidden=false;$('.sh-x').focus();
  if(f.k==='h')fetch(f.u).then(x=>x.text()).then(t=>{const i=$('.vw-f');if(i)i.srcdoc=t}).catch(()=>toast('No se pudo cargar el HTML'));
  if(f.k==='p'){const P='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
    (window.pdfjsLib?Promise.resolve():cdn(P+'pdf.min.js').then(()=>cdn(P+'pdf.worker.min.js'))).then(()=>{pdfjsLib.GlobalWorkerOptions.workerSrc=P+'pdf.worker.min.js';return pdfjsLib.getDocument(f.u).promise}).then(async d=>{
      const box=$('.vw-pdf');if(!box)return;box.innerHTML='';
      for(let n=1;n<=Math.min(d.numPages,40);n++){const pg=await d.getPage(n),vp=pg.getViewport({scale:1.4}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;box.appendChild(c);await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise}
    }).catch(()=>{const b=$('.vw-pdf');if(b)b.innerHTML='<p class="note">No se pudo mostrar el PDF.</p>'})}
}
/* ===== Salud, luces y uso real (requiere el servicio local 127.0.0.1:8799) ===== */
const SRV='http://127.0.0.1:8799',PORTS={};
let EST=null;
const luz=i=>{const p=PORTS[i.n];return p&&LOCAL?'<span class="luz" data-p="'+p+'" title="Comprobando…"></span><button class="btn sm ghost stop" data-p="'+p+'" title="Apaga este dashboard" hidden>■ Detener</button>':''};
function pintaLuces(){document.querySelectorAll('.luz[data-p]').forEach(e=>{const d=EST&&EST.dash[e.dataset.p];e.className='luz'+(d?(d.arriba?' on':' off'):'');e.title=d?(d.arriba?'Encendido':'Apagado'):'Servicio local apagado'});document.querySelectorAll('.stop[data-p]:not([data-p=todos])').forEach(b=>{const d=EST&&EST.dash[b.dataset.p];b.hidden=!(d&&d.arriba)})}
const kbf=n=>String(n).replace('.',',')+' KB';
const lineaH=()=>{const t=(D.linea||[]).slice().reverse();return t.length?'<div class="pcard"><h4>Línea de tiempo</h4><ol class="lt">'+t.map(x=>'<li><b>'+esc(x.f.slice(5).split('-').reverse().join('/'))+'</b> '+esc(x.t)+'</li>').join('')+'</ol></div>':''};
const PF={m:'sem',d1:'',d2:''};
function proyRango(U){
  const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),hoy=new Date(),h=iso(hoy),add=n=>{const x=new Date(hoy);x.setDate(x.getDate()+n);return iso(x)};
  const ks=Object.keys(U.dias||{}).sort(),m=PF.m;
  if(m==='sem')return[add(-((hoy.getDay()+2)%7)),h,'Semana en curso (desde el viernes)'];
  if(m==='hoy')return[h,h,'Hoy'];if(m==='ayer')return[add(-1),add(-1),'Ayer'];
  if(m==='mes')return[h.slice(0,7)+'-01',h,'Mes en curso'];if(m==='ano')return[h.slice(0,4)+'-01-01',h,'Año en curso'];
  if(m==='todo')return[ks[0]||h,h,'Todo el histórico'];
  if(m==='rango')return[PF.d1||ks[0]||h,PF.d2||h,'Rango elegido'];
  return[m+'-01',m+'-31','Mes '+m];
}
function proyHtml(){
  const U=window.USO;if(!U||!U.sesiones)return '';
  const [d1,d2,tit]=proyRango(U);
  const fm=n=>n>=1e9?(n/1e9).toFixed(2).replace('.',',')+' G':n>=1e6?(n/1e6).toFixed(1).replace('.',',')+' M':n>=1e3?Math.round(n/1e3)+' k':String(Math.round(n));
  const mapa={};Object.entries(window.CHATS||{}).forEach(([p,l])=>l.forEach(s=>mapa[s.id]=p));
  const g={};let tot=0;
  Object.entries(U.sesiones).forEach(([sid,dd])=>{let t=0,m=0;Object.entries(dd).forEach(([d,v])=>{if(d>=d1&&d<=d2){t+=v[0]+v[1]+v[2]+v[3];m+=v[4]}});if(!t)return;const p=mapa[sid]||'Otros chats (sin proyecto)';const x=g[p]||(g[p]={t:0,m:0,c:0});x.t+=t;x.m+=m;x.c++;tot+=t});
  const rows=Object.entries(g).sort((x,y)=>y[1].t-x[1].t);
  const f=s=>s.split('-').reverse().join('/');
  return '<p class="tkn">'+esc(tit)+' · '+f(d1)+' al '+f(d2)+'</p>'+(rows.length?'<div class="tkw"><table class="tk"><tr><th>Proyecto</th><th>Chats</th><th>Mensajes</th><th>Tokens</th><th>% del total</th></tr>'+rows.map(([p,x])=>'<tr><td>'+esc(p)+'</td><td>'+x.c+'</td><td>'+x.m+'</td><td><b>'+fm(x.t)+'</b></td><td>'+(x.t/tot*100).toFixed(1).replace('.',',')+' %</td></tr>').join('')+'<tr><td><b>Total</b></td><td><b>'+rows.reduce((s,r)=>s+r[1].c,0)+'</b></td><td><b>'+rows.reduce((s,r)=>s+r[1].m,0)+'</b></td><td><b>'+fm(tot)+'</b></td><td><b>100 %</b></td></tr></table></div>':'<p class="mut">Sin uso en ese período.</p>')+'<p class="tkn">Cada chat se asigna al proyecto donde se abrió; los que no figuran en ninguna carpeta quedan en “Otros”.</p>';
}
function proyPanel(){
  const U=window.USO;if(!U||!U.sesiones)return '';
  const MN=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],ms=[...new Set(Object.keys(U.dias||{}).map(k=>k.slice(0,7)))].sort().reverse();
  const op=(v,t)=>'<option value="'+v+'"'+(PF.m===v?' selected':'')+'>'+t+'</option>';
  return '<h3 class="sub">Gasto por proyecto</h3><div class="pfil"><select id="pfSel">'+op('sem','Semana en curso')+op('hoy','Hoy')+op('ayer','Ayer')+op('mes','Mes en curso')+op('ano','Año en curso')+op('todo','Todo el histórico')+ms.map(k=>op(k,MN[+k.slice(5)-1]+' '+k.slice(0,4))).join('')+op('rango','Rango de fechas…')+'</select><span id="pfRg"'+(PF.m==='rango'?'':' hidden')+'> desde <input type="date" id="pfD1" value="'+PF.d1+'"> hasta <input type="date" id="pfD2" value="'+PF.d2+'"></span></div><div id="proyBox">'+proyHtml()+'</div>';
}
document.addEventListener('change',e=>{const t=e.target;if(!t.id||!t.id.startsWith('pf'))return;if(t.id==='pfSel'){PF.m=t.value;const r=$('#pfRg');if(r)r.hidden=PF.m!=='rango'}else if(t.id==='pfD1')PF.d1=t.value;else if(t.id==='pfD2')PF.d2=t.value;const b=$('#proyBox');if(b)b.innerHTML=proyHtml()});
function vSalud(){
  return '<section class="vh" style="--cc:#2fb34a"><span class="bar"></span><div><p class="kick">Cómo trabajo</p><h2>Salud y uso</h2><p>Estado real de mis herramientas, el cupo semanal y lo que pesa en el contexto.'+(LOCAL?' Se actualiza solo.':' El estado en vivo solo está al abrir el archivo en mi PC.')+'</p></div></section><div id="saludBody">'+(LOCAL?'<p class="mut">Comprobando…</p>':'')+'</div>'+proyPanel();
}
function renderSalud(){
  const b=$('#saludBody');if(!b)return;const e=EST;
  const sec=(t,h)=>'<h3 class="sub">'+t+'</h3><div class="sizes">'+h+'</div>',card=(t,h,bad)=>'<div class="size'+(bad?' bad':'')+'"><h4>'+t+'</h4>'+h+'</div>';
  if(!e){b.innerHTML=(LOCAL?sec('Estado',card('Servicio local apagado','<p>No responde 127.0.0.1:8799. Se reinicia solo al iniciar sesión (tarea AbrirServicioInfografia).</p>',1)):'');return}
  const dot=o=>'<span class="luz '+(o==null?'':o?'on':'off')+'"></span>',fila=(n,o)=>'<li>'+dot(o.ok)+'<b>'+n+'</b><span>'+esc(o.txt)+'</span></li>';
  const c=e.contexto,memAl=c.memory_md>6,dias=e.cupo.dias,pct=Math.min(100,Math.round((7-dias)/7*100));
  const ias=Object.entries(e.ias).sort((x,y)=>y[1].n-x[1].n);
  b.innerHTML=
   sec('Estado del sistema',card('Servicios','<ul class="fl">'+fila('Servicio local',{ok:true,txt:'activo'})+fila('Sesión BigQuery',e.gcloud)+fila('Copia a Drive',e.sync)+'</ul>'+(e.gcloud.ok===false?'<p class="alerta">⚠ Sesión vencida: pídeme “reautenticar gcloud”.</p>':''),e.gcloud.ok===false)+
     card('Dashboards','<ul class="fl">'+Object.entries(e.dash).map(([p,d])=>'<li>'+dot(d.arriba)+'<b>'+esc(d.n)+'</b><span>puerto '+p+'</span></li>').join('')+'</ul><p><button class="btn sm ghost stop" data-p="todos">■ Detener todos</button></p>'))+
   sec('Cupo y contexto',card('Cupo de Claude (mi plan)','<div class="med"><i style="width:'+pct+'%"></i></div><p>Semana avanzada al <b>'+pct+' %</b> · reinicia el <b>viernes '+esc(String(e.cupo.reinicio).replace(/^\w+ /,'').slice(0,5).split('-').reverse().join('/'))+' 3:00</b> · faltan <b>'+String(dias).replace('.',',')+' días</b>.</p><p class="mut">La barra mide el tiempo de la semana, no lo gastado: Claude no deja leer el consumo real desde el PC. Para eso usa /usage en Claude Code. No hay cupo diario: el plan tiene un límite semanal y otro por sesión de 5 horas. Los tokens medidos por día están en Ahorro de tokens.</p>')+
     card('Qué pesa en mi contexto','<ul class="fl"><li><b>CLAUDE.md global</b><span>'+kbf(c.claude_md)+'</span></li><li><b>MEMORY.md</b><span>'+kbf(c.memory_md)+(memAl?' · ⚠ pasa de 6 KB':'')+'</span></li><li><b>Reglas</b><span>'+kbf(c.reglas_kb)+' · bajo demanda</span></li><li><b>Orquestación</b><span>'+kbf(c.orq_kb)+' · bajo demanda</span></li></ul><p class="mut">Carga fija en cada chat: ~'+kbf(Math.round((c.claude_md+c.memory_md)*10)/10)+'.</p>',memAl))+
   '';
}
async function leeEstado(){if(!LOCAL)return;try{const r=await fetch(SRV+'/estado');EST=await r.json()}catch(x){EST=null}pintaLuces();renderSalud()}
if(LOCAL){setInterval(()=>{if(!document.hidden)leeEstado()},8000);setTimeout(leeEstado,300);new MutationObserver(()=>{pintaLuces();if($('#saludBody')&&$('#saludBody').textContent.startsWith('Comprobando'))renderSalud()}).observe(document.body,{childList:true,subtree:true});document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.stop');if(!b)return;e.preventDefault();e.stopPropagation();fetch(SRV+'/detener?p='+b.dataset.p,{mode:'no-cors'}).then(()=>{toast('Deteniendo…');setTimeout(leeEstado,1500)})},true)}
document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href^="abrir:"]');if(!a||!LOCAL)return;
  e.preventDefault();e.stopPropagation();const u=a.getAttribute('href');
  toast('Abriendo…');fetch('http://127.0.0.1:8799/abrir?u='+encodeURIComponent(u)).then(r=>{if(!r.ok)toast('⚠ No se pudo abrir: '+decodeURIComponent(u.replace(/^abrir:\/*/,'')))}).catch(()=>{location.href=u});
},true);
document.addEventListener('click',e=>{
  if(e.target.closest('a.art'))return;
  const vb=e.target.closest('[data-ver],[data-back]');
  if(vb){if(vb.dataset.back!=null){pila.pop();ver(pila[pila.length-1],1)}else ver(vb.dataset.ver);return}
  const t=e.target.closest('[data-v],[data-k],[data-f],[data-r],[data-copy],[data-close]');if(!t)return;
  if(t.dataset.close!=null){$('#sheet').hidden=true;return}
  if(t.dataset.copy){copy(t.dataset.copy);return}
  if(t.dataset.r!=null){if(!LOCAL){e.preventDefault();pila=[];ver(t.dataset.r)}return}
  if(t.dataset.f!=null){fil=t.dataset.f;go(view,1);return}
  if(t.dataset.k!=null){sheet(ALL[+t.dataset.k]);return}
  if(t.dataset.v){go(t.dataset.v)}
});
document.addEventListener('keydown',e=>{if((e.key==='/'||(e.key==='k'&&(e.ctrlKey||e.metaKey)))&&!e.target.matches('input,textarea')){e.preventDefault();$('#q').focus();return}if(e.key==='Escape')$('#sheet').hidden=true;else if((e.key==='Enter'||e.key===' ')&&e.target.matches('.card[role=button]')){e.preventDefault();e.target.click()}});
$('#q').addEventListener('input',e=>{const q=e.target.value.trim();if(!q){const v=view;view='';go(v,1);return}$('#main').innerHTML=vBuscar(q);document.querySelectorAll('.nb').forEach(b=>b.classList.remove('on'))});
nav();
let start=location.hash.slice(1);
if(!VIEWS.includes(start)){try{start=localStorage.getItem('inf-view')||''}catch(e){start=''}}
go(start||'inicio');
sello();
const rb=$('#refresh');if(rb)rb.addEventListener('click',()=>recargar(1));
setInterval(()=>recargar(0),60000);
})();

// Cabecera con nombre e iniciales tomados de data.js
;(function(){var D=window.DATA||{},a=D.autor||'',b=document.querySelector('.brand');if(!b)return;b.querySelector('.mark').textContent=a.split(' ').slice(0,2).map(function(w){return w[0]}).join('').toUpperCase();b.querySelector('p').textContent=a+' · '+(D.rol||'')})();
