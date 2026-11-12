# One-off: Harbour (improved) and Shipyard options on a real coast. Usage: python3 ui/tmp_sea.py "1,2,3,4" ZOOM OUT
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
OPTS=[int(x) for x in sys.argv[1].split(',')];Z=float(sys.argv[2]);OUT=sys.argv[3]
JS="""(()=>{const G=__G,N=G.N,res={};const used=[];
for(const t of ['harbour','shipyard'])for(let y=3;y<N-8&&!res[t];y++)for(let x=3;x<N-8&&!res[t];x++)for(const r of [0,1]){if(used.some(u=>Math.abs(u.x-x)<12&&Math.abs(u.y-y)<12))continue;const c=G.canPlace(t,x,y,r);if(c&&c.ok){G.addBuilding(t,x,y,r,true);G.rebuildOcc&&G.rebuildOcc();const b=G.B[G.B.length-1];used.push({x,y});res[t]={x:b.fx+b.w/2,y:b.fy+b.h/2};break;}}
G.S.ships.push({id:9001,name:'Sea Wolf',type:'karvi',away:false},{id:9002,name:'Raven',type:'knarr',away:false},{id:9003,name:'Storm',type:'karvi',away:false});return res;})()"""
async def main():
    errs=[];shots=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("__G.setSpeed(0);window.__NOFOG=1;document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        its=await pg.evaluate(JS);print('sites',its)
        for lab,setter,o,key in [('Harbour today','__setHarb',0,'harbour'),('Harbour improved','__setHarb',1,'harbour')]+[(f'Shipyard option {o}','__setYard',o,'shipyard') for o in OPTS]:
            it=its.get(key)
            if not it: continue
            await pg.evaluate(f"window.{setter}({o});__G.setView({Z},{it['x']},{it['y']})");await pg.wait_for_timeout(300)
            await pg.screenshot(path='shots/og_raw.png');im=Image.open('shots/og_raw.png');cx,cy=im.width//2,im.height//2;shots.append((lab,im.crop((cx-330,cy-250,cx+330,cy+210))))
        await b.close()
    cols=2;rows=(len(shots)+1)//2;sh=Image.new('RGB',(660*cols,460*rows),(30,30,30));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
    for i,(lab,im) in enumerate(shots):
        x,y=(i%2)*660,(i//2)*460;sh.paste(im,(x,y));d.rectangle([x,y,x+260,y+26],fill=(20,20,20));d.text((x+6,y+3),lab,fill=(240,200,80),font=font)
    sh.save(OUT);print('sheet',OUT,'errors:',errs[:3] or 'none')
asyncio.run(main())
