const body=document.body, langButton=document.getElementById('langButton');
let lang='en';
function applyLang(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';body.classList.toggle('ar',lang==='ar');document.querySelectorAll('[data-en]').forEach(el=>el.textContent=el.dataset[lang]);langButton.textContent=lang==='en'?'العربية':'English'}
langButton.addEventListener('click',()=>{lang=lang==='en'?'ar':'en';applyLang()});
document.querySelector('.menu').addEventListener('click',()=>document.querySelector('.nav nav').classList.toggle('open'));
window.addEventListener('scroll',()=>document.querySelector('.nav').classList.toggle('scrolled',scrollY>30));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();

// FEATURED PRODUCT SOLUTIONS SLIDESHOW
(() => {
 const root=document.querySelector('.phazzer-mini-showcase');
 if(!root)return;
 const slides=[...root.querySelectorAll('.mini-showcase-slide')];
 const dots=[...root.querySelectorAll('[data-mini-slide]')];
 const progress=root.querySelector('.mini-showcase-progress span');
 const delay=5000;
 let current=0,timer=null,isPaused=false;
 const resetProgress=()=>{
  if(!progress)return;
  progress.classList.remove('running');
  void progress.offsetWidth;
  if(!isPaused)progress.classList.add('running');
 };
 const show=i=>{
  current=(i+slides.length)%slides.length;
  slides.forEach((slide,index)=>{
   const active=index===current;
   slide.classList.toggle('active',active);
   slide.setAttribute('aria-hidden',active?'false':'true');
   slide.tabIndex=active?0:-1;
  });
  dots.forEach((dot,index)=>{
   const active=index===current;
   dot.classList.toggle('active',active);
   dot.setAttribute('aria-current',active?'true':'false');
  });
  resetProgress();
 };
 const stop=()=>{clearInterval(timer);timer=null;if(progress)progress.classList.remove('running')};
 const start=()=>{
  stop();
  isPaused=false;
  resetProgress();
  timer=setInterval(()=>show(current+1),delay);
 };
 const pause=()=>{isPaused=true;stop()};
 root.querySelector('.mini-showcase-prev').addEventListener('click',event=>{event.preventDefault();show(current-1);start()});
 root.querySelector('.mini-showcase-next').addEventListener('click',event=>{event.preventDefault();show(current+1);start()});
 dots.forEach(dot=>dot.addEventListener('click',()=>{show(Number(dot.dataset.miniSlide));start()}));
 root.addEventListener('mouseenter',pause);
 root.addEventListener('mouseleave',start);
 root.addEventListener('focusin',pause);
 root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget))start()});
 document.addEventListener('visibilitychange',()=>document.hidden?pause():start());
 let touchX=0;
 root.addEventListener('touchstart',event=>{touchX=event.changedTouches[0].clientX},{passive:true});
 root.addEventListener('touchend',event=>{const delta=event.changedTouches[0].clientX-touchX;if(Math.abs(delta)>45){show(current+(delta<0?1:-1));start()}},{passive:true});
 show(0);
 start();
})();
