import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseHash, headingId, searchChapters, createYoutubeModule, validChecklist } from '../lib/handbook.ts';
const book=JSON.parse(readFileSync('app/book.json','utf8'));
assert.deepEqual(book.chapters.map(c=>c.id),Array.from({length:33},(_,i)=>i+1));
assert.equal(new Set(book.videos.map(v=>v.id)).size,45);
assert.deepEqual(['核心教程','相关专题','其他视频'].map(category=>book.videos.filter(v=>v.category===category).length),[12,13,20]);
assert(!JSON.stringify(book).includes('/Users/'));
assert.equal(parseHash('#chapter-21').chapter,21);
assert.equal(parseHash('#tools').view,'tools');
assert.equal(parseHash('#chapter-8/section-8-2').anchor,'section-8-2');
for(const hash of ['#chapter-0','#chapter-34','#chapter-8/%ZZ','#javascript:alert(1)'])assert.equal(parseHash(hash).chapter,1);
assert(searchChapters(book.chapters,'Smart strategy').some(c=>c.id===15));
assert(searchChapters(book.chapters,'DNS').some(c=>c.id===8));
assert.equal(searchChapters(book.chapters,'   ').length,0);
assert.equal(searchChapters(book.chapters,'不存在的特殊词xyz123').length,0);
for(const c of book.chapters){const ids=[...c.markdown.matchAll(/^### (.+)$/gm)].map(m=>headingId(m[1]));assert.equal(new Set(ids).size,ids.length);}
for(const name of ['Proxy','节点选择','日本 "手动"','test:group']){const module=createYoutubeModule(book.module,name);const line=module.split('\n').find(l=>l.startsWith('  - "RULE-SET'));assert.equal(JSON.parse(line.slice(4)),`RULE-SET,guide-youtube,${name}`);assert(module.includes('[YAML]'));assert(module.includes('+rules:'));}
for(const name of ['',' ','a,b','a\nrules:','x'.repeat(81)])assert.throws(()=>createYoutubeModule(book.module,name));
assert.deepEqual(validChecklist([true,'true',null,false],4),[true,false,false,false]);
assert.deepEqual(validChecklist(null,3),[false,false,false]);
const checks=[...book.chapters[20].markdown.matchAll(/^- \[ \] (.+)$/gm)];assert.equal(checks.length,10);
for(const f of ['openclash-guide.md','video-index.md','provider-example.yaml','youtube-overwrite.conf'])assert(readFileSync('public/downloads/'+f,'utf8').length>200);
console.log('Passed: 33 chapters, 86 mapped source pages, 45 videos, downloads, search, deep links, module input validation, checklist recovery.');

assert.equal(parseHash('#chapter-33').chapter,33);
assert.equal(parseHash('#library').view,'library');
assert.equal(book.library.entries.length,86);
assert.equal(new Set(book.library.entries.map(e=>e.path)).size,86);
assert(book.library.entries.every(e=>e.url.includes(book.library.commit)&&e.chapter>=1&&e.chapter<=33));
assert(searchChapters(book.chapters,'socks5h').some(c=>c.id===24));
assert(searchChapters(book.chapters,'NAT').some(c=>c.id===27));
const page=readFileSync('app/page.tsx','utf8');
assert(!page.includes('href="/downloads/'));
assert(readFileSync('content/integration-notes.md','utf8').includes('CC BY-NC 4.0'));
for(const c of book.chapters){for(const m of c.markdown.matchAll(/\]\(#chapter-(\d+)(?:[^)]*)\)/g))assert(book.chapters.some(x=>x.id===Number(m[1])));}
console.log('Passed: fq-book coverage, relative downloads, extended routes, attribution, integrated search.');
