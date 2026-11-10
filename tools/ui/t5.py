import asyncio,os,time
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':800},device_scale_factor=1)
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(600)
        await pg.screenshot(path='shots/b_title.png')
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.wait_for_timeout(200)
        t0=time.time();await pg.click('[data-tl="5"]');await pg.wait_for_timeout(1500);print('build secs',round(time.time()-t0,1))
        info=await pg.evaluate("(()=>{const G=__G,S=G.S;return {pop:S.pop,house:G.housing(),b:G.B.length,war:S.warriors,ships:S.ships.length,missing:S.testMissing,th:G.thLevel()};})()")
        print(info)
        await pg.evaluate("__G.setSpeed(0);__G.setView(0.5,51,48)");await pg.wait_for_timeout(300);await pg.screenshot(path='shots/b_th5.png')
        await pg.evaluate("__G.setView(1.0,51,48)");await pg.wait_for_timeout(300);await pg.screenshot(path='shots/b_th5z.png')
        await pg.evaluate("__G.openPanel('world')");await pg.wait_for_timeout(300);await pg.screenshot(path='shots/b_world.png')
        await pg.evaluate("__G.openPanel('war')");await pg.wait_for_timeout(300);await pg.screenshot(path='shots/b_war.png')
        await pg.evaluate("__G.S.trader=__G.newTrader();__G.buildingSheet(__G.B.find(b=>b.t==='trade'))");await pg.wait_for_timeout(300);await pg.screenshot(path='shots/b_trade.png')
        await pg.evaluate("__G.buildingSheet(__G.B.find(b=>b.t==='th'))");await pg.wait_for_timeout(300);await pg.screenshot(path='shots/b_thsheet.png')
        await pg.evaluate("__G.openPanel('saga')");await pg.wait_for_timeout(300);await pg.screenshot(path='shots/b_saga.png')
        print('ERRS',errs);await b.close()
asyncio.run(main())
