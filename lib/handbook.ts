export type Chapter = { id: number; title: string; markdown: string };
export type View = 'guide' | 'videos' | 'tools' | 'sources' | 'library';
export function parseHash(hash: string): { view: View; chapter: number; anchor: string } {
  if (['#videos', '#tools', '#sources', '#library'].includes(hash)) return {view: hash.slice(1) as View, chapter: 1, anchor: ''};
  const match = hash.match(/^#chapter-(\d+)(?:\/(.+))?$/);
  const n = Number(match?.[1]);
  try { if (Number.isInteger(n) && n >= 1 && n <= 33) return {view:'guide',chapter:n,anchor:decodeURIComponent(match?.[2] || '')}; } catch { /* malformed link returns to first chapter */ }
  return {view:'guide',chapter:1,anchor:''};
}
export function headingId(text: string) { return 'section-' + text.replace(/[`*]/g,'').toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/g,'-').replace(/-$/,''); }
export function searchChapters(chapters: Chapter[], query: string) {
  const terms=query.trim().slice(0,120).toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return chapters.filter(c=>terms.every(t=>(c.title+' '+c.markdown).toLowerCase().includes(t))).map(c=>{
    const text=c.markdown.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[#*`|]/g,'').replace(/\s+/g,' ');
    const index=Math.max(0,text.toLowerCase().indexOf(terms[0]));
    return {id:c.id,title:c.title,snippet:(index>35?'…':'')+text.slice(Math.max(0,index-35),index+135)+'…'};
  });
}
export function createYoutubeModule(template: string, name: string) {
  const group=name.trim();
  if (!group || group.length>80 || /[,\x00-\x1f\x7f]/.test(group)) throw new Error('请填写 1–80 个字符的策略组名称，不要包含逗号或换行。');
  return template.replace('使用前确认策略组叫 Proxy；否则修改最后一行。','确认下方规则中的策略组名称与现有配置一致。').replace(/  - RULE-SET,guide-youtube,Proxy/, '  - '+JSON.stringify('RULE-SET,guide-youtube,'+group));
}
export function validChecklist(value: unknown, length: number): boolean[] {
  return Array.from({length},(_,i)=>Array.isArray(value)&&value[i]===true);
}
