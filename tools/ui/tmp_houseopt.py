# One-off: house style options. Rows = option 0 (today) .. 4, columns = levels 1/3/5, close up. Run from tools/.
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
PC={'width':1440,'height':900}
OPTS=[int(x) for x in (sys.argv[1] if len(sys.argv)>1 else '0,1,2,3,4').split(',')]
Z=float(sys.argv[2]) if len(sys.argv)>2 else 2.7
NAMES={11:'A Straw thatch',12:'B Blue slate',13:'C Black tarred shingles',14:'D Brick-red boards',0:'0 Today',1:'1 Turf cottage',2:'2 Stave house',3:'3 Log house (laft)',4:'4 Timber & daub longhouse'}
async def main():
    errs=[];rows=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport=PC);pg=await ctx.new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]')
        await pg.wait_for_timeout(2500)
        await pg.evaluate("__G.setSpeed(0);document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        items=await pg.evaluate("__G.B.filter(b=>b.gallery&&b.t==='house'&&b.sch===0&&[1,3,5].includes(b.lvl)).map(b=>({lvl:b.lvl,x:b.fx+b.w/2,y:b.fy+b.h/2})).sort((a,c)=>a.lvl-c.lvl)")
        for o in OPTS:
            await pg.evaluate(f"window.__setHouse({o})");row=[]
            for it in items:
                await pg.evaluate(f"__G.setView({Z},{it['x']},{it['y']-0.35})");await pg.wait_for_timeout(250)
                await pg.screenshot(path='shots/ho_raw.png');im=Image.open('shots/ho_raw.png');cx,cy=im.width//2,im.height//2
                row.append(im.crop((cx-250,cy-215,cx+250,cy+215)))
            rows.append((o,row))
        await b.close()
    W=500*3;H=430*len(rows);sheet=Image.new('RGB',(W,H),(30,30,30));d=ImageDraw.Draw(sheet)
    try: font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22)
    except: font=None
    for r,(o,row) in enumerate(rows):
        for c,im in enumerate(row):
            sheet.paste(im,(c*500,r*430));d.rectangle([c*500,r*430,c*500+300,r*430+30],fill=(20,20,20));d.text((c*500+6,r*430+3),f"{NAMES[o]} - level {[1,3,5][c]}",fill=(240,200,80),font=font)
    sheet.save('shots/houseopt.png');print('sheet shots/houseopt.png',len(rows),'rows; errors:',errs[:3] or 'none')
asyncio.run(main())
