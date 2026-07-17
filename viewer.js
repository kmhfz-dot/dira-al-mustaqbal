(() => {
  const data = Array.isArray(window.CATALOGUE_DATA) ? window.CATALOGUE_DATA : [];
  const params = new URLSearchParams(window.location.search);
  const requestedFile = params.get('file');
  const item = data.find(entry => entry.filename === requestedFile) || data[0];
  if (!item) return;

  const pdfPath = `assets/brochures/${item.filename}`;
  const isAvailable = item.available === true;
  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value || '';
  };

  document.title = `${item.title} | Dira Al Mustaqbal Trading`;
  setText('viewerTitle', item.title);
  setText('viewerBrand', item.brand);
  setText('viewerCategory', item.category);
  setText('viewerDescription', item.description);
  setText('viewerPages', item.pages || '—');
  setText('requiredFilename', item.filename);

  const title = document.getElementById('viewerTitle');
  const category = document.getElementById('viewerCategory');
  const description = document.getElementById('viewerDescription');
  if (title) { title.dataset.en = item.title; title.dataset.ar = item.ar_title || item.title; }
  if (category) { category.dataset.en = item.category; category.dataset.ar = item.ar_category || item.category; }
  if (description) { description.dataset.en = item.description || ''; description.dataset.ar = item.ar_description || item.description || ''; }

  const frame = document.getElementById('pdfFrame');
  const open = document.getElementById('openPdf');
  const download = document.getElementById('downloadPdf');
  const installNote = document.getElementById('pdfInstallNote');
  const fallback = document.querySelector('.pdf-fallback');

  if (isAvailable) {
    if (frame) frame.src = `${pdfPath}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`;
    if (open) { open.href = pdfPath; open.hidden = false; }
    if (download) { download.href = pdfPath; download.download = item.filename; download.hidden = false; }
    if (installNote) installNote.hidden = true;
  } else {
    if (frame) frame.hidden = true;
    if (open) open.hidden = true;
    if (download) download.hidden = true;
    if (installNote) installNote.hidden = false;
    if (fallback) fallback.innerHTML = `<strong data-en="Catalogue PDF not uploaded yet" data-ar="لم تتم إضافة ملف PDF بعد">Catalogue PDF not uploaded yet</strong><p data-en="This catalogue is organised in the correct section, but its full PDF still needs to be added to the website package." data-ar="تم تنظيم هذا الكتالوج في القسم الصحيح، لكن لا يزال يلزم إضافة ملف PDF الكامل إلى حزمة الموقع.">This catalogue is organised in the correct section, but its full PDF still needs to be added to the website package.</p>`;
  }

  const sectorMap = {
    'Land Systems': 'land', 'Public Order Vehicles': 'land', 'Weapon Stations': 'land',
    'Tactical Equipment': 'tactical', 'Protective Equipment': 'tactical', 'CBRN & Protective Equipment': 'tactical', 'Protective & Defence Equipment': 'tactical', 'Specialist Systems': 'tactical',
    'Small Arms': 'weapons', 'Ammunition Systems': 'weapons', 'Pyrotechnics': 'weapons',
    'Law Enforcement': 'law-enforcement', 'Less-Lethal & Rescue': 'law-enforcement', 'Surveillance & Evidence': 'law-enforcement',
    'Unmanned Systems': 'unmanned', 'Unmanned & Target Systems': 'unmanned', 'ISR & Surveillance': 'unmanned',
    'Air & Missile Defence': 'defence', 'Rocket Systems': 'defence', 'Defence Portfolio': 'defence',
    'Rescue & Emergency': 'rescue'
  };
  const currentSector = sectorMap[item.category];
  const back = document.getElementById('viewerBack');
  if (back && currentSector) back.href = `catalogue.html?sector=${encodeURIComponent(currentSector)}`;

  const currentSectorItems = data.filter(entry => sectorMap[entry.category] === currentSector && entry.filename !== item.filename);
  const related = document.getElementById('relatedList');
  if (related) {
    related.innerHTML = currentSectorItems.map(entry => `
      <a class="related-card" href="viewer.html?file=${encodeURIComponent(entry.filename)}">
        <img src="assets/catalogue/${entry.thumb}" alt="${escapeHtml(entry.title)} cover" loading="lazy">
        <span><small>${escapeHtml(entry.brand)} · ${entry.available ? 'PDF' : 'PENDING'}</small><strong data-en="${escapeHtml(entry.title)}" data-ar="${escapeHtml(entry.ar_title || entry.title)}">${escapeHtml(entry.title)}</strong></span>
      </a>`).join('');
  }

  function escapeHtml(value) {
    return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  }
})();
