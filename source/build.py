#!/usr/bin/env python3
"""Build Ubbe's Saga: concatenates src/ into dist/index.html (single file) plus PWA files."""
import os,glob,sys,json,re
ROOT=os.path.dirname(os.path.abspath(__file__))
VERSION=open(os.path.join(ROOT,'VERSION')).read().strip()
src=os.path.join(ROOT,'src')
css=open(os.path.join(src,'style.css')).read()
head=open(os.path.join(src,'head.html')).read()
body=open(os.path.join(src,'body.html')).read()
js=''.join(open(f).read()+'\n' for f in sorted(glob.glob(os.path.join(src,'[0-9][0-9]_*.js'))))
js="(function(){\n'use strict';\nconst GAME_VERSION="+json.dumps(VERSION)+";\n"+js+"})();"
html=head+'<style>\n'+css+'</style>\n\n'+body+'<script>\n'+js+'\n</script>\n'
os.makedirs(os.path.join(ROOT,'dist'),exist_ok=True)
open(os.path.join(ROOT,'dist','index.html'),'w').write(html)
import shutil
D=os.path.join(ROOT,'dist');P=os.path.join(ROOT,'pwa')
for f in ('icon-180.png','icon-192.png','icon-512.png'):shutil.copy(os.path.join(P,f),os.path.join(D,f))
man={'name':"Ubbe's Saga",'short_name':"Ubbe's Saga",'description':'A Viking village saga. Build Kaldstrand, year 865.','start_url':'./','scope':'./','display':'standalone','orientation':'any','background_color':'#263035','theme_color':'#263035',
 'icons':[{'src':'icon-192.png','sizes':'192x192','type':'image/png'},{'src':'icon-512.png','sizes':'512x512','type':'image/png'},{'src':'icon-512.png','sizes':'512x512','type':'image/png','purpose':'maskable'}]}
open(os.path.join(D,'manifest.webmanifest'),'w').write(json.dumps(man,indent=1))
tag=re.sub(r'[^a-z0-9.]','',VERSION.lower())
open(os.path.join(D,'sw.js'),'w').write(open(os.path.join(P,'sw.js')).read().replace('__VER__',tag))
open(os.path.join(D,'.nojekyll'),'w').write('')
print('built',VERSION,len(html),'bytes')
