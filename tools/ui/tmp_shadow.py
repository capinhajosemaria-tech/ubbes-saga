# One-off: every building type from the Gallery in daylight (shadows on). Usage: python3 ui/tmp_shadow.py OUT [ZOOM] [TOD] [types,comma]
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
OUT=sys.argv[1];Z=float(sys.argv[2]) if len(sys.argv)>2 else 1.1;TOD=float(sys.argv[3]) if len(sys.argv)>3 else 0.45
ONLY=sys.argv[4].split(',') if len(sys.argv)>4 else None
async def main():
    errs=[];tiles=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1200,'height':800})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate(f"__G.setSpeed(0);__G.setTod({TOD});window.__NOFOG=1;document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        its=await pg.evaluate("(()=>{const seen={};const o=[];for(const b of __G.B){if(!b.gallery)continue;const k=b.t;const L=b.lvl||1;if(seen[k]&&seen[k].l>=L)continue;seen[k]={l:L,t:b.t,x:b.fx+b.w/2,y:b.fy+b.h/2,w:b.w};}return Object.values(seen);})()")
        if ONLY: its=[i for i in its if i['t'] in ONLY]
        for it in its:
            await pg.evaluate(f"__G.setView({Z},{it['x']-0.5},{it['y']-0.5})");await pg.wait_for_timeout(250)
            await pg.screenshot(path='shots/sh_raw.png');im=Image.open('shots/sh_raw.png');cx,cy=im.width//2,im.height//2
            s=int(110+it['w']*55);tiles.append((it['t'],im.crop((cx-s,cy-s-30,cx+s,cy+s-30)).resize((320,320))))
        await b.close()
    cols=6;rows=(len(tiles)+cols-1)//cols
    sh=Image.new('RGB',(320*cols,320*rows),(30,30,30));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',16)
    for i,(t,im) in enumerate(tiles):
        x,y=(i%cols)*320,(i//cols)*320;sh.paste(im,(x,y));d.rectangle([x,y,x+110,y+22],fill=(20,20,20));d.text((x+5,y+2),t,fill=(240,200,80),font=font)
    sh.save(OUT);print('sheet',OUT,len(tiles),'errors:',errs[:3] or 'none')
asyncio.run(main())
