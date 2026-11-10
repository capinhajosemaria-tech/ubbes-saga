import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)+' @@ '+(e.stack or '')[:600]))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="relaxed"]');await pg.click('#t-skip');await pg.click('[data-ad="bjorn"]');await pg.wait_for_timeout(800)
        await pg.screenshot(path='shots/pb0.png')
        await pg.click('#btn-build');await pg.wait_for_timeout(300)
        cards=await pg.evaluate("[...document.querySelectorAll('#sheet-card button')].map(b=>b.textContent.slice(0,25)+'|'+b.disabled)");print(cards[:14])
        el=await pg.query_selector('#sheet-card [data-b="house"]') or await pg.query_selector('#sheet-card .bcard')
        print('el',el is not None)
        await el.click();await pg.wait_for_timeout(300)
        await pg.screenshot(path='shots/pb1.png')
        st=await pg.evaluate("(()=>{const e=document.elementFromPoint(720,450);return [e.id,e.className,e.tagName]})()");print('center elem',st)
        st=await pg.evaluate("(()=>{const e=document.elementFromPoint(300,600);return [e.id,e.className,e.tagName]})()");print('elem 300,600',st)
        print('mode',await pg.evaluate("document.getElementById('modebar').hidden"),await pg.evaluate("document.getElementById('mode-msg').textContent.slice(0,120)"))
        print('errs',errs);await b.close()
asyncio.run(main())
