import os, re, json, subprocess, glob, numpy as np
from scipy.io import wavfile
V='/home/claude/vsco'; OUT='/home/claude/samp/lib'
NOTE={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def name_midi(fn):
    m=re.search(r'_([A-G])(#?)(-?\d)_',fn)
    if not m: return None
    return 12*(int(m.group(3))+1)+NOTE[m.group(1)]+(1 if m.group(2) else 0)
def load(p):
    tmp='/tmp/_p.wav'; subprocess.run(['ffmpeg','-loglevel','error','-y','-i',p,'-ac','1','-ar','44100','-c:a','pcm_f32le',tmp],check=True)
    sr,x=wavfile.read(tmp); return x.astype(np.float32)
def f0(x,sr=44100):
    i=np.argmax(np.abs(x)>0.05*np.max(np.abs(x))); seg=x[i+int(0.15*sr):i+int(0.15*sr)+8192]
    if len(seg)<4096: seg=x[i:i+8192]
    seg=seg*np.hanning(len(seg)); n=len(seg); F=np.fft.rfft(seg,4*n); ac=np.fft.irfft(np.abs(F)**2)[:n]
    lo,hi=int(sr/2000),int(sr/25); k=lo+np.argmax(ac[lo:hi])
    # prefer the first strong peak (avoid octave errors)
    pk=[j for j in range(lo+1,hi-1) if ac[j]>ac[j-1] and ac[j]>=ac[j+1] and ac[j]>0.85*ac[k]]
    if pk: k=pk[0]
    return sr/k
def trim(x,maxlen,fade=0.4,head=0.02):
    a=np.abs(x); th=0.01*a.max(); i=max(0,int(np.argmax(a>th))-int(0.004*44100)); x=x[i:]
    if len(x)>maxlen*44100: x=x[:int(maxlen*44100)]
    nf=min(len(x)//3,int(fade*44100)); x[-nf:]*=np.linspace(1,0,nf)**2
    return x/ (np.max(np.abs(x))+1e-9)*0.9
INST={ # name: (folder, filename filter regex, max seconds)
 'harp':('Strings/Harp',r'_(mf|mp|f)\.wav$',7),
 'flute':('Woodwinds/Flute/susvib',r'_v1_1\.wav$',6),
 'violin':('Strings/Solo Violin/Arco Vib',r'_p\.wav$',6),
 'violinf':('Strings/Solo Violin/Arco Vib',r'_f\.wav$',6),
 'cello':('Strings/Cello Section/susvib',r'_v1_1\.wav$',8),
 'viola':('Strings/Viola Section/susvib',r'_v1_1\.wav$',8),
 'violins':('Strings/Violin Section/susVib',r'_v1\.wav$',8),
 'bass':('Strings/Solo Contrabass/SusVib',r'_v1_rr1\.wav$',8),
 'horn':('Brass/F Horn/sus',r'_v1_1\.wav$',6),
 'hornf':('Brass/F Horn/sus',r'_v3_1\.wav$',6),
 'trombone':('Brass/Tenor Trombone/sus',r'_v2_1\.wav$',6),
}
man={}
for k,(d,flt,ml) in INST.items():
    os.makedirs(f'{OUT}/{k}',exist_ok=True); rows=[]; offs=[]
    files=sorted(f for f in os.listdir(f'{V}/{d}') if re.search(flt,f))
    for fn in files:
        nm=name_midi(fn)
        if nm is None: continue
        x=load(f'{V}/{d}/{fn}'); ff=f0(x); det=69+12*np.log2(ff/440)
        offs.append(round((det-nm)/12)); rows.append((nm,fn,x,det))
    off=max(set(offs),key=offs.count) if offs else 0
    out=[]
    for nm,fn,x,det in rows:
        m=nm+12*off; y=trim(x,ml); wavfile.write(f'{OUT}/{k}/{m}.wav',44100,y.astype(np.float32)); out.append(m)
    man[k]=sorted(set(out)); print(k,'octave offset',off,'notes',man[k][:3],'..',man[k][-2:], 'n',len(out))
# percussion: one-shots, keep several round-robins/velocities
PERC={
 'gdrum':('VSCO 1 Percussion/drums/other/ethnic/giant/hand',r'hit_(mp|f|ff|p)_\d\.wav$',3),
 'gdrumsoft':('VSCO 1 Percussion/drums/other/ethnic/giant/hand',r'hit_(pp|ppp)_\d\.wav$',3),
 'congo':('VSCO 1 Percussion/drums/other/ethnic/congo/open',r'Low.*\.wav$',2),
 'congohi':('VSCO 1 Percussion/drums/other/ethnic/congo/open',r'High.*\.wav$',2),
 'bdrum':('VSCO 1 Percussion/drums/bass',r'^bdrum_(mp|f|ff|fff)_?\d*\.wav$',4),
 'tenor':('VSCO 1 Percussion/drums/tenor/tenor_lower',r'_(mf|f|ff)_\d\.wav$',2),
 'tumba':('Percussion',r'^Tumba-HitN.*\.wav$',2),
 'conga':('Percussion',r'^Conga-HitN.*\.wav$',2),
 'quinto':('Percussion',r'^Quinto-HitN.*\.wav$',2),
 'tap':('Percussion',r'^(Conga|Tumba|Quinto)-Tap1.*\.wav$',1.5),
 'tamb':('Percussion',r'^Tamb1-Hit.*\.wav$',1.5),
 'shake':('Percussion',r'^Tamb1-Shake.*\.wav$',1.5),
 'timp':('Percussion/Timpani',r'Hit_v(1|3)_rr1_Sum\.wav$',5),
 'frame':('Miscellania Raw/Misc 2',r'^rtomtom_frame2?\.wav$',3),
}
for k,(d,flt,ml) in PERC.items():
    os.makedirs(f'{OUT}/{k}',exist_ok=True)
    files=sorted(f for f in os.listdir(f'{V}/{d}') if re.search(flt,f)); out=[]
    for i,fn in enumerate(files):
        x=load(f'{V}/{d}/{fn}'); y=trim(x,ml,fade=0.2)
        # keep relative loudness inside a family: scale by original peak
        wavfile.write(f'{OUT}/{k}/{i}.wav',44100,y.astype(np.float32)); out.append({'i':i,'f':fn,'pk':float(np.max(np.abs(x)))})
    man[k]=out; print(k,len(out),[o['f'] for o in out][:4])
json.dump(man,open(f'{OUT}/manifest.json','w'))
