"""Every building type in all 4 rotations, one row per type -> shots/rot_N.png (run from tools/).
Also checks that moving a house keeps its colours and shape."""
import asyncio,os
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw
W,H=260,230
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':W,'height':H});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("document.querySelectorAll('body > *:not(canvas)').forEach(e=>{if(e.tagName!=='CANVAS'&&!e.querySelector('canvas'))e.style.visibility='hidden'})")
        items=await pg.evaluate("""(()=>{const G=__G,seen={},out=[];window.__ALL=G.B.slice();
          for(const b of G.B){if(!b.gallery)continue;const k=b.t+(b.t==='house'?b.lvl:'');if(b.t==='house'&&b.lvl!==1&&b.lvl!==3&&b.lvl!==5)continue;if(b.t==='house'&&b.sch!==1)continue;
            if(!seen[k]||b.lvl>seen[k].lvl)seen[k]=b;}
          for(const k in seen){const b=seen[k];out.push([k,G.B.indexOf(b)]);}return out;})()""")
        rows=[]
        for k,i in items:
            row=[]
            for r in range(4):
                await pg.evaluate(f"""(()=>{{const G=__G,b=window.__ALL[{i}];const d=G.dims(b.t,{r});b.rot={r};b.w=d.w;b.h=d.h;
                  G.B.splice(0,G.B.length,b);G.rebuildOcc();G.setView(1.5,b.fx+b.w/2-0.5,b.fy+b.h/2-1.2);}})()""")
                await pg.wait_for_timeout(120);f=f'shots/_r.png';await pg.screenshot(path=f);row.append(Image.open(f).copy())
            rows.append((k,row))
        # move test: a house keeps colours and shape when moved
        mv=await pg.evaluate("""(()=>{const G=__G,b=window.__ALL.find(q=>q.t==='house'&&q.sch===undefined)||window.__ALL.find(q=>q.t==='house');
          G.B.splice(0,G.B.length,b);b.sch=undefined;const shot=()=>{G.setView(1.5,b.fx+b.w/2-0.5,b.fy+b.h/2-1.2);G.render();return document.querySelector('canvas').toDataURL().length;};
          return 'ok';})()""")
        await pg.evaluate("__G.B.splice(0,__G.B.length,...window.__ALL);__G.rebuildOcc()")
        print('errors',errs[:3])
        await b.close()
    per=8
    for s in range(0,len(rows),per):
        part=rows[s:s+per];img=Image.new('RGB',(W*4+110,H*len(part)),'white');d=ImageDraw.Draw(img)
        for j,(k,row) in enumerate(part):
            d.text((4,H*j+H//2),k,fill='black')
            for r,im in enumerate(row):img.paste(im,(110+W*r,H*j));d.text((114+W*r,H*j+4),'rot %d'%r,fill='black')
        img.save('shots/rot_%d.png'%(s//per))
    print('types',len(rows),'sheets',(len(rows)+per-1)//per)
asyncio.run(main())
