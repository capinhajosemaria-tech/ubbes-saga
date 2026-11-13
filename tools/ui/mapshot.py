import asyncio,os,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="sandbox"]');await pg.click('#t-skip');await pg.click('[data-ut="builder"]');await pg.click('[data-pg="odin"]');await pg.click('[data-ad="bjorn"]');await pg.wait_for_timeout(600)
        await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        for z,x,y,n in [(0.17,66,66,'all'),(0.45,63,60,'home'),(0.6,60,38,'mount'),(0.5,104,44,'east')]:
            await pg.evaluate(f"__G.setView({z},{x},{y})");await pg.wait_for_timeout(300);await pg.screenshot(path=f'shots/m_{n}.png')
        print('ERRS',errs);await b.close()
asyncio.run(main())
