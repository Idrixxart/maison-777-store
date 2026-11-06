// Livraison, paiement et coordonnées de contact
(()=>{
  const WHATSAPP='2250787584666';
  const WAVE_URL='https://pay.wave.com/m/M_ci_27GUIufBJ3YF/c/ci/';
  const DELIVERY_KEY='maison777-delivery-v1';
  function getSavedDelivery(){try{const value=JSON.parse(localStorage.getItem(DELIVERY_KEY)||'null');return value&&typeof value==='object'?value:null}catch(error){console.error('Lecture des informations de livraison impossible.',error);return null}}
  const cmd=$('#cmd');
  cmd.textContent='Valider mon panier';
  cmd.href='#checkout-stage';
  cmd.removeAttribute('target');
  const stage=document.createElement('section');
  stage.id='checkout-stage';
  stage.hidden=true;
  stage.setAttribute('aria-labelledby','checkout-title');
  stage.innerHTML=[
    "<h3 id='checkout-title'>Informations de commande et livraison</h3>",
    '<p>Les frais affichés sont estimatifs et doivent être confirmés par Maison 777 avant le paiement. Aucun compte Google n’est nécessaire.</p>',
    "<p><span id='checkout-count'>Articles : 0</span> · Total estimé : <strong id='checkout-total'>À confirmer</strong></p>",
    "<form id='checkout-form'>",
    "<label for='delivery-name'>Nom et prénom</label><input id='delivery-name' name='name' autocomplete='name' required>",
    "<label for='delivery-phone'>Téléphone</label><input id='delivery-phone' name='phone' type='tel' autocomplete='tel' placeholder='+225…' required>",
    "<label for='delivery-commune'>Commune</label><input id='delivery-commune' name='commune' autocomplete='address-level2' required>",
    "<label for='delivery-district'>Quartier</label><input id='delivery-district' name='district' required>",
    "<label for='delivery-address'>Adresse ou indication précise</label><textarea id='delivery-address' name='address' rows='2' required></textarea>",
    "<label for='delivery-landmark'>Point de repère</label><input id='delivery-landmark' name='landmark' placeholder='Ex. près de…'>",
    "<label for='delivery-notes'>Précisions pour le livreur</label><textarea id='delivery-notes' name='notes' rows='2'></textarea>",
    "<input id='delivery-gps' type='hidden'>",
    "<div class='checkout-tools'><button type='button' class='checkout-secondary' id='checkout-location'>Utiliser ma position GPS</button><a id='checkout-map' class='checkout-secondary' target='_blank' rel='noopener' hidden>Voir l’adresse dans Google Maps</a></div>",
    "<p id='checkout-location-status' role='status' aria-live='polite'></p>",
    "<button class='btn' type='submit'>Préparer la commande sur WhatsApp</button></form>",
    "<div id='checkout-after' hidden><p id='checkout-ready' role='status'>Le récapitulatif est prêt. Dans WhatsApp, appuyez sur Envoyer pour transmettre la commande.</p><a id='whatsapp-order-link' class='btn' target='_blank' rel='noopener'>Ouvrir WhatsApp et envoyer</a><p>Le total affiché ne comprend pas la livraison. Confirmez le montant final avec Maison 777 avant tout paiement.</p><label class='fee-confirm'><input id='fee-confirmed' type='checkbox'> Maison 777 m’a confirmé les frais de livraison et le total à payer.</label><a id='wave-link' class='btn wave-link' target='_blank' rel='noopener' aria-disabled='true' tabindex='-1'>Payer avec Wave · bénéficiaire IDRIXX</a></div>",
    "<button type='button' id='checkout-back' class='checkout-secondary'>Retour au panier</button>"
  ].join('');
  cmd.parentNode.insertBefore(stage,cmd);
  $('#wave-link').href=WAVE_URL;

  const actions=document.createElement('div');
  actions.id='contact-actions';
  actions.setAttribute('aria-label','Contacter Maison 777');
  const wa=document.createElement('a');
  wa.className='contact-action';
  wa.href='https://wa.me/'+WHATSAPP+'?text=Bonjour%20Maison%20777%2C%20je%20souhaite%20un%20renseignement%20sur%20une%20commande%2C%20un%20produit%20ou%20une%20livraison.';
  wa.target='_blank';wa.rel='noopener';wa.textContent='WhatsApp';
  const call=document.createElement('a');
  call.className='contact-action';call.href='tel:+2250787584666';call.textContent='Appeler';
  actions.append(wa,call);document.body.append(actions);
  if(document.body.dataset.page==='contact'){
    const panel=$('#contact .ct>div:last-child');
    if(panel)panel.insertAdjacentHTML('beforeend',"<div id='contact-methods'><p><strong>Téléphone et WhatsApp</strong><br><a href='tel:+2250787584666'>+225 07 87 58 46 66</a></p><a class='btn' href='https://wa.me/2250787584666?text=Bonjour%20Maison%20777%2C%20je%20souhaite%20un%20renseignement.' target='_blank' rel='noopener'>Écrire sur WhatsApp</a> <a class='checkout-secondary' href='tel:+2250787584666'>Appeler</a></div>");
  }
  function updateMap(){
    const gps=$('#delivery-gps').value;
    const address=[$('#delivery-address').value,$('#delivery-district').value,$('#delivery-commune').value].filter(Boolean).join(', ');
    const query=gps||address,link=$('#checkout-map');
    if(query){link.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);link.hidden=false}
    else link.hidden=true;
  }
  const savedDelivery=getSavedDelivery();
  if(savedDelivery){
    $('#delivery-phone').value=savedDelivery.phone||'';
    $('#delivery-commune').value=savedDelivery.zone&&savedDelivery.zone!=='À confirmer'?savedDelivery.zone+', Abidjan':'Abidjan (zone à confirmer)';
    $('#delivery-district').value=savedDelivery.location||'';
    $('#delivery-address').value=savedDelivery.location||'';
    if(savedDelivery.coordinates)$('#delivery-gps').value=savedDelivery.coordinates.latitude+', '+savedDelivery.coordinates.longitude;
    updateMap();
  }
  window.addEventListener('maison777:delivery-saved',event=>{
    const delivery=event.detail;if(!delivery)return;
    $('#delivery-phone').value=delivery.phone||'';
    $('#delivery-commune').value=delivery.zone&&delivery.zone!=='À confirmer'?delivery.zone+', Abidjan':'Abidjan (zone à confirmer)';
    $('#delivery-district').value=delivery.location||'';
    $('#delivery-address').value=delivery.location||'';
    if(delivery.coordinates)$('#delivery-gps').value=delivery.coordinates.latitude+', '+delivery.coordinates.longitude;
    updateMap();
  });
  ['delivery-address','delivery-district','delivery-commune'].forEach(id=>$('#'+id).addEventListener('input',updateMap));
  $('#checkout-location').onclick=()=>{
    const status=$('#checkout-location-status');
    if(!navigator.geolocation){status.textContent='La géolocalisation n’est pas disponible. Saisis ton adresse manuellement.';return}
    status.textContent='Autorise l’accès à ta position dans ton navigateur…';
    navigator.geolocation.getCurrentPosition(pos=>{
      $('#delivery-gps').value=pos.coords.latitude.toFixed(6)+', '+pos.coords.longitude.toFixed(6);
      status.textContent='Position GPS ajoutée à la commande.';updateMap();
    },err=>{
      status.textContent=err.code===1?'Accès refusé. Tu peux saisir ton adresse manuellement.':'Position indisponible. Saisis ton adresse manuellement.';
    },{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  };
  $('#checkout-back').onclick=()=>{$('#checkout-stage').hidden=true;$('#checkout-after').hidden=true};
  $('#fee-confirmed').onchange=e=>{
    const link=$('#wave-link'),disabled=!e.target.checked;
    link.setAttribute('aria-disabled',String(disabled));
    if(disabled)link.setAttribute('tabindex','-1');else link.removeAttribute('tabindex');
  };
  $('#wave-link').onclick=e=>{
    if(e.currentTarget.getAttribute('aria-disabled')==='true'){
      e.preventDefault();toast('Confirme d’abord le montant final avec Maison 777');
    }
  };
  cmd.onclick=e=>{
    e.preventDefault();
    if(!cart.length){toast('Ajoute une pièce d’abord');return}
    const saved=getSavedDelivery();if(saved){$('#delivery-phone').value=saved.phone||'';$('#delivery-commune').value=saved.zone&&saved.zone!=='À confirmer'?saved.zone+', Abidjan':'Abidjan (zone à confirmer)';$('#delivery-district').value=saved.location||'';$('#delivery-address').value=saved.location||'';if(saved.coordinates)$('#delivery-gps').value=saved.coordinates.latitude+', '+saved.coordinates.longitude;updateMap()}
    $('#checkout-stage').hidden=false;
    $('#checkout-stage').scrollIntoView({block:'nearest',behavior:'smooth'});
  };
  $('#checkout-form').onsubmit=e=>{
    e.preventDefault();
    if(!cart.length){toast('Ton panier est vide');return}
    updateMap();
    const known=cart.every(c=>P[c.i].p!=null);
    const total=cart.reduce((sum,c)=>sum+c.q*(P[c.i].p||0),0);
    const delivery=getSavedDelivery(),deliveryFee=delivery&&Number.isFinite(Number(delivery.fee))?Number(delivery.fee):null;
    const ref=delivery&&delivery.orderRef?delivery.orderRef:'777-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+Math.random().toString(36).slice(2,7).toUpperCase();
    const gps=$('#delivery-gps').value,map=$('#checkout-map').href,d=new FormData(e.currentTarget);
    const rows=cart.map(c=>{
      const p=P[c.i].p;
      return '- '+c.q+' × '+P[c.i].n+' — taille '+c.t+' — '+(p==null?'Prix à confirmer':F(p)+' / unité, sous-total '+F(p*c.q));
    });
    const text=[
      'Commande Maison 777 — Réf. '+ref,
      'Client : '+d.get('name'),
      'Téléphone : '+d.get('phone'),
      'Commune : '+d.get('commune'),
      'Quartier : '+d.get('district'),
      'Adresse : '+d.get('address'),
      'Point de repère : '+(d.get('landmark')||'Non précisé'),
      'Précisions livreur : '+(d.get('notes')||'Aucune'),
      gps?'GPS : '+gps:'GPS : non fourni',
      !$('#checkout-map').hidden?'Google Maps : '+map:'',
      'Articles :',...rows,
      known?'Sous-total articles : '+F(total):'Sous-total articles : prix à confirmer',
      deliveryFee!==null?'Livraison estimée à '+(delivery.zone||'Abidjan')+' : '+F(deliveryFee):'Livraison : tarif à confirmer avec Maison 777',
      known&&deliveryFee!==null?'Total estimé : '+F(total+deliveryFee):'Total final : à confirmer avec Maison 777 avant paiement',
      'Paiement : Wave, bénéficiaire IDRIXX — '+WAVE_URL
    ].filter(Boolean).join(String.fromCharCode(10));
    const orderRecord={orderRef:ref,createdAt:new Date().toISOString(),customer:{name:String(d.get('name')||''),phone:String(d.get('phone')||'')},items:cart.map(c=>({name:P[c.i].n,size:c.t,quantity:c.q,unitPrice:P[c.i].p})),itemSubtotal:known?total:null,delivery:{location:String(d.get('address')||''),commune:String(d.get('commune')||''),district:String(d.get('district')||''),coordinates:gps||null,estimatedFee:deliveryFee},estimatedTotal:known&&deliveryFee!==null?total+deliveryFee:null,status:'awaiting-confirmation'};
    try{const orders=JSON.parse(localStorage.getItem('maison777-orders-v1')||'[]');if(!Array.isArray(orders))throw new Error('Données de commande locales invalides');orders.push(orderRecord);localStorage.setItem('maison777-orders-v1',JSON.stringify(orders.slice(-20)))}catch(error){console.error('Enregistrement local de la commande impossible.',error);toast('Impossible d’enregistrer la commande sur cet appareil');return}
    const url='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(text);
    $('#whatsapp-order-link').href=url;
    $('#checkout-after').hidden=false;
    $('#fee-confirmed').checked=false;
    $('#fee-confirmed').dispatchEvent(new Event('change'));
    window.open(url,'_blank','noopener,noreferrer');
  };
  const renderBase=rendre;
  rendre=function(){
    renderBase();
    $$('#liste .li').forEach((row,i)=>{
      const c=cart[i],small=row.querySelector('small');
      if(c&&small)small.innerHTML='Taille '+c.t+' · '+prix(P[c.i].p)+' / unité<br>'+(P[c.i].p==null?'Sous-total à confirmer':'Sous-total '+F(P[c.i].p*c.q));
    });
    const count=cart.reduce((a,c)=>a+c.q,0),known=cart.every(c=>P[c.i].p!=null),sum=cart.reduce((a,c)=>a+c.q*(P[c.i].p||0),0);
    $('#checkout-count').textContent='Articles : '+count;
    const delivery=getSavedDelivery(),fee=delivery&&Number.isFinite(Number(delivery.fee))?Number(delivery.fee):null;
    $('#checkout-total').textContent=known?(fee===null?F(sum):F(sum+fee)):'À confirmer';
  };
  rendre();
  $('#liste').onclick=e=>{
    const b=e.target.closest('button');if(!b)return;
    const c=cart[b.dataset.j];if(!c)return;
    c.q+=+b.dataset.s;if(c.q<1)cart.splice(b.dataset.j,1);rendre();
  };
  if($('#fm'))$('#fm').onsubmit=e=>{
    e.preventDefault();
    const text='Bonjour Maison 777, ici '+$('#n').value+'. Sujet : '+$('#s').value+'.'+String.fromCharCode(10)+$('#m').value;
    const url='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(text);
    window.open(url,'_blank','noopener,noreferrer');
    $('#ok').textContent='Le message est prêt dans WhatsApp. Appuie sur Envoyer pour le transmettre.';
  };
})();
