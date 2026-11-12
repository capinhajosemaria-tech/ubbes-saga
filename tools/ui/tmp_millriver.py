# One-off: Water Mill options placed on real river banks, one column per river side. Usage: python3 ui/tmp_millriver.py "1,2,3,4" ZOOM OUT
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont
OPTS=[int(x) for x in sys.argv[1].split(',')];Z=float(sys.argv[2]);OUT=sys.argv[3]
JS="""(()=>{const G=__G,N=G.N,R=G.T.RIVER,ter=G.ter,isR=(x,y)=>G.inMap(x,y)&&ter[y*N+x]===R,out={};
for(let y=2;y<N-3;y++)for(let x=2;x<N-3;x++){const c=G.canPlace('mill',x,y,0);if(!c||!c.ok)continue;
 const cnt={'-y':0,'+x':0,'+y':0,'-x':0};for(let xx=x-1;xx<=x+2;xx++){if(isR(xx,y-1))cnt['-y']+=2;if(isR(xx,y))cnt['-y']++;if(isR(xx,y+2))cnt['+y']+=2;if(isR(xx,y+1))cnt['+y']++;}
 for(let yy=y-1;yy<=y+2;yy++){if(isR(x-1,yy))cnt['-x']+=2;if(isR(x,yy))cnt['-x']++;if(isR(x+2,yy))cnt['+x']+=2;if(isR(x+1,yy))cnt['+x']++;}
 let best='-y';for(const k in cnt)if(cnt[k]>cnt[best])best=k;(out[best]=out[best]||[]).push({x,y});}
const res=[],used=[];for(const k of ['+y','+x','-y','-x'])for(const p of (out[k]||[])){if(used.some(u=>Math.abs(u.x-p.x)<6&&Math.abs(u.y-p.y)<6))continue;const ok=G.canPlace('mill',p.x,p.y,0);if(ok&&ok.ok){G.addBuilding('mill',p.x,p.y,0,true);used.push(p);res.push({s:k,x:p.x+1,y:p.y+1});break;}}
G.rebuildOcc&&G.rebuildOcc();return res;})()"""
async def main():
    errs=[];rows=[]
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await (await b.new_context(viewport={'width':1440,'height':900})).new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("__G.setSpeed(0);window.__NOFOG=1;document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
        its=await pg.evaluate(JS);print('sites',its)
        for o in OPTS:
            row=[]
            for it in its:
                await pg.evaluate(f"window.__setMill({o});__G.setView({Z},{it['x']-0.4},{it['y']-0.4})");await pg.wait_for_timeout(300)
                await pg.screenshot(path='shots/og_raw.png');im=Image.open('shots/og_raw.png');cx,cy=im.width//2,im.height//2;row.append((it['s'],im.crop((cx-260,cy-280,cx+260,cy+180))))
            rows.append((o,row))
        await b.close()
    cols=max(len(r) for _,r in rows);sh=Image.new('RGB',(520*cols,460*len(rows)),(30,30,30));d=ImageDraw.Draw(sh);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20)
    for r,(o,row) in enumerate(rows):
        for c,(s,im) in enumerate(row):
            x,y=c*520,r*460;sh.paste(im,(x,y));d.rectangle([x,y,x+260,y+28],fill=(20,20,20));d.text((x+6,y+3),f"Option {o} - river {s}",fill=(240,200,80),font=font)
    sh.save(OUT);print('sheet',OUT,'errors:',errs[:3] or 'none')
asyncio.run(main())
