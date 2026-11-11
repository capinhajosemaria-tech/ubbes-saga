"""PC dock + build tray + building sheet -> shots/tray.png (run from tools/)"""
import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]') if await pg.query_selector('[data-tl="5"]') else await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.click('[data-dc="Materials"]');await pg.wait_for_timeout(300);await pg.screenshot(path='shots/tray.png')
        await pg.click('[data-dc="Food"]');await pg.wait_for_timeout(300);await pg.screenshot(path='shots/tray2.png')
        await pg.click('#tray-x')
        await pg.evaluate("(()=>{const b=__G.B.find(q=>q.t==='wood');__G.setView(2,b.fx+b.w/2-0.5,b.fy+b.h/2-0.5);})()");await pg.wait_for_timeout(300)
        await pg.mouse.click(720,440);await pg.wait_for_timeout(400);await pg.screenshot(path='shots/sheet.png')
        await pg.evaluate("document.querySelector('#tray-x')&&document.querySelector('#tray-x').click()")
        ok=await pg.evaluate("typeof buildingSheet")
        print('errors',errs[:3])
        await b.close()
asyncio.run(main())
