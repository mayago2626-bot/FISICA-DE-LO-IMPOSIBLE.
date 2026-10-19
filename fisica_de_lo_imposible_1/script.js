/* =========================================================
   ESTRELLAS
========================================================= */
const viajeEstrellas=document.getElementById("viajeEstrellas");
for(let i=0;i<100;i++){
    const estrella=document.createElement("div");
    estrella.className="estrella-viaje";
    estrella.style.setProperty("--x",(Math.random()*2000-1000));
    estrella.style.setProperty("--y",(Math.random()*1400-700));
    estrella.style.animationDuration=(2+Math.random()*5)+"s";
    estrella.style.animationDelay=(Math.random()*5)+"s";
    estrella.style.width=(1+Math.random()*3)+"px";
    estrella.style.height=estrella.style.width;
    viajeEstrellas.appendChild(estrella);
}

/* =========================================================
   MENSAJES
========================================================= */
const mensaje=document.getElementById("mensaje");
function mostrarMensaje(texto){
    mensaje.textContent=texto;
    mensaje.classList.add("mostrar");
    clearTimeout(window.mensajeTimer);
    window.mensajeTimer=setTimeout(()=>mensaje.classList.remove("mostrar"),3200);
}

/* =========================================================
   AUDIO
========================================================= */
let sonidoActivado=true;
let audioContext=null;
function iniciarAudio(){
    if(!audioContext){
        audioContext=new(window.AudioContext||window.webkitAudioContext)();
    }
    if(audioContext.state==="suspended") audioContext.resume();
}
function tono(frecuencia,duracion=.6,tipo="sine",volumen=.18,frecuenciaFinal=null){
    if(!sonidoActivado)return;
    iniciarAudio();
    const osc=audioContext.createOscillator(),gain=audioContext.createGain();
    osc.type=tipo;
    osc.frequency.setValueAtTime(frecuencia,audioContext.currentTime);
    if(frecuenciaFinal)osc.frequency.exponentialRampToValueAtTime(frecuenciaFinal,audioContext.currentTime+duracion);
    gain.gain.setValueAtTime(.0001,audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(volumen,audioContext.currentTime+.04);
    gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duracion);
    osc.connect(gain);gain.connect(audioContext.destination);
    osc.start();osc.stop(audioContext.currentTime+duracion);
}
function sonidoPlaneta(){tono(110,.7,"sine",.3,70)}
function sonidoAgujero(){tono(100,1,"sawtooth",.35,25)}
function sonidoLuna(){
    [523,659,784].forEach((f,i)=>setTimeout(()=>tono(f,.7,"sine",.18),i*120));
}
function sonidoSol(){tono(180,.8,"triangle",.3,700)}
function sonidoTiempo(){tono(150,.8,"sine",.25,1000)}
function sonidoMeteorito(){tono(700,.3,"triangle",.15,80)}

/* =========================================================
   OBJETOS 3D
========================================================= */
const planeta=document.getElementById("planeta3D");
planeta.addEventListener("click",()=>{
    sonidoPlaneta();
    planeta.animate([
        {transform:"scale(1) rotateY(0deg)"},{transform:"scale(1.25) rotateY(180deg)"},{transform:"scale(1) rotateY(360deg)"}
    ],{duration:900});
    mostrarMensaje("🌍 Has activado el planeta. Sonido profundo espacial.");
});

const agujero=document.getElementById("agujeroNegro");
agujero.addEventListener("click",()=>{
    sonidoAgujero();
    agujero.animate([
        {transform:"scale(1)"},{transform:"scale(.75) rotate(180deg)"},{transform:"scale(1.1) rotate(360deg)"},{transform:"scale(1)"}
    ],{duration:1200});
    mostrarMensaje("🕳️ El agujero negro está deformando el espacio-tiempo.");
});

const luna=document.getElementById("luna3D");
luna.addEventListener("click",()=>{
    sonidoLuna();
    luna.animate([
        {transform:"scale(1)"},{transform:"scale(1.2) rotateY(180deg)"},{transform:"scale(1) rotateY(360deg)"}
    ],{duration:1000});
    mostrarMensaje("🌙 Has tocado la Luna. Sonido suave y cristalino.");
});

const sol=document.getElementById("sol3D");
sol.addEventListener("click",()=>{
    sonidoSol();sol.classList.remove("activo");void sol.offsetWidth;sol.classList.add("activo");
    mostrarMensaje("☀️ El Sol libera una explosión de energía.");
});

/* =========================================================
   TARJETAS 3D
========================================================= */
document.querySelectorAll(".tarjeta").forEach(tarjeta=>{
    tarjeta.addEventListener("click",()=>{
        tarjeta.classList.toggle("seleccionada");
        sonidoTiempo();
    });
    tarjeta.addEventListener("mousemove",e=>{
        const r=tarjeta.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
        const rotX=(y-r.height/2)/10,rotY=(r.width/2-x)/10;
        tarjeta.style.transform=`translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });
    tarjeta.addEventListener("mouseleave",()=>{
        tarjeta.style.transform=tarjeta.classList.contains("seleccionada")?"translateY(-10px) scale(1.02)":"";
    });
});

/* =========================================================
   MOVIMIENTO DEL PLANETA CON EL RATÓN
========================================================= */
document.addEventListener("mousemove",e=>{
    const x=(e.clientX/window.innerWidth-.5)*15;
    const y=(e.clientY/window.innerHeight-.5)*15;
    if(!planeta.matches(":active")){
        planeta.style.marginLeft=x+"px";
        planeta.style.marginTop=(30+y)+"px";
    }
});

/* =========================================================
   LABORATORIO DE ONDAS
========================================================= */
const canvas=document.getElementById("ondaCanvas");
const ctx=canvas.getContext("2d");
const freqSlider=document.getElementById("freqSlider");
const ampSlider=document.getElementById("ampSlider");
const freqLabel=document.getElementById("freqLabel");
const ampLabel=document.getElementById("ampLabel");
const datoTipo=document.getElementById("datoTipo");
const datoFrecuencia=document.getElementById("datoFrecuencia");
const datoAmplitud=document.getElementById("datoAmplitud");
const datoLongitud=document.getElementById("datoLongitud");
const ondaInfo=document.getElementById("ondaInfo");

const tipos={
    luminica:{nombre:"Lumínica",color:"#ffe84a",desc:"La luz visible es radiación electromagnética y puede propagarse por el vacío.",longitud:"Media"},
    calorica:{nombre:"Calorífica",color:"#ff7a45",desc:"Aquí se representa visualmente la transferencia térmica; la radiación térmica es electromagnética.",longitud:"Corta"},
    quimica:{nombre:"Química",color:"#35f5df",desc:"Se representa como una oscilación asociada a procesos moleculares, vibraciones o concentraciones.",longitud:"Variable"},
    mecanica:{nombre:"Mecánica",color:"#35aaff",desc:"Necesita un medio material para propagarse, como una cuerda, agua o un sólido.",longitud:"Media"},
    electromagnetica:{nombre:"Electromagnética",color:"#6670ff",desc:"Campos eléctricos y magnéticos oscilan y se propagan incluso en el vacío.",longitud:"Larga"},
    acustica:{nombre:"Acústica",color:"#d875ff",desc:"Es una onda mecánica de presión. El sonido necesita un medio material.",longitud:"Media"},
    gravitacional:{nombre:"Gravitacional",color:"#ff65dd",desc:"Son perturbaciones del espacio-tiempo generadas por movimientos acelerados de masas compactas.",longitud:"Muy larga"},
    nuclear:{nombre:"Nuclear",color:"#ff62f0",desc:"Se muestra como señal visual de procesos nucleares y radiación asociada.",longitud:"Muy corta"}
};
let tipoActual="luminica";
let fase=0;
let pausada=false;
let pulso=0;

function resizeCanvas(){
    const rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
    canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener("resize",resizeCanvas);resizeCanvas();

function actualizarDatos(){
    const t=tipos[tipoActual],f=Number(freqSlider.value),a=Number(ampSlider.value);
    datoTipo.textContent=t.nombre;
    datoFrecuencia.textContent=f.toFixed(1)+" Hz";
    datoAmplitud.textContent=a.toFixed(1);
    datoLongitud.textContent=t.longitud;
    freqLabel.textContent=f.toFixed(1);
    ampLabel.textContent=a.toFixed(1);
    ondaInfo.textContent=t.desc;
}

function seleccionarOnda(tipo){
    tipoActual=tipo;
    document.querySelectorAll(".onda-btn").forEach(b=>b.classList.toggle("activa",b.dataset.type===tipo));
    document.querySelectorAll(".tipo-onda").forEach(b=>b.classList.toggle("activa",b.dataset.type===tipo));
    actualizarDatos();
    mostrarMensaje("〰️ Onda seleccionada: "+tipos[tipo].nombre);
}
document.querySelectorAll(".onda-btn,.tipo-onda").forEach(el=>{
    el.addEventListener("click",()=>seleccionarOnda(el.dataset.type));
});
freqSlider.addEventListener("input",actualizarDatos);
ampSlider.addEventListener("input",actualizarDatos);

function dibujarOnda(){
    const w=canvas.clientWidth,h=canvas.clientHeight;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle="rgba(0,8,28,.72)";ctx.fillRect(0,0,w,h);
    const t=tipos[tipoActual],freq=Number(freqSlider.value),amp=Number(ampSlider.value);
    const base=h/2, amplitud=amp*55;
    ctx.strokeStyle="rgba(120,180,255,.12)";ctx.lineWidth=1;
    for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    ctx.strokeStyle="rgba(190,220,255,.18)";ctx.beginPath();ctx.moveTo(0,base);ctx.lineTo(w,base);ctx.stroke();

    ctx.strokeStyle=t.color;ctx.shadowBlur=18;ctx.shadowColor=t.color;ctx.lineWidth=3;
    ctx.beginPath();
    for(let x=0;x<=w;x++){
        const xx=x/w*12*Math.PI;
        let y=base;
        if(tipoActual==="luminica"||tipoActual==="electromagnetica"){
            y=base+Math.sin(xx*freq/2+fase)*amplitud;
        }else if(tipoActual==="mecanica"||tipoActual==="acustica"){
            y=base+Math.sin(xx*freq/2+fase)*amplitud;
        }else if(tipoActual==="gravitacional"){
            y=base+Math.sin(xx*freq/2+fase)*amplitud*.75;
        }else{
            y=base+Math.sin(xx*freq/2+fase)*amplitud;
        }
        if(pulso>0){
            const distancia=Math.abs(x-w*(.5+(Math.sin(fase*.4)*.3)));
            y+=Math.sin(distancia*.08-fase*2)*pulso*Math.exp(-distancia/170);
        }
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=t.color;ctx.font="bold 15px Arial";ctx.fillText(t.nombre,18,28);
    if(!pausada){fase+=0.035*freq}
    pulso*=.94;
    requestAnimationFrame(dibujarOnda);
}
actualizarDatos();dibujarOnda();

document.getElementById("pausaOnda").addEventListener("click",e=>{
    pausada=!pausada;e.target.textContent=pausada?"▶️ Reanudar onda":"⏸️ Pausar onda";
    mostrarMensaje(pausada?"⏸️ Onda pausada":"▶️ Onda en movimiento");
});
document.getElementById("pulsoOnda").addEventListener("click",()=>{
    pulso=65;
    tono(220,.18,"sine",.12,90);
    mostrarMensaje("💥 Pulso enviado a la onda.");
});
document.getElementById("sonidoOnda").addEventListener("click",()=>{
    if(!sonidoActivado){mostrarMensaje("🔇 Activa primero el sonido.");return}
    if(tipoActual!=="acustica"&&tipoActual!=="mecanica"){
        tono(330,.25,"sine",.08,660);
        mostrarMensaje("🔊 Representación sonora: no todas las ondas son sonidos audibles.");
    }else{
        const hz=120+Number(freqSlider.value)*55;
        tono(hz,.8,"sine",.2,hz*1.35);
        mostrarMensaje("🔊 Esta onda se ha convertido en una señal audible aproximada.");
    }
});
document.getElementById("reiniciarOnda").addEventListener("click",()=>{
    freqSlider.value=2;ampSlider.value=1;fase=0;pulso=0;pausada=false;
    document.getElementById("pausaOnda").textContent="⏸️ Pausar onda";actualizarDatos();
    mostrarMensaje("↻ Laboratorio reiniciado.");
});

/* Mini ondas animadas en las tarjetas */
document.querySelectorAll(".mini-onda").forEach((box)=>{
    const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("viewBox","0 0 300 55");
    const path=document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d","M0 28 Q15 3 30 28 T60 28 T90 28 T120 28 T150 28 T180 28 T210 28 T240 28 T270 28 T300 28");
    path.setAttribute("fill","none");path.setAttribute("stroke","currentColor");path.setAttribute("stroke-width","4");
    svg.appendChild(path);box.appendChild(svg);
    let offset=0;
    function animMini(){
        offset-=1.4;path.style.transform=`translateX(${offset%60}px)`;
        requestAnimationFrame(animMini);
    }
    animMini();
});

/* Interacciones */
document.querySelectorAll(".interaccion-card").forEach(card=>{
    card.addEventListener("click",()=>{
        const tipo=card.dataset.interaccion;
        const textos={
            interferencia:"〰️ Interferencia: prueba a cambiar la frecuencia y observa cómo se modifica el patrón.",
            resonancia:"🎵 Resonancia: un sistema puede responder con mayor amplitud cerca de una frecuencia natural.",
            difraccion:"🌊 Difracción: las ondas pueden expandirse después de pasar por una abertura.",
            superposicion:"➕ Superposición: las perturbaciones de varias ondas pueden sumarse."
        };
        pulso=45;mostrarMensaje(textos[tipo]);tono(260,.25,"sine",.1,520);
    });
});

/* Zoom sencillo de la imagen del mapa */
document.getElementById("mapaOndas").addEventListener("click",function(){
    if(this.dataset.zoom!=="1"){
        this.dataset.zoom="1";this.style.transform="scale(1.35)";this.style.cursor="zoom-out";
        mostrarMensaje("🔎 Mapa ampliado. Tócalo otra vez para volver.");
    }else{
        this.dataset.zoom="0";this.style.transform="scale(1)";this.style.cursor="zoom-in";
    }
});

/* =========================================================
   ZOOM DE LA IMAGEN ADICIONAL DE AGUJEROS NEGROS
   (Solo afecta a la imagen nueva)
========================================================= */
const imagenAgujero=document.getElementById("imagenAgujero");
if(imagenAgujero){
    imagenAgujero.dataset.zoom="0";
    imagenAgujero.addEventListener("click",()=>{
        if(imagenAgujero.dataset.zoom!=="1"){
            imagenAgujero.dataset.zoom="1";
            imagenAgujero.style.transform="scale(1.35)";
            imagenAgujero.style.cursor="zoom-out";
            mostrarMensaje("🔎 Imagen ampliada. Tócala otra vez para volver.");
        }else{
            imagenAgujero.dataset.zoom="0";
            imagenAgujero.style.transform="scale(1)";
            imagenAgujero.style.cursor="zoom-in";
        }
    });
}

/* =========================================================
   ACTIVAR AUDIO CON EL PRIMER TOQUE
========================================================= */
document.addEventListener("pointerdown",()=>{if(sonidoActivado)iniciarAudio()},{once:true});

/* Meteoritos */
document.querySelectorAll(".meteorito").forEach(meteorito=>{
    meteorito.addEventListener("animationiteration",()=>{if(Math.random()>.55)sonidoMeteorito()});
});

/* =========================================================
   BOTÓN DE SONIDO
========================================================= */
const sonidoBtn=document.getElementById("sonidoBtn");
sonidoBtn.addEventListener("click",()=>{
    sonidoActivado=!sonidoActivado;
    sonidoBtn.textContent=sonidoActivado?"🔊":"🔇";
    mostrarMensaje(sonidoActivado?"🔊 Sonido activado":"🔇 Sonido desactivado");
    if(sonidoActivado)iniciarAudio();
});

/* =========================================================
   IMPRIMIR
========================================================= */
document.getElementById("imprimirBtn").addEventListener("click",()=>{
    mostrarMensaje("🖨️ Preparando la página para imprimir...");
    setTimeout(()=>window.print(),500);
});

/* =========================================================
   COMPARTIR
========================================================= */
document.getElementById("compartirBtn").addEventListener("click",async()=>{
    const datosCompartir={
        title:"Física de lo Imposible",
        text:"🌌 Explora mi página sobre física, espacio, tiempo, agujeros negros, ondas, la Luna y el Sol.",
        url:window.location.href
    };
    if(navigator.share){
        try{await navigator.share(datosCompartir);mostrarMensaje("📤 ¡Página compartida!")}
        catch(error){console.log("Compartir cancelado")}
        return;
    }
    try{
        await navigator.clipboard.writeText(window.location.href);
        mostrarMensaje("🔗 Enlace copiado. Ya puedes pegarlo y compartirlo.");
    }catch(error){
        mostrarMensaje("📤 Copia el enlace de la página desde el navegador.");
    }
});
