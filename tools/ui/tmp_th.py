import asyncio, os, sys
from playwright.async_api import async_playwright
Z=float(sys.argv[1]) if len(sys.argv)>1 else 3.0
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1440,'height':900},device_scale_factor=1)
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html')); await pg.wait_for_timeout(500)
        await pg.click('#t-new'); await pg.click('[data-sl="1"]'); await pg.click('[data-md="test"]'); await pg.click('[data-tl="5"]')
        await pg.wait_for_timeout(1500)
        await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true);window.__setArt(2);window.__setMk(1)")
        m=await pg.evaluate("(()=>{const t=__G.B.find(b=>b.t==='th');return [t.fx,t.fy,t.w,t.h,t.rot]})()")
        print(m)
        for v in range(7):
            await pg.evaluate(f"window.__setTHD({v});__G.setView({Z},{m[0]+2.3},{m[1]+3.5})"); await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'shots/th_{v}.png',clip={'x':370,'y':150,'width':700,'height':560})
        print(errs); await b.close()
asyncio.run(main())
