import asyncio, os, sys
from playwright.async_api import async_playwright
OUT=sys.argv[1] if len(sys.argv)>1 else 'cur'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':1440,'height':900})
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html')); await pg.wait_for_timeout(500)
        await pg.click('#t-new'); await pg.click('[data-sl="1"]'); await pg.click('[data-md="test"]'); await pg.click('[data-tl="5"]')
        await pg.wait_for_timeout(1500)
        await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        th=await pg.evaluate("(()=>{const t=__G.B.find(b=>b.t===\"th\");return [t.fx,t.fy]})()")
        print(th)
        for v in [0,1,2,3]:
          await pg.evaluate(f"window.__setArt({v})")
          for z,x,y,n in [(1.0,th[0]+2,th[1]+6,"a"),(2.0,th[0]+3,th[1]+5,"b")]:
            await pg.evaluate(f"__G.setView({z},{x},{y})"); await pg.wait_for_timeout(600)
            await pg.screenshot(path=f'shots/g_v{v}_{n}.png',clip={'x':40,'y':90,'width':1000,'height':640})
        print(errs)
        await b.close()
asyncio.run(main())
