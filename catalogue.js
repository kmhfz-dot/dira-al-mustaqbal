(() => {
  const data = Array.isArray(window.CATALOGUE_DATA) ? window.CATALOGUE_DATA : [];
  const grid = document.getElementById('catalogueGrid');

  const esc = value => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const buildCard = item => {
    const search = [item.title, item.ar_title, item.brand, item.category, item.description].filter(Boolean).join(' ').toLowerCase();
    return `<article class="catalogue-card reveal" data-category="${esc(item.category)}" data-search="${esc(search)}">
      <div class="catalogue-thumb"><img src="assets/catalogue/${esc(item.thumb)}" alt="${esc(item.title)} brochure cover" loading="lazy"><span>${esc(item.pages || '—')} <span data-en="pages" data-ar="صفحة">pages</span></span></div>
      <div class="catalogue-body"><p class="catalogue-brand">${esc(item.brand)}</p><h3 data-en="${esc(item.title)}" data-ar="${esc(item.ar_title || item.title)}">${esc(item.title)}</h3><p data-en="${esc(item.description || '')}" data-ar="${esc(item.ar_description || item.description || '')}">${esc(item.description || '')}</p><div class="catalogue-actions"><a href="#">Open full catalogue</a><a href="mailto:mahfz@hotmail.com?subject=${encodeURIComponent(`Product enquiry: ${item.title}`)}" data-en="Enquire" data-ar="استفسار">Enquire</a></div></div>
    </article>`;
  };

  if (grid) {
    const existingCount = grid.querySelectorAll('.catalogue-card').length;
    if (existingCount < data.length) {
      grid.insertAdjacentHTML('beforeend', data.slice(existingCount).map(buildCard).join(''));
    }
  }

  const cards = [...document.querySelectorAll('.catalogue-card')];
  cards.forEach((card,index)=>{
    const item=data[index];
    if(!item)return;
    const viewerUrl=`viewer.html?file=${encodeURIComponent(item.filename)}`;
    const primary=card.querySelector('.catalogue-actions a:first-child');
    if(primary){
      primary.href=viewerUrl;
      primary.dataset.en=item.available ? 'Open full catalogue' : 'PDF pending';
      primary.dataset.ar=item.available ? 'فتح الكتالوج الكامل' : 'ملف PDF قيد الإضافة';
      primary.textContent=item.available ? 'Open full catalogue' : 'PDF pending';
      primary.classList.toggle('is-pending', !item.available);
    }
    const thumb=card.querySelector('.catalogue-thumb');
    if(thumb){
      thumb.tabIndex=0;
      thumb.setAttribute('role','link');
      thumb.setAttribute('aria-label',`Open ${item.title}`);
      thumb.addEventListener('click',()=>window.location.href=viewerUrl);
      thumb.addEventListener('keydown',event=>{
        if(event.key==='Enter'||event.key===' '){event.preventDefault();window.location.href=viewerUrl;}
      });
    }
  });

  const input=document.getElementById('catalogueSearch');
  const filters=[...document.querySelectorAll('.filter')];
  const count=document.getElementById('catalogueCount');
  const empty=document.getElementById('catalogueEmpty');
  let selected='all';
  const params=new URLSearchParams(window.location.search);
  const initialSearch=params.get('search');
  const initialSector=params.get('sector');
  const sectorCategories={
    land:['Land Systems','Public Order Vehicles','Weapon Stations'],
    tactical:['Tactical Equipment','Protective Equipment','CBRN & Protective Equipment','Protective & Defence Equipment','Specialist Systems'],
    weapons:['Small Arms','Ammunition Systems','Pyrotechnics'],
    'law-enforcement':['Law Enforcement','Less-Lethal & Rescue','Surveillance & Evidence'],
    unmanned:['Unmanned Systems','Unmanned & Target Systems','ISR & Surveillance'],
    defence:['Air & Missile Defence','Rocket Systems','Defence Portfolio'],
    rescue:['Rescue & Emergency']
  };
  let selectedSectorCategories=initialSector&&sectorCategories[initialSector]?sectorCategories[initialSector]:null;
  if(input&&initialSearch)input.value=initialSearch;

  function update(){
    const q=(input?.value||'').trim().toLowerCase(); let shown=0;
    cards.forEach(card=>{
      const okSector=!selectedSectorCategories||selectedSectorCategories.includes(card.dataset.category);
      const okCat=selected==='all'||card.dataset.category===selected;
      const okSearch=!q||card.dataset.search.includes(q);
      const show=okSector&&okCat&&okSearch;
      card.hidden=!show;
      if(show)shown++;
    });
    const ar=document.body.classList.contains('ar');
    if(count) count.textContent=ar?`${shown} من ${cards.length} كتيب`:`${shown} of ${cards.length} brochures`;
    if(empty) empty.hidden=shown!==0;
  }

  input?.addEventListener('input',update);
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedSectorCategories=null;
    selected=btn.dataset.filter;
    update();
  }));
  document.getElementById('langButton')?.addEventListener('click',()=>setTimeout(()=>{
    if(input)input.placeholder=document.body.classList.contains('ar')?input.dataset.placeholderAr:input.dataset.placeholderEn;
    update();
  },0));
  // Catalogue enquiry buttons: prefilled WhatsApp plus email to the contact details shown on the website.
  cards.forEach((card,index)=>{
    const item=data[index]; if(!item)return;
    const actions=card.querySelector('.catalogue-actions'); if(!actions)return;
    let enquire=actions.querySelector('a:nth-child(2)');
    const msg=`Hello Dira Al Mustaqbal Trading, I would like information about the ${item.title} catalogue by ${item.brand}.`;
    if(enquire){enquire.href=`https://wa.me/97477889531?text=${encodeURIComponent(msg)}`;enquire.target='_blank';enquire.rel='noopener';enquire.dataset.en='WhatsApp enquiry';enquire.dataset.ar='استفسار واتساب';enquire.textContent='WhatsApp enquiry';}
    if(!actions.querySelector('.catalogue-email-enquiry')){
      const email=document.createElement('a');email.className='catalogue-email-enquiry';email.dataset.en='Email enquiry';email.dataset.ar='استفسار بالبريد';email.textContent='Email enquiry';email.href=`mailto:mahfz@hotmail.com?subject=${encodeURIComponent('Catalogue enquiry: '+item.title)}&body=${encodeURIComponent(msg)}`;actions.appendChild(email);
    }
  });
  update();
})();
