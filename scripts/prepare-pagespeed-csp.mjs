// Narrow, reviewable CSP change. Dry-run unless --write is supplied.
import {readFile,writeFile} from 'node:fs/promises';
const path='src/worker.js';
const original=await readFile(path,'utf8');
const changes=[
 ["script-src 'self' https://challenges.cloudflare.com;","script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com;"],
 ["connect-src 'self' https://challenges.cloudflare.com;","connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com;"]
];
let updated=original;
for(const [before,after] of changes){
 if(updated.split(before).length!==2)throw new Error('Expected exactly one CSP directive; inspect source before applying.');
 updated=updated.replace(before,after);
}
if(process.argv.includes('--write'))await writeFile(path,updated);
console.log(process.argv.includes('--write')?'Applied two CSP origin additions.':'Dry-run passed: exactly two CSP directives would change; no file written.');
