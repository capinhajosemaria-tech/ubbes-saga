import sys, base64, asyncio, subprocess, os
from playwright.async_api import async_playwright
names=sys.argv[1:]
async def main():
    srv=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1'],cwd='/home/claude',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    await asyncio.sleep(1)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=await b.new_page()
            pg.on('pageerror',lambda e:print('ERR',e)); pg.on('console',lambda m:print('console:',m.text) if m.type=='error' else None)
            await pg.goto('http://127.0.0.1:8765/music/render2.html')
            for n in names:
                r=await pg.evaluate('n=>renderTrack(n)',n); open(f'out2/{n}.wav','wb').write(base64.b64decode(r['b64']))
                print(n,r['title'],round(r['len'],1),'s peak',round(r['peak'],3),flush=True)
            await b.close()
    finally: srv.terminate()
asyncio.run(main())
