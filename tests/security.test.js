import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from '../src/worker.js';
const origin='https://amaravathitravels.com';
const request=()=>new Request(origin+'/api/enquiries',{method:'POST',headers:{origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:'{}'});
test('enquiry throttling returns retry guidance without accessing database',async()=>{
 let calls=0;const response=await worker.fetch(request(),{ENQUIRY_RATE_LIMIT:{async limit({key}){assert.equal(key,'192.0.2.1');calls++;return {success:false};}}},{});
 assert.equal(response.status,429);assert.equal(response.headers.get('Retry-After'),'60');assert.equal(calls,1);
});
test('allowed enquiry attempts still undergo validation',async()=>{
 const response=await worker.fetch(request(),{ENQUIRY_RATE_LIMIT:{async limit(){return {success:true};}}},{});
 assert.equal(response.status,400);
});
test('CSV escapes quotes and guards formula prefixes without corrupting normal text',()=>{
 const source=readFileSync(new URL('../public/admin.js',import.meta.url),'utf8');
 const expression=source.match(/const safe=([\s\S]*?);const csv=/)[1];
 const safe=Function('return ('+expression+')')();
 for(const value of ['=1+2','+919940263719','-1','@SUM(A1)','  =1','\t=1','\n=1','＝1'])assert.ok(safe(value).startsWith('"\t'));
 assert.equal(safe('A,"B"'),'"A,""B"""');assert.equal(safe('Chennai'),'"Chennai"');
 assert.ok(source.includes(".join('\\r\\n')"));assert.ok(!source.includes("'import { assets }"));
});
test('retention failures are propagated so the platform detects failed runs',async()=>{
 await assert.rejects(worker.scheduled({},{DB:{prepare(){return {bind(){return this;}};},async batch(){throw new Error('synthetic database failure');}}}),/synthetic database failure/);
});
test('retention health requires authenticated approved staff',async()=>{
 const response=await worker.fetch(new Request(origin+'/admin/api/security-status'),{ACCESS_AUD:'test'},{});
 assert.equal(response.status,403);
});
