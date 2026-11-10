import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for n,vp,m in [('pc',{'width':1440,'height':900},False),('ip',{'width':390,'height':844},True)]:
            ctx=await b.new_context(viewport=vp,is_mobile=m,has_touch=m);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)+(e.stack or '')[:200]))
            await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
            await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]');await pg.wait_for_timeout(1500)
            await pg.evaluate("__G.setSpeed(0);__G.openPanel('world')");await pg.wait_for_timeout(500);await pg.screenshot(path=f'shots/w2_{n}a.png')
            box=await pg.query_selector('#wmbox');bb=await box.bounding_box();cx,cy=bb['x']+bb['width']/2,bb['y']+bb['height']/2
            if not m:
                await pg.mouse.move(cx,cy);await pg.mouse.down();await pg.mouse.move(cx+300,cy+150,steps=10);await pg.mouse.up();await pg.wait_for_timeout(200)
                await pg.mouse.wheel(0,500);await pg.wait_for_timeout(300)
            else:
                await pg.click('[data-wz="1.25"]');await pg.click('[data-wz="1.25"]');await pg.wait_for_timeout(200)
            await pg.screenshot(path=f'shots/w2_{n}b.png')
            vb=await pg.evaluate("document.getElementById('wsvg').getAttribute('viewBox')");print(n,'viewBox',vb)
            await pg.click('g[data-tg="hord"]' if not m else '.wrow');await pg.wait_for_timeout(300);print(n,'sheet open',await pg.evaluate("!document.getElementById('sheet').hidden"))
            print(n,errs[:2]);await ctx.close()
        await b.close()
asyncio.run(main())
