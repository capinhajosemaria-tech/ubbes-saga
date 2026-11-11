"""Force a raid on a Town Hall 5 test village and watch it: python3 ui/vraidtest.py [walls:0|1] -> shots/vr_*.png (run from tools/)"""
import asyncio,os,sys
from playwright.async_api import async_playwright
WALL=sys.argv[1] if len(sys.argv)>1 else '1'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':800});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)+(e.stack or '')[:300]))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]');await pg.wait_for_timeout(3000)
        info=await pg.evaluate("""(()=>{const G=__G;let n=0;for(let i=0;i<G.N*G.N;i++)if(G.walls()[i])n++;return {walls:n,closed:G.S.wallClosed,war:G.S.warriors,mode:G.S.mode,towers:G.B.filter(b=>b.t==='tower').length}})()""")
        print('village',info)
        if WALL!='0':
            r=await pg.evaluate('''(()=>{const G=__G,th=G.B.find(b=>b.t==='th'),R=%s,cx=th.fx+3,cy=th.fy+3;let n=0;
              for(let y=cy-R;y<=cy+R;y++)for(let x=cx-R;x<=cx+R;x++){if(!G.inMap(x,y))continue;if(Math.max(Math.abs(x-cx),Math.abs(y-cy))!==R)continue;const i=y*G.N+x;const t=G.ter[i];if(t===G.T.SEA||t===G.T.MOUNT)continue;if(G.occ[i]){const id=G.occ[i];const k=G.B.findIndex(b=>b.id===id);if(k>=0&&G.B[k].t!=='th')G.B.splice(k,1);G.rebuildOcc();}G.walls()[i]=G.roads[i]?2:1;n++;}
              let gi=-1;for(let i=0;i<G.N*G.N;i++)if(G.walls()[i]===1){gi=i;break;}if(gi>=0)G.walls()[gi]=2;G.S.wallClosed=undefined;return n;})()'''%WALL)
            print('ring segments',r,await pg.evaluate("(()=>{__G.recomputeConn();return 1})()"))
            await pg.evaluate("__G.S.modal.length=0");cl=await pg.evaluate("(()=>{__G.S.day+=0;return null})()")
            if WALL in ('8','10','12','14'): pass
        if WALL=='0': await pg.evaluate("for(let i=0;i<__G.N*__G.N;i++)__G.walls()[i]=0")
        await pg.evaluate("(()=>{const S=__G.S;while(S.modal.length)S.modal.shift();S.vr={day:S.day,n:+(new URLSearchParams('n=18').get('n')),who:'Test Jarl'};__G.dayTick();})()")
        await pg.wait_for_timeout(300)
        st=await pg.evaluate("__G.VR?{u:__G.VR.u.length,raid:__G.VR.u.filter(u=>u.side==='raid').length,def:__G.VR.u.filter(u=>u.side==='def').length,tw:__G.VR.towers.length,land:__G.VR.land}:'no VR'")
        print('start',st)
        print('dbg',await pg.evaluate("(()=>{const G=__G,V=G.VR,th=G.B.find(b=>b.t==='th');return {N:G.N,closed:G.S.wallClosed,land:[V.land%G.N,(V.land/G.N)|0],th:[th.fx,th.fy,th.w,th.h],fin:V.fin[V.land],insLand:V.ins[V.land],gates:Array.from(G.walls()).filter(v=>v===2).length}})()"))
        await pg.evaluate("document.querySelectorAll('.modal,#modal').forEach(e=>e.style.display='none')")
        await pg.click('.seg button[data-speed="4"]') if await pg.query_selector('.seg button[data-speed="4"]') else None
        for k in range(14):
            await pg.wait_for_timeout(2200)
            s=await pg.evaluate("(()=>{const V=__G.VR;if(!V)return 'over';const R=V.u.filter(u=>u.side==='raid'&&u.hp>0);const C=__G.S.wdmg||{};return {t:Math.round(V.t),raidLeft:R.length,states:R.map(u=>u.st).join(''),def:V.u.filter(u=>u.side==='def'&&u.hp>0).length,broke:V.broke,killed:V.killed,arrows:V.arch,dmg:Object.keys(C).length}})()")
            print(k,s)
            if k in (0,1,2):
                await pg.evaluate("(()=>{const V=__G.VR;if(!V)return;const u=V.u.find(u=>u.side==='raid'&&u.hp>0);if(u)__G.setView(1.6,u.x,u.y);})()");await pg.wait_for_timeout(100);await pg.screenshot(path=f'shots/vr_{k}.png')
            if s=='over':break
        m=await pg.evaluate("__G.S.modal.map(m=>m.k+':'+m.title+' | '+(m.table||[]).map(r=>r.join('=')).join('; '))")
        print('modal',m);print('errors',errs[:3])
        await b.close()
asyncio.run(main())
