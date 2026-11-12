# One-off: house 1 colour schemes at one level, 4 x 2 grid. Run from tools/.
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
LV=int(sys.argv[1]) if len(sys.argv)>1 else 4
async def main():
    errs=[];tiles=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        it=await pg.evaluate(f"(()=>{{const q=__G.B.find(b=>b.gallery&&b.t==='house'&&b.sch===0&&b.lvl==={LV});return {{x:q.fx+q.w/2,y:q.fy+q.h/2}}}})()")
        names=await pg.evaluate("1")
        for o in range(21,29):
            await pg.evaluate(f"window.__setHouse({o})");await pg.evaluate(f"__G.setView(2.7,{it['x']},{it['y']-0.35})");await pg.wait_for_timeout(250)
            await pg.screenshot(path='shots/hs_raw.png');im=Image.open('shots/hs_raw.png');cx,cy=im.width//2,im.height//2;tiles.append(im.crop((cx-230,cy-190,cx+230,cy+190)))
        await b.close()
    N=['Pine and straw','Tar and slate','Falu red','Silver grey','Oak and red boards','Birch and black','Ochre and slate','Black and red']
    sh=Image.new('RGB',(460*4,380*2));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22)
    for i,t in enumerate(tiles):
        x,y=(i%4)*460,(i//4)*380;sh.paste(t,(x,y));d.rectangle([x,y,x+290,y+30],fill=(20,20,20));d.text((x+6,y+3),f"{i+1} {N[i]}",fill=(240,200,80),font=font)
    sh.save('shots/housesch.png');print('sheet shots/housesch.png; errors:',errs[:3] or 'none')
asyncio.run(main())
