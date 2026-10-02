import { cp, readdir, readFile, writeFile, mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import {basePath as base,origin} from './site-config.mjs';
const project = process.cwd();
const output = path.resolve(project, 'site');
if (path.dirname(output) !== project) throw new Error('Unsafe export directory');
await rm(output, {recursive:true,force:true});
await cp(path.resolve('dist/client'), output, {recursive:true});
async function files(dir) { const entries = await readdir(dir,{withFileTypes:true}); const result=[]; for(const e of entries){ const p=path.join(dir,e.name); if(e.isDirectory()) result.push(...await files(p)); else result.push(p); } return result; }
const routes=[];
for(const filename of await files(output)) {
 if(!filename.endsWith('.html'))continue;
 let html=await readFile(filename,'utf8');
 html=html.replaceAll('href="/manifest.webmanifest"',`href="${base}/manifest.webmanifest"`);
 await writeFile(filename,html);
 const relative=path.relative(output,filename).replaceAll('\\','/');
 if(relative==='404.html') continue;
 if(relative==='index.html'){routes.push('');continue;}
 const route=relative.slice(0,-5);
 routes.push(route);
 const target=path.join(output,route,'index.html');
 await mkdir(path.dirname(target),{recursive:true});
 await rename(filename,target);
}
await writeFile(path.join(output,'.nojekyll'),'');
if (process.env.GBET_PUBLIC_ORIGIN) await writeFile(path.join(output,'CNAME'),new URL(origin).hostname+'\n');
await writeFile(path.join(output,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(path.join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.filter(Boolean).map(r=>`<url><loc>${origin}/${r}/</loc></url>`).join('')+'</urlset>');
await writeFile(path.join(output,'manifest.webmanifest'),JSON.stringify({name:'GBET Consulting Engineers',short_name:'GBET',start_url:`${base}/mn/`,scope:`${base}/`,display:'browser',background_color:'#fafaf7',theme_color:'#003dff',icons:[{src:`${base}/logo-mark.png`,sizes:'192x192',type:'image/png'}]}));
console.log(`GitHub Pages export: ${routes.length} routes → site/ (${origin})`);
