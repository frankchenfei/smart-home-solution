
(function(){
  var D = window.AI_DATA;
  if(!D){ var el = document.getElementById('ai-data');
    if(el){ try { D = JSON.parse(el.textContent || el.innerHTML); } catch(e) { D = null; } } }
  if(!D) return;
  window.AI_DATA = D;
  var S = {
    newchinese:{arch:0,lattice:1,cove:1,ink:1,wallA:'#EDE7DA',wallB:'#DCD2BF',floorA:'#8A6440',floorB:'#6B4A2E',
      accent:'#8C2F26',metal:'#A8894F',wood:'#6B4A2F',fabric:'#C9BCA4',seat:'#B9A98D',plant:'#4E6B4A',light:'#F3CB92'},
    modern:{arch:0,cove:1,minimal:1,wallA:'#F4F5F6',wallB:'#E3E5E8',floorA:'#CFCCC6',floorB:'#B3AEA7',
      accent:'#12B4C8',metal:'#9AA3AB',wood:'#BFBAB2',fabric:'#8E959C',seat:'#A7AEB4',plant:'#4F7A63',light:'#FFE7BF'},
    european:{arch:1,chandelier:1,marble:1,ornate:1,wallA:'#F0E6D5',wallB:'#DFD2BB',floorA:'#8E6D48',floorB:'#6E5233',
      accent:'#7A5B2E',metal:'#C9A961',wood:'#4E3722',fabric:'#B39B72',seat:'#C6AE86',plant:'#4A6B45',light:'#FFDC9E'},
    french:{arch:1,chandelier:1,marble:1,brass:1,cove:1,wallA:'#F6F1EA',wallB:'#E9DED1',floorA:'#BE9F84',floorB:'#9C7C60',
      accent:'#C9A961',metal:'#D8B678',wood:'#8A6E52',fabric:'#D3C3AE',seat:'#E2D3C0',plant:'#53704F',light:'#FFE1B4'},
    japandi:{low:1,paper:1,wallA:'#EAE3D7',wallB:'#D7CEBE',floorA:'#B79E79',floorB:'#957E5C',
      accent:'#7C6A50',metal:'#6E6252',wood:'#8C7A5E',fabric:'#CFC4AE',seat:'#BCB09A',plant:'#5A7350',light:'#F7DCAE'},
    cream:{arch:1,curved:1,cove:1,wallA:'#F8F2EB',wallB:'#EFE3D6',floorA:'#DCC7B0',floorB:'#C0A88E',
      accent:'#D9A88C',metal:'#C7A882',wood:'#B08D6C',fabric:'#E7D6C4',seat:'#F1E3D3',plant:'#5D7A55',light:'#FFE9C7'}
  };
  var HARD = {newchinese:2700,modern:2200,european:3600,french:3200,japandi:2400,cream:2300};
  var uid = 0, timer = null;

  var state = {floor:D.floors[0].k, style:D.styles[0].k, space:D.spaces[0].k, tier:D.ui.tiers[0].k, needs:[]};

  function q(k){ return document.querySelector(k); }
  function qa(k){ return Array.prototype.slice.call(document.querySelectorAll(k)); }
  function money(n){ return n.toLocaleString('en-US'); }

  /* ---------------- 场景生成 ---------------- */
  function scene(space, styleK, floorK){
    var st = S[styleK] || S.modern, u = 's' + (++uid);
    var fl = null, i;
    for(i=0;i<D.floors.length;i++) if(D.floors[i].k===floorK) fl = D.floors[i];
    var big = fl && fl.area >= 200;
    var W=1200, H=760, HZ=470, hasWindow = (space!=='courtyard');
    var o = [];
    o.push('<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" role="img">');
    o.push('<defs>'
      + '<linearGradient id="w'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+st.wallA+'"/>'
      + '<stop offset="1" stop-color="'+st.wallB+'"/></linearGradient>'
      + '<linearGradient id="f'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+st.floorA+'"/>'
      + '<stop offset="1" stop-color="'+st.floorB+'"/></linearGradient>'
      + '<linearGradient id="d'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCF0FA"/>'
      + '<stop offset="1" stop-color="#F3E2C2"/></linearGradient>'
      + '<radialGradient id="l'+u+'"><stop offset="0" stop-color="'+st.light+'" stop-opacity=".82"/>'
      + '<stop offset="1" stop-color="'+st.light+'" stop-opacity="0"/></radialGradient>'
      + '<radialGradient id="v'+u+'" cx="50%" cy="44%" r="72%"><stop offset=".45" stop-color="#000" stop-opacity="0"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity=".40"/></radialGradient>'
      + '<linearGradient id="m'+u+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBFBF9"/>'
      + '<stop offset=".5" stop-color="#EDE9E2"/><stop offset="1" stop-color="#D9D2C7"/></linearGradient>'
      + '</defs>');
    if(space==='courtyard'){
      o.push('<rect width="'+W+'" height="300" fill="#0E1A24"/>');
      o.push('<rect width="'+W+'" height="300" fill="url(#d'+u+')" opacity=".5"/>');
      o.push('<rect y="300" width="'+W+'" height="'+(H-300)+'" fill="url(#f'+u+')"/>');
      o.push('<g opacity=".2" stroke="#fff" stroke-width="1">');
      for(i=0;i<10;i++) o.push('<path d="M'+(300+i*90)+' 300 L'+(60+i*150)+' '+H+'"/>');
      o.push('</g>');
      o.push('<rect x="60" y="120" width="1080" height="18" rx="8" fill="'+st.wood+'"/>');
      for(i=0;i<13;i++) o.push('<rect x="'+(80+i*82)+'" y="130" width="34" height="96" rx="6" fill="'+st.wood+'" opacity=".55"/>');
      o.push('<rect x="150" y="330" width="330" height="150" rx="18" fill="'+st.seat+'"/>');
      o.push('<rect x="168" y="300" width="120" height="60" rx="14" fill="'+st.seat+'" opacity=".85"/>');
      o.push('<rect x="330" y="300" width="120" height="60" rx="14" fill="'+st.seat+'" opacity=".85"/>');
      o.push('<rect x="160" y="470" width="16" height="52" rx="6" fill="'+st.wood+'"/>');
      o.push('<rect x="452" y="470" width="16" height="52" rx="6" fill="'+st.wood+'"/>');
      o.push('<rect x="118" y="600" width="120" height="90" rx="12" fill="'+st.wood+'" opacity=".8"/>');
      o.push('<ellipse cx="178" cy="596" rx="66" ry="22" fill="'+st.plant+'" opacity=".85"/>');
      o.push('<path d="M600 620 H1140 V668 H600 Z" fill="#2E6C86" opacity=".85"/>');
      o.push('<path d="M600 620 H1140 V632 H600 Z" fill="#8FD3E8" opacity=".5"/>');
      o.push('<circle cx="640" cy="560" r="46" fill="'+st.plant+'" opacity=".7"/>');
      o.push('<circle cx="720" cy="576" r="30" fill="'+st.plant+'" opacity=".55"/>');
      o.push('<rect x="880" y="380" width="250" height="180" rx="16" fill="'+st.fabric+'" opacity=".9"/>');
      o.push('<rect x="900" y="352" width="210" height="46" rx="12" fill="'+st.seat+'"/>');
      o.push('<rect x="820" y="120" width="60" height="230" rx="10" fill="url(#l'+u+')"/>');
      o.push('<circle cx="850" cy="360" r="120" fill="url(#l'+u+')" opacity=".5"/>');
      o.push('<rect width="'+W+'" height="'+H+'" fill="url(#v'+u+')"/>');
      o.push('</svg>');
      return o.join('');
    }
    o.push('<rect width="'+W+'" height="'+HZ+'" fill="url(#w'+u+')"/>');
    o.push('<rect width="'+W+'" height="112" fill="'+st.wallB+'" opacity=".85"/>');
    o.push('<rect width="'+W+'" height="'+HZ+'" fill="url(#v'+u+')" opacity=".0"/>');
    o.push('<rect y="'+HZ+'" width="'+W+'" height="'+(H-HZ)+'" fill="url(#f'+u+')"/>');
    o.push('<g opacity=".14" stroke="#fff" stroke-width="1.2">');
    for(i=0;i<11;i++) o.push('<path d="M'+(-120+i*140)+' '+HZ+' L'+(-380+i*230)+' '+H+'"/>');
    o.push('</g>');
    if(st.cove){ o.push('<rect x="120" y="108" width="'+(W-240)+'" height="5" rx="3" fill="'+st.light+'" opacity=".75"/>');
      o.push('<rect x="60" y="88" width="'+(W-120)+'" height="44" rx="14" fill="url(#l'+u+')" opacity=".35"/>'); }
    /* 窗 / 采光 */
    if(hasWindow){
      var wx=90, wy=(big?96:150), ww=(big?430:360), wh=(HZ-wy+8);
      if(st.arch){ o.push('<path d="M'+wx+' '+HZ+' V'+wy+' a'+(ww/2)+' '+(ww/2)+' 0 0 1 '+ww+' 0 V'+HZ+' Z" fill="url(#d'+u+')" opacity=".92"/>'); }
      else { o.push('<rect x="'+wx+'" y="'+wy+'" width="'+ww+'" height="'+wh+'" rx="4" fill="url(#d'+u+')" opacity=".92"/>'); }
      o.push('<g stroke="'+st.wood+'" stroke-width="7" fill="none" opacity=".85">');
      if(st.arch){ o.push('<path d="M'+wx+' '+HZ+' V'+wy+' a'+(ww/2)+' '+(ww/2)+' 0 0 1 '+ww+' 0 V'+HZ+'"/>'); }
      else { o.push('<rect x="'+wx+'" y="'+wy+'" width="'+ww+'" height="'+wh+'"/>'); }
      o.push('<path d="M'+(wx+ww/2)+' '+wy+' V'+HZ+'"/>');
      if(st.lattice){ for(i=1;i<4;i++) o.push('<path d="M'+wx+' '+(wy+i*62)+' H'+(wx+ww)+'"/>');
        for(i=1;i<4;i++) o.push('<path d="M'+(wx+i*ww/4)+' '+wy+' V'+HZ+'"/>'); }
      else { o.push('<path d="M'+wx+' '+(wy+wh/2)+' H'+(wx+ww)+'"/>'); }
      o.push('</g>');
      o.push('<path d="M'+(wx+ww)+' '+HZ+' L'+(wx+ww+320)+' '+(HZ+250)+' L'+(wx+ww-40)+' '+(HZ+250)+' Z" fill="#FFF6DE" opacity=".12"/>');
      o.push('<path d="M'+(wx+30)+' '+wy+' L'+(wx+220)+' '+HZ+' L'+(wx+60)+' '+HZ+' Z" fill="#FFF6DE" opacity=".10"/>');
    }
    /* 背景墙装饰 */
    if(st.lattice){
      o.push('<g opacity=".5" stroke="'+st.wood+'" stroke-width="3" fill="none">');
      for(i=0;i<6;i++) o.push('<path d="M'+(700+i*70)+' 150 V'+HZ+'"/>');
      for(i=0;i<6;i++) o.push('<path d="M700 '+(170+i*54)+' H1050"/>');
      o.push('</g>');
      o.push('<rect x="720" y="240" width="200" height="140" rx="6" fill="#F7F3E8" stroke="'+st.accent+'" stroke-width="3" opacity=".9"/>');
      o.push('<path d="M760 340 q40 -60 80 -10 q30 40 70 -20" stroke="'+st.accent+'" stroke-width="4" fill="none" opacity=".8"/>');
    } else if(st.ornate){
      o.push('<rect x="690" y="140" width="300" height="200" rx="10" fill="#F6EFE0" stroke="'+st.metal+'" stroke-width="7"/>');
      o.push('<rect x="706" y="156" width="268" height="168" rx="6" fill="'+st.fabric+'" opacity=".55"/>');
      o.push('<circle cx="840" cy="240" r="52" fill="'+st.accent+'" opacity=".35"/>');
      o.push('<rect x="640" y="120" width="400" height="18" rx="6" fill="'+st.metal+'" opacity=".7"/>');
      o.push('<rect x="600" y="320" width="60" height="150" rx="8" fill="'+st.metal+'" opacity=".45"/>');
      o.push('<rect x="1020" y="320" width="60" height="150" rx="8" fill="'+st.metal+'" opacity=".45"/>');
    } else if(st.marble){
      o.push('<rect x="700" y="150" width="330" height="'+(HZ-150)+'" fill="url(#m'+u+')" opacity=".9"/>');
      o.push('<rect x="1010" y="150" width="130" height="'+(HZ-150)+'" fill="'+st.wood+'" opacity=".55"/>');
      o.push('<g stroke="'+st.metal+'" stroke-width="2" opacity=".7" fill="none"><rect x="730" y="185" width="230" height="160" rx="4"/>');
      o.push('<path d="M730 265 H960 M845 185 V345"/></g>');
    } else if(st.ink){
      o.push('<rect x="720" y="180" width="260" height="150" rx="8" fill="#F6F2E7" stroke="'+st.wood+'" stroke-width="5"/>');
      o.push('<path d="M760 300 q50 -70 100 -14 q40 44 80 -26" stroke="#3B3A36" stroke-width="3" fill="none" opacity=".7"/>');
    } else {
      o.push('<rect x="700" y="170" width="300" height="170" rx="10" fill="#F5F5F3" stroke="'+st.metal+'" stroke-width="3"/>');
      o.push('<rect x="726" y="196" width="248" height="118" rx="6" fill="'+st.accent+'" opacity=".16"/>');
    }

    /* ---- 家具 ---- */
    function sofa(x,y,w){
      var s=[];
      s.push('<rect x="'+x+'" y="'+y+'" width="'+w+'" height="118" rx="'+(st.curved?34:16)+'" fill="'+st.fabric+'"/>');
      s.push('<rect x="'+(x+8)+'" y="'+(y-72)+'" width="'+(w-16)+'" height="96" rx="'+(st.curved?30:14)+'" fill="'+st.seat+'"/>');
      s.push('<rect x="'+(x+18)+'" y="'+(y-88)+'" width="'+(w-36)+'" height="44" rx="'+(st.curved?22:12)+'" fill="'+st.seat+'" opacity=".75"/>');
      s.push('<rect x="'+(x-16)+'" y="'+(y-70)+'" width="34" height="176" rx="16" fill="'+st.fabric+'"/>');
      s.push('<rect x="'+(x+w-18)+'" y="'+(y-70)+'" width="34" height="176" rx="16" fill="'+st.fabric+'"/>');
      for(var i=0;i<3;i++) s.push('<rect x="'+(x+20+i*((w-40)/3))+'" y="'+(y-52)+'" width="'+((w-60)/3)+'" height="76" rx="'+(st.curved?24:12)+'" fill="'+(i%2?st.seat:st.fabric)+'" opacity=".95"/>');
      for(var j=0;j<2;j++) s.push('<rect x="'+(x+22+j*36)+'" y="'+(y+118)+'" width="12" height="26" rx="4" fill="'+st.wood+'"/>');
      s.push('<rect x="'+(x+w-34)+'" y="'+(y+118)+'" width="12" height="26" rx="4" fill="'+st.wood+'"/>');
      return s.join('');
    }
    function lamp(x,y,scale){
      return '<rect x="'+(x-3)+'" y="'+y+'" width="6" height="'+(560-y)+'" rx="3" fill="'+st.metal+'"/>'
        + '<path d="M'+(x-38*scale)+' '+y+' h'+(76*scale)+' l-14 '+(-46*scale)+' h'+(-48*scale)+' z" fill="'+st.light+'"/>'
        + '<ellipse cx="'+x+'" cy="'+(y+8)+'" rx="90" ry="70" fill="url(#l'+u+')" opacity=".55"/>'
        + '<ellipse cx="'+x+'" cy="562" rx="30" ry="9" fill="'+st.metal+'" opacity=".7"/>';
    }
    function rug(x,y,w,h){
      return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="26" fill="'+(st.curved?st.seat:st.fabric)+'" opacity=".45"/>'
        + '<rect x="'+(x+14)+'" y="'+(y+12)+'" width="'+(w-28)+'" height="'+(h-24)+'" rx="20" fill="none" stroke="'+st.metal+'" stroke-width="2" opacity=".45"/>';
    }
    function plant(x,y,s){
      return '<rect x="'+(x-26*s)+'" y="'+(y-46*s)+'" width="'+(52*s)+'" height="'+(52*s)+'" rx="10" fill="'+st.wood+'"/>'
        + '<path d="M'+x+' '+(y-46*s)+' C'+(x-62*s)+' '+(y-140*s)+' '+(x+58*s)+' '+(y-132*s)+' '+x+' '+(y-46*s)+'" fill="'+st.plant+'" opacity=".85"/>'
        + '<ellipse cx="'+(x-30*s)+'" cy="'+(y-96*s)+'" rx="'+(26*s)+'" ry="'+(34*s)+'" fill="'+st.plant+'" opacity=".7"/>'
        + '<ellipse cx="'+(x+32*s)+'" cy="'+(y-110*s)+'" rx="'+(24*s)+'" ry="'+(30*s)+'" fill="'+st.plant+'" opacity=".6"/>';
    }
    function pendants(xs,y,cordLen){
      var g='';
      for(var i=0;i<xs.length;i++){
        g += '<rect x="'+(xs[i]-2)+'" y="112" width="4" height="'+cordLen+'" fill="'+st.metal+'"/>'
          + '<path d="M'+(xs[i]-34)+' '+(112+cordLen+30)+' h68 l-16 30 h-36 z" fill="'+st.light+'"/>'
          + '<ellipse cx="'+xs[i]+'" cy="'+(112+cordLen+40)+'" rx="74" ry="54" fill="url(#l'+u+')" opacity=".5"/>';
      }
      return g;
    }
    function chandelier(x,y){
      var g = '<rect x="'+(x-3)+'" y="112" width="6" height="'+(y-112)+'" fill="'+st.metal+'"/>';
      g += '<ellipse cx="'+x+'" cy="'+y+'" rx="46" ry="14" fill="'+st.metal+'"/>';
      for(var i=0;i<6;i++){
        var a=i*Math.PI/3, dx=Math.cos(a)*72, dy=Math.sin(a)*18;
        g += '<path d="M'+x+' '+y+' q'+(dx/2)+' '+(dy+26)+' '+dx+' '+dy+'" stroke="'+st.metal+'" stroke-width="3" fill="none"/>'
          + '<rect x="'+(x+dx-6)+'" y="'+(y+dy-26)+'" width="12" height="26" rx="4" fill="'+st.light+'"/>'
          + '<circle cx="'+(x+dx)+'" cy="'+(y+dy-30)+'" r="7" fill="'+st.light+'"/>';
      }
      g += '<ellipse cx="'+x+'" cy="'+(y+20)+'" rx="170" ry="120" fill="url(#l'+u+')" opacity=".45"/>';
      return g;
    }
    if(space==='living'){
      o.push(rug(300,560,660,190));
      o.push(sofa(big?430:470,404,big?600:520));
      o.push('<ellipse cx="'+(big?720:700)+'" cy="620" rx="132" ry="34" fill="'+st.wood+'"/>');
      o.push('<rect x="'+(big?700:680)+'" y="620" width="12" height="52" rx="4" fill="'+st.metal+'"/>');
      o.push('<rect x="'+(big?640:620)+'" y="586" width="90" height="14" rx="6" fill="'+st.accent+'" opacity=".7"/>');
      o.push(lamp(big?1090:1060,236,1));
      o.push(plant(1020,632,1));
      if(st.chandelier) o.push(chandelier(880,220)); else if(st.paper) o.push(lamp(300,300,.9));
      if(st.minimal) o.push('<rect x="150" y="300" width="900" height="10" rx="5" fill="'+st.light+'" opacity=".5"/>');
    }
    if(space==='bedroom'){
      o.push(rug(300,570,700,180));
      o.push('<rect x="'+(big?360:400)+'" y="336" width="'+(big?560:500)+'" height="150" rx="16" fill="'+st.seat+'"/>');
      o.push('<rect x="'+(big?352:392)+'" y="456" width="'+(big?576:516)+'" height="128" rx="14" fill="'+st.fabric+'"/>');
      o.push('<rect x="'+(big?372:412)+'" y="470" width="'+(big?200:180)+'" height="64" rx="14" fill="#F7F3EA" opacity=".95"/>');
      o.push('<rect x="'+(big?592:612)+'" y="470" width="'+(big?200:180)+'" height="64" rx="14" fill="#F7F3EA" opacity=".95"/>');
      o.push('<rect x="'+(big?352:392)+'" y="546" width="'+(big?576:516)+'" height="60" rx="12" fill="'+st.accent+'" opacity=".55"/>');
      o.push('<rect x="'+(big?300:340)+'" y="470" width="56" height="72" rx="8" fill="'+st.wood+'"/>');
      o.push('<rect x="'+(big?920:900)+'" y="470" width="56" height="72" rx="8" fill="'+st.wood+'"/>');
      o.push(lamp(big?286:326,300,.55));
      o.push(lamp(big?906:886,300,.55));
      o.push(pendants([big?640:600,big?800:760],64));
      o.push(plant(1080,640,.85));
    }
    if(space==='dining'){
      o.push(rug(330,600,660,150));
      o.push('<ellipse cx="660" cy="540" rx="'+(big?290:250)+'" ry="46" fill="'+st.wood+'"/>');
      o.push('<rect x="'+(big?620:630)+'" y="540" width="30" height="90" rx="8" fill="'+st.wood+'"/>');
      for(var c=0;c<4;c++){
        var cx=[big?470:490,big?850:830,big?560:570,big?760:750][c], cy=[556,556,640,640][c];
        o.push('<rect x="'+(cx-40)+'" y="'+(cy-70)+'" width="80" height="84" rx="12" fill="'+st.seat+'"/>'
          + '<rect x="'+(cx-34)+'" y="'+(cy+14)+'" width="68" height="14" rx="6" fill="'+st.fabric+'"/>');
      }
      o.push(pendants([big?560:570,big?660:660,big?760:750],88));
      o.push('<rect x="'+(big?410:430)+'" y="330" width="160" height="120" rx="8" fill="'+st.fabric+'" opacity=".6" stroke="'+st.metal+'" stroke-width="3"/>');
      o.push(plant(1090,646,.8));
    }
    if(space==='study'){
      o.push(rug(340,590,620,150));
      o.push('<rect x="'+(big?430:470)+'" y="470" width="'+(big?500:440)+'" height="26" rx="8" fill="'+st.wood+'"/>');
      o.push('<rect x="'+(big?450:490)+'" y="496" width="14" height="120" fill="'+st.metal+'"/>');
      o.push('<rect x="'+(big?896:876)+'" y="496" width="14" height="120" fill="'+st.metal+'"/>');
      o.push('<rect x="'+(big?600:620)+'" y="382" width="170" height="96" rx="8" fill="#2B3038" opacity=".85"/>');
      o.push('<rect x="'+(big?620:640)+'" y="478" width="130" height="10" rx="4" fill="'+st.metal+'"/>');
      o.push('<rect x="'+(big?540:560)+'" y="530" width="120" height="120" rx="16" fill="'+st.seat+'"/>');
      o.push('<rect x="'+(big?552:572)+'" y="640" width="96" height="12" rx="6" fill="'+st.fabric+'"/>');
      o.push(lamp(big?790:800,330,.5));
      o.push('<rect x="980" y="180" width="190" height="290" fill="'+st.wood+'" opacity=".85"/>');
      for(var sh=0;sh<4;sh++) o.push('<rect x="992" y="'+(200+sh*72)+'" width="166" height="10" rx="4" fill="'+st.metal+'" opacity=".7"/>');
      o.push(plant(1080,662,.7));
    }
    if(st.chandelier && space!=='living' && space!=='bedroom') o.push(chandelier(660,206));
    if(!st.chandelier && space==='living' && !st.paper) o.push(pendants([big?760:740,big?920:900],72));
    o.push('<rect width="'+W+'" height="'+H+'" fill="url(#v'+u+')"/>');
    o.push('</svg>');
    return o.join('');
  }

  /* ---------------- 毛坯 / 现状场景 ---------------- */
  function rawScene(space){
    var u = 'r' + (++uid);
    var W = 1200, H = 760, HZ = 470;
    var o = ['<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img">'];
    o.push('<defs>'
      + '<linearGradient id="rw' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BEBAB4"/>'
      + '<stop offset="1" stop-color="#A5A19B"/></linearGradient>'
      + '<linearGradient id="rf' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ACA79F"/>'
      + '<stop offset="1" stop-color="#8C877F"/></linearGradient>'
      + '<radialGradient id="rl' + u + '"><stop offset="0" stop-color="#FFF3D6" stop-opacity=".9"/>'
      + '<stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient>'
      + '<radialGradient id="rv' + u + '" cx="50%" cy="44%" r="72%"><stop offset=".45" stop-color="#000" stop-opacity="0"/>'
      + '<stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient>'
      + '</defs>');
    o.push('<rect width="' + W + '" height="' + HZ + '" fill="url(#rw' + u + ')"/>');
    o.push('<rect y="' + HZ + '" width="' + W + '" height="' + (H-HZ) + '" fill="url(#rf' + u + ')"/>');
    /* 墙面批灰痕迹 */
    var i;
    for (i=0;i<7;i++){
      o.push('<rect x="' + (60 + i*152) + '" y="' + (40 + (i%3)*36) + '" width="' + (90 + (i%4)*40) +
             '" height="' + (120 + (i%3)*70) + '" fill="#B4B0AA" opacity=".55"/>');
    }
    o.push('<g stroke="#8E8A84" stroke-width="2" opacity=".5" fill="none">');
    for (i=0;i<4;i++) o.push('<path d="M60 ' + (120 + i*74) + ' H' + (1140 - i*40) + '"/>');
    o.push('</g>');
    /* 窗洞 / 塑料布 */
    o.push('<rect x="90" y="150" width="360" height="' + (HZ-150+8) + '" fill="#6E6A64"/>');
    o.push('<g stroke="#D8D4CE" stroke-width="3" opacity=".55" fill="none">');
    for (i=0;i<7;i++) o.push('<path d="M90 ' + (170 + i*52) + ' L450 ' + (140 + i*52) + '"/>');
    o.push('</g>');
    /* 地面找平 + 碎石 */
    o.push('<g fill="#7E7A74" opacity=".5">');
    for (i=0;i<16;i++) o.push('<circle cx="' + (90 + (i*73)%1000) + '" cy="' + (520 + (i*37)%180) + '" r="' + (3 + (i%3)*2) + '"/>');
    o.push('</g>');
    o.push('<g opacity=".22" stroke="#fff" stroke-width="1.2" fill="none">');
    for (i=0;i<10;i++) o.push('<path d="M' + (-120 + i*140) + ' ' + HZ + ' L' + (-380 + i*230) + ' ' + H + '"/>');
    o.push('</g>');
    /* 线管 + 底盒 + 电线 */
    o.push('<rect x="640" y="150" width="6" height="250" fill="#9C7A3C"/>');
    o.push('<rect x="600" y="380" width="86" height="66" rx="6" fill="#8E8A84"/>');
    o.push('<rect x="616" y="396" width="14" height="34" fill="#C0392B"/>');
    o.push('<rect x="640" y="396" width="14" height="34" fill="#2E6C86"/>');
    o.push('<rect x="664" y="396" width="14" height="34" fill="#4C7A44"/>');
    o.push('<path d="M690 180 q50 60 10 140 q-40 80 30 130" stroke="#B9B5AF" stroke-width="3" fill="none"/>');
    o.push('<path d="M960 120 q-30 90 20 150" stroke="#B9B5AF" stroke-width="3" fill="none"/>');
    /* 临时灯泡 */
    o.push('<path d="M1020 0 V150" stroke="#8E8A84" stroke-width="3"/>');
    o.push('<circle cx="1020" cy="176" r="26" fill="#F6E7B8" opacity=".92"/>');
    o.push('<circle cx="1020" cy="176" r="120" fill="url(#rl' + u + ')" opacity=".62"/>');
    /* 工具与材料 */
    o.push('<rect x="180" y="596" width="150" height="54" rx="8" fill="#7C6A50"/>');
    o.push('<rect x="196" y="580" width="118" height="18" rx="6" fill="#8E7A5E"/>');
    o.push('<rect x="380" y="600" width="70" height="52" rx="8" fill="#5F6B74"/>');
    o.push('<rect x="470" y="620" width="120" height="12" rx="6" fill="#A8A49D"/>');
    o.push('<rect x="470" y="640" width="90" height="12" rx="6" fill="#A8A49D"/>');
    /* 水桶 */
    o.push('<path d="M840 600 h70 l-10 54 h-50 z" fill="#5E7F8C"/>');
    o.push('<ellipse cx="875" cy="600" rx="35" ry="9" fill="#7CA0AD"/>');
    /* 门洞 */
    o.push('<rect x="1040" y="210" width="160" height="' + (HZ-210+8) + '" fill="#9A968F"/>');
    o.push('<rect x="1040" y="210" width="160" height="' + (HZ-210+8) + '" fill="none" stroke="#8A8680" stroke-width="4"/>');
    o.push('<rect width="' + W + '" height="' + H + '" fill="url(#rv' + u + ')"/>');
    o.push('</svg>');
    return o.join('');
  }

  /* ---------------- 结果渲染 ---------------- */
  function cur(list, k){ for(var i=0;i<list.length;i++) if(list[i].k===k) return list[i]; return list[0]; }
  function pad(n){ return n < 10 ? '0' + n : '' + n; }
  function planId(fl, st, ti){
    var d = new Date();
    return 'ZH-' + d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) + '-' +
           fl.k.toUpperCase() + '-' + st.k.toUpperCase() + '-' + ti.k.toUpperCase();
  }
  function switchCount(fl){ return fl.area >= 280 ? 14 : (fl.area >= 130 ? 10 : 8); }

  /* 智能点位示意图（简化平面 + 点位标记） */
  function floorplan(floorK, needKeys){
    var fl = cur(D.floors, floorK);
    var W = 520, H = 340, m = 16;
    var cols = fl.area >= 280 ? 3 : (fl.area >= 130 ? 3 : 2);
    var rows = fl.area >= 280 ? 3 : 2;
    var iw = (W - 2*m) / cols, ih = (H - 2*m) / rows;
    var SW = '#12B4C8', SN = '#C9A961', AP = '#5B7CFA', CU = '#E08A5B';
    var hints = ['sofa','bed','table','desk','kitchen','bath','wardrobe','child'];
    var o = ['<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img">'];
    o.push('<rect x="' + m + '" y="' + m + '" width="' + (W-2*m) + '" height="' + (H-2*m) +
           '" rx="10" fill="#FBFCFD" stroke="#B7C3CE" stroke-width="3"/>');
    var i, r, c, x, y, hx, hy, h;
    for (r=0; r<rows; r++){
      for (c=0; c<cols; c++){
        x = m + c*iw; y = m + r*ih;
        o.push('<rect x="' + x + '" y="' + y + '" width="' + iw + '" height="' + ih +
               '" fill="#fff" stroke="#CBD5DE" stroke-width="2"/>');
        h = hints[(r*cols + c) % hints.length];
        hx = x + iw*0.24; hy = y + ih*0.5;
        if (h === 'sofa'){
          o.push('<rect x="' + hx + '" y="' + hy + '" width="' + iw*0.5 + '" height="' + ih*0.16 +
                 '" rx="4" fill="#E6EDF3"/><rect x="' + hx + '" y="' + (hy - ih*0.09) + '" width="' + iw*0.5 +
                 '" height="' + ih*0.09 + '" rx="4" fill="#EFF4F8"/>');
        } else if (h === 'bed'){
          o.push('<rect x="' + hx + '" y="' + hy + '" width="' + iw*0.44 + '" height="' + ih*0.3 +
                 '" rx="4" fill="#E6EDF3"/><rect x="' + (hx+4) + '" y="' + (hy+4) + '" width="' + iw*0.16 +
                 '" height="' + ih*0.1 + '" rx="3" fill="#fff"/>');
        } else if (h === 'table'){
          o.push('<ellipse cx="' + (hx + iw*0.2) + '" cy="' + (hy + ih*0.14) + '" rx="' + iw*0.16 +
                 '" ry="' + ih*0.11 + '" fill="#E6EDF3"/>');
        } else if (h === 'desk'){
          o.push('<rect x="' + hx + '" y="' + hy + '" width="' + iw*0.4 + '" height="' + ih*0.08 +
                 '" rx="3" fill="#E6EDF3"/>');
        } else {
          o.push('<rect x="' + hx + '" y="' + hy + '" width="' + iw*0.36 + '" height="' + ih*0.22 +
                 '" rx="4" fill="#EDF2F7"/>');
        }
      }
    }
    /* 点位 */
    var pts = {sw:0, sn:0, ap:0, cu:0};
    var marks = [];
    for (r=0; r<rows; r++){
      for (c=0; c<cols; c++){
        x = m + c*iw; y = m + r*ih;
        marks.push('<path d="M' + (x+18) + ' ' + (y+11) + ' l7 7 -7 7 -7 -7 z" fill="' + SW + '"/>');
        pts.sw++;
        if (c === 0 && r === 0){ marks.push('<rect x="' + (x+10) + '" y="' + (y+ih-24) +
          '" width="13" height="13" rx="3" fill="' + SW + '"/>'); pts.sw++; }
        if (r === 0){ marks.push('<rect x="' + (x+iw*0.45) + '" y="' + (y+4) +
          '" width="' + Math.min(30, iw*0.3) + '" height="7" rx="3" fill="' + CU + '"/>'); pts.cu++; }
      }
    }
    marks.push('<circle cx="' + (W/2) + '" cy="' + (m + ih/2) + '" r="7" fill="' + AP + '"/>'); pts.ap++;
    marks.push('<circle cx="' + (W - m - 26) + '" cy="' + (H - m - 26) + '" r="7" fill="' + AP + '"/>'); pts.ap++;
    var snSpots = [[m + iw*0.55, m + ih*0.72], [W/2 + 20, H - m - 30]];
    snSpots.push([m + 30, H - m - 40]);
    for (i=0; i<snSpots.length; i++){ marks.push('<circle cx="' + snSpots[i][0] + '" cy="' + snSpots[i][1] + '" r="6" fill="' + SN + '"/>'); pts.sn++; }
    var needExtra = {elder:2, kids:1, pet:1, office:1, guest:0};
    for (i=0; i<needKeys.length; i++){ pts.sn += (needExtra[needKeys[i]] || 0); }
    for (i=0; i<pts.sn - snSpots.length; i++){
      marks.push('<circle cx="' + (m + 60 + i*46) + '" cy="' + (H/2 + 6) + '" r="6" fill="' + SN + '"/>');
    }
    o.push(marks.join(''));
    o.push('</svg>');
    return {svg: o.join(''), pts: pts};
  }

  function legendHtml(){
    var cols = ['#12B4C8', '#C9A961', '#5B7CFA', '#E08A5B'];
    return D.ui.legend.map(function(t, i){
      return '<span><i style="background:' + cols[i] + '"></i>' + t + '</span>';
    }).join('');
  }

  function renderAll(){
    var fl = cur(D.floors, state.floor), sp = cur(D.spaces, state.space), st = cur(D.styles, state.style);
    var ti = cur(D.ui.tiers, state.tier);
    /* 主图 */
    q('#ai-scene').innerHTML = scene(state.space, state.style, state.floor);
    q('#ai-scene-note').textContent = D.ui.note;
    q('#ai-tags').innerHTML = '<span>' + fl.name + '</span><span>' + sp.name + '</span><span>' + st.name +
      '</span><span>' + ti.name + '</span>';
    /* 成套缩略图 */
    var order = [state.space];
    for (var i=0;i<D.spaces.length;i++){ if(D.spaces[i].k !== state.space && order.length < 4) order.push(D.spaces[i].k); }
    q('#ai-thumbs').innerHTML = order.map(function(k){
      var s2 = cur(D.spaces, k);
      return '<button type="button" class="ai-thumb-btn' + (k === state.space ? ' on' : '') +
             '" data-space="' + k + '"><span class="mini">' + scene(k, state.style, state.floor) +
             '</span><em>' + s2.name + '</em></button>';
    }).join('') + '<p class="ai-note" style="grid-column:1/-1;margin:0">' + D.ui.rotate + '</p>';
    qa('#ai-thumbs .ai-thumb-btn').forEach(function(b){
      b.addEventListener('click', function(){
        state.space = b.getAttribute('data-space'); renderAll();
      });
    });
    /* 参数行 */
    var shots = ti.renders;
    q('#ai-meta').innerHTML = '<span>' + D.ui.area + ' <b>' + fl.area + '㎡</b></span>'
      + '<span>' + D.ui.layout + ' <b>' + fl.rooms + '</b></span>'
      + '<span>' + D.ui.shots + ' <b>' + shots + (D.ui.unitPcs || '') + '</b></span>'
      + '<span>' + D.ui.matched + ' <b>' + D.ui.cases + '</b></span>'
      + '<span>' + D.ui.speed + ' <b>' + D.ui.speedV + '</b></span>';
    q('#ai-tagline').textContent = st.tagline;
    /* 点位图 */
    var fp = floorplan(state.floor, state.needs);
    q('#ai-floorplan').innerHTML = fp.svg;
    q('#ai-legend').innerHTML = legendHtml();
    var tot = fp.pts.sw + fp.pts.sn + fp.pts.ap + fp.pts.cu;
    q('#ai-points').textContent = D.ui.points + '：' + tot + ' 个（' + D.ui.legend[0] + ' ' + fp.pts.sw +
      ' · ' + D.ui.legend[1] + ' ' + fp.pts.sn + ' · ' + D.ui.legend[2] + ' ' + fp.pts.ap + ' · ' +
      D.ui.legend[3] + ' ' + fp.pts.cu + '）';
    /* 生成清单 */
    q('#ai-deliverables').innerHTML = D.ui.deliverables.map(function(t, i){
      var badge = i === 0 ? (shots + ' 张') : (i === 4 ? (tot + ' 点位') : (i === 3 ? '' : ''));
      return '<li><span>' + t + '</span>' + (badge ? '<em>' + badge + '</em>' : '') + '</li>';
    }).join('');
    q('#ai-planid').textContent = D.ui.planId + '：' + planId(fl, st, ti);
    /* 配色 + 主材 */
    var sw = '';
    for (var j=0;j<st.palette.length;j++){
      sw += '<span class="swatch"><i style="background:' + st.palette[j][0] + '"></i><em>' + st.palette[j][1] + '</em></span>';
    }
    q('#ai-palette').innerHTML = sw;
    q('#ai-mats').innerHTML = '<ul>' + st.materials.map(function(m){ return '<li>' + m + '</li>'; }).join('')
      + '<li><b>' + ti.mat + '</b></li></ul>';
    /* 灯光 */
    q('#ai-light').innerHTML = '<p>' + st.lighting + '</p>';
    /* 智能配套（含特殊需求） */
    var add = '';
    for (var k=0;k<state.needs.length;k++){
      var nd = cur(D.ui.needs, state.needs[k]);
      add += '<li>' + nd.add + '</li>';
    }
    q('#ai-smart').innerHTML = '<p>' + st.smart + '</p>' +
      (add ? '<ul class="ai-adds">' + add + '</ul>' : '<p class="ai-note">' + D.ui.none + '</p>');
    /* 档次 */
    q('#ai-tier').innerHTML = '<p><b>' + ti.name + '</b> · ' + ti.sub + '</p><p>' + ti.extra + '</p>'
      + '<p class="ai-note">' + shots + (D.ui.unitPcs || '') + ' ' + D.ui.night + ' · ' + D.ui.drawing + '</p>';
    /* 造价 */
    var rate = (HARD[state.style] || 2400) * ti.coef;
    var loY = fl.area*rate, hiY = fl.area*rate*1.28, smartY = fl.area*fl.smart;
    function fmt(n, noSym){
      var head = noSym ? '' : D.ui.cur;
      if (D.ui.pMode === 'wan'){ var v = n/10000; return head + (v >= 100 ? Math.round(v) : (Math.round(v*10)/10)) + D.ui.wan; }
      return head + (n >= 1000000 ? (Math.round(n/10000)/100).toFixed(2) + 'M' : Math.round(n/1000) + 'k');
    }
    q('#ai-price').innerHTML = '<table><tbody>'
      + '<tr><th>' + D.ui.pHard + '</th><td><b>' + fmt(loY) + '–' + fmt(hiY, true) + '</b></td></tr>'
      + '<tr><th>' + D.ui.pSmart + '</th><td><b>' + fmt(smartY) +
        (D.ui.pMode === 'wan' ? D.ui.up.replace(' ', '') : '+') + '</b></td></tr>'
      + '<tr><th>' + D.ui.pRender + '</th><td><b>' + D.ui.cur + money(D.ui.renderPrice + (ti.k === 'luxury' ? 1200 : 0)) + '</b></td></tr>'
      + '<tr><th>' + D.ui.pFull + '</th><td><b>' + D.ui.cur + money(D.ui.fullPrice) + D.ui.up + '</b></td></tr>'
      + '</tbody></table>';
  }

  /* ---------------- 控件 ---------------- */
  function buildChips(){
    var groups = [['#ai-floors', D.floors, 'floor'], ['#ai-styles', D.styles, 'style'],
                  ['#ai-spaces', D.spaces, 'space'], ['#ai-tiers', D.ui.tiers, 'tier']];
    groups.forEach(function(g){
      var host = q(g[0]); if(!host) return;
      host.innerHTML = g[1].map(function(it){
        return '<button type="button" class="ai-chip" data-k="' + it.k + '" data-g="' + g[2] + '">' + it.name +
          (it.sub ? '<em>' + it.sub + '</em>' : (it.rooms ? '<em>' + it.rooms + '</em>' : '')) + '</button>';
      }).join('');
    });
    var nh = q('#ai-needs');
    if (nh){
      nh.innerHTML = D.ui.needs.map(function(it){
        return '<button type="button" class="ai-chip ai-chip-need" data-need="' + it.k + '">' + it.name + '</button>';
      }).join('');
      qa('#ai-needs .ai-chip-need').forEach(function(b){
        b.addEventListener('click', function(){
          var k = b.getAttribute('data-need'), i = state.needs.indexOf(k);
          if (i > -1) state.needs.splice(i, 1); else state.needs.push(k);
          b.classList.toggle('on'); renderAll();
        });
      });
    }
    qa('.ai-chip[data-g]').forEach(function(b){
      b.addEventListener('click', function(){
        if (state.busy) return;
        state[b.getAttribute('data-g')] = b.getAttribute('data-k');
        syncChips(); renderAll();
      });
    });
    syncChips();
  }
  function syncChips(){
    qa('.ai-chip[data-g]').forEach(function(b){
      b.classList.toggle('on', state[b.getAttribute('data-g')] === b.getAttribute('data-k'));
    });
  }

  function generate(){
    if (state.busy) return;
    state.busy = true;
    var wrap = q('#ai-progress'), bar = q('#ai-progress .ai-bar i'), lis = qa('#ai-progress li');
    if (!wrap || !bar){ renderAll(); state.busy = false; return; }
    wrap.classList.add('on'); bar.style.width = '4%';
    lis.forEach(function(l, i){ l.classList.toggle('on', i === 0); });
    var i = 0, timer = setInterval(function(){
      i++;
      if (i < lis.length){ lis[i].classList.add('on'); bar.style.width = (18 + i*26) + '%'; }
      if (i >= lis.length){
        clearInterval(timer);
        bar.style.width = '100%';
        setTimeout(function(){
          renderAll();
          wrap.classList.remove('on'); bar.style.width = '0%';
          lis.forEach(function(l){ l.classList.remove('on'); });
          state.busy = false;
          var s2 = q('#ai-scene');
          if (s2){ s2.style.transition = 'opacity .45s'; s2.style.opacity = '.25';
            setTimeout(function(){ s2.style.opacity = '1'; }, 60); }
        }, 320);
      }
    }, 520);
  }

  var go = q('#ai-go');
  if (go) go.addEventListener('click', generate);
  var form = q('#ai-form');
  if (form) form.addEventListener('submit', function(e){
    e.preventDefault();
    var t = q('#ai-toast'); if (t) t.classList.add('on');
  });

  buildChips();
  if (q('#ai-scene')) renderAll();
  /* 改造前后对比滑块 */
  qa('[data-cmp]').forEach(function(el, i){
    var sp = el.getAttribute('data-space') || 'living';
    var sk = el.getAttribute('data-style') || 'modern';
    var fk = el.getAttribute('data-floor') || 'apt120';
    var A = el.querySelector('.cmp-raw'), B = el.querySelector('.cmp-rend');
    if (A) A.innerHTML = rawScene(sp);
    if (B) B.innerHTML = scene(sp, sk, fk);
    var rng = el.querySelector('input[type=range]');
    function set(v){ el.style.setProperty('--x', v + '%'); if(rng) rng.value = v; }
    set(56);
    if (rng) rng.addEventListener('input', function(){ el.style.setProperty('--x', rng.value + '%'); });
    if (!i && rng) set(56);
  });
  /* 图库 / 推广位缩略图 */
  qa('[data-ai-thumb]').forEach(function(el, i){
    var k = el.getAttribute('data-ai-thumb');
    el.innerHTML = scene(el.getAttribute('data-space') || (i%3===0?'living':(i%3===1?'bedroom':'dining')),
                         k, el.getAttribute('data-floor') || 'villa300');
  });
})();
