export function whatsappUrl(message){return 'https://wa.me/919940263719?text='+encodeURIComponent(message);}
export function tripMessage(data){return `Trip type: ${data.service}\nPickup: ${data.pickup}\nDestination: ${data.destination}\nTravel date: ${data.date}\nPassengers: ${data.passengers}\nVehicle preference: ${data.vehicle||"Any suitable vehicle"}`;}
export function corporateMessage(data){return `Company: ${data.company}\nContact: ${data.contact}\nTeam size: ${data.team}\nRequirement: ${data.requirement}\nRoutes and timings: ${data.details}`;}
if(typeof document!=='undefined'){
const date=document.querySelector('input[name="date"]');if(date){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=t=>parts.find(p=>p.type===t).value;date.min=`${get('year')}-${get('month')}-${get('day')}`;}
const dialog=document.getElementById('quote-dialog');let pendingKeys=new WeakMap();
function show(message,reference=''){document.getElementById('quote-summary').textContent=message;document.getElementById('reference').textContent=reference?'Reference: '+reference:'';document.getElementById('send-whatsapp').href=whatsappUrl(`Hello Perumal, enquiry ${reference||''}\n${message}`);dialog.showModal();}
document.getElementById('close-dialog')?.addEventListener('click',()=>dialog.close());
const forms=[...document.querySelectorAll('[data-enquiry-kind]')];
for(const form of forms){const holder=form.querySelector('.turnstile');const submit=form.querySelector('.trip-submit-row')||form.querySelector('[type="submit"]');if(holder&&submit)submit.after(holder);if(holder){holder.style.minHeight='0';holder.style.margin='8px 0';}}
const mobilePanels=[...document.querySelectorAll('details.mobile-panel')];
const mobileLayout=window.matchMedia('(max-width:700px)');
const chooser=document.querySelector('.mobile-choices');
if(chooser&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(([entry])=>document.body.classList.toggle('service-menu-visible',entry.isIntersecting));
 observer.observe(chooser);
}
function openPanel(panel){
 if(!panel||!mobileLayout.matches)return;
 for(const other of mobilePanels)other.open=other===panel;
}
function panelFromHash(){
 const id=window.location.hash.slice(1);
 const target=document.getElementById(id);
 return target?.matches('details.mobile-panel')?target:target?.closest('details.mobile-panel');
}
function setPanelLayout(){
 for(const panel of mobilePanels)panel.open=!mobileLayout.matches;
 if(mobileLayout.matches)openPanel(panelFromHash());
}
setPanelLayout();
window.addEventListener('hashchange',()=>openPanel(panelFromHash()));
const scrollBehavior=()=>window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth';
function mountWidgets(){if(!window.turnstile){setTimeout(mountWidgets,300);return;}for(const form of forms){if(form.widget!==undefined||form.dataset.securityActive!=='true')continue;const panel=form.closest('details.mobile-panel');if(panel&&!panel.open)continue;const holder=form.querySelector('.turnstile');form.widget=window.turnstile.render(holder,{sitekey:holder.dataset.sitekey,action:'enquiry',appearance:'interaction-only',theme:'light',size:holder.clientWidth<300?'compact':'flexible'});}}
for(const panel of mobilePanels)panel.addEventListener('toggle',()=>{if(mobileLayout.matches&&panel.open)for(const other of mobilePanels)if(other!==panel)other.open=false;mountWidgets();});
mobileLayout.addEventListener('change',setPanelLayout);
document.querySelectorAll('a[data-panel-target]').forEach(link=>link.addEventListener('click',()=>{if(!mobileLayout.matches)return;openPanel(document.getElementById(link.dataset.panelTarget));}));
for(const form of forms)form.addEventListener('focusin',()=>{form.dataset.securityActive='true';mountWidgets();},{once:true});
mountWidgets();
for(const form of forms){form.addEventListener('input',()=>pendingKeys.delete(form));form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const status=form.querySelector('.submit-status'),button=form.querySelector('[type="submit"]');const token=window.turnstile?.getResponse(form.widget);if(!token){status.textContent='Please complete the security check.';return;}const d=Object.fromEntries(new FormData(form));const details=form.id==='trip-form'?tripMessage(d):form.id==='corporate-form'?corporateMessage(d):d.details;const key=pendingKeys.get(form)||crypto.randomUUID();pendingKeys.set(form,key);button.disabled=true;status.textContent='Saving your enquiry…';try{const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:form.dataset.enquiryKind,name:d.customer_name||d.contact,phone:d.phone,details,consent:d.consent==='on',token,key})});const result=await response.json();if(!response.ok)throw new Error(result.error||'Could not save the enquiry.');status.replaceChildren();const heading=document.createElement('strong');heading.textContent='Enquiry submitted and recorded.';const reference=document.createElement('p');reference.textContent='Reference: '+result.reference;const note=document.createElement('p');note.textContent='Our team has received your enquiry. Perumal will confirm availability and price. You do not need to send it again on WhatsApp.';const follow=document.createElement('a');follow.href=whatsappUrl('Hello Perumal, following up on enquiry '+result.reference);follow.textContent='Optional: follow up on WhatsApp ↗';status.append(heading,reference,note,follow);button.textContent='Submitted ✓';form.dataset.submitted='true';const securityWidget=form.querySelector('.turnstile');if(securityWidget)securityWidget.hidden=true;status.scrollIntoView({behavior:scrollBehavior(),block:'center'});pendingKeys.delete(form);}catch(error){status.textContent=error.message+' You can also call +91 99402 63719.';}finally{button.disabled=form.dataset.submitted==='true';if(form.dataset.submitted!=='true')window.turnstile?.reset(form.widget);}});}
document.querySelectorAll('[data-enquire]').forEach(button=>button.addEventListener('click',()=>{const form=document.getElementById('trip-form');form.elements.destination.value=button.dataset.enquire;pendingKeys.delete(form);openPanel(form.closest('details.mobile-panel'));requestAnimationFrame(()=>{form.scrollIntoView({behavior:scrollBehavior(),block:'start'});form.elements.pickup.focus({preventScroll:true});});}));
document.querySelectorAll('[data-start-service]').forEach(link=>link.addEventListener('click',()=>{const radio=[...document.querySelectorAll('input[name=service]')].find(r=>r.value===link.dataset.startService);if(radio)radio.checked=true;}));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;});}));
}
