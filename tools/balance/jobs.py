import asyncio,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page()
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        for L in range(1,6):
            r=await pg.evaluate(f"""(()=>{{const G=__G;G.buildTestVillage({L});const S=G.S;let slots=0,by={{}};for(const b of G.B){{const s=G.slotsOf(b);if(s){{slots+=s;by[b.t]=(by[b.t]||0)+s;}}}}
              const adults=S.people.filter(p=>p.a>=14&&p.a<60).length;return {{L:{L},housing:G.housing(),pop:S.pop,wf:G.workforce(),adults,slots,war:S.warriors,warCap:G.warCap(),thralls:S.thralls,miss:S.testMissing,kids:S.people.filter(p=>p.a<14).length,houses:G.count('house'),hlim:G.limitOf('house'),by}}}})()""")
            print(r)
        await b.close()
asyncio.run(main())
