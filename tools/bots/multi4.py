import asyncio,os,sys,json,re
from playwright.async_api import async_playwright
async def one(b,opts,days):
    pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(400)
    await pg.evaluate('document.getElementById("title").hidden=true')
    res=await pg.evaluate(open('bots/bot4.js').read()+'('+str(days)+','+json.dumps(opts)+')')
    await pg.close();return res,errs
def summ(res):
    ev=res['events'];o={}
    for e in ev:
        m=re.match(r'day (\d+): (.*)',e)
        if not m: continue
        d=int(m.group(1));t=m.group(2)
        if t.startswith('TOWN HALL -> 2'):o['th2']=d
        if t.startswith('TOWN HALL -> 3'):o['th3']=d
        if t.startswith('keel laid'):o.setdefault('keel',d)
        if t.startswith('RAID'):o['raids']=o.get('raids',0)+1;o.setdefault('raid1',d)
        if t.startswith('REPORT'):
            o['rep']=o.get('rep',[])+[t[7:80]]
        if t.startswith('YEAR'):
            y=int(t.split()[1]);pop=int(t.split()[-1]);o['y%d'%y]=pop
            o['left']=o.get('left',0)+int(re.search(r'left (\d+)',t).group(1));o['deaths']=o.get('deaths',0)+int(re.search(r'deaths (\d+)',t).group(1))
        if 'GAME OVER' in t:o['over']=d
    L=res['log']
    for dd in (90,180,315):
        row=[l for l in L if int(l.split()[0])<=dd]
        if row: x=row[-1].split();o['z%d'%dd]=int(x[26]);o['fe%d'%dd]=int(x[27]);o['f%d'%dd]=int(x[19])
    o['th4']=res['ms'].get('th4');o['th5']=res['ms'].get('th5');o['fail']=res.get('fail');o['ms']=len(res['ms']);o['missing']=res['thr'];o['ships']=len(res['ships'])
    mor=[int(l.split()[21]) for l in res['log']];o['morale_min']=min(mor);o['morale_avg']=round(sum(mor)/len(mor))
    return o
async def main():
    days=int(sys.argv[1]);runs=json.loads(sys.argv[2])
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,opts,n in runs:
            for i in range(n):
                res,errs=await one(b,opts,days);s=summ(res)
                rep=s.pop('rep',[])
                print(name,i,json.dumps(s),'ERR' if errs else '',errs[:1])
                for r in rep[:4]:print('    ',r)
        await b.close()
asyncio.run(main())
