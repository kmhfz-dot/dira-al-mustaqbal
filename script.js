const body=document.body, langButton=document.getElementById('langButton');
let lang='en';
function applyLang(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';body.classList.toggle('ar',lang==='ar');document.querySelectorAll('[data-en]').forEach(el=>el.textContent=el.dataset[lang]);langButton.textContent=lang==='en'?'العربية':'English'}
langButton.addEventListener('click',()=>{lang=lang==='en'?'ar':'en';applyLang()});
document.querySelector('.menu').addEventListener('click',()=>document.querySelector('.nav nav').classList.toggle('open'));
window.addEventListener('scroll',()=>document.querySelector('.nav').classList.toggle('scrolled',scrollY>30));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();
