const base=process.env.SITE_URL||'https://amaravathitravels.com';
for(const path of ['/','/healthz','/readyz','/privacy','/contact','/terms','/api/catalog']){const r=await fetch(base+path,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error(`${path}: HTTP ${r.status}`);console.log(path,r.status);}
for(const path of ['/admin','/admin/api/enquiries']){const r=await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(20000)});if(![302,303,401,403].includes(r.status))throw new Error(`Admin route exposed: ${path} ${r.status}`);console.log(path,'protected',r.status);}
