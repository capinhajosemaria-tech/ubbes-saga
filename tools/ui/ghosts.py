import asyncio,os,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)+' @@ '+(e.stack or '')[:300]))
        await pg.goto('file://'+os.path.abspath(sys.argv[1]));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]');await pg.wait_for_timeout(1500)
        ks=await pg.evaluate("Object.keys(__G.DEF)")
        bad=[]
        for k in ks:
            if k=='th':continue
            n=len(errs)
            await pg.evaluate(f"(()=>{{try{{__G.startPlace?__G.startPlace('{k}'):0}}catch(e){{}}}})()")
            await pg.wait_for_timeout(120)
            if len(errs)>n:bad.append((k,errs[-1][:200]))
            await pg.keyboard.press('Escape')
        print('startPlace' ,await pg.evaluate("typeof __G.startPlace"),'bad',bad,'errs',len(errs))
        await b.close()
asyncio.run(main())
