import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]');await pg.wait_for_timeout(1500)
        for z in [0.4,0.8,1.4]:
            ms=await pg.evaluate(f"(()=>{{__G.setView({z},63,60);const t0=performance.now();for(let i=0;i<20;i++)__G.render();return (performance.now()-t0)/20}})()")
            print('zoom',z,'ms/frame',round(ms,1))
        await b.close()
asyncio.run(main())
