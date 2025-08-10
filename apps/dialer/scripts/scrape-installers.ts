#!/usr/bin/env tsx
import got from "got";
import * as cheerio from "cheerio";
import { createObjectCsvWriter } from "csv-writer";
import pLimit from "p-limit";
import { URL } from "url";
import fs from "fs";

type Row = { company:string; website:string; source_url:string; city?:string; state?:string };

const SOURCES:string[] = [
  // add real directories here (state energy partner lists, trade assoc pages)
  "https://example.com/state-solar-partners",
  "https://example.com/association/members"
];

const UA = "HelioLeadsBot/0.1 (+contact@example.com)";
const limit = pLimit(6);

async function robotsAllowed(root:string, path="/"):Promise<boolean>{
  try{
    const { body } = await got(new URL("/robots.txt", root).toString(), { headers:{ "user-agent":UA }, timeout:{ request:5000 }});
    if (/Disallow:\s*\/\s*$/im.test(body)) return false;
  }catch{}
  return true;
}

function absolutize(base:string, href:string){ try{ return new URL(href, base).toString(); }catch{ return ""; } }

async function scrapeSource(url:string):Promise<Row[]>{
  const out:Row[] = [];
  const root = new URL(url).origin;
  if(!(await robotsAllowed(root))) return out;

  const html = await got(url, { headers:{ "user-agent":UA }}).text();
  const $ = cheerio.load(html);

  $("a[href]").each((_i, a)=>{
    const text = $(a).text().trim();
    const href = $(a).attr("href") || "";
    const abs = absolutize(url, href);
    if (!abs.startsWith("http")) return;
    // loose filter for likely company links
    if (/solar|energy|renew|power/i.test(text) && !/pdf|mailto:|#/.test(href)){
      out.push({ company: text.replace(/\s+/g," "), website: abs, source_url: url });
    }
  });

  // simple table rows fallback
  $("tr").each((_i,tr)=>{
    const t = $(tr).text().trim();
    const link = $(tr).find("a[href]").attr("href");
    if (link && /http/.test(link) && /solar|energy/i.test(t)){
      out.push({ company: t.slice(0,120), website: absolutize(url, link), source_url: url });
    }
  });

  return out;
}

(async ()=>{
  const raw:Row[] = (await Promise.all(SOURCES.map(s=>limit(()=>scrapeSource(s))))).flat();

  // dedupe by domain
  const byDomain = new Map<string, Row>();
  for (const r of raw){
    try{
      const u = new URL(r.website);
      const k = u.hostname.replace(/^www\./,"");
      if (!byDomain.has(k)) byDomain.set(k, r);
    }catch{}
  }
  const rows = Array.from(byDomain.values());

  fs.writeFileSync("installers.raw.json", JSON.stringify(rows, null, 2));

  const csv = createObjectCsvWriter({
    path: "installers.raw.csv",
    header: [
      { id:"company", title:"company" },
      { id:"website", title:"website" },
      { id:"source_url", title:"source_url" },
      { id:"city", title:"city" },
      { id:"state", title:"state" },
    ],
  });
  await csv.writeRecords(rows);
  console.log(`scraped ${rows.length} unique companies`);
})();