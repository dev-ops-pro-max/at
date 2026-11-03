import { assets } from './generated-assets.js';
export const statuses=['New','Quoted','Confirmed','In progress','Completed','Cancelled'];
const approved='amaravathitravelsavr@gmail.com';
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function json(data,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}});}
export function validateEnquiry(body){
 if(!body||typeof body!=='object'||!['rental','corporate','partner'].includes(body.kind))throw new Error('Choose an enquiry type.');
 const name=String(body.name||'').trim(),phone=String(body.phone||'').trim();
 if(name.length<2||name.length>100)throw new Error('Enter your name (2–100 characters).');
 if(!/^\+?[0-9 ()-]{8,20}$/.test(phone))throw new Error('Enter a valid contact phone number.');
 if(body.consent!==true)throw new Error('Please agree to the enquiry privacy notice.');
 if(!/^[a-zA-Z0-9-]{20,64}$/.test(body.key||''))throw new Error('Reload the page and try again.');
 if(typeof body.details!=='string'||body.details.trim().length<10||body.details.length>2500)throw new Error('Include your trip or transport requirements.');
 return {name,phone,kind:body.kind,details:body.details.trim(),key:body.key};
}
async function readJson(request){if(!request.headers.get('content-type')?.startsWith('application/json'))throw new Error('Use JSON.');const reader=request.body?.getReader();if(!reader)throw new Error('Empty request.');let size=0;const chunks=[];try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>10000){await reader.cancel();throw new Error('Request too large.');}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return JSON.parse(new TextDecoder().decode(bytes));}finally{reader.releaseLock();}}
async function requireAdmin(ctx,env){if(!env.ACCESS_AUD||!ctx.access||ctx.access.aud!==env.ACCESS_AUD)return null;const identity=await ctx.access.getIdentity();return identity?.email?.toLowerCase()===approved?identity.email:null;}
function sameOrigin(request){return request.headers.get('origin')===new URL(request.url).origin;}
async function verifyBot(request,env,token){if(!env.TURNSTILE_SECRET||typeof token!=='string'||token.length<1||token.length>2048)return false;try{const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:token,remoteip:request.headers.get('CF-Connecting-IP')||''}),signal:AbortSignal.timeout(10000)});if(!response.ok)return false;const result=await response.json();return result.success===true&&result.action==='enquiry'&&result.hostname===new URL(request.url).hostname;}catch{return false;}}
async function catalog(env){const {results}=await env.DB.prepare('SELECT id,kind,title,description,details,price FROM catalog WHERE published=1 ORDER BY rowid').all();return results;}
export function renderHome(template,rows,sitekey){let page=template;let vehicleIndex=0;const drawings=[...template.matchAll(/<div class="vehicle-art[\s\S]*?<\/svg><\/div>/g)].map(m=>m[0]);const vehicles=rows.filter(r=>r.kind==='vehicle').map(r=>`<article class="vehicle" data-category="${r.id==='van'?'group':'car'}">${['sedan','suv','van'].includes(r.id)?`<div class="vehicle-art archived-photo"><span>PHOTOS FROM AMARAVATHI TRAVELS</span><img src="/images/${r.id==='sedan'?'chennai-sedan.jpg':r.id==='suv'?'car-interior.jpg':'chennai-traveller.jpg'}" alt="${escapeHtml(r.title)} photograph supplied by Amaravathi Travels" width="612" height="464" loading="lazy"></div>`:(drawings[r.id==='suv'?1:Math.min(vehicleIndex++,drawings.length-1)]||'')}<div class="vehicle-body"><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.description)}</p><div class="specs">${escapeHtml(r.details)}</div><div class="card-bottom"><span>${escapeHtml(r.price)}</span><button data-enquire="${escapeHtml(r.title)}">Enquire ↗</button></div></div></article>`).join('');
page=page.replace(/<div class="fleet-grid">[\s\S]*?<\/div><p class="fine-print">/,`<div class="fleet-grid">${vehicles}</div><p class="fine-print">`);
const packages=rows.filter(r=>r.kind==='package').map((r,i)=>`<article class="package ${['coast','pondy','temple'][i%3]}"><div class="destination-icon">${['≈','☀','✦'][i%3]}</div><span class="tag">YOUR NEXT JOURNEY</span><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.description)}</p><p class="package-detail">${escapeHtml(r.details)}</p><p>${escapeHtml(r.price)}</p><button data-enquire="${escapeHtml(r.title)}">Ask for a package ↗</button></article>`).join('');
page=page.replace(/<div class="package-grid">[\s\S]*?<\/div><div class="tariff-note">/,`<div class="package-grid">${packages}</div><div class="tariff-note">`);
return page.replaceAll('__TURNSTILE_SITEKEY__',escapeHtml(sitekey||''));}
async function handle(request,env,ctx){const url=new URL(request.url),path=url.pathname.replace(/\/+$/,'')||'/';
 if(url.protocol==='http:'&&url.hostname!=='localhost'&&url.hostname!=='127.0.0.1'){url.protocol='https:';return Response.redirect(url.toString(),308);}
 if(path==='/healthz')return json({status:'ok',service:'amaravathi-travels',release:env.RELEASE_SHA||'local'});
 if(path==='/readyz'){try{await env.DB.prepare('SELECT 1 FROM catalog LIMIT 1').first();return json({status:'ready'});}catch{return json({status:'unavailable'},503);}}
 if(path==='/api/catalog'&&request.method==='GET')return json(await catalog(env));
 if(path==='/api/enquiries'&&request.method==='POST'){
  if(!sameOrigin(request))return json({error:'Origin not allowed'},403);
  let body,data;try{body=await readJson(request);data=validateEnquiry(body);}catch(e){return json({error:e.message},400);}
  if(!await verifyBot(request,env,body.token))return json({error:'Verification failed. Please complete the security check again.'},403);
  const id='AT-'+crypto.randomUUID().toUpperCase();
  await env.DB.prepare('INSERT INTO enquiries(id,idempotency_key,kind,name,phone,details) VALUES(?,?,?,?,?,?) ON CONFLICT(idempotency_key) DO NOTHING').bind(id,data.key,data.kind,data.name,data.phone,data.details).run();
  const row=await env.DB.prepare('SELECT id FROM enquiries WHERE idempotency_key=?').bind(data.key).first();return json({reference:row.id,message:'Enquiry received. Availability and pricing require confirmation.'},201);
 }
 if(path==='/admin'||path.startsWith('/admin/')){
  const actor=await requireAdmin(ctx,env);if(!actor)return json({error:'Staff sign-in required'},403);
  if(!['GET','HEAD'].includes(request.method)&&!sameOrigin(request))return json({error:'Origin not allowed'},403);
  if(path==='/admin/api/enquiries'&&request.method==='GET'){
   const status=url.searchParams.get('status')||'',q=(url.searchParams.get('q')||'').slice(0,100),offset=Math.max(0,Math.min(10000,Number(url.searchParams.get('offset'))||0));
   if(status&&!statuses.includes(status))return json({error:'Invalid status'},400);
   const {results}=await env.DB.prepare("SELECT * FROM enquiries WHERE (?='' OR status=?) AND (?='' OR name LIKE ? OR phone LIKE ? OR id LIKE ?) ORDER BY created_at DESC,id DESC LIMIT 51 OFFSET ?").bind(status,status,q,'%'+q+'%','%'+q+'%','%'+q+'%',offset).all();return json({items:results.slice(0,50),next:results.length>50?offset+50:null});
  }
  if(path.startsWith('/admin/api/enquiries/')&&request.method==='PATCH'){
   const id=path.split('/').pop();let b;try{b=await readJson(request);}catch{return json({error:'Invalid JSON'},400);}
   if(!statuses.includes(b.status)||!Number.isInteger(b.version)||b.version<1||typeof b.quote!=='string'||b.quote.length>500||typeof b.assigned_vehicle!=='string'||b.assigned_vehicle.length>150||typeof b.notes!=='string'||b.notes.length>2000)return json({error:'Invalid booking update'},400);
   const statements=[env.DB.prepare('UPDATE enquiries SET status=?,quote=?,assigned_vehicle=?,notes=?,version=version+1,updated_at=CURRENT_TIMESTAMP WHERE id=? AND version=?').bind(b.status,b.quote,b.assigned_vehicle,b.notes,id,b.version),env.DB.prepare("INSERT INTO audit_log(actor,event,entity_id) SELECT ?,'booking_updated',? WHERE changes()>0").bind(actor,id)];const result=await env.DB.batch(statements);return result[0].meta.changes?json({ok:true}):json({error:'This enquiry changed. Reload before saving.'},409);
  }
  if(path==='/admin/api/catalog'&&request.method==='GET')return json((await env.DB.prepare('SELECT * FROM catalog ORDER BY kind,rowid').all()).results);
  if(path==='/admin/api/catalog'&&request.method==='POST'){
   let b;try{b=await readJson(request);}catch{return json({error:'Invalid JSON'},400);}
   if(!/^[a-z0-9-]{1,50}$/.test(b.id||'')||!['vehicle','package'].includes(b.kind)||!b.title||b.title.length>100||typeof b.description!=='string'||b.description.length>1000||typeof b.details!=='string'||b.details.length>500||typeof b.price!=='string'||b.price.length>120||typeof b.published!=='boolean')return json({error:'Check all catalogue fields'},400);
   await env.DB.batch([env.DB.prepare('INSERT INTO catalog(id,kind,title,description,details,price,published) VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,title=excluded.title,description=excluded.description,details=excluded.details,price=excluded.price,published=excluded.published,updated_at=CURRENT_TIMESTAMP').bind(b.id,b.kind,b.title,b.description,b.details,b.price,b.published?1:0),env.DB.prepare("INSERT INTO audit_log(actor,event,entity_id) VALUES(?,'catalog_saved',?)").bind(actor,b.id)]);return json({ok:true});
  }
  if(path==='/admin'&&request.method==='GET')return new Response(assets['/admin.html'].body,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
  return json({error:'Not found'},404);
 }
 if(!['GET','HEAD'].includes(request.method))return json({error:'Method not allowed'},405);
 if(path==='/'){return new Response(request.method==='HEAD'?null:renderHome(assets['/index.html'].body,await catalog(env),env.TURNSTILE_SITEKEY),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});}
 const asset=assets[path]||assets[path+'.html'];if(asset)return new Response(request.method==='HEAD'?null:(asset.binary?Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)):asset.body),{headers:{'Content-Type':asset.type,'Cache-Control':path.endsWith('.css')||path.endsWith('.js')?'public,max-age=300':'no-store'}});
 return new Response('Page not found',{status:404});
}
export default {async scheduled(controller,env){await env.DB.batch([env.DB.prepare("DELETE FROM enquiries WHERE updated_at < datetime('now','-180 days')"),env.DB.prepare("DELETE FROM audit_log WHERE created_at < datetime('now','-180 days')")]);},async fetch(request,env,ctx){const requestId=crypto.randomUUID(),start=Date.now();let response;try{response=await handle(request,env,ctx);}catch{console.error(JSON.stringify({event:'request_failed',requestId,path:new URL(request.url).pathname}));response=json({error:'Service temporarily unavailable. Please call Perumal.',requestId},503);}const headers=new Headers(response.headers);headers.set('X-Request-ID',requestId);headers.set('X-Content-Type-Options','nosniff');headers.set('Referrer-Policy','strict-origin-when-cross-origin');headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; style-src 'self'; img-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');console.log(JSON.stringify({event:'request',requestId,path:new URL(request.url).pathname,status:response.status,durationMs:Date.now()-start}));return new Response(response.body,{status:response.status,headers});}};
