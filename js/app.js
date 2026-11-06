const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const F=n=>n.toLocaleString('fr-FR').replace(/\u202f/g,' ')+' FCFA';
const prix=x=>x==null?'Prix sur demande':F(x);
let cart=[];try{cart=JSON.parse(localStorage.getItem('c777-v2')||'[]')}catch(_){}
let cur=null,taille='M';

// Préchargeur 777 (une seule fois par visite)
let premiere=false;try{premiere=!sessionStorage.getItem('v777')}catch(_){}
const pre=$('#pre');
if(pre&&premiere){
  $('#slots').innerHTML=[0,1,2].map(()=>'<div><span>'+Array.from({length:20},(_,i)=>'<i>'+(i%10)+'</i>').join('')+'</span></div>').join('');
  document.body.classList.add('fige');
  setTimeout(()=>{pre.classList.add('fin');document.body.classList.remove('fige')},2900);
  try{sessionStorage.setItem('v777','1')}catch(_){}
}else if(pre){pre.remove()}
const D=pre&&premiere?2.6:.1;

// Bandeau
if($('#mq'))$('#mq').innerHTML=Array(12).fill('777 ✦ Maison 777 Store ✦ ').join('');

// Grille Instagram
if($('#igg'))$('#igg').innerHTML=M.filter(x=>x.type==='photo').slice(0,6).map(x=>'<a class="rv" href="'+IG+'" target="_blank" rel="noopener" aria-label="Découvrir '+x.title+' sur Instagram" style="background-image:linear-gradient(180deg,rgba(20,18,16,.15),rgba(20,18,16,.42)),url(\''+x.src+'\')"></a>').join('');

// Galerie des visuels et vidéos
if($('#media-grid'))$('#media-grid').innerHTML=M.map((x,i)=>'<figure class="media-card rv" data-kind="'+x.type+'">'+(x.type==='video'?'<video controls muted playsinline preload="none" poster="'+x.poster+'" aria-label="'+x.title+'"><source src="'+x.src+'" type="video/mp4"></video>':'<img src="'+x.src+'" alt="'+x.title+'" loading="lazy">')+'<figcaption>'+x.title+'</figcaption></figure>').join('');
$$('#media-filters button').forEach(b=>b.onclick=()=>{
  $$('#media-filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const f=b.dataset.mediaFilter;
  $$('.media-card').forEach(x=>x.hidden=f!=='tout'&&x.dataset.kind!==f);
});

// Collection
if($('#gr'))$('#gr').innerHTML=P.map((x,i)=>'<article class="pr rv" data-t="'+x.t+'"><div class="car"><div class="vis" data-i="'+i+'" tabindex="0" role="button" aria-label="Aperçu '+x.n+'" style="background-image:linear-gradient(180deg,rgba(20,18,16,.08),rgba(20,18,16,.3)),url(\''+x.img+'\')"></div><h3>'+x.n+'</h3><div class="inf"><span>'+prix(x.p)+'</span><button class="add" data-i="'+i+'">Ajouter</button></div></div></article>').join('');
$$('.fil button').forEach(b=>b.onclick=()=>{
  $$('.fil button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const f=b.dataset.f;
  $$('.pr').forEach(p=>{const ok=f==='tout'||p.dataset.t===f;
    if(ok){p.hidden=false;requestAnimationFrame(()=>p.classList.remove('out'))}
    else{p.classList.add('out');setTimeout(()=>{if(p.classList.contains('out'))p.hidden=true},350)}});
});

// Page courante
const pg=document.body.dataset.page;
$$('nav a.l').forEach(a=>{if(a.getAttribute('href')===pg+'.html')a.setAttribute('aria-current','page')});
$('#bg').onclick=()=>$('#nav').classList.toggle('ouv');

// Révélation au défilement
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.15});
function obs(){$$('.page.actif .rv').forEach((e,i)=>{e.style.transitionDelay=(i%4)*90+'ms';io.observe(e)})}
obs();

// Titre : apparition échelonnée
$$('#titre .m span').forEach((s,i)=>s.style.animationDelay=(D+i*.15)+'s');

// En-tête : fond au défilement, masqué en descendant
let y0=0;addEventListener('scroll',()=>{const y=scrollY;$('#hd').classList.toggle('sol',y>40);$('#hd').classList.toggle('cache',y>y0&&y>300);y0=y;
  const t=$('#ti');if(t)t.style.backgroundPosition='0 '+(y*.05)+'px'},{passive:true});

// Lueur qui suit la souris + inclinaison des cartes
if(matchMedia('(pointer:fine)').matches){
  addEventListener('mousemove',e=>{const g=$('#glow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
  document.addEventListener('mousemove',e=>{const c=e.target.closest('.car');
    $$('.car').forEach(x=>{if(x!==c)x.style.transform=''});
    if(c){const r=c.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;
      c.style.transform='rotateY('+dx*12+'deg) rotateX('+-dy*12+'deg)'}});
  $$('.btn').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.15+'px,'+(e.clientY-r.top-r.height/2)*.25+'px)'});b.addEventListener('mouseleave',()=>b.style.transform='')});
}

// Panier
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2000)}
function ajouter(i,t){const k=i+'-'+t,l=cart.find(c=>c.k===k);l?l.q++:cart.push({k,i,t,q:1});
  toast(P[i].n+' ajouté');const b=$('#pan');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');rendre()}
function rendre(){
  $('#nb').textContent=cart.reduce((a,c)=>a+c.q,0);try{localStorage.setItem('c777-v2',JSON.stringify(cart))}catch(_){}
  $('#liste').innerHTML=cart.length?cart.map((c,j)=>'<div class="li"><div class="mini" style="background-image:linear-gradient(180deg,rgba(20,18,16,.08),rgba(20,18,16,.28)),url(\''+P[c.i].img+'\')"></div><div><strong>'+P[c.i].n+'</strong><br><small>Taille '+c.t+' · '+prix(P[c.i].p)+'</small></div><div class="q"><button data-j="'+j+'" data-s="-1" aria-label="Moins">−</button>'+c.q+'<button data-j="'+j+'" data-s="1" aria-label="Plus">+</button></div></div>').join(''):'<p>Ton panier est vide. Choisis une pièce dans la collection.</p>';
  const totalConnu=cart.every(c=>P[c.i].p!=null),tot=cart.reduce((a,c)=>a+c.q*(P[c.i].p||0),0);$('#tt').textContent=totalConnu?F(tot):'À confirmer';
  const msg='Bonjour Maison 777, je souhaite commander :\n'+cart.map(c=>'- '+c.q+' x '+P[c.i].n+' (taille '+c.t+')'+(P[c.i].p==null?'':' — '+F(P[c.i].p)+' l’unité')).join('\n')+'\n'+(totalConnu?'Total : '+F(tot):'Prix et disponibilité : à confirmer');
  $('#cmd').dataset.msg=msg;
}
$('#liste').onclick=e=>{const b=e.target.closest('button');if(!b)return;const c=cart[b.dataset.j];c.q+=+b.dataset.s;if(c.q<1)cart.splice(b.dataset.j,1);rendre()};
$('#pan').onclick=()=>document.body.classList.add('ouvert');
$('#fp').onclick=$('#ombre').onclick=()=>document.body.classList.remove('ouvert');
$('#cmd').onclick=async e=>{if(!cart.length){e.preventDefault();toast('Ajoute une pièce d’abord');return}
  try{await navigator.clipboard.writeText($('#cmd').dataset.msg);toast('Commande copiée : colle-la dans le message')}
  catch(_){toast('Copie impossible ici : recopie les articles depuis le panier')}};
rendre();

// Aperçu produit
if($('#gr'))$('#gr').onclick=e=>{const a=e.target.closest('.add'),v=e.target.closest('.vis');
  if(a)ajouter(+a.dataset.i,'M');else if(v)ouvrir(+v.dataset.i)};
if($('#gr'))$('#gr').onkeydown=e=>{if(e.key==='Enter'&&e.target.classList.contains('vis'))ouvrir(+e.target.dataset.i)};
function ouvrir(i){cur=i;taille='M';const x=P[i];$('#mv').className='vis';$('#mv').style.backgroundImage='linear-gradient(180deg,rgba(20,18,16,.08),rgba(20,18,16,.3)),url(\''+x.img+'\')';$('#mn').textContent=x.n;$('#md').textContent=x.d;$('#mp').textContent=prix(x.p);
  $('#tl').innerHTML=['S','M','L','XL'].map(s=>'<button aria-pressed="'+(s==='M')+'">'+s+'</button>').join('');$('#mod').classList.add('on')}
$('#tl').onclick=e=>{const b=e.target.closest('button');if(!b)return;taille=b.textContent;$$('#tl button').forEach(x=>x.setAttribute('aria-pressed',x===b))};
$('#ma').onclick=()=>{ajouter(cur,taille);$('#mod').classList.remove('on')};
$('#fm2').onclick=()=>$('#mod').classList.remove('on');
$('#mod').onclick=e=>{if(e.target.id==='mod')$('#mod').classList.remove('on')};
addEventListener('keydown',e=>{if(e.key==='Escape'){$('#mod').classList.remove('on');document.body.classList.remove('ouvert')}});

// Contact : copie le message puis ouvre la discussion Instagram
if($('#fm'))$('#fm').onsubmit=async e=>{e.preventDefault();
  const t='Bonjour Maison 777, ici '+$('#n').value+'. Sujet : '+$('#s').value+'.\n'+$('#m').value;
  window.open('https://ig.me/m/maison.777_store','_blank','noopener');
  try{
    await navigator.clipboard.writeText(t);
    $('#ok').textContent='Message copié. Colle-le dans la conversation Instagram qui vient de s’ouvrir.';
    e.target.reset();
  }catch(_){$('#ok').textContent='La copie automatique a échoué. Copie ton message puis envoie-le sur Instagram.'}
};

const deliveryScript=document.createElement('script');deliveryScript.src='js/checkout.js';deliveryScript.async=false;document.body.append(deliveryScript);
deliveryScript.addEventListener('load',()=>{const submit=document.querySelector('#fm button[type="submit"]');if(submit)submit.textContent='Envoyer via WhatsApp';const note=[...document.querySelectorAll('#contact .ct p')].find(p=>p.textContent.includes('formulaire copie'));if(note)note.textContent='Le formulaire ouvre WhatsApp avec ton message prérempli. Appuie sur Envoyer pour nous l’adresser.'});


// Fenêtres de commande et estimation de livraison sur la page d’accueil
if(document.body.dataset.page==='index'){
  const DELIVERY_KEY='maison777-delivery-v1';
  const WHATSAPP='2250787584666';
  const zones=[
    {name:'Plateau',fee:900,aliases:['plateau']},
    {name:'Treichville',fee:900,aliases:['treichville']},
    {name:'Adjamé',fee:1500,aliases:['adjame']},
    {name:'Attécoubé',fee:1500,aliases:['attecoube']},
    {name:'Marcory',fee:1500,aliases:['marcory']},
    {name:'Koumassi',fee:1500,aliases:['koumassi']},
    {name:'Cocody',fee:2000,aliases:['cocody']},
    {name:'Port-Bouët',fee:2000,aliases:['port bouet','port-bouet','port bouet']},
    {name:'Abobo',fee:2500,aliases:['abobo']},
    {name:'Yopougon',fee:2500,aliases:['yopougon']},
    {name:'Bingerville',fee:2500,aliases:['bingerville']},
    {name:'Anyama',fee:3000,aliases:['anyama']},
    {name:'Songon',fee:3000,aliases:['songon']}
  ];
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const zoneFor=s=>zones.find(z=>z.aliases.some(a=>norm(s).includes(a)))||null;
  const readSaved=()=>{try{const d=JSON.parse(localStorage.getItem(DELIVERY_KEY)||'null');return d&&typeof d==='object'?d:null}catch(error){console.error('Lecture des informations de livraison impossible.',error);return null}};
  const overlay=document.createElement('div');
  overlay.id='holo-overlay';overlay.hidden=true;overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML=
    '<section class="holo-dialog" role="dialog" aria-modal="true" aria-labelledby="holo-title">'+
      '<button class="holo-close" type="button" aria-label="Fermer la fenêtre">×</button>'+ 
      '<div id="holo-contact-panel" hidden><h2 id="holo-title">Commander par message</h2><p class="holo-intro">Choisissez le moyen de contact qui vous convient.</p><div class="holo-contact-list">'+
        '<a class="holo-contact" target="_blank" rel="noopener noreferrer" href="https://wa.me/'+WHATSAPP+'?text=Bonjour%20Maison%20777%2C%20je%20souhaite%20commander."><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20.5 11.6a8.3 8.3 0 0 1-12.3 7.3L3 20l1.2-5A8.3 8.3 0 1 1 20.5 11.6Z"/><path d="M8 7.8c.3-.6.6-.6.9-.6h.4c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4 0 .6l-.5.7c-.2.2-.2.4 0 .7.5.9 1.2 1.5 2.1 2 .3.1.5.1.7-.1l.7-.8c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5 0 .4-.2 1.1-.7 1.5-.5.5-1.2.7-2 .6-1-.1-2.2-.6-3.5-1.7-1.6-1.4-2.7-3.2-3-4.2-.3-1 .1-1.8.5-2.3Z"/></svg>WhatsApp</a>'+
        '<a class="holo-contact" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/maison.777_store"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>Instagram</a>'+
        '<a class="holo-contact" href="contact.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h16v12H9l-5 4V5Z"/><path d="M8 9h8M8 13h5"/></svg>Contact Maison 777</a>'+
      '</div></div>'+
      '<div id="holo-delivery-panel" hidden><h2 id="holo-title-delivery">Estimer ma livraison</h2><p class="holo-intro">Livraison à moto uniquement à Abidjan. Les frais varient de 900 à 3 000 FCFA selon la commune. Les expéditions hors d’Abidjan ne sont pas encore disponibles.</p>'+
        '<form id="holo-delivery-form" novalidate><div class="holo-field"><label for="holo-location">Position, commune ou quartier</label><input id="holo-location" name="location" autocomplete="street-address" placeholder="Ex. Cocody, Riviera 2" required></div>'+
        '<div class="holo-actions"><button class="holo-secondary" type="button" id="holo-geolocate">Utiliser ma position GPS</button></div><p class="holo-note">Si vous autorisez le GPS, la position sert à identifier la commune via OpenStreetMap. Vous pouvez aussi saisir votre zone manuellement.</p><div class="holo-field"><label for="holo-phone">Numéro de téléphone</label><input id="holo-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="18" placeholder="07 00 00 00 00" required></div>'+
        '<p class="holo-status" id="holo-status" role="status" aria-live="polite"></p><div class="holo-estimate" id="holo-estimate" hidden></div><div class="holo-actions"><button class="btn" type="submit">Calculer le tarif</button><button class="btn" type="button" id="holo-confirm" hidden>Confirmer et associer à ma commande</button></div></form>'+
        '<p class="holo-note">Le tarif affiché est une estimation, à confirmer par Maison 777 avant paiement. Les informations sont conservées sur cet appareil et ajoutées au récapitulatif WhatsApp ; aucune base de données serveur n’est utilisée.</p></div>'+ 
    '</section>';
  document.body.append(overlay);
  const dialog=overlay.querySelector('.holo-dialog'),contactPanel=overlay.querySelector('#holo-contact-panel'),deliveryPanel=overlay.querySelector('#holo-delivery-panel'),closeButton=overlay.querySelector('.holo-close');
  let opener=null,pending=null,gps=null,lookupToken=0;
  function closeHolo(){overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');setTimeout(()=>{if(!overlay.classList.contains('is-open'))overlay.hidden=true},250);document.body.classList.remove('holo-active');if(opener)opener.focus()}
  function openHolo(type,trigger){opener=trigger;overlay.hidden=false;overlay.setAttribute('aria-hidden','false');contactPanel.hidden=type!=='contact';deliveryPanel.hidden=type!=='delivery';if(type==='delivery'){pending=null;gps=null;overlay.querySelector('#holo-estimate').hidden=true;overlay.querySelector('#holo-confirm').hidden=true;overlay.querySelector('#holo-status').textContent='';const saved=readSaved();if(saved){overlay.querySelector('#holo-location').value=saved.location||'';overlay.querySelector('#holo-phone').value=saved.phone||'';gps=saved.coordinates||null}}requestAnimationFrame(()=>overlay.classList.add('is-open'));document.body.classList.add('holo-active');(type==='contact'?overlay.querySelector('.holo-contact'):closeButton).focus()}
  closeButton.addEventListener('click',closeHolo);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeHolo()});
  document.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape'){closeHolo();return}if(e.key==='Tab'){const focusable=[...dialog.querySelectorAll('a[href],button:not([hidden]),input:not([disabled]),[tabindex="0"]')].filter(el=>!el.hidden&&el.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  document.querySelectorAll('.interactive-card').forEach(card=>{const activate=()=>openHolo(card.dataset.highlight,card);card.addEventListener('click',activate);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}})});
  const locationInput=overlay.querySelector('#holo-location'),phoneInput=overlay.querySelector('#holo-phone'),status=overlay.querySelector('#holo-status'),estimate=overlay.querySelector('#holo-estimate'),confirmButton=overlay.querySelector('#holo-confirm');
  overlay.querySelector('#holo-geolocate').addEventListener('click',()=>{if(!navigator.geolocation){status.textContent='La géolocalisation n’est pas disponible. Saisissez votre commune manuellement.';return}status.textContent='Autorisez l’accès à votre position dans le navigateur…';navigator.geolocation.getCurrentPosition(async position=>{gps={latitude:Number(position.coords.latitude.toFixed(6)),longitude:Number(position.coords.longitude.toFixed(6))};status.textContent='Position reçue. Identification de la commune…';const token=++lookupToken;try{const url='https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=12&lat='+encodeURIComponent(gps.latitude)+'&lon='+encodeURIComponent(gps.longitude);const response=await fetch(url,{headers:{Accept:'application/json'}});if(!response.ok)throw new Error('Service de localisation indisponible ('+response.status+').');const result=await response.json();if(token!==lookupToken)return;const a=result.address||{},parts=[a.city_district,a.municipality,a.suburb,a.city,a.town,a.village].filter(Boolean),found=zones.find(z=>parts.some(p=>z.aliases.some(alias=>norm(p).includes(alias)))||z.aliases.some(alias=>norm(result.display_name||'').includes(alias)));if(!found){status.textContent='Commune d’Abidjan non identifiée automatiquement. Vérifiez votre adresse ou saisissez la commune manuellement.';locationInput.value=result.display_name||gps.latitude+', '+gps.longitude;return}locationInput.value=[found.name, a.suburb&&norm(a.suburb)!==norm(found.name)?a.suburb:'', 'Abidjan'].filter(Boolean).join(', ');status.textContent='Commune détectée : '+found.name+'. Vérifiez l’adresse avant de continuer.'}catch(error){console.error('Géolocalisation et recherche de commune impossibles.',error);locationInput.value=gps.latitude+', '+gps.longitude;status.textContent='La commune n’a pas pu être déterminée automatiquement. Saisissez votre commune et quartier manuellement.'}},error=>{status.textContent=error.code===1?'Accès GPS refusé. Saisissez votre commune ou quartier manuellement.':'Position indisponible. Saisissez votre commune ou quartier manuellement.'},{enableHighAccuracy:true,timeout:12000,maximumAge:60000})});
  locationInput.addEventListener('input',()=>{gps=null;pending=null;estimate.hidden=true;confirmButton.hidden=true});phoneInput.addEventListener('input',()=>{pending=null;estimate.hidden=true;confirmButton.hidden=true});
  function normalizePhone(value){const digits=String(value||'').replace(/\D/g,'');const local=digits.startsWith('225')?digits.slice(3):digits;if(!/^0[157]\d{8}$/.test(local))return null;return '+225'+local}
  overlay.querySelector('#holo-delivery-form').addEventListener('submit',e=>{e.preventDefault();const location=locationInput.value.trim(),phone=normalizePhone(phoneInput.value);if(!location){status.textContent='Saisissez votre commune ou quartier.';locationInput.focus();return}if(!phone){status.textContent='Saisissez un numéro ivoirien valide (10 chiffres, préfixe 01, 05 ou 07).';phoneInput.focus();return}const zone=zoneFor(location);if(!zone&&!norm(location).includes('abidjan')){pending=null;estimate.hidden=true;confirmButton.hidden=true;status.textContent='La livraison est disponible uniquement à Abidjan. Indiquez une commune d’Abidjan ou contactez-nous pour vérifier votre zone.';return}pending={location,phone,zone:zone?zone.name:'À confirmer',fee:zone?zone.fee:null,coordinates:gps};estimate.innerHTML='';const label=document.createElement('strong');label.textContent=zone?'Estimation : '+zone.fee.toLocaleString('fr-FR')+' FCFA':'Tarif à confirmer';const details=document.createElement('span');details.textContent=(zone?zone.name:'Zone d’Abidjan à vérifier')+' · Livraison à moto';estimate.append(label,details);estimate.hidden=false;confirmButton.hidden=false;status.textContent='Vérifiez votre numéro et la zone avant de confirmer.'});
  confirmButton.addEventListener('click',()=>{if(!pending)return;const orderRef='777-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+Math.random().toString(36).slice(2,7).toUpperCase();const record={...pending,orderRef,savedAt:new Date().toISOString()};try{localStorage.setItem(DELIVERY_KEY,JSON.stringify(record));const phone=document.querySelector('#delivery-phone'),commune=document.querySelector('#delivery-commune'),address=document.querySelector('#delivery-address'),gpsField=document.querySelector('#delivery-gps');if(phone)phone.value=record.phone;if(commune)commune.value=record.zone==='À confirmer'?'Abidjan (zone à confirmer)':record.zone+', Abidjan';if(address)address.value=record.location;if(gpsField&&record.coordinates)gpsField.value=record.coordinates.latitude+', '+record.coordinates.longitude;if(typeof rendre==='function')rendre();window.dispatchEvent(new CustomEvent('maison777:delivery-saved',{detail:record}));status.textContent='Livraison associée à la commande '+orderRef+'. Les détails seront inclus dans le récapitulatif WhatsApp.';confirmButton.hidden=true;setTimeout(closeHolo,900)}catch(error){console.error('Enregistrement local des informations de livraison impossible.',error);status.textContent='Impossible d’enregistrer ces informations sur cet appareil. Vérifiez l’espace de stockage puis réessayez.'}});
  const renderBeforeDelivery=rendre;
  rendre=function(){renderBeforeDelivery();const saved=readSaved();if(saved&&Number.isFinite(saved.fee)){const known=cart.every(c=>P[c.i].p!=null),subtotal=cart.reduce((sum,c)=>sum+c.q*(P[c.i].p||0),0);$('#tt').textContent=known?F(subtotal+saved.fee):'Articles à confirmer + '+F(saved.fee)}};
  rendre();
}
