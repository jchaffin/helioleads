#!/usr/bin/env tsx
import fs from "fs";
import { enqueueLead } from "../src/schedule/enqueue";

type Lead = {
  company:string; website:string; phone:string; email?:string;
  state?:string; city?:string; tz_override?:string; source_url:string
};

const leads:Lead[] = JSON.parse(fs.readFileSync("installers.enriched.json","utf8"));

(async ()=>{
  let n=0;
  for (const l of leads){
    await enqueueLead({
      phone: l.phone,
      state: l.state,
      tz_override: l.tz_override,
      company: l.company,
      src: l.source_url
    });
    if (++n % 50 === 0) console.log(`queued ${n}`);
  }
  console.log(`queued ${n} leads`);
})();