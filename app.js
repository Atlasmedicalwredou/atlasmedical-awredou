const modules = [
 {id:"anatomie",title:"Anatomie cardiovasculaire",desc:"Cœur, vaisseaux et circulation",icon:"♥",tone:"#e0f5f1",topics:["Organisation générale du système cardiovasculaire","Anatomie externe du cœur","Cavités et valves cardiaques","Vascularisation coronaire","Circulation systémique et pulmonaire"],detail:"Découvre l’organisation du cœur et des vaisseaux, les rapports anatomiques et les bases de la circulation."},
 {id:"syndromes",title:"Syndromes et triades",desc:"Tableaux cliniques et associations",icon:"✚",tone:"#e9eef9",topics:["Syndrome coronarien aigu","Insuffisance cardiaque","Syndrome d’insuffisance artérielle périphérique","Péricardite aiguë","Thrombose veineuse profonde"],detail:"Des fiches structurées pour reconnaître les tableaux cliniques, leurs signes et leurs diagnostics différentiels."},
 {id:"semiologie",title:"Sémiologie cardiovasculaire",desc:"Signes, examens et manœuvres",icon:"⌁",tone:"#fff1df",topics:["Interrogatoire cardiovasculaire","Inspection et palpation","Auscultation cardiaque","Mesure de la pression artérielle","Recherche des signes d’insuffisance cardiaque"],detail:"Révise la démarche d’examen clinique et la signification des principaux signes cardiovasculaires."},
 {id:"bilans",title:"Bilans cardiovasculaires",desc:"Biologie et explorations",icon:"▤",tone:"#f0eafa",topics:["NFS et bilan biologique initial","Troponines : indications et limites","BNP et NT-proBNP","Ionogramme, fonction rénale","Échocardiographie : indications"],detail:"Comprends les examens complémentaires, leurs indications et les précautions d’interprétation."},
 {id:"ecg",title:"Interprétation ECG",desc:"Méthode de lecture des tracés",icon:"⌁",tone:"#fce9ec",topics:["Vérifier calibration et qualité du tracé","Fréquence et rythme","Axe électrique","Intervalles PR, QRS et QT","Analyse du segment ST et de l’onde T"],detail:"Une méthode systématique de lecture ECG, avec des exemples commentés à ajouter et valider."},
 {id:"urgences",title:"Urgences cardiovasculaires",desc:"Repères et conduite initiale",icon:"⚡",tone:"#fff4d9",topics:["Évaluation initiale ABCDE","Douleur thoracique aiguë","Arrêt cardiaque : principes de réanimation","Œdème aigu pulmonaire","Choc : reconnaissance initiale"],detail:"Des repères pédagogiques à confronter systématiquement aux protocoles locaux et recommandations en vigueur."},
 {id:"classifications",title:"Classifications et mémos",desc:"Scores et points essentiels",icon:"◎",tone:"#e8f1fa",topics:["NYHA : classe fonctionnelle","Classification de Killip","Stades de l’insuffisance cardiaque","Facteurs de risque cardiovasculaire","Mémos de révision"],detail:"Retrouve les classifications, scores et moyens mnémotechniques utiles aux révisions."},
 {id:"entrainement",title:"QCM et cas cliniques",desc:"S’entraîner et s’autoévaluer",icon:"☑",tone:"#e9f5e8",topics:["QCM de connaissances fondamentales","Cas cliniques progressifs","Correction expliquée","Révision des erreurs"],detail:"Entraîne-toi avec des questions et des cas cliniques. Les contenus finaux seront relus et référencés."}
];
const $ = s => document.querySelector(s);
const saved = new Set(JSON.parse(localStorage.getItem("atlas-favorites")||"[]"));
let currentPage="home", deferredPrompt=null;
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2100)}

function renderModules(list = modules) {
  const grid = $("#moduleGrid");
  grid.replaceChildren();

  $("#moduleCount").textContent =
    String(list.length).padStart(2, "0") + " modules";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent =
      "Aucun module trouvé. Essaie un autre mot-clé.";
    grid.appendChild(empty);
    return;
  }

  list.forEach(m => {
    const button = document.createElement("button");
    button.className = "module-card";

    const icon = document.createElement("span");
    icon.className = "module-icon";
    icon.style.backgroundColor = m.tone;
    icon.textContent = m.icon;

    const title = document.createElement("strong");
    title.textContent = m.title;

    const description = document.createElement("small");
    description.textContent = m.desc;

    button.append(icon, title, description);

    button.addEventListener("click", () => {
      openModule(m);
    });

    grid.appendChild(button);
  });
}

 list.forEach(m=>{const b=document.createElement("button");b.className="module-card";b.innerHTML=`<span class="module-icon" style="background:${m.tone}">${m.icon}</span><strong>${m.title}</strong><small>${m.desc}</small>`;b.addEventListener("click",()=>openModule(m));grid.appendChild(b)})}

function openModule(m) {
  $("#dialogTag").textContent = "ATLAS CARDIOVASCULAIRE";

  const content = $("#dialogContent");
  content.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = m.title;

  const description = document.createElement("p");
  description.textContent = m.detail;

  const list = document.createElement("ul");
  list.className = "content-list";

  m.topics.forEach(topic => {
    const item = document.createElement("li");
    item.textContent = topic;
    list.appendChild(item);
  });

  const favoriteButton = document.createElement("button");
  favoriteButton.className = "primary-btn";
  favoriteButton.textContent = saved.has(m.id)
    ? "★ Retirer des favoris"
    : "☆ Ajouter aux favoris";

  favoriteButton.addEventListener("click", () => {
    if (saved.has(m.id)) {
      saved.delete(m.id);
    } else {
      saved.add(m.id);
    }

    localStorage.setItem(
      "atlas-favorites",
      JSON.stringify([...saved])
    );

    favoriteButton.textContent = saved.has(m.id)
      ? "★ Retirer des favoris"
      : "☆ Ajouter aux favoris";

    toast(
      saved.has(m.id)
        ? "Ajouté aux favoris"
        : "Retiré des favoris"
    );
  });

  const note = document.createElement("p");
  note.className = "small-note";
  note.textContent =
    "Version prototype : ces rubriques sont une structure de départ. Les fiches médicales détaillées devront être rédigées, sourcées et validées avant diffusion.";

  content.append(title, description, list, favoriteButton, note);

  $("#moduleDialog").showModal();
}

function setPage(page){currentPage=page;document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));if(page==="home"||page==="atlas"){renderModules();$("#searchInput").placeholder=page==="atlas"?"Rechercher dans l’atlas…":"Rechercher un cours, un syndrome, un ECG…";$("#moduleGrid").style.display="grid";$(".study-card").style.display=page==="home"?"flex":"none";$(".hero").style.display=page==="home"?"block":"none";$(".section-head h2").textContent=page==="atlas"?"Atlas cardiovasculaire":"Les modules";$(".section-head .eyebrow").textContent=page==="atlas"?"PARCOURS CARDIOVASCULAIRE":"COMMENCER À EXPLORER";$(".search-box").style.display="flex";$("#searchInput").value=""}
 else if(page==="saved"){const list=modules.filter(m=>saved.has(m.id));renderModules(list);$(".hero").style.display="none";$(".study-card").style.display="none";$(".section-head h2").textContent="Mes favoris";$(".section-head .eyebrow").textContent="CONTENUS ENREGISTRÉS";$(".search-box").style.display="none";$("#moduleGrid").style.display="grid"}
 else if(page==="quiz"){renderQuiz();return}
 else{renderProfile();return}}
function renderQuiz(){ $(".hero").style.display="none";$(".study-card").style.display="none";$(".search-box").style.display="none";$(".section-head h2").textContent="Entraînement";$(".section-head .eyebrow").textContent="TESTE TES CONNAISSANCES";$("#moduleCount").textContent="QCM";$("#moduleGrid").innerHTML=`<div class="quiz-card" style="grid-column:1/-1;border:1px solid var(--line);padding:18px;border-radius:16px"><p class="eyebrow">QUESTION D’EXEMPLE</p><h3 style="font:700 17px Manrope">Quel est le pacemaker physiologique principal du cœur ?</h3><div id="quizOptions"></div><p id="quizFeedback" aria-live="polite" style="font-size:12px;color:var(--muted)"></p></div>`;$("#moduleGrid").style.display="grid";const opts=["Le nœud sinusal","Le nœud auriculo-ventriculaire","Le faisceau de His","Le réseau de Purkinje"];opts.forEach((o,i)=>{const b=document.createElement("button");b.className="quiz-option";b.textContent=o;b.onclick=()=>{document.querySelectorAll(".quiz-option").forEach(x=>x.disabled=true);b.classList.add(i===0?"correct":"wrong");$("#quizFeedback").textContent=i===0?"Bonne réponse. Le nœud sinusal est le pacemaker physiologique dominant.":"Pas tout à fait. La bonne réponse est le nœud sinusal.";};$("#quizOptions").appendChild(b)})}
function renderProfile(){ $(".hero").style.display="none";$(".study-card").style.display="none";$(".search-box").style.display="none";$(".section-head h2").textContent="Mon espace";$(".section-head .eyebrow").textContent="ATLAS MÉDICAL BY @WREDOU";$("#moduleCount").textContent="Profil local";$("#moduleGrid").innerHTML=`<div style="grid-column:1/-1;background:#f0f8f7;border:1px solid #dcefeb;border-radius:16px;padding:20px"><div style="font-size:26px">◉</div><h3 style="font:800 18px Manrope">Bienvenue dans ton atlas</h3><p style="font-size:12px;color:#718293;line-height:1.6">Tu peux commencer sans créer de compte. Tes favoris sont conservés sur cet appareil. La synchronisation entre appareils et l’espace Premium seront ajoutés dans une prochaine version.</p><button class="secondary-btn" id="clearData">Réinitialiser mes favoris</button></div>`;$("#moduleGrid").style.display="grid";$("#clearData").onclick=()=>{if(confirm("Effacer tous les favoris enregistrés sur cet appareil ?")){saved.clear();localStorage.removeItem("atlas-favorites");toast("Favoris effacés")}}}
$("#searchInput").addEventListener("input",e=>{const q=e.target.value.toLocaleLowerCase("fr");renderModules(modules.filter(m=>(m.title+" "+m.desc+" "+m.topics.join(" ")).toLocaleLowerCase("fr").includes(q)))});
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.page)));
$("#closeDialog").addEventListener("click",()=>$("#moduleDialog").close());
$("#moduleDialog").addEventListener("click",e=>{if(e.target===$("#moduleDialog"))$("#moduleDialog").close()});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").hidden=false});
$("#installBtn").addEventListener("click",async()=>{if(!deferredPrompt){toast("Sur iPhone : Safari → Partager → Sur l’écran d’accueil.");return}deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("#installBtn").hidden=true});
if("serviceWorker" in navigator && location.protocol.startsWith("http")){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>toast("Installation hors ligne indisponible pour le moment.")))}
renderModules();
