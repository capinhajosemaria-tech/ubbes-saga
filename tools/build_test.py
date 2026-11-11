import os
s=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','source','dist','index.html')).read()
hook="""window.__G={setTod(v){todForce=v},get S(){return S},get VR(){return typeof VR!=="undefined"?VR:null},get B(){return B},get roads(){return roads},get occ(){return occ},get conn(){return conn},get free(){return freeWorkers},
DEF,MS,dayTick,assignWorkers,canPlace,addBuilding,costOf,afford,pay,limitOf,count,has,recomputeConn,rebuildOcc,checkMilestones,needCount,
consTick,startCons,pigCap,sheepCap,srcInfo,fireToday,WAR_TEST,N,T,ter,isUnl,workforce,foodUnits,housing,fireNeed,BUILDABLE,inMap,freshState,isWinter,DAY,capFood,capMat,capWater,trees,bushes,dims,unlockedSet:()=>unlocked,zoneCost,zoneAdj,upgradeTH,thReq,startTraining,SHIPS,applyModal,modalSpec,launchRaid,estimate,TARGETS,TROOPS,SMITH,GODS,addFavor,recalcMorale,jarlP,raidProvNeed,canRaid,shipCost,pname,drinkers,thrallCap,tgtDef,crewStr,raidMult,GOD_KEYS,FESTS,upCost,canUpgrade,slotsOf,herdTotal,herdCap,warCap,eatNeed,PRICES,thLevel,capFood,capMat,capArms,buildTestVillage,BASEP,GAL,render,LIMITS,REGIONS,HOUSE_CAP,startPlace,worldClose,SHIPCAP,TROOPS:typeof TROOPS!=="undefined"?TROOPS:null,priceSell,priceBuy,bought,mktSat,claimShore,yardFits,TH_UP,placeAuto,planSpot,walls:()=>walls,recomputeWalls,wallsClosed,defenceValue,PARTNERS,newTrader,regionOpen,ANIMS,hideTitle,setView:(z,x,y)=>{zoom=z;const p=iso(x,y);camX=p[0];camY=p[1];},setSpeed,openPanel,buildingSheet,queueModal,modalTick,targetSheet,planSheet,worldPanel,get plan(){return plan},set plan(v){plan=v},newPerson,syncPop,EVTS,removePerson,PB,kidsOf};
"""
i=s.rindex('})();')
s=s[:i]+hook+s[i:]
s=s.replace('<link rel="stylesheet" href="https://fonts.googleapis.com','<link rel="x" href="about:blank')
s=s.replace('function addRes(k,a){','function addRes(k,a){if(window.__P&&a>0){const y=Math.floor(S.gameT/YEAR);const P=window.__P[y]=window.__P[y]||{};P[k]=(P[k]||0)+a;}',1)
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'test.html'),'w').write(s)
