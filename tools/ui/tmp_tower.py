# One-off: 1-tile Watchtower options set into a palisade (straight run and corner). Usage: python3 ui/tmp_tower.py "1,2,3,4" ZOOM OUT
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
OPTS=[int(x) for x in sys.argv[1].split(',')];Z=float(sys.argv[2]);OUT=sys.argv[3]
JS="""(()=>{const G=__G,N=G.N,W=G.walls(),ok=(x,y)=>G.inMap(x,y)&&G.BUILDABLE.has(G.ter[y*N+x])&&!G.occ[y*N+x]&&!G.roads[y*N+x]&&!W[y*N+x];
let x0=-1,y0=-1;for(let y=4;y<N-10&&x0<0;y++)for(let x=4;x<N-16;x++){let good=true;for(let yy=y;yy<y+7&&good;yy++)for(let xx=x;xx<x+14;xx++)if(!ok(xx,yy)){good=false;break;}if(good){x0=x;y0=y;break;}}
if(x0<0)return null;G.DEF.tower.w=1;G.DEF.tower.h=1;const set=(x,y,v)=>{W[y*N+x]=v;};
const y1=y0+2;for(let x=x0;x<=x0+6;x++)set(x,y1,1);set(x0+3,y1,3);G.addBuilding('tower',x0+3,y1,0,true);
const cx=x0+9,cy=y0+1;for(let x=cx;x<=cx+4;x++)set(x,cy,1);for(let y=cy;y<=cy+4;y++)set(cx,y,1);set(cx,cy,3);G.addBuilding('tower',cx,cy,0,true);
G.rebuildOcc&&G.rebuildOcc();return [{n:'in a straight wall',x:x0+3+0.5,y:y1+0.5},{n:'at a corner',x:cx+1,y:cy+1}];})()"""
async def main():
    errs=[];rows=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("__G.setSpeed(0);window.__NOFOG=1;document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        its=await pg.evaluate(JS);print('scenes',its)
        for o in OPTS:
            row=[]
            for it in its:
                await pg.evaluate(f"window.__setTower({o});__G.setView({Z},{it['x']-0.4},{it['y']-0.4})");await pg.wait_for_timeout(300)
                await pg.screenshot(path='shots/og_raw.png');im=Image.open('shots/og_raw.png');cx,cy=im.width//2,im.height//2;row.append((it['n'],im.crop((cx-260,cy-330,cx+260,cy+130))))
            rows.append((o,row))
        await b.close()
    cols=max(len(r) for _,r in rows);sh=Image.new('RGB',(520*cols,460*len(rows)),(30,30,30));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
    for r,(o,row) in enumerate(rows):
        for c,(s,im) in enumerate(row):
            x,y=c*520,r*460;sh.paste(im,(x,y));d.rectangle([x,y,x+300,y+26],fill=(20,20,20));d.text((x+6,y+3),f"Option {o} - {s}",fill=(240,200,80),font=font)
    sh.save(OUT);print('sheet',OUT,'errors:',errs[:3] or 'none')
asyncio.run(main())
