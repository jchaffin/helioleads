#!/usr/bin/env tsx
import got from "got";
import * as cheerio from "cheerio";
import pLimit from "p-limit";
import fs from "fs";

type In = { company:string; website:string; source_url:string; city?:string; state?:string };
type Out = In & { phone?:string; email?:string; tz_override?:string };

const UA = "HelioLeadsBot/0.1 (+contact@example.com)";
const limit = pLimit(8);
const rows:In[] = JSON.parse(fs.readFileSync("installers.raw.json","utf8"));

function findPhoneEmail(html:string){
  const phone = (html.match(/\+?1?[\s.(-]?\d{3}[\s.)-]?\s?\d{3}[-.\s]?\d{4}/)?.[0]||"").trim();
  const email = (html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]||"").toLowerCase();
  return { phone, email };
}

async function fetchSafe(url:string){
  try{
    return await got(url, { headers:{ "user-agent":UA }, timeout:{ request:8000 } }).text();
  }catch{ return ""; }
}

async function enrichOne(r:In):Promise<Out>{
  const pages = [r.website, r.website + "/contact", r.website + "/about"];
  let phone="", email="";
  for (const p of pages){
    const html = await fetchSafe(p);
    const hit = findPhoneEmail(html);
    phone ||= hit.phone;
    email ||= hit.email;
    if (phone && email) break;
  }
  return { ...r, phone, email };
}

(async ()=>{
  const out:Out[] = await Promise.all(rows.map(row=>limit(()=>enrichOne(row))));
  const filtered = out.filter(r=>r.phone); // require phone
  fs.writeFileSync("installers.enriched.json", JSON.stringify(filtered, null, 2));
  console.log(`enriched ${filtered.length}/${rows.length} with phones`);
})();