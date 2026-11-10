import asyncio,os,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page()
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(400)
        d=await pg.evaluate("(()=>{const G=__G,o={};for(const k in G.DEF){const D=G.DEF[k];o[k]={s:D.slots||0,up:!!D.up,w:!!D.wonder,lvl:D.lvl,lim:G.LIMITS[k]||[1,1,1,1,1],cat:D.cat,hidden:!!D.hidden,housing:D.housing||0}}return o})()")
        json.dump(d,open('defs.json','w'),indent=0);await b.close()
asyncio.run(main())
