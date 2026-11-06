const form=document.getElementById('trip-form');
if(form){
 const fields=form.querySelector('.booking-fields');
 const passengers=form.elements.passengers.closest('label');
 const customers=form.querySelector('.customer-fields');
 const consent=form.querySelector('.consent');
 const security=form.querySelector('.turnstile');
 const status=form.querySelector('.submit-status');
 const submit=form.querySelector('.trip-submit-row');
 const steps=['Journey','Travellers','Contact'];
 const panels=steps.map((name,i)=>{const section=document.createElement('section');section.className='booking-step';section.setAttribute('aria-label',name);section.dataset.step=i;return section;});
 const nav=document.createElement('div');nav.className='booking-progress';nav.setAttribute('aria-label','Booking progress');
 const indicators=steps.map((name,i)=>{const span=document.createElement('span');span.textContent=`${i+1} ${name}`;nav.append(span);return span;});
 const tabs=form.querySelector('.trip-tabs');
 const requested=document.createElement('label');requested.innerHTML='Vehicle preference<select name="vehicle"><option value="Any suitable vehicle">Help me choose</option><option>Sedan</option><option>Van / Traveller</option></select>';
 panels[0].append(tabs,fields);panels[1].append(passengers,requested);panels[2].append(customers,consent,security,status,submit);
 const controls=document.createElement('div');controls.className='booking-controls';
 const back=document.createElement('button');back.type='button';back.className='btn step-back';back.textContent='← Back';
 const next=document.createElement('button');next.type='button';next.className='btn primary';next.textContent='Continue →';
 const hint=document.createElement('p');hint.className='step-hint';hint.textContent='Quote first. Confirm with Perumal.';
 controls.append(back,hint,next);form.prepend(nav);form.append(...panels,controls);
 let active=0;
 function show(i,focus=false){active=i;panels.forEach((p,n)=>p.hidden=n!==i);indicators.forEach((p,n)=>{p.classList.toggle('current',n===i);p.classList.toggle('complete',n<i);if(n===i)p.setAttribute('aria-current','step');else p.removeAttribute('aria-current');});back.hidden=i===0;next.hidden=i===2;hint.hidden=i===2;form.dataset.activeStep=String(i);if(focus)panels[i].querySelector('input:not([type=radio]),select,textarea')?.focus({preventScroll:true});}
 next.addEventListener('click',()=>{for(const input of panels[active].querySelectorAll('input,select,textarea'))if(!input.reportValidity())return;show(active+1,true);});
 back.addEventListener('click',()=>show(active-1,true));
 form.addEventListener('keydown',e=>{if(e.key==='Enter'&&active<2&&e.target.tagName!=='BUTTON'){e.preventDefault();next.click();}});
 form.addEventListener('invalid',e=>{const panel=e.target.closest('.booking-step');if(panel)show(Number(panel.dataset.step));},true);
 form.addEventListener('submit',e=>{if(active<2){e.preventDefault();e.stopImmediatePropagation();next.click();}},true);
 document.querySelectorAll('[data-enquire]').forEach(button=>button.addEventListener('click',()=>{show(0);if(button.closest('.vehicle')){form.elements.destination.value='';const choice=[...form.elements.vehicle.options].find(o=>o.value===button.dataset.enquire);if(choice)form.elements.vehicle.value=choice.value;}}));
 const review=document.createElement('div');review.className='booking-review';review.setAttribute('aria-live','polite');panels[2].prepend(review);
 function updateReview(){review.replaceChildren();const title=document.createElement('h3');title.textContent='Review your journey';review.append(title);for(const [label,value] of [['Trip',form.elements.service.value],['Pickup',form.elements.pickup.value],['Destination',form.elements.destination.value],['Date',form.elements.date.value],['Passengers',form.elements.passengers.value],['Vehicle',form.elements.vehicle.value]]){const row=document.createElement('p');const strong=document.createElement('strong');strong.textContent=label+': ';row.append(strong,document.createTextNode(value||'To be confirmed'));review.append(row);}}
 next.addEventListener('click',updateReview);form.addEventListener('input',updateReview);
 function localDestination(){const local=form.elements.service.value==='Local rental';form.elements.destination.placeholder=local?'Area or itinerary within Chennai':'Where to?';if(local&&!form.elements.destination.value)form.elements.destination.value='Chennai local rental';else if(!local&&form.elements.destination.value==='Chennai local rental')form.elements.destination.value='';}
 form.querySelectorAll('[name=service]').forEach(r=>r.addEventListener('change',localDestination));localDestination();
 show(0);
}
const hero=document.querySelector('.premium-hero');
if(hero){const dock=document.createElement('nav');dock.className='service-dock wrap';dock.setAttribute('aria-label','Choose a service');for(const [label,target,icon] of [['Book a ride','booking','↗'],['Vehicles','rentals','▰'],['Trip ideas','packages','✦'],['Corporate','corporate','▦'],['Driver partners','partners','◎']]){const link=document.createElement('a');link.href='#'+target;const mark=document.createElement('span');mark.textContent=icon;mark.setAttribute('aria-hidden','true');const text=document.createElement('strong');text.textContent=label;link.append(mark,text);dock.append(link);}hero.after(dock);}
