import asyncio, os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1440,'height':900})
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html')); await pg.wait_for_timeout(500)
        await pg.click('#t-new'); await pg.click('[data-sl="1"]'); await pg.click('[data-md="test"]'); await pg.click('[data-tl="5"]')
        await pg.wait_for_timeout(1500)
        await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true);window.__setArt(2)")
        m=await pg.evaluate("(()=>{const t=__G.B.find(b=>b.t==='market');return [t.fx+t.w/2-0.5,t.fy+t.h/2-0.5]})()")
        for v in range(4):
            await pg.evaluate(f"window.__setMk({v});__G.setView(2.4,{m[0]},{m[1]})"); await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'shots/m_{v}.png',clip={'x':370,'y':200,'width':700,'height':480})
        print(m,errs); await b.close()
asyncio.run(main())
