# One-off: the 7 decor pieces, variants 1 and 2. Usage: python3 ui/tmp_decor.py ZOOM OUT
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
Z=float(sys.argv[1]);OUT=sys.argv[2]
TYPES=['camp','bench','wattle','rune','herbs','prow','nets']
JS="""(()=>{const G=__G,N=G.N,W=G.walls(),ok=(x,y)=>G.inMap(x,y)&&G.BUILDABLE.has(G.ter[y*N+x])&&!G.occ[y*N+x]&&!G.roads[y*N+x]&&!W[y*N+x];
let x0=-1,y0=-1;for(let y=4;y<N-10&&x0<0;y++)for(let x=4;x<N-30;x++){let good=true;for(let yy=y;yy<y+5&&good;yy++)for(let xx=x;xx<x+24;xx++)if(!ok(xx,yy)){good=false;break;}if(good){x0=x;y0=y;break;}}
const T=%s,res={};T.forEach((t,i)=>{const x=x0+1+i*3,y=y0+2;G.addBuilding(t,x,y,0,true);if(t==='wattle'){G.addBuilding('wattle',x-1,y,0,true);G.addBuilding('wattle',x,y+1,0,true);}res[t]={x:x+0.5,y:y+0.5};});G.rebuildOcc&&G.rebuildOcc();return res;})()"""%str(TYPES).replace("'",'"')
async def main():
    errs=[];rows=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("__G.setSpeed(0);window.__NOFOG=1;window.__SP=0.5;document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        its=await pg.evaluate(JS)
        for t in TYPES:
            row=[]
            for o in [1,2]:
                it=its[t];await pg.evaluate(f"window.__setDecor({o});__G.setView({Z},{it['x']-0.9},{it['y']-0.9})");await pg.wait_for_timeout(250)
                await pg.screenshot(path='shots/og_raw.png');im=Image.open('shots/og_raw.png');cx,cy=im.width//2,im.height//2;row.append(im.crop((cx-170,cy-200,cx+170,cy+80)))
            rows.append((t,row))
        await b.close()
    sh=Image.new('RGB',(340*4,280*4),(30,30,30));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',16)
    for i,(t,row) in enumerate(rows):
        for j,im in enumerate(row):
            k=i*2+j;x,y=(k%4)*340,(k//4)*280;sh.paste(im,(x,y));d.rectangle([x,y,x+150,y+22],fill=(20,20,20));d.text((x+5,y+2),f"{t} {j+1}",fill=(240,200,80),font=font)
    sh.save(OUT);print('sheet',OUT,'errors:',errs[:3] or 'none')
asyncio.run(main())
