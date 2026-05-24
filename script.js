function openLightbox(wrap) {
  document.getElementById('lightbox-img').src = wrap.querySelector('img').src;
  document.getElementById('lightbox-caption').textContent = wrap.getAttribute('data-caption');
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function loadPage(page) {
  const fichiers = ['juillet','aout','septembre','octobre','novembre','decembre'];
  const mois = ['Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const i = fichiers.indexOf(page);

  document.querySelectorAll('nav a').forEach((a,j) => {
    a.classList.toggle('active', j === i);
  });

  // Charger le header
  fetch('header.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('header').innerHTML = html;
      // Marquer l'onglet actif
      document.querySelectorAll('nav a').forEach(a => {
        if (a.href.includes(page)) a.classList.add('active');
      });
    });

  // Charger les données du mois
  fetch('data/' + page + '.json')
    .then(r => r.json())
    .then(data => {
      document.title = 'ACS Vouillé 79 — ' + mois[i];
      document.querySelector('.mois-titre span').textContent = mois[i];
      renderPage(data);
    });
}

function renderPage(data) {
  const container = document.getElementById('content');
  container.innerHTML = '';

  if (!data || data.length === 0) {
    container.innerHTML = '<div class="vide">📅 Les parcours de ce mois seront ajoutés prochainement.</div>';
    return;
  }

  const grouped = {};
  data.forEach(p => {
    if (!grouped[p.date]) grouped[p.date] = [];
    grouped[p.date].push(p);
  });

  for (const [date, parcours] of Object.entries(grouped)) {
    const single = parcours.length === 1 ? 'single' : '';
    let html = '<div class="section-date">' + date + '</div><div class="grid ' + single + '">';
    parcours.forEach(p => {
      html += '<div class="card">';
      html += '<div class="card-header"><span class="parcours-label">' + p.label + '</span><span class="km-badge">' + p.km + '</span></div>';
      html += '<div class="card-img-wrap" onclick="openLightbox(this)" data-caption="' + date + ' — ' + p.label + ' (' + p.km + ')">';
      html += '<img src="images/' + p.num + '.PNG" alt="' + p.label + ' - ' + date + '"></div>';
      html += '<div class="hint">Cliquez sur la carte pour agrandir</div>';
      html += '<div class="card-footer">';
      html += '<a class="btn-garmin" href="' + p.garmin + '" target="_blank">&#128506; Voir sur Garmin</a>';
      html += '<a class="btn-gpx" href="gpx/' + p.num + '.gpx" download>&#11015; Trace GPX</a>';
      html += '</div></div>';
    });
    html += '</div>';
    container.innerHTML += html;
  }
}
