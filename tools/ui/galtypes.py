import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':520,'height':420});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)+' '+(e.stack or '')[:300]))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("document.querySelectorAll('.top,.nav,.side,.fabs').forEach(e=>e.style.display='none')")
        for t in ['hof','tower','hives','tomb','brewery','tailor','smith','weaver']:
            pos=await pg.evaluate(f"(()=>{{const b=__G.B.filter(b=>b.t==='{t}').sort((a,c)=>c.lvl-a.lvl)[0];if(!b)return null;if('{t}'==='tomb')b.proj={{done:300}};return [b.fx+b.w/2-0.5,b.fy+b.h/2-0.5]}})()")
            if not pos: print('none',t);continue
            await pg.evaluate(f"__G.setView(1.5,{pos[0]},{pos[1]-0.5})");await pg.wait_for_timeout(200);await pg.screenshot(path=f'shots/t_{t}.png')
        print('skip',await pg.evaluate('__G.GAL.skip'));print(errs[:2]);await b.close()
asyncio.run(main())
