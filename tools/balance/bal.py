import json,sys
d=json.load(open(sys.argv[2] if len(sys.argv)>2 else 'defs.json'))
FIELDS={'hay','garden','grain','flax'}
HC=[4,5,6,7,8]; W=[0,5,12,20,30]; T=[0,0,8,10,12]   # thralls in test village = thrallCap/2
over=json.loads(sys.argv[1]) if len(sys.argv)>1 else {}
for k,v in over.items():
    if k=='HC':HC=v
    else:d[k]['lim']=v
for L in range(1,6):
    slots=0;H=0
    for k,v in d.items():
        if v['lvl']>L or v['hidden']:continue
        n=v['lim'][L-1] if v['cat']!='Decor' else 1
        lv=min(L,5) if v['up'] else 1
        if k=='house':H+=n*HC[lv-1];continue
        H+=n*v['housing'] if k!='th' else v['housing']
        if v['s']==0:continue
        s=v['s']+(0 if v['w'] or k in FIELDS else (1 if lv>=3 else 0))
        slots+=n*s
    wf=round(0.75*H)-W[L-1]+T[L-1]
    print(f'L{L} housing {H:4d} workforce~{wf:4d} slots {slots:4d} warriors {W[L-1]:3d}  spare {wf-slots:+d}')
