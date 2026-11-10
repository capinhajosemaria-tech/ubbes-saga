timeout 3000 python3 bots/multi4.py $1 "$2" 2>&1 | grep -v agent-proxy | python3 -c "
import sys,json,re
for line in sys.stdin:
    m=re.match(r'(\S+) (\d+) (\{.*\})(.*)',line)
    if not m: continue
    d=json.loads(m.group(3))
    print(m.group(1),m.group(2),'TH',d.get('th2'),d.get('th3'),d.get('th4'),d.get('th5'),'pop',[d.get('y%d'%i) for i in (3,6,9,12,15,18)],'deaths',d.get('deaths'),'left',d.get('left'),'raids',d.get('raids'),'ships',d.get('ships'),'mor',d.get('morale_avg'),d.get('morale_min'),m.group(4)[:100],'\n   fail',d.get('fail'),'\n   missing',d.get('missing'))
"
