const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];

window.addEventListener("load",()=>{
  setTimeout(()=>$("#preloader")?.classList.add("hide"),700);
  document.body.classList.add("loaded");
});

const nav=$(".nav-wrap");
const progress=$(".scroll-progress");
window.addEventListener("scroll",()=>{
  nav.classList.toggle("scrolled",scrollY>30);
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(max>0?(scrollY/max)*100:0)+"%";
},{passive:true});

const toggle=$(".menu-toggle"), links=$(".nav-links");
toggle?.addEventListener("click",()=>links.classList.toggle("open"));
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));

const cursorDot=$(".cursor-dot"),cursorRing=$(".cursor-ring");
window.addEventListener("pointermove",e=>{
  cursorDot.style.left=e.clientX+"px";cursorDot.style.top=e.clientY+"px";
  cursorRing.style.left=e.clientX+"px";cursorRing.style.top=e.clientY+"px";
});
$$("a,button,.magnetic").forEach(el=>{
  el.addEventListener("mouseenter",()=>cursorRing.classList.add("hover"));
  el.addEventListener("mouseleave",()=>cursorRing.classList.remove("hover"));
});
$$(".magnetic").forEach(el=>{
  el.addEventListener("mousemove",e=>{
    const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.12}px,${y*.12}px)`;
  });
  el.addEventListener("mouseleave",()=>el.style.transform="");
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}});
},{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));

const countObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target,end=Number(el.dataset.count),start=0,duration=1200;
    let t0=null;
    function step(t){if(!t0)t0=t;const p=Math.min((t-t0)/duration,1),v=Math.floor(start+(end-start)*(1-Math.pow(1-p,3)));el.textContent=v;if(p<1)requestAnimationFrame(step);else el.textContent=end}
    requestAnimationFrame(step);countObserver.unobserve(el);
  });
},{threshold:.7});
$$("[data-count]").forEach(el=>countObserver.observe(el));

/* Project slider */
const slides=$$(".project-slide"),dots=$("#sliderDots"),prev=$("#prevProject"),next=$("#nextProject");
let projectIndex=0;
slides.forEach((_,i)=>{const b=document.createElement("button");b.setAttribute("aria-label","Project "+(i+1));b.addEventListener("click",()=>showProject(i));dots.appendChild(b)});
function showProject(i){
  projectIndex=(i+slides.length)%slides.length;
  slides.forEach((s,n)=>s.classList.toggle("active",n===projectIndex));
  $$("#sliderDots button").forEach((b,n)=>b.classList.toggle("active",n===projectIndex));
}
prev.addEventListener("click",()=>showProject(projectIndex-1));
next.addEventListener("click",()=>showProject(projectIndex+1));
showProject(0);
let sliderTimer=setInterval(()=>showProject(projectIndex+1),6500);
$("#projectSlider").addEventListener("mouseenter",()=>clearInterval(sliderTimer));
$("#projectSlider").addEventListener("mouseleave",()=>sliderTimer=setInterval(()=>showProject(projectIndex+1),6500));

/* Touch swipe for project slider */
let touchX=0;
$("#projectSlider").addEventListener("touchstart",e=>touchX=e.changedTouches[0].screenX,{passive:true});
$("#projectSlider").addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].screenX-touchX;
  if(Math.abs(dx)>45)showProject(projectIndex+(dx<0?1:-1));
},{passive:true});

/* Testimonials */
const quotes=$$(".quote"), qButtons=$$(".quote-controls button");
qButtons.forEach(b=>b.addEventListener("click",()=>showQuote(Number(b.dataset.q))));
function showQuote(i){quotes.forEach((q,n)=>q.classList.toggle("active",n===i));qButtons.forEach((b,n)=>b.style.color=n===i?"#b7ff3c":"")}
showQuote(0);

/* Visitor weather: browser geolocation -> Open-Meteo reverse geocoding + weather */
const weatherBtn=$("#weatherBtn");
const weatherTemp=$("#weatherTemp"),weatherPlace=$("#weatherPlace"),weatherCondition=$("#weatherCondition"),weatherIcon=$(".weather-icon");

function weatherText(code){
  const map={0:["Clear sky","☀"],1:["Mainly clear","🌤"],2:["Partly cloudy","⛅"],3:["Overcast","☁"],45:["Fog","〰"],48:["Rime fog","〰"],51:["Light drizzle","🌦"],53:["Drizzle","🌦"],55:["Heavy drizzle","🌧"],61:["Light rain","🌦"],63:["Rain","🌧"],65:["Heavy rain","🌧"],71:["Light snow","🌨"],73:["Snow","❄"],75:["Heavy snow","❄"],80:["Rain showers","🌦"],81:["Rain showers","🌧"],82:["Heavy showers","⛈"],95:["Thunderstorm","⛈"],96:["Thunderstorm + hail","⛈"],99:["Thunderstorm + hail","⛈"]};
  return map[code]||["Current conditions","◌"];
}
async function loadWeather(lat,lon){
  weatherCondition.textContent="Loading local weather…";
  const [w,g]=await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code&timezone=auto`).then(r=>r.json()),
    fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`).then(r=>r.json()).catch(()=>({}))
  ]);
  const cur=w.current||{}, place=g.results?.[0];
  const [label,icon]=weatherText(cur.weather_code);
  weatherTemp.textContent=`${Math.round(cur.temperature_2m)}°C`;
  weatherPlace.textContent=place?[place.name,place.admin1,place.country].filter(Boolean).join(", "):"Your location";
  weatherCondition.textContent=`${label} · Feels like ${Math.round(cur.apparent_temperature)}°C`;
  weatherIcon.textContent=icon;
  weatherBtn.textContent="Refresh weather";
}
function locate(){
  if(!navigator.geolocation){
    weatherPlace.textContent="Geolocation is not supported";
    weatherCondition.textContent="Please use a modern browser";
    return;
  }
  weatherBtn.textContent="Requesting permission…";
  navigator.geolocation.getCurrentPosition(
    pos=>loadWeather(pos.coords.latitude,pos.coords.longitude).catch(()=>{weatherCondition.textContent="Weather service unavailable";weatherBtn.textContent="Try again"})),
    err=>{
      weatherPlace.textContent="Location permission needed";
      weatherCondition.textContent=err.code===1?"Allow location access to see local weather":"Could not detect location";
      weatherBtn.textContent="Use my location";
    },
    {enableHighAccuracy:false,timeout:10000,maximumAge:300000}
  );
}
weatherBtn.addEventListener("click",locate);

/* Contact form demo */
$("#contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  $("#formStatus").textContent="Thanks! This demo form is ready to connect to your email service or Discord webhook.";
});

/* Footer year */
$("#year").textContent=new Date().getFullYear();

/* Keyboard project navigation */
document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight")showProject(projectIndex+1);
  if(e.key==="ArrowLeft")showProject(projectIndex-1);
});

/* Subtle 3D tilt on desktop */
$$(".portrait-card,.case-card,.skill-card").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    if(innerWidth<900)return;
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(800px) rotateX(${y*-4}deg) rotateY(${x*5}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave",()=>card.style.transform="");
});