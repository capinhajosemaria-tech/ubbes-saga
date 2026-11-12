# One-off: grass options, a mid view (village edge) and a close view. Usage: python3 ui/tmp_grass.py "0,1,2,3,4,5,6" OUT
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
OPTS=[int(x) for x in sys.argv[1].split(',')];OUT=sys.argv[2]
JS="""(()=>{const G=__G,N=G.N,W=G.walls(),ok=(x,y)=>G.inMap(x,y)&&G.ter[y*N+x]===G.T.GRASS&&!G.occ[y*N+x]&&!G.roads[y*N+x]&&!W[y*N+x]&&G.isUnl(x,y);
for(let y=6;y<N-12;y++)for(let x=6;x<N-12;x++){let good=true;for(let yy=y;yy<y+6&&good;yy++)for(let xx=x;xx<x+6;xx++)if(!ok(xx,yy)){good=false;break;}if(good)return {x:x+3,y:y+3};}return null;})()"""
async def main():
    errs=[];rows=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]');await pg.wait_for_timeout(3000)
        await pg.evaluate("__G.setSpeed(0);window.__NOFOG=1;window.__SP=0.55;document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        g=await pg.evaluate(JS);th=await pg.evaluate("(()=>{const b=__G.B.find(b=>b.t==='th');return {x:b.fx+b.w/2,y:b.fy+b.h/2}})()");print('grass',g,'th',th)
        for o in OPTS:
            row=[]
            for (z,pt) in [(1.3,g),(3.0,g)]:
                await pg.evaluate(f"window.__setGrass({o});__G.setView({z},{pt['x']},{pt['y']})");await pg.wait_for_timeout(300)
                await pg.screenshot(path='shots/og_raw.png');im=Image.open('shots/og_raw.png');cx,cy=im.width//2,im.height//2;row.append(im.crop((cx-300,cy-200,cx+300,cy+200)))
            rows.append((o,row))
        await b.close()
    sh=Image.new('RGB',(1200,400*len(rows)),(30,30,30));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
    names={0:'Today',1:'1 Dense meadow',2:'2 Tall grass in the wind',3:'3 Grazed pasture, moss, stones',4:'4 Nordic heath',5:'5 Flowering meadow',6:'6 Painterly'}
    for r,(o,row) in enumerate(rows):
        for c,im in enumerate(row):
            x,y=c*600,r*400;sh.paste(im,(x,y));d.rectangle([x,y,x+330,y+26],fill=(20,20,20));d.text((x+6,y+3),names[o]+(' (close)' if c else ''),fill=(240,200,80),font=font)
    sh.save(OUT);print('sheet',OUT,'errors:',errs[:3] or 'none')
asyncio.run(main())
