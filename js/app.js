const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const F=n=>n.toLocaleString('fr-FR').replace(/\u202f/g,' ')+' FCFA';
let cart=[];try{cart=JSON.parse(localStorage.getItem('c777')||'[]')}catch(_){}
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
if($('#igg'))$('#igg').innerHTML=P.slice(0,6).map((x,i)=>'<a class="rv" href="'+IG+'" target="_blank" rel="noopener" aria-label="Voir sur Instagram" style="background-image:linear-gradient(180deg,rgba(20,18,16,.15),rgba(20,18,16,.42)),url(\''+x.img+'\')"></a>').join('');

// Collection
if($('#gr'))$('#gr').innerHTML=P.map((x,i)=>'<article class="pr rv" data-t="'+x.t+'"><div class="car"><div class="vis" data-i="'+i+'" tabindex="0" role="button" aria-label="Aperçu '+x.n+'" style="background-image:linear-gradient(180deg,rgba(20,18,16,.08),rgba(20,18,16,.3)),url(\''+x.img+'\')"></div><h3>'+x.n+'</h3><div class="inf"><span>'+F(x.p)+'</span><button class="add" data-i="'+i+'">Ajouter</button></div></div></article>').join('');
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
  $('#nb').textContent=cart.reduce((a,c)=>a+c.q,0);try{localStorage.setItem('c777',JSON.stringify(cart))}catch(_){}
  $('#liste').innerHTML=cart.length?cart.map((c,j)=>'<div class="li"><div class="mini" style="background-image:linear-gradient(180deg,rgba(20,18,16,.08),rgba(20,18,16,.28)),url(\''+P[c.i].img+'\')"></div><div><strong>'+P[c.i].n+'</strong><br><small>Taille '+c.t+' · '+F(P[c.i].p)+'</small></div><div class="q"><button data-j="'+j+'" data-s="-1" aria-label="Moins">−</button>'+c.q+'<button data-j="'+j+'" data-s="1" aria-label="Plus">+</button></div></div>').join(''):'<p>Ton panier est vide. Choisis une pièce dans la collection.</p>';
  const tot=cart.reduce((a,c)=>a+c.q*P[c.i].p,0);$('#tt').textContent=F(tot);
  const msg='Bonjour Maison 777, je souhaite commander :\n'+cart.map(c=>'- '+c.q+' x '+P[c.i].n+' (taille '+c.t+')').join('\n')+'\nTotal : '+F(tot);
  $('#cmd').dataset.msg=msg;
}
$('#liste').onclick=e=>{const b=e.target.closest('button');if(!b)return;const c=cart[b.dataset.j];c.q+=+b.dataset.s;if(c.q<1)cart.splice(b.dataset.j,1);rendre()};
$('#pan').onclick=()=>document.body.classList.add('ouvert');
$('#fp').onclick=$('#ombre').onclick=()=>document.body.classList.remove('ouvert');
$('#cmd').onclick=e=>{if(!cart.length){e.preventDefault();toast('Ajoute une pièce d’abord');return}
  try{navigator.clipboard.writeText($('#cmd').dataset.msg);toast('Commande copiée : colle-la dans le message')}catch(_){}};
rendre();

// Aperçu produit
if($('#gr'))$('#gr').onclick=e=>{const a=e.target.closest('.add'),v=e.target.closest('.vis');
  if(a)ajouter(+a.dataset.i,'M');else if(v)ouvrir(+v.dataset.i)};
if($('#gr'))$('#gr').onkeydown=e=>{if(e.key==='Enter'&&e.target.classList.contains('vis'))ouvrir(+e.target.dataset.i)};
function ouvrir(i){cur=i;taille='M';const x=P[i];$('#mv').className='vis';$('#mv').style.backgroundImage='linear-gradient(180deg,rgba(20,18,16,.08),rgba(20,18,16,.3)),url(\''+x.img+'\')';$('#mn').textContent=x.n;$('#md').textContent=x.d;$('#mp').textContent=F(x.p);
  $('#tl').innerHTML=['S','M','L','XL'].map(s=>'<button aria-pressed="'+(s==='M')+'">'+s+'</button>').join('');$('#mod').classList.add('on')}
$('#tl').onclick=e=>{const b=e.target.closest('button');if(!b)return;taille=b.textContent;$$('#tl button').forEach(x=>x.setAttribute('aria-pressed',x===b))};
$('#ma').onclick=()=>{ajouter(cur,taille);$('#mod').classList.remove('on')};
$('#fm2').onclick=()=>$('#mod').classList.remove('on');
$('#mod').onclick=e=>{if(e.target.id==='mod')$('#mod').classList.remove('on')};
addEventListener('keydown',e=>{if(e.key==='Escape'){$('#mod').classList.remove('on');document.body.classList.remove('ouvert')}});

// Contact : copie le message puis ouvre la discussion Instagram
if($('#fm'))$('#fm').onsubmit=e=>{e.preventDefault();
  const t='Bonjour Maison 777, ici '+$('#n').value+'. Sujet : '+$('#s').value+'.\n'+$('#m').value;
  try{navigator.clipboard.writeText(t)}catch(_){}
  window.open('https://ig.me/m/maison.777_store','_blank','noopener');
  $('#ok').textContent='Message copié. Colle-le dans la conversation Instagram qui vient de s’ouvrir.';e.target.reset()};
