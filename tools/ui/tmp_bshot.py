# One-off: one building type close up at levels 1/3/5 from the Gallery. Usage (from tools/): python3 ui/tmp_bshot.py TYPE [zoom] [opt]
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
T=sys.argv[1];Z=float(sys.argv[2]) if len(sys.argv)>2 else 2.2;OPT=sys.argv[3] if len(sys.argv)>3 else None
async def main():
    errs=[];tiles=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("__G.setSpeed(0);window.__NOFOG=1;document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        if OPT: await pg.evaluate(OPT)
        its=await pg.evaluate(f"__G.B.filter(b=>b.gallery&&b.t==='{T}').map(b=>({{l:b.lvl||1,x:b.fx+b.w/2,y:b.fy+b.h/2,w:b.w}})).sort((a,c)=>a.l-c.l)")
        seen=set();sel=[]
        for it in its:
            if it['l'] in seen: continue
            seen.add(it['l']);sel.append(it)
        sel=[s for s in sel if s['l'] in (1,3,5)] or sel[:3]
        for it in sel:
            await pg.evaluate(f"__G.setView({Z},{it['x']-0.55},{it['y']-0.55})");await pg.wait_for_timeout(300)
            await pg.screenshot(path='shots/bs_raw.png');im=Image.open('shots/bs_raw.png');cx,cy=im.width//2,im.height//2;tiles.append((it['l'],im.crop((cx-300,cy-340,cx+300,cy+160))))
        await b.close()
    sh=Image.new('RGB',(600*len(tiles),500));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22)
    for i,(l,t) in enumerate(tiles):
        sh.paste(t,(i*600,0));d.rectangle([i*600,0,i*600+260,30],fill=(20,20,20));d.text((i*600+6,3),f"{T} - level {l}",fill=(240,200,80),font=font)
    sh.save(f'shots/b_{T}.png');print(f'sheet shots/b_{T}.png', len(tiles),'tiles; errors:',errs[:3] or 'none')
asyncio.run(main())
