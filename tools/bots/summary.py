import sys,json,re
for l in sys.stdin:
  m=re.match(r'(\S+) (\d+) (\{.*\})',l)
  if not m:
    if 'ERR' in l or 'Error' in l: print(l[:300])
    continue
  d=json.loads(m.group(3))
  print(m.group(1),m.group(2),'TH',[d.get(k) for k in ('th2','th3','th4','th5')],'pop',[d.get('y%d'%i) for i in (3,6,9,12,15,18)],'mor/attr',d.get('morale_avg'),d.get('morale_min'),d.get('attr_avg'),'short',d.get('shortFood'),'wood0W',d.get('wood0W'),'wait',d.get('thWait'),'ships',d.get('ships'),'dead/left',d.get('deaths'),d.get('left'))
  print('   extra',d.get('extra'),'ups',d.get('ups'),'missing',d.get('missing'),{k:v for k,v in (d.get('fail') or {}).items() if any(z in k for z in ('trade','harb','shipy'))})
  print('   stk',json.dumps(d.get('stkEnd'))[:900])
