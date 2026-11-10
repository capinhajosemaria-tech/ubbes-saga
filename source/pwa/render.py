import os,asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for s in (180,192,512):
            pg=await b.new_page(viewport={'width':s,'height':s})
            await pg.goto('file://'+os.path.abspath('pwa/icon.html')+'#'+str(s));await pg.wait_for_timeout(200)
            await pg.screenshot(path='pwa/icon-%d.png'%s,clip={'x':0,'y':0,'width':s,'height':s})
        await b.close()
asyncio.run(main())
