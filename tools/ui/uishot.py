import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for n,vp,m in [('pc',{'width':1440,'height':900},False),('ip',{'width':390,'height':844},True)]:
            ctx=await b.new_context(viewport=vp,is_mobile=m,has_touch=m);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)+(e.stack or '')[:200]))
            await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
            await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="relaxed"]');await pg.click('#t-skip');await pg.click('[data-ad="bjorn"]');await pg.wait_for_timeout(1200)
            await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");await pg.wait_for_timeout(900)
            await pg.screenshot(path=f'shots/ui_{n}0.png')
            if not m:
                await pg.click('[data-dc="Resources"]');await pg.wait_for_timeout(600);await pg.screenshot(path=f'shots/ui_{n}1.png')
                await pg.click('#tray-x')
                th=await pg.evaluate("(()=>{const b=__G.B.find(b=>b.t==='th');const p=[(b.fx+1-(b.fy+1))*32,(b.fx+1+b.fy+1)*16];return p})()")
                await pg.mouse.move(720,450);await pg.wait_for_timeout(200)
                await pg.mouse.click(720,450);await pg.wait_for_timeout(400);await pg.screenshot(path=f'shots/ui_{n}2.png')
            else:
                await pg.click('#btn-build');await pg.wait_for_timeout(400);await pg.screenshot(path=f'shots/ui_{n}1.png')
            print(n,errs[:2]);await ctx.close()
        await b.close()
asyncio.run(main())
