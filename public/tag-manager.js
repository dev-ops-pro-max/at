// Let page imagery and controls render before loading optional analytics.
let started=false;
function startTagManager(){
 if(started)return;started=true;
 const script=document.createElement('script');
 script.async=true;script.fetchPriority='low';
 script.src='https://www.googletagmanager.com/gtm.js?id=GTM-T8V2Q4L3';
 document.head.append(script);
}
for(const event of ['pointerdown','keydown'])window.addEventListener(event,startTagManager,{once:true,passive:true});
function afterLoad(){requestAnimationFrame(()=>requestAnimationFrame(()=>{
 if('requestIdleCallback' in window)window.requestIdleCallback(startTagManager,{timeout:1500});
 else setTimeout(startTagManager,0);
}));}
if(document.readyState==='complete')afterLoad();else window.addEventListener('load',afterLoad,{once:true});
