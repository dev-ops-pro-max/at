// Verify anonymous HTML and image delivery; this cannot inspect WhatsApp's own cache.
for(const base of ['https://amaravathitravels.com','https://app.amaravathitravels.com']){
 const response=await fetch(base+'/',{headers:{'User-Agent':'facebookexternalhit/1.1'},signal:AbortSignal.timeout(25000)});
 if(!response.ok)throw Error(base+' HTTP '+response.status);
 const html=await response.text();const head=html.split('</head>')[0];
 const title=head.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
 const image=head.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
 if(!title||!image||!image.startsWith(base+'/'))throw Error('Missing or invalid social metadata: '+base);
 const asset=await fetch(image,{headers:{'User-Agent':'facebookexternalhit/1.1'},signal:AbortSignal.timeout(25000)});
 if(!asset.ok||!asset.headers.get('content-type')?.startsWith('image/jpeg'))throw Error('Preview image unavailable: '+image);
 const bytes=new Uint8Array(await asset.arrayBuffer());if(bytes[0]!==255||bytes[1]!==216)throw Error('Invalid JPEG');
 console.log(JSON.stringify({site:base,title,image,status:asset.status,bytes:bytes.length}));
}
const redirect=await fetch('https://www.amaravathitravels.com/contact?share=test',{redirect:'manual',signal:AbortSignal.timeout(25000)});
if(redirect.status!==308||redirect.headers.get('location')!=='https://amaravathitravels.com/contact?share=test')throw Error('WWW redirect failed');
console.log('WWW redirect preserves path and query.');
