import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
async function run(status, body, network = false) {
  const dir=await mkdtemp(join(tmpdir(),'rem404-sync-test-'));
  try {
    await mkdir(join(dir,'scripts')); await mkdir(join(dir,'js'));
    await copyFile(new URL('../scripts/sync-exhibition-config.mjs',import.meta.url),join(dir,'scripts/sync.mjs'));
    await writeFile(join(dir,'js/exhibition-snapshot.json'),'original');
    await writeFile(join(dir,'js/exhibition-snapshot.js'),'original-js');
    await writeFile(join(dir,'mock.mjs'),`globalThis.fetch=async()=>{${network?'throw new Error("secret URL")':`return new Response(${JSON.stringify(JSON.stringify(body))},{status:${status}})`}};`);
    const result=spawnSync(process.execPath,['--import',join(dir,'mock.mjs'),join(dir,'scripts/sync.mjs')],{encoding:'utf8',env:{...process.env,GITHUB_REPOSITORY:'owner/REM404',REM404_FIREBASE_API_KEY:'test-secret'}});
    return {...result,json:await readFile(join(dir,'js/exhibition-snapshot.json'),'utf8'),js:await readFile(join(dir,'js/exhibition-snapshot.js'),'utf8')};
  } finally {await rm(dir,{recursive:true,force:true});}
}
for (const status of [403,404,429,500]) test(`HTTP ${status} fails safely without overwriting snapshots or leaking response`,async()=>{
 const r=await run(status,{error:{status:status===403?'PERMISSION_DENIED':'NOT_FOUND',message:'test-secret',details:[{reason:'API_KEY_HTTP_REFERRER_BLOCKED',metadata:{key:'test-secret'}}]}});
 assert.notEqual(r.status,0);assert.equal(r.json,'original');assert.equal(r.js,'original-js');assert.match(r.stderr,new RegExp(`HTTP ${status}`));assert.doesNotMatch(r.stderr,/test-secret/);
});
test('network failure preserves snapshots and redacts underlying error',async()=>{const r=await run(200,{},true);assert.notEqual(r.status,0);assert.equal(r.json,'original');assert.doesNotMatch(r.stderr,/secret URL/)});
test('successful public config updates both formats',async()=>{const r=await run(200,{fields:{status:{stringValue:'published'},titleKo:{stringValue:'전시'}}});assert.equal(r.status,0);assert.equal(JSON.parse(r.json).titleKo,'전시');assert.match(r.js,/Object.freeze/)});
