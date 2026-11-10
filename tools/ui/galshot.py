import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)+' '+(e.stack or '')[:300]))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        n=await pg.evaluate("__G.B.filter(b=>b.gallery).length");print('gallery items',n)
        await pg.screenshot(path='shots/gal0.png')
        for i,(dx,dy) in enumerate([(8,4),(30,4),(8,20),(30,22),(50,30)]):
            await pg.evaluate(f"__G.setView(1.1,__G.N&&{dx}+{0}+(window.__GX||0),0)") if False else None
        g=await pg.evaluate("(()=>{const b=__G.B.filter(b=>b.gallery);return [b[0].fx,b[0].fy,b[b.length-1].fx,b[b.length-1].fy]})()");print(g)
        GX=await pg.evaluate('[__G.GAL?0:0]')
        x0,y0=await pg.evaluate('(()=>{const b=__G.B.filter(b=>b.gallery);return [Math.min(...b.map(q=>q.fx)),Math.min(...b.map(q=>q.fy))]})()')
        for i,(fx,fy) in enumerate([(x0+10,y0+5),(x0+34,y0+5),(x0+10,y0+22),(x0+40,y0+30),(x0+25,y0+45)]):
            await pg.evaluate(f"__G.setView(1.0,{fx},{fy})");await pg.wait_for_timeout(250);await pg.screenshot(path=f'shots/gal{i+1}.png')
        print(errs[:2]);await b.close()
asyncio.run(main())
