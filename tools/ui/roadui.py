import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,vp,mob in [('pc',{'width':1440,'height':900},False),('ip',{'width':390,'height':844},True)]:
            ctx=await b.new_context(viewport=vp,is_mobile=mob,has_touch=mob);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
            await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="3"]');await pg.wait_for_timeout(1200)
            await pg.evaluate("__G.setSpeed(0)")
            await pg.click('#btn-build' if mob else '[data-dc="Homes"]');await pg.wait_for_timeout(300);await pg.screenshot(path=f'shots/{name}_buildmenu.png')
            vis=await pg.evaluate("(()=>{const b=document.querySelector('[data-cat=\"Sea\"]')||document.querySelector('[data-dc=\"Sea\"]');const r=b.getBoundingClientRect();return [r.left,r.right,innerWidth]})()");print(name,'Sea tab',vis)
            await pg.keyboard.press('Escape');await pg.keyboard.press('Escape')
            if mob: await ctx.close();continue
            # road flow with mouse
            await pg.evaluate("__G.setView(1.0,51,48)");await pg.wait_for_timeout(200)
            await pg.click('#dk-road');await pg.wait_for_timeout(200);await pg.screenshot(path='shots/pc_roadstart.png');print('ERRS',errs,'MB',await pg.evaluate("[document.getElementById('modebar').hidden,document.getElementById('mode-msg').innerHTML.slice(0,80)]"))
            cx,cy=vp['width']//2,vp['height']//2
            A=await pg.evaluate('''(()=>{const G=__G,N=G.N;const ok=(x,y)=>G.isUnl(x,y)&&!G.occ[y*N+x]&&G.BUILDABLE.has(G.ter[y*N+x])&&!G.roads[y*N+x];for(let r=0;r<10;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const x=51+dx,y=48+dy;let g=true;for(let k=0;k<5;k++)if(!ok(x+k,y))g=false;if(g)return [dx,dy];}return null;})()''')
            print('A',A);sp=lambda dx,dy:(cx+(dx-dy)*32,cy+(dx+dy)*16)
            p1=sp(A[0],A[1]);p2=sp(A[0]+4,A[1])
            await pg.mouse.click(*p1);await pg.wait_for_timeout(100)
            await pg.mouse.move(*p2);await pg.wait_for_timeout(100)
            await pg.mouse.click(*p2);await pg.wait_for_timeout(150)
            n1=await pg.evaluate("document.getElementById('mode-msg').textContent")
            print('MSG',n1[:160]);btn=await pg.query_selector('#mode-acts .primary');bb=await btn.bounding_box()
            await pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2,steps=15);await pg.wait_for_timeout(100)
            n2=await pg.evaluate("document.getElementById('mode-msg').textContent")
            await pg.screenshot(path='shots/pc_roadlock.png')
            r0=await pg.evaluate("__G.roads.reduce((a,b)=>a+b,0)")
            print('L1',n1[:200]);print('L2',n2[:200])
            await btn.click(timeout=2000);await pg.wait_for_timeout(150)
            r1=await pg.evaluate("__G.roads.reduce((a,b)=>a+b,0)")
            print('locked msg',n1[:120]);print('after move',n2[:120]);print('roads',r0,'->',r1,'errs',errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
