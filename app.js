let vehicles = JSON.parse(localStorage.getItem("koolTrackVehicles") || "[]");
let currentStore = localStorage.getItem("koolTrackStore") || "Koolaudio";
let currentFilter = "Todos";

const demoVehicles = [
  {id:1,client:"Manuel",phone:"",brand:"Toyota",model:"Tundra",year:"2018",plate:"ABC-123",status:"En proceso",job:"Instalación de sistema de audio SQ"},
  {id:2,client:"Carlos",phone:"",brand:"Toyota",model:"Prado",year:"2021",plate:"XYZ-789",status:"En espera",job:"Diagnóstico e instalación"},
  {id:3,client:"Alejandra",phone:"",brand:"Toyota",model:"Prius",year:"2015",plate:"DEF-456",status:"Entregado",job:"Sistema de audio y subwoofer"}
];

function selectStore(store){
  currentStore = store;
  localStorage.setItem("koolTrackStore", store);
  $("currentStore").textContent = store;
  $("storeScreen").classList.add("hidden");
  $("homeScreen").classList.remove("hidden");
  updateStats();
  renderVehicles();
}

function showStore(){
  $("homeScreen").classList.add("hidden");
  $("formModal").classList.add("hidden");
  $("storeScreen").classList.remove("hidden");
}

function openForm(){ $("formModal").classList.remove("hidden"); }
function closeForm(){ $("formModal").classList.add("hidden"); }

function $(id){return document.getElementById(id)}

function saveVehicle(){
  const v = {
    id: Date.now(),
    client: $("client").value.trim(),
    phone: $("phone").value.trim(),
    brand: $("brand").value.trim(),
    model: $("model").value.trim(),
    year: $("year").value.trim(),
    plate: $("plate").value.trim(),
    status: $("status").value,
    job: $("job").value.trim()
  };
  if(!v.client || !v.brand || !v.model){
    alert("Completa cliente, marca y modelo.");
    return;
  }
  vehicles.unshift(v);
  localStorage.setItem("koolTrackVehicles", JSON.stringify(vehicles));
  ["client","phone","brand","model","year","plate","job"].forEach(id=>$(id).value="");
  closeForm();
  updateStats();
  renderVehicles();
}

function updateStats(){
  const data = vehicles.length ? vehicles : demoVehicles;
  $("vehicleCount").textContent = data.length;
  $("processCount").textContent = data.filter(v=>v.status==="En proceso").length;
  $("deliveredCount").textContent = data.filter(v=>v.status==="Entregado").length;
}

function setFilter(filter, el){
  currentFilter = filter;
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  if(el) el.classList.add("active");
  renderVehicles();
}

function toggleFilters(){ $("filters").classList.toggle("hidden"); }

function renderVehicles(){
  const box = $("vehicleList");
  const query = $("searchInput").value.trim().toLowerCase();
  let data = vehicles.length ? vehicles : demoVehicles;

  data = data.filter(v=>{
    const matchesQuery = !query || [v.client,v.brand,v.model,v.plate,v.year].join(" ").toLowerCase().includes(query);
    const matchesFilter = currentFilter==="Todos" || v.status===currentFilter;
    return matchesQuery && matchesFilter;
  });

  if(!data.length){
    box.innerHTML = '<div class="empty">No encontramos vehículos con esos criterios.</div>';
    return;
  }

  box.innerHTML = data.slice(0,8).map(v=>{
    const cls = v.status==="Entregado" ? "done" : v.status==="En espera" ? "wait" : "process";
    return `<article class="vehicle-card">
      <div class="vehicle-photo"></div>
      <div>
        <h3>${escapeHTML(v.brand)} ${escapeHTML(v.model)}</h3>
        <p>${escapeHTML(v.year || "")} | ${escapeHTML(v.plate || "Sin placa")}</p>
        <p>Cliente: ${escapeHTML(v.client)}</p>
      </div>
      <span class="badge ${cls}">${escapeHTML(v.status)}</span>
    </article>`;
  }).join("");
}

function focusVehicles(){
  $("searchInput").focus();
  window.scrollTo({top:document.querySelector(".section-head").offsetTop-70,behavior:"smooth"});
}

function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

$("currentStore").textContent = currentStore;
updateStats();
renderVehicles();

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
