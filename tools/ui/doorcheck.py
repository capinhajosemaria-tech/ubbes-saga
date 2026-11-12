"""Door check (run from tools/ after build_test.py): every building type, both turns, is drawn with its door
on the side the game uses for the door tile (paths, night light, the gold 'door' marker when placing).
Prints 'bad []' when all agree, else 'bad [(type, rot, logic side, drawn side), ...]'."""
import asyncio, os
from playwright.async_api import async_playwright
s = open('test.html').read()
hook = r"""
window.__DOORS=[];
{const _hd=hoDoor;hoDoor=function(f,g,face,s0,w,hd,o){try{const p=hoPt(f,g,face,s0,0),q=face==='L'?f(s0,g.hw+0.2,0):f(g.hl+0.2,s0,0);window.__DOORS.push([p,q]);}catch(e){}return _hd.apply(this,arguments);};}
{const _df=doorOnFace;doorOnFace=function(a,b,wh){const m=lerp(a,b,0.5),u=(b[0]-a[0])/HW,v=(b[1]-a[1])/HH,ex=(u+v)/2,ey=(v-u)/2;window.__DOORS.push([m,Math.abs(ex)>Math.abs(ey)?[m[0]-HW*0.2,m[1]+HH*0.2]:[m[0]+HW*0.2,m[1]+HH*0.2]]);return _df.apply(this,arguments);};}
window.__DC=()=>{const out=[],seen={};for(const b0 of B){if(!b0.gallery)continue;if(seen[b0.t]&&seen[b0.t].lvl>=b0.lvl)continue;seen[b0.t]=b0;}
  for(const t in seen){if(t==='th'||t==='shipyard')continue;for(const r of [0,1]){const d=dims(t,r),b=Object.assign({},seen[t],{rot:r,w:d.w,h:d.h});window.__DOORS=[];ctx.save();try{drawBuilding1(b,false,1,false);}catch(e){}ctx.restore();
    const W2=p=>{const u=p[0]/HW,v=p[1]/HH;return [(u+v)/2,(v-u)/2];};
    const sides=[...new Set(window.__DOORS.map(([p,q])=>{const P0=W2(p),Q=W2(q),nx=Q[0]-P0[0],ny=Q[1]-P0[1];return Math.abs(nx)>Math.abs(ny)?(nx>0?'+x':'-x'):(ny>0?'+y':'-y');}))];
    if(sides.length&&!sides.includes(doorSide(b)))out.push([t,r,doorSide(b),sides.join('/')]);}}return out;};
"""
i = s.rindex('})();'); open('test_door.html', 'w').write(s[:i] + hook + s[i:])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 900, 'height': 600}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.abspath('test_door.html')); await pg.wait_for_timeout(500)
        await pg.click('#t-new'); await pg.click('[data-sl="1"]'); await pg.click('[data-md="test"]'); await pg.click('[data-tl="g"]'); await pg.wait_for_timeout(2500)
        bad = await pg.evaluate('window.__DC()')
        print('bad', [tuple(x) for x in bad]); print('ERRS', errs[:3]); await b.close()
    os.remove('test_door.html')
asyncio.run(main())
