'use strict';
const CACHE_NAME='maison777-offline-v1';
const BASE_URL=new URL('./',self.registration.scope);
const urlFor=path=>new URL(path,BASE_URL).href;
const CORE_FILES=[
 'index.html','collection.html','contact.html','offline.html','favicon.svg',
 'css/style.css','css/style.css?v=gallery-20261106-v2',
 'js/produits.js','js/medias.js?v=gallery-20261106-v2',
 'js/app.js','js/app.js?v=gallery-20261106-v6','js/checkout.js'
];
const IMAGE_FILES=['logo.png','product-logo.png',...Array.from({length:4},(_,i)=>'cover-'+String(i+1).padStart(2,'0')+'.png'),...Array.from({length:20},(_,i)=>'product-'+String(i+1).padStart(2,'0')+'.png'),...Array.from({length:4},(_,i)=>'shooting-'+String(i+1).padStart(2,'0')+'.png')].map(file=>'images/gallery/'+file);
const OFFLINE_URL=urlFor('offline.html');

self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME);
  await cache.addAll(CORE_FILES.map(path=>urlFor(path)));
  await Promise.all(IMAGE_FILES.map(async path=>{
   try{
    const response=await fetch(urlFor(path));
    if(response.ok)await cache.put(urlFor(path),response);
   }catch(error){console.warn('Maison 777 : image non préchargée pour le hors connexion.',path,error)}
  }));
  await self.skipWaiting();
 })());
});

self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name.startsWith('maison777-offline-')&&name!==CACHE_NAME).map(name=>caches.delete(name)));
  await self.clients.claim();
 })());
});

self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const requestUrl=new URL(request.url);
 if(requestUrl.origin!==self.location.origin||!requestUrl.pathname.startsWith(new URL(BASE_URL).pathname))return;
 if(/\.(mp4|webm|mov)$/i.test(requestUrl.pathname))return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   if(requestUrl.pathname===new URL(OFFLINE_URL).pathname){
    return await caches.match(OFFLINE_URL)||fetch(request);
   }
   try{
    const response=await fetch(request);
    if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone())}
    return response;
   }catch(error){
    return Response.redirect(OFFLINE_URL,302);
   }
  })());
  return;
 }
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(request,{ignoreSearch:true});
  if(cached&&/\.(png|jpe?g|svg|webp|woff2?)$/i.test(requestUrl.pathname))return cached;
  try{
   const response=await fetch(request);
   if(response.ok)await cache.put(request,response.clone());
   return response;
  }catch(error){
   if(cached)return cached;
   return new Response('',{status:504,statusText:'Offline'});
  }
 })());
});
