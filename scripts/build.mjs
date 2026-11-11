import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
const assets={};async function collect(dir,prefix=''){for(const entry of await readdir(dir,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory()){await collect(dir+'/'+entry.name,name+'/');continue;}const ext=name.split('.').pop(),binary=['jpg','jpeg','png','webp','woff'].includes(ext),body=await readFile(dir+'/'+entry.name);assets['/'+name]={body:binary?body.toString('base64'):body.toString('utf8'),binary,type:({html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'application/javascript; charset=utf-8',jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',woff:'font/woff',txt:'text/plain; charset=utf-8',xml:'application/xml',svg:'image/svg+xml'})[ext]||'text/plain'};}}await collect('public');
const optimizedPhotos=['chennai-traveller','chennai-sedan','car-interior','traveller-interior','traveller-seats'];
function optimizePhotoReferences(text){for(const name of optimizedPhotos){if(!assets['/images/'+name+'.webp'])throw new Error('Missing optimized photo: '+name);text=text.replaceAll(name+'.jpg',name+'.webp');}return text;}
for(const asset of Object.values(assets))if(asset.type.startsWith('text/html'))asset.body=optimizePhotoReferences(asset.body);


// Install the requested GTM container on public marketing pages only.
const gtmSnippet="<script async fetchpriority=\"low\" src=\"https://www.googletagmanager.com/gtm.js?id=GTM-T8V2Q4L3\"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n</script>\n";
for(const path of ['/index.html','/contact.html','/privacy.html','/terms.html']){if(assets[path].body.includes('GTM-T8V2Q4L3'))throw new Error('Duplicate GTM installation');assets[path].body=assets[path].body.replace('<head>','<head>'+gtmSnippet);}
assets['/privacy.html'].body=assets['/privacy.html'].body.replace('Last updated: 3 November 2026.','Last updated: 11 November 2026.').replace('This release does not add advertising trackers.','Google Tag Manager loads our configured website tags. Google receives technical connection information when its script loads. Tags configured in the container may process usage data or use cookies according to their settings. Our website code does not add enquiry names, phone numbers or trip details to the Google data layer.');


// Preserve cascade order while reducing mobile render-blocking requests.
const cssPaths=['/styles.css','/usability.css','/tamil-font.css','/premium.css'];
const combinedCss=cssPaths.map(path=>assets[path].body).join('\n');
const cssBundle='/site-'+createHash('sha256').update(combinedCss).digest('hex').slice(0,12)+'.css';
assets[cssBundle]={body:combinedCss,binary:false,type:'text/css; charset=utf-8'};
for(const path of cssPaths){const pattern=new RegExp('<link rel="stylesheet" href="'+path.replaceAll('.','\\.')+'[^" ]*">');if(!pattern.test(assets['/index.html'].body))throw new Error('Missing stylesheet: '+path);assets['/index.html'].body=assets['/index.html'].body.replace(pattern,path===cssPaths[0]?'<link rel="stylesheet" href="'+cssBundle+'">':'');}
assets['/index.html'].body=assets['/index.html'].body.replace(/(<details class="mobile-panel" id="[^"]+") open/g,'$1');
assets['/index.html'].body=assets['/index.html'].body.replace('<head>','<head>'+"<link rel=\"preload\" as=\"image\" href=\"/images/chennai-traveller-720.webp\" imagesrcset=\"/images/chennai-traveller-480.webp 480w, /images/chennai-traveller-720.webp 720w, /images/chennai-traveller.webp 1100w\" imagesizes=\"(max-width:700px) calc(100vw - 56px), (max-width:1000px) 44vw, 560px\" fetchpriority=\"high\">");
assets['/index.html'].body=assets['/index.html'].body.replace('class="hero-photo"','class="hero-photo" srcset="/images/chennai-traveller-480.webp 480w, /images/chennai-traveller-720.webp 720w, /images/chennai-traveller.webp 1100w" sizes="(max-width:700px) calc(100vw - 56px), (max-width:1000px) 44vw, 560px"');

await mkdir('dist',{recursive:true});await writeFile('src/generated-assets.js','export const assets='+JSON.stringify(assets)+';\n');let source=optimizePhotoReferences(await readFile('src/worker.js','utf8'));
// Keep the verified production analytics CSP fix in repeatable releases.
for(const [before,after] of [["script-src 'self' https://challenges.cloudflare.com;","script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com;"],["connect-src 'self' https://challenges.cloudflare.com;","connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com;"]]){if(source.includes(after))continue;if(source.split(before).length!==2)throw new Error('Unexpected CSP: review analytics policy before deployment.');source=source.replace(before,after);}

const gtmPolicyChanges=[["script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com;", "script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://www.googletagmanager.com 'sha256-jYHg7tXSuuVUqjy+JeRT8vyG97+Spkw5IFHdQEBbmrw=';"],["connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com;", "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com https://www.googletagmanager.com;"]];
gtmPolicyChanges[1][1]=gtmPolicyChanges[1][1].replace('https://www.googletagmanager.com;','https://www.googletagmanager.com https://www.google-analytics.com/g/collect https://region1.google-analytics.com/g/collect https://www.google.com/g/collect;');
for(const [before,after] of gtmPolicyChanges){if(source.split(before).length!==2)throw new Error('Unexpected GTM CSP directive');source=source.replace(before,after);}
await writeFile('dist/worker.mjs',source.replace("import { assets } from './generated-assets.js';",'const assets='+JSON.stringify(assets)+';'));console.log('Built Worker with '+Object.keys(assets).length+' embedded assets.');
