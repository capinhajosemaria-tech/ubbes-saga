import asyncio,os,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+os.path.abspath('test.html'));await pg.wait_for_timeout(500)
        await pg.click('#t-new');await pg.click('[data-sl="2"]');await pg.click('[data-md="sandbox"]');await pg.click('#t-skip');await pg.click('[data-ad="bjorn"]')
        await pg.wait_for_timeout(300)
        await pg.evaluate("""(()=>{const G=__G;G.setSpeed(0);const S=G.S;S.th=3;S.fame=5000;const U=G.unlockedSet();for(let a=3;a<11;a++)for(let c=3;c<11;c++)U.add(a+','+c);
          const put=(t)=>{for(let y=20;y<64;y++)for(let x=20;x<64;x++)for(const rot of [0,1]){if(G.canPlace(t,x,y,rot,0).ok){const b=G.addBuilding(t,x,y,rot,false);b.desired=G.slotsOf(b);return b;}}return null;};
          ['shipyard','harbour','trade','altar','train','arsenal','thrall','smith','pen','camp','bench','rune','herbs','prow','nets','wattle','wattle'].forEach(put);
          Object.assign(S.res,{spears:30,shields:20,swords:12,bows:10,arrows:200,misc:30,silver:300,hides:30,meat:80,wool:40,rope:20,cloth:20});
          S.ships.push({id:S.shipSeq++,type:'karvi',name:'Sea-Raven',away:0,voy:0});S.ships.push({id:S.shipSeq++,type:'knarr',name:'Wave-Biter',away:0,voy:0});
          const ad=S.people.filter(p=>p.a>=16&&p.id!==S.jarl);const types=['warrior','spear','archer','skirm'];for(let i=0;i<10;i++){const p=G.newPerson({g:i%3?'m':'f',a:20+i,w:types[i%4],xp:i%3});}G.syncPop();S.thralls=4;S.gods.freyja=85;S.gods.odin=60;G.recalcMorale();})()""")
        async def sheet(name,js):
            await pg.evaluate(js);await pg.wait_for_timeout(250);await pg.screenshot(path='shots/u_%s.png'%name)
        await sheet('altar',"__G.buildingSheet(__G.B.find(b=>b.t==='altar'))")
        await sheet('train',"__G.buildingSheet(__G.B.find(b=>b.t==='train'))")
        await sheet('smith',"__G.buildingSheet(__G.B.find(b=>b.t==='smith'))")
        await sheet('war',"__G.openPanel('war')")
        await sheet('world',"__G.openPanel('world')")
        await sheet('target',"__G.targetSheet('ringa')")
        await pg.click('#w-plan');await pg.wait_for_timeout(250);await pg.screenshot(path='shots/u_plan.png')
        await pg.click('#p-go');await pg.wait_for_timeout(250)
        print('raids',await pg.evaluate("__G.S.raids.length"))
        await sheet('village_pol',"(()=>{__G.openPanel('village');document.querySelector('[data-tv=Policies]').click();})()")
        await sheet('village_win',"(()=>{document.querySelector('[data-tv=Winter]').click();})()")
        # events
        await pg.evaluate("__G.S.trader={until:__G.S.day+4,from:'hedeby'}")
        await sheet('trade',"__G.buildingSheet(__G.B.find(b=>b.t==='trade'))")
        await pg.evaluate("document.getElementById('sheet').hidden=true")
        await pg.evaluate("(()=>{const G=__G,S=G.S;const e=G.EVTS.holmgang;const a=e.mk();G.queueModal({k:'evt',id:'holmgang',a:a,text:e.t(a)});G.modalTick();})()");await pg.wait_for_timeout(250);await pg.screenshot(path='shots/u_evt.png')
        await pg.click('[data-mo="0"]');await pg.wait_for_timeout(200)
        # run the raid to completion via days
        for i in range(30):
            await pg.evaluate("(()=>{const G=__G;if(G.S.modal.length){return;}G.S.gameT+=G.DAY;G.dayTick();G.modalTick();})()")
            vis=await pg.evaluate("!document.getElementById('modal').hidden")
            if vis:
                await pg.screenshot(path='shots/u_modal_%d.png'%i)
                t=await pg.evaluate("document.querySelector('.mhd').textContent");print('modal',i,t)
                if await pg.query_selector('#m-sl'):
                    await pg.evaluate("(()=>{const s=document.getElementById('m-sl');s.value=s.max;s.oninput();})()");await pg.screenshot(path='shots/u_load.png')
                await pg.click('[data-mo="0"]');await pg.wait_for_timeout(100)
        await sheet('people',"__G.openPanel('people')")
        await pg.evaluate("document.getElementById('sheet').hidden=true;__G.setView(1.0,40,44)");await pg.wait_for_timeout(300);await pg.screenshot(path='shots/u_map.png')
        print('ERRS',errs);await b.close()
asyncio.run(main())
