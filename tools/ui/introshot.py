"""Opening screens + guide: python3 ui/introshot.py [w h] -> shots/intro_*.png (run from tools/)"""
import asyncio,os,sys
from playwright.async_api import async_playwright
W=int(sys.argv[1]) if len(sys.argv)>1 else 1440;H=int(sys.argv[2]) if len(sys.argv)>2 else 900
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':W,'height':H});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(600)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="relaxed"]');await pg.wait_for_timeout(700)
        for i in range(3):
            await pg.screenshot(path=f'shots/intro_{i}.png');await pg.click('#t-next');await pg.wait_for_timeout(500)
        for n,sel in [('trait','[data-ut="builder"]'),('patron','[data-pg="thor"]'),('adv','[data-ad="bjorn"]')]:
            await pg.wait_for_timeout(400);await pg.screenshot(path=f'shots/intro_{n}.png')
            if n=='trait':
                await pg.hover(sel);await pg.wait_for_timeout(250);await pg.screenshot(path='shots/intro_traith.png')
            await pg.click(sel)
        await pg.wait_for_timeout(1500);await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        await pg.wait_for_timeout(900);await pg.screenshot(path='shots/intro_g0.png')
        for k in range(1,4):
            nb=await pg.query_selector('#g-next')
            if nb: await nb.click()
            else: await pg.evaluate("(()=>{const S=__G.S;S.guide++;})()")
            await pg.wait_for_timeout(900);await pg.screenshot(path=f'shots/intro_g{k}.png')
        await pg.evaluate("__G.buildingSheet(__G.B.find(b=>b.t==='th'))");await pg.wait_for_timeout(500);await pg.screenshot(path='shots/intro_gs.png')
        print('errors',errs[:3]);await b.close()
asyncio.run(main())
