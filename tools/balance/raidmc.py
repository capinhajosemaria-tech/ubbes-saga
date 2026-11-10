import random,statistics as st,sys
T=[('hval','Hvalsey',3,4,{'fish':60,'dfish':30,'misc':6,'silver':10},4,0),
   ('sogn','Sogn',3,8,{'wood':80,'iron':30,'hides':10,'silver':20},4,0),
   ('hord','Hordaland',4,18,{'silver':70,'iron':40,'spears':6,'shields':4,'meat':30},8,0),
   ('ringa','Ringsaker',4,9,{'grain':80,'meat':60,'wool':30,'silver':25},6,0),
   ('skir','Skiringssal',5,15,{'silver':90,'cloth':15,'salt':30,'tools':4},6,0),
   ('jut','Jutland',6,24,{'silver':110,'swords':3,'iron':50,'meat':40},8,0),
   ('hedeby','Hedeby',7,44,{'silver':240,'cloth':30,'swords':6,'tools':10},12,1),
   ('birka','Birka',9,32,{'silver':180,'hides':30,'cloth':20,'misc':12},10,1)]
VAL={'silver':1,'fish':0.3,'dfish':0.6,'misc':0.3,'wood':0.3,'iron':1,'hides':0.8,'spears':6,'shields':8,'meat':0.3,'grain':0.3,'wool':0.6,'cloth':1.5,'salt':0.3,'tools':6,'swords':20}
STR={'skirm':1,'spear':1.6,'archer':1.4,'warrior':2.2}
CREWS={'5 skirm (L2-early)':['skirm']*5,'12 mixed':['skirm']*5+['spear']*5+['warrior']*2,'12 elite xp2':['warrior']*6+['spear']*4+['archer']*2}
WARVAL=25  # silver-equivalent of a trained warrior lost (weapons+training+worker)
def sim(t,crew,xp,tactic,n=4000,mult=1.0):
    _,name,d,df,loot,pris,walls=t
    travel=max(2,round(d*0.7));days=2*travel+1
    res=[]
    for _ in range(n):
        alive=len(crew);s=sum(STR[c]*(1+0.1*xp) for c in crew)*mult*random.uniform(0.65,1.35)
        extra=0
        if tactic=='siege':
            rounds=5;defF=0.9**(rounds-1);D=df*1.25*defF*0.9;extra=2*rounds
            alive-=sum(1 for _ in range(rounds-1) if random.random()<0.25)
            s=s*alive/len(crew)
        else:
            D=df*(1.6 if walls else 1)*((0.8 if random.random()<0.7 else 1) if tactic=='quick' else 1)
        ratio=s/D;win=ratio>=1
        if win: fd=min(0.6,0.2/ratio**1.3*random.uniform(0.6,1.4))
        else: fd=min(0.6,max(0.15,0.35/ratio*random.uniform(0.7,1.2)))
        dead=round(alive*fd)+(len(crew)-alive)
        prov=(len(crew))*0.75*(2*travel+3+extra*1.5)
        val=0
        if win:
            m=0.6 if tactic=='quick' else 1
            l={k:v*m*1.4*random.uniform(0.85,1.15) for k,v in loot.items()}
            units=sum(v*(0.1 if k=='silver' else 1) for k,v in l.items())
            p=round(pris*(0.5 if tactic=='quick' else 1)*random.uniform(0.7,1.2)*0.5)
            cap=120;room=max(0,cap-p*4);k=min(1,room/units) if units else 1
            val=sum(v*k*VAL[k2] for k2,v in l.items())+p*12
        res.append((win,dead,val-prov*0.4-dead*WARVAL,val))
    w=sum(r[0] for r in res)/n
    return w,st.mean(r[1] for r in res),st.mean(r[3] for r in res),st.mean(r[2] for r in res),days+(10 if tactic=='siege' else 0)
for cname,crew in CREWS.items():
    xp=2 if 'xp2' in cname else 0
    print('==',cname,'str',round(sum(STR[c]*(1+0.1*xp) for c in crew),1))
    for t in T:
        for tac in (['quick','assault']+(['siege'] if t[6] else [])):
            w,dead,val,net,days=sim(t,crew,xp,tac)
            print(f"  {t[1]:12s} {tac:7s} win {w*100:5.1f}%  dead {dead:4.1f}  loot {val:6.0f}  net {net:6.0f}  days {days}  net/day {net/days:5.1f}")
