#!/usr/bin/env python3
"""Regenerate docs/NUMBERS.md from the built game, so the spec's numbers never drift from the code.
Run: python3 tools/gen_numbers.py   (after python3 source/build.py)"""
import asyncio,os,json,subprocess
from playwright.async_api import async_playwright
T=os.path.dirname(os.path.abspath(__file__));R=os.path.dirname(T)
subprocess.run(['python3','build_test.py'],cwd=T,check=True,capture_output=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page()
        await pg.goto('file://'+os.path.join(T,'test.html'));await pg.wait_for_timeout(400)
        d=await pg.evaluate("""(()=>{const G=__G;const cs=c=>Object.entries(c||{}).map(e=>e[1]+' '+e[0]).join(', ');
          const ver=document.querySelector('.ver')?document.querySelector('.ver').textContent:'';
          const b=Object.keys(G.DEF).filter(k=>!G.DEF[k].hidden).map(k=>{const D=G.DEF[k];return [k,D.name,D.cat,D.lvl,D.w+'×'+D.h,cs(D.cost),D.slots||0,(D.out||'').replace(/\\|/g,'/'),(G.LIMITS[k]||[1,1,1,1,1]).join(' / ')];});
          const th=Object.keys(G.TH_UP).map(l=>{const u=G.TH_UP[l];return [l,cs(u.cost),u.pop,u.fame,u.bld.map(q=>G.DEF[q[0]].name+(q[1]>1?' lv'+q[1]:'')).join(', '),u.ms.map(id=>(G.MS.find(m=>m.id===id)||{title:id}).title).join(', ')];});
          const ms=G.MS.map(m=>[m.lv,m.title,m.goal,m.fame,(m.unlock||[]).map(k=>G.DEF[k]?G.DEF[k].name:k).join(', ')]);
          const tr=Object.keys(G.TROOPS).map(k=>{const t=G.TROOPS[k];return [k,t.n||k,t.lv,t.str,cs(t.cost||t.gear||{})];});
          const sh=Object.keys(G.SHIPS).map(k=>{const s=G.SHIPS[k];return [k,s.name,s.lv||3,cs(s.cost),s.work,(G.SHIPCAP[k]||{}).crew,(G.SHIPCAP[k]||{}).cargo];});
          const tg=G.TARGETS.map(t=>[t.n,t.reg,t.type,t.def,t.walls?'yes':'',cs(t.loot)]);
          const pa=Object.keys(G.PARTNERS).map(k=>{const P=G.PARTNERS[k];return [P.n,P.wants.join(', '),P.sells.join(', ')];});
          return {b,th,ms,tr,sh,tg,pa,hc:G.HOUSE_CAP,regions:G.REGIONS};})()""")
        await b.close()
    v=open(os.path.join(R,'source','VERSION')).read().strip()
    def table(h,rows):return '| '+' | '.join(h)+' |\n|'+'---|'*len(h)+'\n'+''.join('| '+' | '.join(str(c) for c in r)+' |\n' for r in rows)+'\n'
    md='# Ubbe\'s Saga: numbers ('+v+')\n\nGenerated from the game by `tools/gen_numbers.py`. Do not edit by hand.\n\n'
    md+='## Town Hall upgrades\n\n'+table(['To level','Materials','People','Fame earned','Buildings','Saga goals'],d['th'])
    md+='## Buildings\n\nLimits are per Town Hall level 1 / 2 / 3 / 4 / 5. Workers: +1 at building level 3 (not fields or wonders). House capacity by house level: '+' / '.join(map(str,d['hc']))+'.\n\n'
    md+=table(['Key','Name','Category','Town Hall','Size','Cost','Workers','Output','Limits'],d['b'])
    md+='## Saga goals\n\n'+table(['Age','Goal','Task','Fame','Unlocks'],d['ms'])
    md+='## Troops\n\n'+table(['Key','Name','Town Hall','Strength','Cost / gear'],d['tr'])
    md+='## Ships\n\n'+table(['Key','Name','Town Hall','Cost','Work','Crew','Cargo'],d['sh'])
    md+='## Raid targets\n\n'+table(['Place','Region','Type','Defence','Walls','Loot'],d['tg'])
    md+='## Trading partners\n\n'+table(['Partner','Wants','Sells'],d['pa'])
    os.makedirs(os.path.join(R,'docs'),exist_ok=True);open(os.path.join(R,'docs','NUMBERS.md'),'w').write(md);print('wrote docs/NUMBERS.md',len(md),'chars')
asyncio.run(main())
