# One-off: house close-ups from the Gallery (levels 1/3/5 x 6 colour schemes) + one village house at zoom 1.0.
# Run from tools/: python3 ui/tmp_housegal.py ; writes shots/s_hg_*.png, shots/s_village_house.png, then joins into shots/sheet.png
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image
PC = {'width': 1440, 'height': 900}

async def open_game(pg, mode):
    await pg.goto('file://' + os.path.abspath('test.html')); await pg.wait_for_timeout(500)
    await pg.click('#t-new'); await pg.click('[data-sl="1"]')
    await pg.click('[data-md="test"]'); await pg.click(f'[data-tl="{mode}"]')
    await pg.wait_for_timeout(2500 if mode == 'g' else 1500)
    await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
    await pg.wait_for_timeout(500)

def crop_center(path, out, half=260):
    im = Image.open(path); cx, cy = im.width // 2, im.height // 2
    im.crop((cx - half, cy - half, cx + half, cy + half)).save(out); return out

async def main():
    errs = []; made = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport=PC); pg = await ctx.new_page()
        pg.on('pageerror', lambda e: errs.append(f'hg: {e}'))
        await open_game(pg, 'g')
        items = await pg.evaluate("__G.B.filter(b=>b.gallery&&b.t==='house'&&[1,3,5].includes(b.lvl)).map(b=>({sch:b.sch,lvl:b.lvl,x:b.fx+b.w/2,y:b.fy+b.h/2})).sort((a,c)=>a.sch-c.sch||a.lvl-c.lvl)")
        print('gallery houses', len(items))
        for it in items:
            await pg.evaluate(f"__G.setView(2,{it['x']},{it['y']})"); await pg.wait_for_timeout(250)
            raw = f"shots/hg_raw_{it['sch']}_{it['lvl']}.png"; await pg.screenshot(path=raw)
            made.append(crop_center(raw, f"shots/s_hg{it['sch']}L{it['lvl']}.png"))
        await ctx.close()

        ctx = await b.new_context(viewport=PC); pg = await ctx.new_page()
        pg.on('pageerror', lambda e: errs.append(f'village: {e}'))
        await open_game(pg, '5')
        h = await pg.evaluate("(()=>{const q=__G.B.filter(b=>b.t==='house'&&!b.gallery&&b.lvl>=3)[0]||__G.B.find(b=>b.t==='house');return q?{x:q.fx+q.w/2,y:q.fy+q.h/2}:null})()")
        print('village house', h)
        if h:
            await pg.evaluate(f"__G.setView(1.0,{h['x']},{h['y']})")
        await pg.wait_for_timeout(400)
        out = 'shots/s_village_house.png'; await pg.screenshot(path=out); made.append(out)
        await ctx.close(); await b.close()

    ns = {}; exec(open(os.path.abspath('ui/sheet.py')).read().split('async def main')[0], ns); join = ns['join']
    print('sheet', join(made), 'tiles', len(made))
    print('page errors', errs[:3] if errs else 'none')

asyncio.run(main())
