/* =================== sprites =================== */
function sprite(svg,vbW,vbH,ax,ay){
  const sc=3,s={ready:false,cv:null,w:vbW,h:vbH,ax:ax,ay:ay};const img=new Image();
  img.onload=function(){const c=document.createElement('canvas');c.width=Math.ceil(vbW*sc);c.height=Math.ceil(vbH*sc);c.getContext('2d').drawImage(img,0,0,c.width,c.height);s.cv=c;s.ready=true;};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="'+(vbW*sc)+'" height="'+(vbH*sc)+'" '));
  return s;
}
const LH_CSS='.stone{fill:#A39D93}.stone-d{fill:#857F76}.wall{fill:#8E6F52}.wall-d{fill:#6E543D}.planks{stroke:#7A5F46;stroke-width:1.5}.planks-d{stroke:#5C4634;stroke-width:1.5}.beam{fill:#4E3C2E}.carve{fill:none;stroke:#C9B38A;stroke-width:1.5;stroke-linejoin:round}.roof{fill:#7F9568}.roof-b{fill:#9AAE83}.turf-line{fill:none;stroke:#6B8058;stroke-width:2;stroke-linecap:round}.ridge{stroke:#4E3C2E;stroke-width:5;stroke-linecap:round}.barge{fill:none;stroke:#8E3B2F;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}.frame{fill:#5C4634}.door{fill:#3C2E24}.door-line{stroke:#5C4634;stroke-width:1.5}.ring{fill:none;stroke:#C9B38A;stroke-width:2}.sh1{fill:#A34A3A}.sh2{fill:#D7CDB4}.boss2{fill:#C9C2B2}.barrel{fill:#8A6E52}.barrel-top{fill:#A88A69}.hoop{stroke:#4E4A45;stroke-width:2}.post{stroke:#4E3C2E;stroke-width:5;stroke-linecap:round}.flame{fill:#F0A040}.flame-in{fill:#FFE0A0}.tuft{fill:none;stroke:#6F8A5C;stroke-width:1.6;stroke-linecap:round}.w .roof,.w .roof-b{fill:#EEF1F0}.w .turf-line{stroke:#D3DAD9}.w .tuft{stroke:#C9D1D0}';
function logPileSvg(ox,oy,r){
  let s='';const vx=30,vy=15,gx=-0.894*2.1*r,gy=0.447*2.1*r,mx=-0.447,my=0.894,f=n=>n.toFixed(1);
  for(let j=0;j<3;j++)for(let k=0;k<3-j;k++){
    const px=ox+(k+j*0.5)*gx,py=oy+(k+j*0.5)*gy-j*1.75*r,qx=px-vx,qy=py-vy;
    s+='<polygon fill="#8A6E52" points="'+f(qx-mx*r)+','+f(qy-my*r)+' '+f(px-mx*r)+','+f(py-my*r)+' '+f(px+mx*r)+','+f(py+my*r)+' '+f(qx+mx*r)+','+f(qy+my*r)+'"/>';
    s+='<polygon fill="#6E543D" points="'+f(qx)+','+f(qy)+' '+f(px)+','+f(py)+' '+f(px+mx*r)+','+f(py+my*r)+' '+f(qx+mx*r)+','+f(qy+my*r)+'"/>';
    s+='<ellipse cx="'+f(px)+'" cy="'+f(py)+'" rx="'+f(r*0.9)+'" ry="'+f(r)+'" transform="rotate(-26.6 '+f(px)+' '+f(py)+')" fill="#D2B98F" stroke="#8E6F52" stroke-width="1.2"/>';
    s+='<ellipse cx="'+f(px)+'" cy="'+f(py)+'" rx="'+f(r*0.4)+'" ry="'+f(r*0.45)+'" transform="rotate(-26.6 '+f(px)+' '+f(py)+')" fill="none" stroke="#B89E74" stroke-width="1"/>';
  }
  return s;
}
function langhus(w){return '<svg viewBox="400 100 460 340"><style>'+LH_CSS+'</style><g class="'+(w?'w':'')+'">'+
'<polygon points="456,314 704,438 814,382 566,258" fill="#263035" opacity="0.18"/>'+
'<polygon class="roof-b" points="512,154 752,274 800,320 560,200"/>'+
'<polygon class="wall" points="464,308 704,428 704,368 464,248"/>'+
'<path class="planks" d="M484 266 V308 M504 276 V318 M524 286 V328 M544 296 V338 M564 306 V348 M584 316 V358 M604 326 V368 M624 336 V378 M644 346 V388 M664 356 V398 M684 366 V408"/>'+
'<polygon class="stone" points="464,308 704,428 704,418 464,298"/>'+
'<polygon class="beam" points="464,248 704,368 704,376 464,256"/>'+
'<polyline class="carve" points="464,250 484,264 504,270 524,284 544,290 564,304 584,310 604,324 624,330 644,344 664,350 684,364 704,370"/>'+
'<polygon class="wall-d" points="704,428 800,380 800,320 704,368"/>'+
'<polygon class="wall-d" points="704,368 800,320 752,274"/>'+
'<path class="planks-d" d="M720 360 V410 M736 352 V402 M768 336 V386 M784 328 V378 M736 352 V306 M752 344 V276 M768 336 V290"/>'+
'<polygon class="stone-d" points="704,428 800,380 800,370 704,418"/>'+
'<polygon class="frame" points="731,416 773,395 773,350 752,340 731,360"/>'+
'<path class="carve" d="M733 362 L752 342 L771 352"/>'+
'<polygon class="door" points="737,411 767,396 767,355 752,348 737,363"/>'+
'<path class="door-line" d="M752 404 V350"/><circle class="ring" cx="760" cy="380" r="3"/>'+
'<circle class="sh1" cx="500" cy="296" r="12"/><circle class="boss2" cx="500" cy="296" r="3"/>'+
'<circle class="sh2" cx="540" cy="316" r="12"/><circle class="boss2" cx="540" cy="316" r="3"/>'+
'<circle class="sh1" cx="584" cy="338" r="12"/><circle class="boss2" cx="584" cy="338" r="3"/>'+
'<circle class="sh2" cx="628" cy="360" r="12"/><circle class="boss2" cx="628" cy="360" r="3"/>'+
'<circle class="sh1" cx="668" cy="380" r="12"/><circle class="boss2" cx="668" cy="380" r="3"/>'+
'<polygon class="roof" points="464,248 704,368 752,274 512,154"/>'+
'<path class="turf-line" d="M476 224 L716 344 M488 201 L728 321 M500 178 L740 298"/>'+
'<line class="ridge" x1="512" y1="154" x2="752" y2="274"/>'+
'<path class="tuft" d="M536 162 l3 -7 l3 7 M584 186 l3 -7 l3 7 M680 234 l3 -7 l3 7 M728 258 l3 -7 l3 7"/>'+
'<polygon class="door" points="600,206 616,214 622,206 606,198"/>'+
'<path class="barge" d="M704 368 L752 274 L765 248 q10 -4 8 -14 M800 320 L752 274 L736 254 q-10 -2 -10 -12"/>'+
'<path class="barge" style="stroke-width:4" d="M464 248 L512 154 L524 130 q8 -2 8 -10 M512 154 L497 134 q-8 -2 -8 -10"/>'+
'<line class="post" x1="724" y1="422" x2="724" y2="390"/><line class="post" x1="778" y1="396" x2="778" y2="364"/>'+
'<path class="flame" d="M724 390 q-6 -8 0 -16 q6 8 0 16 Z"/><path class="flame-in" d="M724 388 q-3 -4 0 -9 q3 5 0 9 Z"/>'+
'<path class="flame" d="M778 364 q-6 -8 0 -16 q6 8 0 16 Z"/><path class="flame-in" d="M778 362 q-3 -4 0 -9 q3 5 0 9 Z"/>'+
logPileSvg(446,338,6)+
'<rect class="barrel" x="807" y="400" width="18" height="20"/><ellipse class="barrel-top" cx="816" cy="400" rx="9" ry="4"/><path class="hoop" d="M807 406 H825 M807 414 H825"/>'+
'<rect class="barrel" x="827" y="410" width="18" height="20"/><ellipse class="barrel-top" cx="836" cy="410" rx="9" ry="4"/><path class="hoop" d="M827 416 H845 M827 424 H845"/>'+
'</g></svg>';}
function house(w){return '<svg viewBox="-80 -95 186 185"><style>'+LH_CSS+'</style><g class="'+(w?'w':'')+'">'+
'<polygon points="-76,38 24,90 100,50 0,0" fill="#263035" opacity="0.18"/>'+
'<polygon class="roof-b" points="-36,-68 60,-20 96,8 0,-40"/>'+
'<polygon class="wall" points="-72,36 24,84 24,44 -72,-4"/>'+
'<path class="planks" d="M-56 4 V44 M-40 12 V52 M-24 20 V60 M-8 28 V68 M8 36 V76"/>'+
'<polygon class="stone" points="-72,36 24,84 24,78 -72,30"/>'+
'<polygon class="beam" points="-72,-4 24,44 24,49 -72,1"/>'+
'<polygon class="frame" points="-40,34 -18,45 -18,29 -40,18"/><polygon class="door" points="-37,32 -21,40 -21,30 -37,22"/>'+
'<polygon class="wall-d" points="24,84 96,48 96,8 24,44"/><polygon class="wall-d" points="24,44 96,8 60,-20"/>'+
'<polygon class="frame" points="49,72 71,61 71,33 60,29 49,39"/><polygon class="door" points="52,70 68,62 68,36 60,32 52,40"/>'+
'<polygon class="roof" points="-72,-4 24,44 60,-20 -36,-68"/>'+
'<path class="turf-line" d="M-60 -25 L36 23 M-48 -46 L48 2"/>'+
'<line class="ridge" style="stroke-width:4" x1="-36" y1="-68" x2="60" y2="-20"/>'+
'<path class="barge" style="stroke-width:4" d="M24 44 L60 -20 L68 -38 q6 -2 6 -8 M96 8 L60 -20 L50 -36 q-6 -2 -6 -8"/>'+
'</g></svg>';}
function spruce(w){const l=w?'#4B6650':'#567356',sn=w?'<polygon fill="#F3F2EC" points="42,136 70,100 98,136 84,130 70,138 56,130"/><polygon fill="#F3F2EC" points="48,102 70,66 92,102 80,96 70,104 60,96"/><polygon fill="#F3F2EC" points="53,70 70,36 87,70 78,65 70,72 62,65"/><polygon fill="#F3F2EC" points="60,40 70,8 80,40 75,36 70,42 65,36"/>':'';
  return '<svg viewBox="28 0 84 172"><ellipse cx="72" cy="162" rx="26" ry="7" fill="#263035" opacity="0.16"/><rect fill="#5A4636" x="66" y="146" width="8" height="14"/>'+
  '<polygon fill="#3F5A41" points="32,150 70,100 70,154"/><polygon fill="'+l+'" points="70,100 108,150 70,154"/>'+
  '<polygon fill="#3F5A41" points="38,116 70,66 70,120"/><polygon fill="'+l+'" points="70,66 102,116 70,120"/>'+
  '<polygon fill="#3F5A41" points="46,82 70,36 70,86"/><polygon fill="'+l+'" points="70,36 94,82 70,86"/>'+
  '<polygon fill="#3F5A41" points="54,50 70,8 70,54"/><polygon fill="'+l+'" points="70,8 86,50 70,54"/>'+sn+'</svg>';}
function pine(w){const l=w?'#E8EEEE':'#567356';
  return '<svg viewBox="155 105 95 200"><ellipse cx="202" cy="298" rx="22" ry="6" fill="#263035" opacity="0.16"/><polygon points="196,300 204,300 202,160 198,160" fill="#8A5A3C"/><polygon points="200,300 204,300 202,160 200,160" fill="#6E4A30"/>'+
  '<path d="M200 200 L184 186 M201 180 L218 162 M200 168 L190 150" stroke="#6E4A30" stroke-width="3" stroke-linecap="round"/>'+
  '<polygon fill="#3F5A41" points="160,196 176,170 202,174 208,192 190,204"/><polygon fill="'+l+'" points="176,170 202,174 188,188"/>'+
  '<polygon fill="#3F5A41" points="196,170 210,142 238,146 244,164 224,176"/><polygon fill="'+l+'" points="210,142 238,146 222,160"/>'+
  '<polygon fill="#3F5A41" points="172,150 188,118 212,116 220,136 200,152"/><polygon fill="'+l+'" points="188,118 212,116 200,134"/></svg>';}
function birch(w){const crown=w?'<path d="M330 200 L304 170 M330 186 L360 156 M330 172 L318 140 M331 160 L344 132 M312 178 L300 176 M350 166 L366 168" stroke="#8C877E" stroke-width="2" stroke-linecap="round"/>':
  '<path d="M330 214 L310 196 M331 196 L352 178" stroke="#CFCBBE" stroke-width="3" stroke-linecap="round"/><polygon points="286,198 296,152 330,128 364,148 376,194 352,214 310,214" fill="#7E9A62"/><polygon points="296,152 330,128 330,172" fill="#9BB27A"/><polygon points="330,128 364,148 330,172" fill="#8BA66E"/><polygon points="286,198 296,152 330,172 310,214" fill="#86A169"/><polygon points="330,172 364,148 376,194 352,214" fill="#6E8A56"/>';
  return '<svg viewBox="282 122 98 182"><ellipse cx="332" cy="298" rx="24" ry="6" fill="#263035" opacity="0.16"/><polygon points="325,300 335,300 333,150 327,150" fill="#E9E6DC"/><polygon points="330,300 335,300 333,150 330,150" fill="#CFCBBE"/>'+
  '<polygon points="326,280 332,278 332,282" fill="#263035"/><polygon points="328,252 334,250 333,255" fill="#263035"/><polygon points="326,226 331,224 331,228" fill="#263035"/>'+crown+'</svg>';}
function bush(w){const sn=w===1;const a=sn?'#C9D3D1':'#6E8A5C',b=sn?'#DCE3E3':'#84A06E',c=sn?'#D2DAD9':'#7A9664',d=sn?'#B9C4C2':'#5E7A4E';
  const berries=w===0?'<circle cx="566" cy="280" r="3.4" fill="#9E3B3B"/><circle cx="580" cy="270" r="3.4" fill="#9E3B3B"/><circle cx="596" cy="284" r="3.4" fill="#9E3B3B"/><circle cx="610" cy="272" r="3.4" fill="#9E3B3B"/><circle cx="618" cy="288" r="3.4" fill="#9E3B3B"/><circle cx="574" cy="290" r="3.4" fill="#9E3B3B"/>':'';
  return '<svg viewBox="546 250 90 54"><ellipse cx="592" cy="298" rx="40" ry="6" fill="#263035" opacity="0.14"/><polygon points="550,298 556,272 578,256 604,258 626,274 632,298" fill="'+a+'"/><polygon points="556,272 578,256 590,276" fill="'+b+'"/><polygon points="578,256 604,258 590,276" fill="'+c+'"/><polygon points="604,258 626,274 632,298 600,288" fill="'+d+'"/>'+berries+'</svg>';}
const SP={
  lh:[sprite(langhus(0),460,340,232,244),sprite(langhus(1),460,340,232,244)],
  house:[sprite(house(0),186,185,92,137),sprite(house(1),186,185,92,137)],
  spruce:[sprite(spruce(0),84,172,42,160),sprite(spruce(1),84,172,42,160)],
  pine:[sprite(pine(0),95,200,45,195),sprite(pine(1),95,200,45,195)],
  birch:[sprite(birch(0),98,182,48,178),sprite(birch(1),98,182,48,178)],
  bush:[sprite(bush(0),90,54,44,48),sprite(bush(1),90,54,44,48),sprite(bush(2),90,54,44,48)]
};
