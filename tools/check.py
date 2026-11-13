#!/usr/bin/env python3
"""Build the game and run the regression checks. Prints one line per check: PASS or FAIL with the reason.
Run from the repository root or from tools/:  python3 tools/check.py  [--quick]"""
import os,subprocess,sys,re
T=os.path.dirname(os.path.abspath(__file__));R=os.path.dirname(T)
def run(cmd,timeout=900):
    p=subprocess.run(cmd,cwd=T,shell=True,capture_output=True,text=True,timeout=timeout)
    out=(p.stdout+p.stderr);out='\n'.join(l for l in out.splitlines() if 'agent-proxy' not in l);return p.returncode,out
ok=True
rc,out=run('python3 ../source/build.py');print(('PASS' if rc==0 else 'FAIL')+'  build  '+(out.strip().splitlines() or [''])[-1]);ok&=rc==0
rc,out=run('python3 build_test.py');print(('PASS' if rc==0 else 'FAIL')+'  test page');ok&=rc==0
checks=[('ui/t5.py','Town Hall 5 test village + panels'),('ui/uitest.py','new saga, raids, modals (phone size)'),('ui/roadui.py','road tool and build menu'),
        ('ui/ghosts.py test.html','placement preview of every building'),('ui/wshot2.py','world map drag, zoom, click'),('ui/uishot.py','dock, tray, inspector (PC and phone)'),('ui/doorcheck.py','doors drawn where the game puts them'),('ui/sandbox.py','sandbox: endless stores, all open, instant')]
if '--quick' in sys.argv:checks=checks[:2]
for c,label in checks:
    try:rc,out=run('python3 '+c)
    except subprocess.TimeoutExpired:print('FAIL  '+label+'  (timed out)');ok=False;continue
    errs=[l for l in out.splitlines() if re.search(r"Error|Traceback|ERRS \[['\"]|\['[^\]]+'\]$",l) and 'ERRS []' not in l]
    bad=rc!=0 or bool(errs) or re.search(r"bad \[\(",out)
    print(('FAIL' if bad else 'PASS')+'  '+label+('  '+(errs[-1][:200] if errs else 'exit '+str(rc)) if bad else ''))
    ok&=not bad
print('ALL PASS' if ok else 'SOME CHECKS FAILED')
sys.exit(0 if ok else 1)
