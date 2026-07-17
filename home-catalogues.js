(() => {
  const data = Array.isArray(window.CATALOGUE_DATA) ? window.CATALOGUE_DATA : [];
  const root = document.getElementById('sectorCatalogueGroups');
  if (!root || !data.length) return;

  const sectors = [
    {
      key: 'land',
      number: '01',
      title: 'Land Systems',
      arTitle: 'الأنظمة البرية',
      description: 'Armored vehicles, protected mobility platforms, public-order vehicles and weapon stations.',
      arDescription: 'المركبات المدرعة ومنصات التنقل المحمي ومركبات حفظ النظام ومحطات التسليح.',
      categories: ['Land Systems', 'Public Order Vehicles', 'Weapon Stations']
    },
    {
      key: 'tactical',
      number: '02',
      title: 'Tactical & Protective Equipment',
      arTitle: 'المعدات التكتيكية ومعدات الحماية',
      description: 'Body armor, helmets, hearing protection, CBRN protection and specialist mission equipment.',
      arDescription: 'الدروع والخوذ وحماية السمع والحماية من مخاطر CBRN ومعدات المهام المتخصصة.',
      categories: ['Tactical Equipment', 'Protective Equipment', 'CBRN & Protective Equipment', 'Protective & Defence Equipment', 'Specialist Systems']
    },
    {
      key: 'weapons',
      number: '03',
      title: 'Guns & Ammunition',
      arTitle: 'الأسلحة والذخائر',
      description: 'Precision rifles, small arms, ammunition systems and related pyrotechnic products.',
      arDescription: 'البنادق الدقيقة والأسلحة الخفيفة وأنظمة الذخائر والمنتجات البيروتقنية ذات الصلة.',
      categories: ['Small Arms', 'Ammunition Systems', 'Pyrotechnics']
    },
    {
      key: 'law-enforcement',
      number: '04',
      title: 'Law Enforcement',
      arTitle: 'إنفاذ القانون',
      description: 'Less-lethal platforms, body-worn cameras, restraints and evidence-management solutions.',
      arDescription: 'المنصات الأقل فتكاً والكاميرات المحمولة ووسائل التقييد وحلول إدارة الأدلة.',
      categories: ['Law Enforcement', 'Less-Lethal & Rescue', 'Surveillance & Evidence']
    },
    {
      key: 'unmanned',
      number: '05',
      title: 'Unmanned & Surveillance Systems',
      arTitle: 'الأنظمة غير المأهولة والمراقبة',
      description: 'UAV platforms, aerial targets, airborne observation and ISR technologies.',
      arDescription: 'منصات الطائرات بدون طيار والأهداف الجوية وتقنيات المراقبة الجوية والاستطلاع.',
      categories: ['Unmanned Systems', 'Unmanned & Target Systems', 'ISR & Surveillance']
    },
    {
      key: 'defence',
      number: '06',
      title: 'Air & Defence Systems',
      arTitle: 'أنظمة الدفاع الجوي والدفاع',
      description: 'Integrated air defence, rocket systems and broad international defence portfolios.',
      arDescription: 'الدفاع الجوي المتكامل وأنظمة الصواريخ ومحافظ الدفاع الدولية المتنوعة.',
      categories: ['Air & Missile Defence', 'Rocket Systems', 'Defence Portfolio']
    },
    {
      key: 'rescue',
      number: '07',
      title: 'Rescue & Emergency',
      arTitle: 'الإنقاذ والطوارئ',
      description: 'Professional rescue, line-launching, evacuation and emergency-response equipment.',
      arDescription: 'معدات احترافية للإنقاذ وإطلاق الخطوط والإخلاء والاستجابة للطوارئ.',
      categories: ['Rescue & Emergency']
    }
  ];

  const esc = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const card = item => {
    const title = esc(item.title);
    const arTitle = esc(item.ar_title || item.title);
    const description = esc(item.description || '');
    const arDescription = esc(item.ar_description || item.description || '');
    const brand = esc(item.brand || '');
    const thumb = esc(item.thumb || '');
    const pages = esc(item.pages || '');
    const viewerUrl = `viewer.html?file=${encodeURIComponent(item.filename)}`;
    const mailUrl = `mailto:mahfz@hotmail.com?subject=${encodeURIComponent(`Product enquiry: ${item.title}`)}`;
    const primaryEn = item.available ? 'Open full catalogue' : 'PDF pending';
    const primaryAr = item.available ? 'فتح الكتالوج الكامل' : 'ملف PDF قيد الإضافة';

    return `
      <article class="home-catalogue-card reveal">
        <a class="home-catalogue-thumb" href="${viewerUrl}" aria-label="${title}">
          <img src="assets/catalogue/${thumb}" alt="${title} brochure cover" loading="lazy">
          <span>${pages} <span data-en="pages" data-ar="صفحة">pages</span></span>
        </a>
        <div class="home-catalogue-body">
          <p class="home-catalogue-brand">${brand}</p>
          <h3 data-en="${title}" data-ar="${arTitle}">${title}</h3>
          <p data-en="${description}" data-ar="${arDescription}">${description}</p>
          <div class="home-catalogue-actions">
            <a href="${viewerUrl}" data-en="${primaryEn}" data-ar="${primaryAr}">${primaryEn}</a>
            <a href="${mailUrl}" data-en="Enquire" data-ar="استفسار">Enquire</a>
          </div>
        </div>
      </article>`;
  };

  root.innerHTML = sectors.map(sector => {
    const items = data.filter(item => sector.categories.includes(item.category));
    return `
      <section class="sector-block" id="sector-${sector.key}">
        <div class="sector-intro reveal">
          <span class="sector-number">${sector.number}</span>
          <div>
            <p class="eyebrow" data-en="PRODUCT SECTOR" data-ar="قطاع المنتجات">PRODUCT SECTOR</p>
            <h2 data-en="${esc(sector.title)}" data-ar="${esc(sector.arTitle)}">${esc(sector.title)}</h2>
            <p data-en="${esc(sector.description)}" data-ar="${esc(sector.arDescription)}">${esc(sector.description)}</p>
            <a class="sector-view-all" href="catalogue.html?sector=${encodeURIComponent(sector.key)}" data-en="View all ${esc(sector.title)} →" data-ar="عرض جميع منتجات ${esc(sector.arTitle)} ←">View all ${esc(sector.title)} →</a>
          </div>
        </div>
        <div class="home-catalogue-grid">
          ${items.map(card).join('')}
        </div>
      </section>`;
  }).join('');

  // Register dynamically created cards with the page's reveal animation.
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    }), { threshold: 0.08 });
    root.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  } else {
    root.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
  }
})();
