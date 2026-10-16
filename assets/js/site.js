
(function(){
  var h=document.getElementById('hdr'), b=document.getElementById('burger'), n=document.getElementById('nav');
  function cool(){ if(window.scrollY>28){h.classList.add('is-solid');h.classList.remove('on-dark');} else {h.classList.remove('is-solid'); if(h.dataset.dark==='1')h.classList.add('on-dark');} var t=document.getElementById('totop'); if(t)t.classList.toggle('show',window.scrollY>620); }
  cool(); window.addEventListener('scroll',cool,{passive:true});
  if(b&&n){b.addEventListener('click',function(){n.classList.toggle('open');b.setAttribute('aria-expanded',n.classList.contains('open'));});}
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('.reveal');
  if(rm||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});}
  else{ var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.06});
    els.forEach(function(e,i){e.style.transitionDelay=((i%3)*70)+'ms';io.observe(e);}); }
  var tt=document.getElementById('totop');
  if(tt){tt.addEventListener('click',function(){window.scrollTo({top:0,behavior:rm?'auto':'smooth'});});}
  document.querySelectorAll('table').forEach(function(t){ if(!t.parentElement.classList.contains('tablewrap')){var w=document.createElement('div');w.className='tablewrap';t.parentNode.insertBefore(w,t);w.appendChild(t);} });
})();

(function(){
  var bar=document.getElementById('prog');
  function upd(){
    if(!bar) return;
    var h=document.documentElement;
    var max=(h.scrollHeight-h.clientHeight)||0;
    var y=window.pageYOffset||h.scrollTop||0;
    bar.style.width=(max>0?Math.min(100,(y/max)*100):0).toFixed(2)+'%';
  }
  upd(); window.addEventListener('scroll',upd,{passive:true}); window.addEventListener('resize',upd);

  var tocs=[].slice.call(document.querySelectorAll('details.toc'));
  if(tocs.length){
    var mq=window.matchMedia('(max-width:1080px)');
    var sync=function(){ tocs.forEach(function(d){ d.open = !mq.matches; }); };
    sync();
    if(mq.addEventListener) mq.addEventListener('change',sync);
  }
  var links=[].slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if(links.length && 'IntersectionObserver' in window){
    var heads=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var io=new IntersectionObserver(function(en){
      en.forEach(function(e){
        if(!e.isIntersecting) return;
        links.forEach(function(l){ l.classList.toggle('active', l.getAttribute('href')==='#'+e.target.id); });
      });
    },{rootMargin:'-100px 0px -72% 0px',threshold:0});
    heads.forEach(function(x){ io.observe(x); });
  }
})();
