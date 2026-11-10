import asyncio,os,sys,collections
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1440,'height':900})
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="1"]');await pg.click('[data-md="test"]');await pg.click('[data-tl="5"]');await pg.wait_for_timeout(1500)
        await pg.evaluate("__G.setSpeed(0);__G.setView(%s,63,60)"%sys.argv[1])
        cdp=await pg.context.new_cdp_session(pg);await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{'interval':200});await cdp.send('Profiler.start')
        await pg.evaluate("for(let i=0;i<15;i++)__G.render()")
        prof=(await cdp.send('Profiler.stop'))['profile']
        nodes={n['id']:n for n in prof['nodes']};cnt=collections.Counter()
        for s in prof['samples']:
            n=nodes[s];cnt[n['callFrame']['functionName'] or '(anon)']+=1
        tot=sum(cnt.values())
        for k,v in cnt.most_common(18):print(f'{k:30s} {100*v/tot:5.1f}%')
        await b.close()
asyncio.run(main())
