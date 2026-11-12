# One-off: Town Hall options 1-4 at levels 1/3/5. Run from tools/.
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
OPTS=[int(x) for x in (sys.argv[1] if len(sys.argv)>1 else '1,2,3,4').split(',')];LV=[int(x) for x in (sys.argv[2] if len(sys.argv)>2 else '1,3,5').split(',')];Z=float(sys.argv[3]) if len(sys.argv)>3 else 1.6
N={1:'1 Slate hall',2:'2 Red-board hall',3:'3 Valhalla: roof of shields',4:'4 Ship hall'}
async def main():
    errs=[];rows=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]');await pg.wait_for_timeout(2000)
        await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true);window.__setJarl(2)")
        th=await pg.evaluate("(()=>{const q=__G.B.find(b=>b.t==='th');return {x:q.fx+q.w/2,y:q.fy+q.h/2}})()")
        for o in OPTS:
            row=[]
            for L in LV:
                await pg.evaluate(f"window.__setTH({o});__G.S.th={L};__G.setView({Z},{th['x']-0.9},{th['y']-0.9})");await pg.wait_for_timeout(350)
                await pg.screenshot(path='shots/tho_raw.png');im=Image.open('shots/tho_raw.png');cx,cy=im.width//2,im.height//2;row.append((L,im.crop((cx-330,cy-310,cx+330,cy+230))))
            rows.append((o,row))
        await b.close()
    W=660*len(LV);sh=Image.new('RGB',(W,540*len(rows)),(30,30,30));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22)
    for r,(o,row) in enumerate(rows):
        for c,(L,im) in enumerate(row):
            x,y=c*660,r*540;sh.paste(im,(x,y));d.rectangle([x,y,x+420,y+30],fill=(20,20,20));d.text((x+6,y+3),f"{N[o]} - TH{L}",fill=(240,200,80),font=font)
    sh.save('shots/th_opts.png');print('sheet shots/th_opts.png; errors:',errs[:3] or 'none')
asyncio.run(main())
