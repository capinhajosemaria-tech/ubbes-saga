# Contact sheet: takes several views of the game and joins them into ONE image (shots/sheet.png),
# so judging visuals costs one image instead of many. Run from tools/ after build_test.py.
# Usage: python3 ui/sheet.py [view ...]   (no arguments = the standard tour)
# Views: pc_start pc_th5 pc_th5z pc_world pc_gallery ip_start ip_build ip_th5 ip_world
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw

TOUR = ['pc_start', 'pc_th5', 'pc_th5z', 'pc_world', 'ip_start', 'ip_build', 'ip_th5', 'ip_world']
PC = {'width': 1440, 'height': 900}
IP = {'width': 390, 'height': 844}

async def new_game(pg, mode):
    await pg.goto('file://' + os.path.abspath('test.html')); await pg.wait_for_timeout(500)
    await pg.click('#t-new'); await pg.click('[data-sl="1"]')
    if mode == 'start':
        await pg.click('[data-md="relaxed"]'); await pg.click('#t-skip');await pg.click('[data-ut="builder"]');await pg.click('[data-pg="odin"]'); await pg.click('[data-ad="bjorn"]')
    else:
        await pg.click('[data-md="test"]'); await pg.click(f'[data-tl="{mode}"]')
    await pg.wait_for_timeout(2500 if mode == 'g' else 1500)
    await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
    await pg.wait_for_timeout(500)

async def shoot(b, view, errs):
    dev, what = view.split('_', 1)
    phone = dev == 'ip'
    ctx = await b.new_context(viewport=IP if phone else PC, is_mobile=phone, has_touch=phone)
    pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(f'{view}: {e}'))
    if what == 'start':
        await new_game(pg, 'start')
    elif what == 'build':
        await new_game(pg, 'start'); await pg.click('#btn-build'); await pg.wait_for_timeout(400)
    elif what == 'gallery':
        await new_game(pg, 'g')
    else:
        await new_game(pg, '5')
        if what == 'th5': await pg.evaluate("__G.setView(%s,51,48)" % ('0.35' if phone else '0.5'))
        if what == 'th5z': await pg.evaluate("__G.setView(1.0,51,48)")
        if what == 'world': await pg.evaluate("__G.openPanel('world')")
        await pg.wait_for_timeout(400)
    path = f'shots/s_{view}.png'; await pg.screenshot(path=path); await ctx.close()
    return path

def join(paths, out='shots/sheet.png'):
    ims = [(os.path.basename(p)[2:-4], Image.open(p)) for p in paths]
    H = 450  # every tile scaled to this height; phones are narrow, PCs wide
    tiles = []
    for name, im in ims:
        w = round(im.width * H / im.height); t = im.resize((w, H)).convert('RGB')
        ImageDraw.Draw(t).rectangle([0, 0, 8 * len(name) + 10, 18], fill=(0, 0, 0)); ImageDraw.Draw(t).text((5, 3), name, fill=(255, 255, 0))
        tiles.append(t)
    rows, row, width = [], [], 0
    for t in tiles:  # rows up to ~2000 px wide
        if row and width + t.width > 2000: rows.append(row); row, width = [], 0
        row.append(t); width += t.width + 6
    if row: rows.append(row)
    W = max(sum(t.width + 6 for t in r) for r in rows)
    sheet = Image.new('RGB', (W, len(rows) * (H + 6)), (30, 30, 30))
    for i, r in enumerate(rows):
        x = 0
        for t in r: sheet.paste(t, (x, i * (H + 6))); x += t.width + 6
    sheet.save(out); return out

async def main():
    views = sys.argv[1:] or TOUR; errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        paths = [await shoot(b, v, errs) for v in views]
        await b.close()
    print('sheet', join(paths), 'views', len(paths))
    print('page errors', errs[:3] if errs else 'none')

asyncio.run(main())
