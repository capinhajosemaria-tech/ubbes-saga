# One-off: Town Hall at levels 1..5 (test village, S.th forced), close up. Run from tools/. Optional arg: JS to run first.
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
PRE=sys.argv[1] if len(sys.argv)>1 else ''
Z=float(sys.argv[2]) if len(sys.argv)>2 else 1.7
async def main():
    errs=[];tiles=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]');await pg.wait_for_timeout(2000)
        await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        if PRE: await pg.evaluate(PRE)
        th=await pg.evaluate("(()=>{const q=__G.B.find(b=>b.t==='th');return {x:q.fx+q.w/2,y:q.fy+q.h/2}})()")
        for L in [1,2,3,4,5]:
            await pg.evaluate(f"__G.S.th={L}");await pg.evaluate(f"__G.setView({Z},{th['x']-0.8},{th['y']-0.8})");await pg.wait_for_timeout(350)
            await pg.screenshot(path='shots/th_raw.png');im=Image.open('shots/th_raw.png');cx,cy=im.width//2,im.height//2;tiles.append(im.crop((cx-330,cy-300,cx+330,cy+240)))
        await b.close()
    sh=Image.new('RGB',(660*3,540*2),(30,30,30));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22)
    for i,t in enumerate(tiles):
        x,y=(i%3)*660,(i//3)*540;sh.paste(t,(x,y));d.rectangle([x,y,x+240,y+30],fill=(20,20,20));d.text((x+6,y+3),f"Town Hall {i+1}",fill=(240,200,80),font=font)
    sh.save('shots/th_levels.png');print('sheet shots/th_levels.png; errors:',errs[:3] or 'none')
asyncio.run(main())
