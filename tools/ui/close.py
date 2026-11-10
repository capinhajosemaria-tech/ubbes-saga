import asyncio,os,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]');await pg.wait_for_timeout(1500)
        await pg.evaluate("__G.setSpeed(0)")
        th=await pg.evaluate("(()=>{const b=__G.B.find(b=>b.t==='th');return [b.fx+3,b.fy+3]})()")
        for z,dx,dy,n in [(1.4,0,0,'c1'),(1.4,8,6,'c2'),(1.4,-8,6,'c3'),(0.8,0,4,'c4')]:
            await pg.evaluate(f"__G.setView({z},{th[0]+dx},{th[1]+dy})");await pg.wait_for_timeout(300);await pg.screenshot(path=f'shots/{sys.argv[1]}_{n}.png')
        print(errs);await b.close()
asyncio.run(main())
