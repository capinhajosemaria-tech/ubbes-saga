import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for n,vp,m in [('pc',{'width':1440,'height':900},False),('ip',{'width':390,'height':844},True)]:
            ctx=await b.new_context(viewport=vp,is_mobile=m,has_touch=m);pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
            await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="3"]');await pg.wait_for_timeout(1500)
            await pg.evaluate("for(let i=0;i<3;i++)__G.dayTick();__G.setSpeed(0)");await pg.wait_for_timeout(300)
            if not m: await pg.hover('#chip-wood');await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'shots/bar_{n}.png',clip={'x':0,'y':0,'width':vp['width'],'height':360})
            print(n,errs);await ctx.close()
        await b.close()
asyncio.run(main())
