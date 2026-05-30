import { useState } from "react";

const C = {
  cepeda:    { name:"Iván Cepeda",       short:"Cepeda",    tag:"Izquierda",        color:"#e84c3d", emoji:"🔴" },
  lopez:     { name:"Claudia López",      short:"C. López",  tag:"Centro-izquierda", color:"#9b59b6", emoji:"🟣" },
  fajardo:   { name:"Sergio Fajardo",     short:"Fajardo",   tag:"Centro",           color:"#27ae60", emoji:"🟢" },
  valencia:  { name:"Paloma Valencia",    short:"Valencia",  tag:"Derecha",          color:"#2980b9", emoji:"🔵" },
  espriella: { name:"De la Espriella",    short:"Espriella", tag:"Derecha indep.",   color:"#e67e22", emoji:"🟠" },
};

const QS = [
  { topic:"💸 La plata del país", text:"Si el gobierno tuviera plata extra hoy, ¿qué debería hacer con ella?", options:[
    { text:"Dársela a los que menos tienen: subsidios, vivienda, comida.", scores:{cepeda:3,lopez:1} },
    { text:"Invertirla en educación y hospitales para todos por igual.", scores:{fajardo:3,lopez:1} },
    { text:"Usarla para pagar deudas y no endeudarnos más.", scores:{espriella:3,valencia:2} },
    { text:"Bajar impuestos para que los negocios crezcan y haya más empleo.", scores:{valencia:3,espriella:1} },
  ]},
  { topic:"🔫 Seguridad en el barrio", text:"¿Cómo le metemos mano a los grupos violentos que controlan zonas del país?", options:[
    { text:"Hablando con ellos y ofreciéndoles salidas pacíficas.", scores:{cepeda:3} },
    { text:"Con policía y ejército, pero también oportunidades en esas zonas.", scores:{fajardo:3,lopez:1} },
    { text:"Tratarlos como criminales: cárcel y punto, sin negociar.", scores:{lopez:3,espriella:1} },
    { text:"Mano durísima, cero contemplaciones.", scores:{valencia:3,espriella:2} },
  ]},
  { topic:"🏥 Cuando uno se enferma", text:"¿Cómo debería funcionar la salud en Colombia?", options:[
    { text:"El Estado maneja todo y la salud es gratis para todos.", scores:{cepeda:3} },
    { text:"Que funcione bien como estaba, con EPS y clínicas privadas.", scores:{valencia:3,espriella:2} },
    { text:"Mejorar lo que hay sin dañar lo que funciona.", scores:{fajardo:2,lopez:2} },
    { text:"Quitarles poder a los intermediarios que se roban la plata.", scores:{lopez:3,cepeda:1} },
  ]},
  { topic:"☮️ La paz", text:"Con los grupos armados que todavía quedan en Colombia…", options:[
    { text:"Hay que negociar y buscarles una salida, así tome años.", scores:{cepeda:3} },
    { text:"Que primero dejen las armas y después hablamos.", scores:{espriella:2,fajardo:1} },
    { text:"Nada de diálogo: el ejército que los acabe.", scores:{valencia:3,espriella:2} },
    { text:"Combatirlos, pero a los que se rindan darles una segunda oportunidad.", scores:{fajardo:2,lopez:2} },
  ]},
  { topic:"📚 Los hijos y el futuro", text:"¿En qué debería gastar más el gobierno para que los jóvenes tengan futuro?", options:[
    { text:"Universidad gratis para los que no pueden pagarla.", scores:{cepeda:3,lopez:1} },
    { text:"Que los colegios públicos sean tan buenos como los privados.", scores:{fajardo:3} },
    { text:"Cursos y técnicos para que salgan con un oficio y trabajen.", scores:{fajardo:2,lopez:1,valencia:1} },
    { text:"Dejar que las familias elijan: colegios privados con vouchers.", scores:{valencia:2,espriella:2} },
  ]},
  { topic:"⚖️ La diferencia entre ricos y pobres", text:"En Colombia unos pocos tienen muchísimo y la mayoría muy poco. ¿Qué hacemos?", options:[
    { text:"Cobrarles más a los ricos y darles más a los pobres, ya.", scores:{cepeda:3} },
    { text:"Acabar con la corrupción: ahí está la plata que le falta a los pobres.", scores:{lopez:3,fajardo:1} },
    { text:"Que la economía crezca sola y eso le llega a todo el mundo.", scores:{valencia:2,espriella:2} },
    { text:"Darle a todos la misma educación y oportunidades desde chiquitos.", scores:{fajardo:3,lopez:1} },
  ]},
];

function winner(sc){return Object.entries(sc).sort((a,b)=>b[1]-a[1])[0][0];}
function ranked(sc){const mx=Math.max(...Object.values(sc));return Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({k,pct:mx>0?Math.round(v/mx*100):0}));}

function Logo({small}){const fs=small?20:26,bs=small?30:38;return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:small?12:22}}><span style={{fontFamily:"'Fraunces',serif",fontWeight:900,fontSize:bs*0.78,background:"#f5c842",color:"#09090f",borderRadius:7,width:bs,height:bs,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>A</span><span style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:fs,color:"#f0eee8",marginLeft:6}}>nder<span style={{color:"#f5c842"}}>ground</span></span></div>);}
function Page({children}){return(<div style={{minHeight:"100vh",background:"#09090f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px 64px",fontFamily:"'DM Sans',sans-serif"}}>{children}</div>);}

export default function App(){
  const [screen,setScreen]=useState("home");
  const [name,setName]=useState("");
  const [age,setAge]=useState("");
  const [qIdx,setQIdx]=useState(0);
  const [scores,setScores]=useState({cepeda:0,lopez:0,fajardo:0,valencia:0,espriella:0});
  const [chosen,setChosen]=useState(null);
  const [result,setResult]=useState(null);

  function handleOption(i){setChosen(prev=>prev===i?null:i);}
  function handleEnviar(){if(chosen===null)return;const opt=QS[qIdx].options[chosen];const ns={...scores};Object.entries(opt.scores||{}).forEach(([k,v])=>{ns[k]=(ns[k]||0)+v;});setScores(ns);setChosen(null);if(qIdx+1>=QS.length){setResult({name:name.trim(),age:age.trim(),winner:winner(ns),all:ranked(ns)});setScreen("result");}else{setQIdx(q=>q+1);}}
  function startQuiz(){if(!name.trim()||!age.trim())return;setQIdx(0);setScores({cepeda:0,lopez:0,fajardo:0,valencia:0,espriella:0});setChosen(null);setScreen("quiz");}
  function restart(){setName("");setAge("");setResult(null);setScreen("home");}

  if(screen==="home")return(<Page><Logo/><h1 style={S.h1}>Descubrí lo que<br/><em style={S.em}>en verdad</em><br/>llevás dentro</h1><p style={S.sub}>6 preguntas sencillas. Sin política complicada.<br/>Descubrí con qué candidato pensás más parecido. 🇨🇴</p><div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:340,margin:"28px auto 0"}}><label style={S.lbl}>Tu nombre</label><input style={S.inp} placeholder="Ej: Mamá Gloria" value={name} onChange={e=>setName(e.target.value)}/><label style={{...S.lbl,marginTop:8}}>Tu edad</label><input style={S.inp} placeholder="Ej: 52" type="number" min="1" max="120" value={age} onChange={e=>setAge(e.target.value)}/><button style={{...S.btnY,marginTop:16,opacity:(name.trim()&&age.trim())?1:0.4}} onClick={startQuiz} disabled={!name.trim()||!age.trim()}>Empezar →</button></div><p style={S.credit}>Anderground · Creado por Ander · Colombia 2026</p></Page>);

  if(screen==="quiz")return(<Page><div style={S.card}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={S.lbl}>{qIdx+1} de {QS.length}</span><span style={S.lbl}>{Math.round((qIdx/QS.length)*100)}%</span></div><div style={S.progBar}><div style={{...S.progFill,width:`${Math.round((qIdx/QS.length)*100)}%`}}/></div><div style={S.topicTag}>{QS[qIdx].topic}</div><h2 style={S.qText}>{QS[qIdx].text}</h2><div style={{display:"flex",flexDirection:"column",gap:10}}>{QS[qIdx].options.map((opt,i)=>{const sel=chosen===i;return(
