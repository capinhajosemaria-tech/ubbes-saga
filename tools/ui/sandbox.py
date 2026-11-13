"""Sandbox mode check: python3 ui/sandbox.py (run from tools/, after build_test.py) -> PASS/FAIL lines"""
import asyncio,os,json,sys
BAD=[]
from playwright.async_api import async_playwright
JS="""(()=>{const G=__G,out={};G.freshState('sandbox','lagertha');G.hideTitle();
 const S=G.S;out.zonesAll=G.unlockedSet().size;
 out.wood=S.res.wood;out.affordBig=G.afford({wood:1e6,gold:1e6});const w0=S.res.wood;G.pay({wood:500},1);out.payFree=S.res.wood===w0;
 const lvl5=Object.keys(G.DEF).filter(k=>G.DEF[k].lvl===5&&!G.DEF[k].hidden);out.lvl5=lvl5.length;out.lvl5Limit=lvl5.every(k=>G.limitOf(k)>0);
 const h=G.B.find(b=>b.t==='house');out.houseCanUp=G.canUpgrade(h);
 G.startCons(h,'up',h.lvl+1);G.consTick(0.01);out.upInstant=!h.cons&&h.lvl===2;
 for(let i=0;i<4;i++){G.upgradeTH();G.consTick(0.01);}out.th=G.thLevel();
 const p0=S.people.length;for(let i=0;i<20;i++){S.gameT+=G.DAY;G.dayTick();}out.people=[p0,S.people.length];out.woodAfter=S.res.wood;out.dbg=[out.wood,out.affordBig,out.payFree];
 return out;})()"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1400,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(600)
        r=await pg.evaluate(JS);await pg.wait_for_timeout(1500)
        n=await pg.evaluate("__G.N/6")
        await pg.evaluate("__G.openPanel('village')");await pg.wait_for_timeout(300)
        chips=await pg.evaluate("document.getElementById('r-wood').textContent")
        ok=lambda c,m:(print(('PASS  ' if c else 'FAIL  ')+m),None if c else BAD.append(m))
        ok(r['zonesAll']==n*n,f"all land unlocked ({r['zonesAll']}/{int(n*n)})")
        ok(r['affordBig'] and r['payFree'] and r['wood']>=999 and r['woodAfter']>=999,'endless stores '+json.dumps(r['dbg']+[r['woodAfter']]))
        ok(r['lvl5']>0 and r['lvl5Limit'],'Town Hall 5 buildings open at Town Hall 1')
        ok(r['houseCanUp'] and r['upInstant'],'upgrade allowed and instant')
        ok(r['th']==5,f"Town Hall raised to {r['th']} with no requirements")
        ok(r['people'][1]>0,f"people live on {r['people']}")
        ok(chips=='∞',f'HUD shows {chips}')
        ok(not errs,'no page errors '+json.dumps(errs[:3]))
        await b.close()
asyncio.run(main())
sys.exit(1 if BAD else 0)
