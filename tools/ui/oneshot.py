"""Close-ups of one building type: python3 ui/oneshot.py hof [zoom...] -> shots/one_<t>.png (run from tools/)"""
import asyncio,os,sys
from playwright.async_api import async_playwright
from PIL import Image
t=sys.argv[1];zs=[float(z) for z in sys.argv[2:]] or [1.2,2.2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':480,'height':420});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="g"]');await pg.wait_for_timeout(2500)
        await pg.evaluate("document.querySelectorAll('body > *').forEach(e=>{if(e.tagName!=='CANVAS'&&!e.querySelector('canvas'))e.style.visibility='hidden'})")
        ims=[]
        for z in zs:
            for r in (0,1):
                await pg.evaluate(f"""(()=>{{const G=__G,b=G.B.filter(q=>q.t==='{t}').sort((a,c)=>c.lvl-a.lvl)[0];const d=G.dims(b.t,{r});b.rot={r};b.w=d.w;b.h=d.h;G.setView({z},b.fx+b.w/2-0.5,b.fy+b.h/2-1.5);}})()""")
                await pg.wait_for_timeout(150);await pg.screenshot(path='shots/_o.png');ims.append(Image.open('shots/_o.png').copy())
        img=Image.new('RGB',(480*2,420*len(zs)))
        for i,im in enumerate(ims):img.paste(im,((i%2)*480,(i//2)*420))
        img.save(f'shots/one_{t}.png');print('errors',errs[:3])
        await b.close()
asyncio.run(main())
