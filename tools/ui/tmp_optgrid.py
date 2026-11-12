# One-off: building TYPE, options list, levels list, from the Gallery. Usage: python3 ui/tmp_optgrid.py TYPE SETTER "1,2,3,4" "1,3,5" ZOOM OUT
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
T,SET,OPTS,LVS,Z,OUT=sys.argv[1],sys.argv[2],[int(x) for x in sys.argv[3].split(',')],[int(x) for x in sys.argv[4].split(',')],float(sys.argv[5]),sys.argv[6]
async def main():
    errs=[];rows=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("__G.setSpeed(0);window.__NOFOG=1;document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        its=await pg.evaluate(f"__G.B.filter(b=>b.gallery&&b.t==='{T}').map(b=>({{l:b.lvl||1,x:b.fx+b.w/2,y:b.fy+b.h/2}}))")
        bylv={}
        for it in its: bylv.setdefault(it['l'],it)
        for o in OPTS:
            row=[]
            for L in LVS:
                it=bylv.get(L) or list(bylv.values())[0]
                await pg.evaluate(f"window.{SET}({o});__G.setView({Z},{it['x']-0.4},{it['y']-0.4})");await pg.wait_for_timeout(300)
                await pg.screenshot(path='shots/og_raw.png');im=Image.open('shots/og_raw.png');cx,cy=im.width//2,im.height//2;row.append((L,im.crop((cx-260,cy-280,cx+260,cy+180))))
            rows.append((o,row))
        await b.close()
    sh=Image.new('RGB',(520*len(LVS),460*len(rows)),(30,30,30));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20)
    for r,(o,row) in enumerate(rows):
        for c,(L,im) in enumerate(row):
            x,y=c*520,r*460;sh.paste(im,(x,y));d.rectangle([x,y,x+230,y+28],fill=(20,20,20));d.text((x+6,y+3),f"{'Today' if o==0 else 'Option '+str(o)} - L{L}",fill=(240,200,80),font=font)
    sh.save(OUT);print('sheet',OUT,'errors:',errs[:3] or 'none')
asyncio.run(main())
