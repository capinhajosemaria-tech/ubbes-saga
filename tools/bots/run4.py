import asyncio,json,sys,os
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(800)
        await pg.evaluate('document.getElementById("title").hidden=true')
        opts=sys.argv[3] if len(sys.argv)>3 else '{}'
        res=await pg.evaluate(open('bots/bot4.js').read()+'('+sys.argv[1]+','+opts+')')
        print('ERRS',errs)
        print('day S/W th pop house war wf free food water wood planks iron tools spears hay herd cloth/rope silver fame kinds morale attr thralls raids gods')
        step=int(sys.argv[2]) if len(sys.argv)>2 else 5
        for i,l in enumerate(res['log']):
            if i%step==0 or i==len(res['log'])-1: print(l)
        print('\n'.join(e for e in res['events'] if 'built house' not in e))
        print('MS',res['ms']);print('SHIPS',res['ships']);print(res['final'])
        await b.close()
asyncio.run(main())
