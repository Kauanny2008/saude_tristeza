/* =============================================
   SAÚDE ACESSÍVEL — app.js (Barra do Garças/MT)
   ============================================= */

// ── CAMPANHAS E NAVEGAÇÃO ──────────────────────
function calcularStatusCampanha(campanha) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  function paraData(valor) {
    if (!valor || valor === 'Permanente') return null;
    const partesISO = String(valor).match(/^\d{4}-\d{2}-\d{2}$/);
    if (partesISO) return new Date(valor + 'T00:00:00');
    const partesBR = String(valor).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (partesBR) return new Date(Number(partesBR[3]), Number(partesBR[2]) - 1, Number(partesBR[1]));
    return null;
  }

  const inicio = paraData(campanha.inicio);
  const fim = paraData(campanha.fim);
  if (fim && fim < hoje) return 'encerrada';
  if (inicio && inicio > hoje) return 'breve';
  return 'ativa';
}

function normalizarStatusCampanhas() {
  CAMPANHAS = CAMPANHAS.map(campanha => ({ ...campanha, status: calcularStatusCampanha(campanha) }));
}

function renderAvisos() {
  const container = document.getElementById('avisoList');
  if (!container) return;

  normalizarStatusCampanhas();
  const vigentes = CAMPANHAS.filter(campanha => campanha.status === 'ativa' || campanha.status === 'breve');
  const campanhasHtml = vigentes.map(campanha => `
    <div class="aviso success">
      <span class="a-mark"></span>
      <span>
        <strong>${campanha.nome}</strong>
        <span class="body-text">${campanha.inicio}–${campanha.fim}. ${campanha.desc}</span>
      </span>
    </div>`).join('');

  container.innerHTML = campanhasHtml + `
    <div class="aviso info">
      <span class="a-mark"></span>
      <span>
        <strong>CEM é atendimento por encaminhamento</strong>
        <span class="body-text">Só é possível ser atendido no CEM com encaminhamento das UBS de Barra do Garças.</span>
      </span>
    </div>`;
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');
  document.querySelectorAll('[data-page="' + pageId + '"]').forEach(l => l.classList.add('active'));
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
  document.getElementById('hamburger').setAttribute('aria-label', 'Abrir menu');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
  link.addEventListener('click', function (e) { e.preventDefault(); showPage(this.dataset.page); });
});
document.querySelectorAll('.index-item[data-target]').forEach(item => {
  item.addEventListener('click', function (e) { e.preventDefault(); showPage(this.dataset.target); });
});
document.getElementById('hamburger').addEventListener('click', function () {
  const mobileNav = document.getElementById('mobileNav');
  mobileNav.classList.toggle('open');
  this.setAttribute('aria-expanded', mobileNav.classList.contains('open') ? 'true' : 'false');
  this.setAttribute('aria-label', mobileNav.classList.contains('open') ? 'Fechar menu' : 'Abrir menu');
});

// ── TOAST ───────────────────────────────────────
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── POSTOS ──────────────────────────────────────
const statusLabel = { aberto: 'Aberto', fechado: 'Fechado', urgencia: 'Urgência' };

function buildPostoCard(p, index) {
  const aviso = p.aviso ? `<div class="posto-aviso"><i class="fas fa-exclamation-triangle"></i> ${p.obs}</div>` : '';
  return `
    <div class="posto-card" data-id="${p.id}" data-status="${p.status}">
      <div class="posto-header">
        <div>
          <div class="posto-id">UNIDADE Nº ${String(index + 1).padStart(2, '0')}</div>
          <h3 class="posto-nome">${p.nome}</h3>
          <div class="posto-bairro"><i class="fas fa-location-arrow"></i> ${p.bairro} · ${p.distancia}</div>
        </div>
        <div class="stamp sm stamp-${p.status}">${statusLabel[p.status]}</div>
      </div>
      <div class="posto-info"><i class="fas fa-map-marker-alt"></i> ${p.endereco}</div>
      <div class="posto-info"><i class="fas fa-clock"></i> ${p.horario}</div>
      <div class="posto-meta-row">
        <div class="meta">Espera<strong>${p.espera}</strong></div>
        <div class="meta">Lotação<strong>${p.lotacao}</strong></div>
        <div class="meta">Telefone<strong>${p.telefone}</strong></div>
      </div>
      <div class="posto-tags">
        ${p.servicos.slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('')}
        ${p.servicos.length > 3 ? `<span class="tag tag-more">+${p.servicos.length - 3}</span>` : ''}
      </div>
      ${aviso}
      <div class="posto-actions">
        <button class="btn-sm primary" onclick="openPostoModal(${p.id})"><i class="fas fa-info-circle"></i> Detalhes</button>
        <button class="btn-sm" onclick="goMaps(${p.id})"><i class="fas fa-directions"></i> Rota</button>
        <button class="btn-sm" onclick="callPosto('${p.telefone}')"><i class="fas fa-phone"></i> Ligar</button>
      </div>
    </div>`;
}
function renderPostos(filter = 'all') {
  const grid = document.getElementById('postosGrid');
  const filtered = filter === 'all' ? POSTOS : POSTOS.filter(p => p.status === filter);
  grid.innerHTML = filtered.map((p, i) => buildPostoCard(p, i)).join('');
}
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    this.classList.add('active');
    this.setAttribute('aria-pressed', 'true');
    renderPostos(this.dataset.filter);
  });
});
function goMaps(id) {
  const p = POSTOS.find(x => x.id === id);
  if (!p) return;
  window.open(`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`, '_blank');
}
function callPosto(tel) {
  window.open('tel:' + tel.replace(/\D/g, ''));
  showToast('Ligando para ' + tel);
}

// ── MODAL POSTO ─────────────────────────────────
let modalOpener = null;
let modalPreviousOverflow = '';

function abrirModal(opener = document.activeElement) {
  const overlay = document.getElementById('modalOverlay');
  if (overlay.classList.contains('open')) return;

  modalOpener = opener || document.activeElement;
  modalPreviousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  document.querySelectorAll('.masthead, .nav-main, .mobile-nav, .stats-strip, .main-content, .site-footer').forEach(element => {
    element.setAttribute('inert', '');
  });

  overlay.classList.add('open');
  document.getElementById('modalClose').focus();
}

function fecharModal() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay.classList.contains('open')) return;

  overlay.classList.remove('open');
  document.querySelectorAll('.masthead, .nav-main, .mobile-nav, .stats-strip, .main-content, .site-footer').forEach(element => {
    element.removeAttribute('inert');
  });
  document.body.style.overflow = modalPreviousOverflow;

  if (modalOpener && typeof modalOpener.focus === 'function') modalOpener.focus();
  modalOpener = null;
}

function openPostoModal(id) {
  const p = POSTOS.find(x => x.id === id);
  if (!p) return;
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  const avisoHtml = p.obs ? `
    <div class="modal-section">
      <h4>Observação</h4>
      <div class="modal-row" style="background:var(--ochre-tint);padding:10px 12px;color:#6b4a0e;">
        <i class="fas fa-exclamation-triangle" style="color:var(--ochre)"></i> ${p.obs}
      </div>
    </div>` : '';
  content.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:6px">
      <div class="stamp stamp-${p.status}">${statusLabel[p.status]}</div>
      <div>
        <div class="modal-title" id="modalTitle">${p.nome}</div>
        <div style="font-size:.78rem;color:var(--ink-soft)">${p.bairro} — ${p.distancia} de distância</div>
      </div>
    </div>
    <div class="modal-section">
      <h4>Localização &amp; Contato</h4>
      <div class="modal-row"><i class="fas fa-map-marker-alt"></i> ${p.endereco}</div>
      <div class="modal-row"><i class="fas fa-phone"></i> ${p.telefone}</div>
    </div>
    <div class="modal-section">
      <h4>Horário &amp; Fluxo</h4>
      <div class="modal-row"><i class="fas fa-clock"></i> ${p.horario}</div>
      <div class="modal-row"><i class="fas fa-hourglass-half"></i> Espera estimada: ${p.espera}</div>
      <div class="modal-row"><i class="fas fa-users"></i> Lotação: ${p.lotacao}</div>
    </div>
    <div class="modal-section">
      <h4>Serviços Disponíveis</h4>
      <div class="modal-tags">${p.servicos.map(s => `<span class="tag">${s}</span>`).join('')}</div>
    </div>
    ${avisoHtml}
    <button class="modal-btn" onclick="goMaps(${p.id})"><i class="fas fa-directions"></i> Como Chegar</button>
    <button class="modal-btn secondary" style="margin-top:8px" onclick="callPosto('${p.telefone}')"><i class="fas fa-phone"></i> Ligar</button>
  `;
  abrirModal();
}
document.getElementById('modalClose').addEventListener('click', fecharModal);
document.getElementById('modalOverlay').addEventListener('click', function (e) { if (e.target === this) fecharModal(); });
document.addEventListener('keydown', function (e) {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay.classList.contains('open')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    fecharModal();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = Array.from(overlay.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(element => !element.hasAttribute('disabled') && element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// ── VACINAÇÃO ───────────────────────────────────
function buildCampanhaCard(c) {
  const statusClass = { ativa: 'status-ativa', breve: 'status-breve', encerrada: 'status-encerrada' }[c.status] || '';
  const statusTxt = { ativa: 'Ativa', breve: 'Em breve', encerrada: 'Encerrada' }[c.status] || '';
  return `
    <div class="campanha-card">
      <div class="campanha-emoji">${c.icone}</div>
      <div class="campanha-body">
        <h3>${c.nome}</h3>
        <p>${c.desc}</p>
        <p class="campanha-loc"><i class="fas fa-map-marker-alt"></i> ${c.postos.join(', ')}</p>
        <div class="campanha-meta">
          <span class="status-pill ${statusClass}">${statusTxt}</span>
          <span class="vacina-date">${c.inicio} → ${c.fim}</span>
        </div>
      </div>
    </div>`;
}
function buildCalVacinalRow(v) {
  return `
    <div class="cal-vacinal-row">
      <span class="faixa-etaria">${v.faixa}</span>
      <div style="flex:1"><div class="vacina-nome">${v.vacina}</div><div class="vacina-doses">${v.doses}</div></div>
      ${v.obs ? `<div class="vacina-obs"><i class="fas fa-info-circle"></i> ${v.obs}</div>` : ''}
    </div>`;
}
function buildHistoricoCard(h) {
  return `
    <div class="hist-card">
      <div class="hist-check"><i class="fas fa-check"></i></div>
      <div class="hist-info">
        <h4>${h.vacina}</h4>
        <p>${h.data} · ${h.posto} · ${h.dose}</p>
      </div>
    </div>`;
}
document.querySelectorAll('.vtab').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.vtab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.vtab-content').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');
    document.getElementById('vtab-' + this.dataset.vtab).classList.add('active');
  });
});

// ── PROFISSIONAIS ────────────────────────────────
const espColor = { clinico: '#2c5d73', pediatra: '#1f5c3f', dentista: '#6a4c93', cardio: '#a1402c', gineco: '#b97f24' };
function buildProfCard(p) {
  const color = espColor[p.categoria] || '#2c5d73';
  const badge = p.disponivel
    ? `<span class="badge-disponivel">Disponível</span>`
    : `<span class="badge-indisponivel">Indisponível</span>`;
  return `
    <div class="prof-card">
      <div class="prof-avatar" style="border-color:${color};color:${color}">${p.init}</div>
      <div class="prof-name">${p.nome}</div>
      <div class="prof-esp" style="color:${color}">${p.esp}</div>
      <div class="prof-horario"><i class="fas fa-clock"></i> ${p.horario}</div>
      <div class="prof-posto"><i class="fas fa-map-marker-alt"></i> ${p.posto}</div>
      ${badge}
    </div>`;
}
function renderProfissionais(esp = 'todos') {
  const grid = document.getElementById('profGrid');
  const filtered = esp === 'todos' ? PROFISSIONAIS : PROFISSIONAIS.filter(p => p.categoria === esp);
  grid.innerHTML = filtered.map(buildProfCard).join('');
}
document.querySelectorAll('.esp-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.esp-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    this.classList.add('active');
    this.setAttribute('aria-pressed', 'true');
    renderProfissionais(this.dataset.esp);
  });
});

// ── CALENDÁRIO ──────────────────────────────────
const _today = new Date();
let calYear = _today.getFullYear(), calMonth = _today.getMonth();
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const tipoColor = { campanha: '#1f5c3f', feriado: '#b97f24', evento: '#2c5d73' };

function renderCalendario() {
  document.getElementById('calTitle').textContent = monthNames[calMonth] + ' ' + calYear;
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-day-name'; el.textContent = d;
    grid.appendChild(el);
  });
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevDays = new Date(calYear, calMonth, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.innerHTML = `<span class="day-num">${prevDays - i}</span>`;
    grid.appendChild(el);
  }
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d;
    el.className = 'cal-day' + (isToday ? ' today' : '');
    el.dataset.date = dateStr;
    const events = EVENTOS_CALENDARIO.filter(e => e.data === dateStr);
    const dots = events.map(e => `<div class="day-dot" style="background:${tipoColor[e.tipo] || '#888'}"></div>`).join('');
    el.innerHTML = `<span class="day-num">${d}</span><div class="day-dots">${dots}</div>`;
    el.addEventListener('click', () => openCalModal(dateStr, el));
    if (events.length) el.style.cursor = 'pointer';
    grid.appendChild(el);
  }
  showCalEvents(null);
}
function showCalEvents(dateFilter) {
  const container = document.getElementById('calEvents');
  const events = dateFilter
    ? EVENTOS_CALENDARIO.filter(e => e.data === dateFilter)
    : EVENTOS_CALENDARIO.filter(e => { const [y, m] = e.data.split('-').map(Number); return y === calYear && m === calMonth + 1; }).sort((a, b) => a.data.localeCompare(b.data));
  if (!events.length) {
    container.innerHTML = '<p style="color:var(--ink-soft);font-size:.85rem;padding:12px 0">Nenhum evento neste dia.</p>';
    return;
  }
  const label = dateFilter ? `Eventos em ${dateFilter.split('-').reverse().join('/')}` : `Eventos em ${monthNames[calMonth]}`;
  container.innerHTML = `<h3>${label}</h3>` + events.map(e => `
    <div class="event-row">
      <div class="event-dot-big" style="background:${tipoColor[e.tipo] || '#888'}"></div>
      <div><div class="event-title">${e.titulo}</div><div class="event-date">${e.data.split('-').reverse().join('/')}</div><div class="event-desc">${e.desc}</div></div>
    </div>`).join('');
}
document.getElementById('prevMonth').addEventListener('click', () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendario(); });
document.getElementById('nextMonth').addEventListener('click', () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendario(); });

function openCalModal(dateStr, opener) {
  const events = EVENTOS_CALENDARIO.filter(e => e.data === dateStr);
  const [year, month, day] = dateStr.split('-');
  const dateDisplay = `${day}/${month}/${year}`;
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  const tipoLabel = { campanha: 'Campanha', feriado: 'Feriado', evento: 'Evento' };
  const tipoIcon = { campanha: 'fas fa-syringe', feriado: 'fas fa-flag', evento: 'fas fa-star' };
  if (!events.length) {
    content.innerHTML = `
      <div style="text-align:center;padding:16px 0">
        <div class="modal-title" id="modalTitle" style="margin-bottom:8px">${dateDisplay}</div>
        <p style="color:var(--ink-soft);font-size:.9rem">Nenhum evento registrado para este dia.</p>
      </div>`;
  } else {
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const d = new Date(dateStr + 'T12:00:00');
    const dayName = dayNames[d.getDay()];
    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <div style="width:48px;height:48px;border:1.5px solid var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
          <span style="font-size:1.15rem;font-weight:800;line-height:1">${day}</span>
          <span style="font-size:.58rem;font-weight:700;text-transform:uppercase;font-family:'IBM Plex Mono',monospace">${d.toLocaleString('pt-BR', { month: 'short' })}</span>
        </div>
        <div>
          <div class="modal-title" id="modalTitle" style="font-size:1.05rem;margin-bottom:2px">${dayName}, ${dateDisplay}</div>
          <span style="font-size:.76rem;color:var(--green-deep);font-weight:700">${events.length} evento${events.length > 1 ? 's' : ''} neste dia</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${events.map(e => `
          <div style="border:1px solid var(--line);border-left:3px solid ${tipoColor[e.tipo]};padding:13px 15px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <i class="${tipoIcon[e.tipo]}" style="color:${tipoColor[e.tipo]};font-size:.8rem"></i>
              <div>
                <div style="font-weight:700;font-size:.88rem;line-height:1.2">${e.titulo}</div>
                <span style="font-size:.65rem;font-weight:700;color:${tipoColor[e.tipo]};text-transform:uppercase;letter-spacing:.04em;font-family:'IBM Plex Mono',monospace">${tipoLabel[e.tipo]}</span>
              </div>
            </div>
            <p style="font-size:.81rem;color:var(--ink-soft);line-height:1.55;margin:0">${e.desc}</p>
          </div>`).join('')}
      </div>`;
  }
  abrirModal(opener);
}

// ── BUSCA ──────────────────────────────────────
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
searchInput.addEventListener('input', function () {
  const q = this.value.trim().toLowerCase();
  if (!q) { searchResults.classList.remove('open'); return; }
  const matches = SEARCH_INDEX.filter(item => item.label.toLowerCase().includes(q));
  if (!matches.length) { searchResults.classList.remove('open'); return; }
  searchResults.innerHTML = matches.map(item => `
    <div class="search-result-item" data-page="${item.page}"><i class="${item.icon}"></i><span>${item.label}</span></div>`).join('');
  searchResults.classList.add('open');
  searchResults.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', function () {
      showPage(this.dataset.page);
      searchInput.value = '';
      searchResults.classList.remove('open');
    });
  });
});
document.addEventListener('click', function (e) {
  if (!e.target.closest('.search-bar-wrap')) searchResults.classList.remove('open');
});
document.querySelector('.btn-search').addEventListener('click', function () {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return;
  const match = SEARCH_INDEX.find(item => item.label.toLowerCase().includes(q));
  if (match) { showPage(match.page); searchInput.value = ''; searchResults.classList.remove('open'); }
  else showToast('Nenhum resultado encontrado para "' + searchInput.value + '"');
});

// ── STATS DA TIRA SUPERIOR ─────────────────────
function renderStats() {
  const abertos = POSTOS.filter(p => p.status !== 'fechado').length;
  const ativas = CAMPANHAS.filter(c => c.status === 'ativa').length;
  const disponiveis = PROFISSIONAIS.filter(p => p.disponivel).length;
  document.getElementById('statPostos').textContent = abertos;
  document.getElementById('statCampanhas').textContent = ativas;
  document.getElementById('statProfissionais').textContent = disponiveis;
}

// ── RELÓGIO / EDIÇÃO ────────────────────────────
function startRealtimeClock() {
  const edicaoEl = document.getElementById('edicaoData');
  const clockEl = document.getElementById('boardClock');
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  function tick() {
    const now = new Date();
    const dayName = days[now.getDay()];
    const date = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    if (edicaoEl) edicaoEl.textContent = `${dayName}, ${date}`;
    if (clockEl) clockEl.textContent = `Atualizado às ${time}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* =============================================
   ATENDENTE VIRTUAL (motor local, sem API)
   ============================================= */
const iaFab = document.getElementById('iaFab');
const iaPanel = document.getElementById('iaPanel');
const iaMessages = document.getElementById('iaMessages');
const iaInput = document.getElementById('iaInput');
const iaChips = document.getElementById('iaChips');

const IA_SUGESTOES = ["Postos abertos agora", "Tem dentista hoje?", "Campanha de dengue", "Onde é a UPA 24h?", "Calendário vacinal de idosos"];

function iaAddMsg(text, who = 'bot') {
  const div = document.createElement('div');
  div.className = 'ia-msg ' + who;
  div.innerHTML = text;
  iaMessages.appendChild(div);
  iaMessages.scrollTop = iaMessages.scrollHeight;
}
function iaRenderChips() {
  iaChips.innerHTML = IA_SUGESTOES.map(s => `<button type="button" class="ia-chip">${s}</button>`).join('');
  iaChips.querySelectorAll('.ia-chip').forEach(chip => {
    chip.addEventListener('click', () => { iaInput.value = chip.textContent; iaSubmit(); });
  });
}
function iaOpen() {
  iaPanel.classList.add('open');
  if (!iaMessages.childElementCount) {
    iaAddMsg('Olá! Sou o atendente virtual do posto de saúde. Posso ajudar com endereços, campanhas de vacinação, profissionais disponíveis ou datas do calendário. Como posso ajudar?');
    iaRenderChips();
  }
}
iaFab.addEventListener('click', iaOpen);
document.getElementById('iaClose').addEventListener('click', () => iaPanel.classList.remove('open'));

function iaFindEspecialidade(q) {
  const map = { dentista: 'dentista', odont: 'dentista', pediatr: 'pediatra', 'crianç': 'pediatra',
    cardio: 'cardio', 'coração': 'cardio', gineco: 'gineco', mulher: 'gineco', clinic: 'clinico', 'clínic': 'clinico' };
  for (const k in map) if (q.includes(k)) return map[k];
  return null;
}

function iaResponder(rawQ) {
  const q = rawQ.toLowerCase();

  if (/(urg[êe]ncia|upa|emerg[êe]ncia|acidente|24h|24 horas)/.test(q)) {
    const upa = POSTOS.find(p => p.status === 'urgencia');
    return `Para urgências, procure a <strong>${upa.nome}</strong>.<br>${upa.endereco}<br>${upa.telefone}<br>${upa.horario}<br><br>Em caso de emergência grave, ligue para o <strong>SAMU (192)</strong>.`;
  }

  const postoMatch = POSTOS.find(p => q.includes(p.nome.toLowerCase()));
  if (postoMatch) {
    return `<strong>${postoMatch.nome}</strong><br>${postoMatch.endereco}<br>${postoMatch.horario}<br>${postoMatch.telefone}<br>Espera estimada: ${postoMatch.espera}.<br>Serviços: ${postoMatch.servicos.join(', ')}.`;
  }

  if (/(posto|ubs).*(aberto|perto|próxim)|aberto agora/.test(q)) {
    const abertos = POSTOS.filter(p => p.status === 'aberto');
    const lista = abertos.map(p => `• <strong>${p.nome}</strong> — ${p.horario} (espera ${p.espera})`).join('<br>');
    return `Unidades abertas hoje:<br>${lista}`;
  }

  const campanhaKeywords = { dengue: 'dengue', gripe: 'gripe', influenza: 'gripe', hpv: 'hpv', hepatite: 'hepatite', bcg: 'bcg', infantil: 'infantil', 'crianç': 'infantil' };
  for (const k in campanhaKeywords) {
    if (q.includes(k)) {
      const c = CAMPANHAS.find(c => c.nome.toLowerCase().includes(campanhaKeywords[k]));
      if (c) return `<strong>${c.nome}</strong><br>${c.desc}<br><br>${c.inicio} → ${c.fim}<br>Locais: ${c.postos.join(', ')}`;
    }
  }
  if (/(campanha|vacina[çc][ãa]o)/.test(q)) {
    const ativas = CAMPANHAS.filter(c => c.status === 'ativa').map(c => `• ${c.icone} ${c.nome}`).join('<br>');
    return `Campanhas ativas no momento:<br>${ativas}<br><br>Posso detalhar qualquer uma — é só perguntar pelo nome (ex: "dengue").`;
  }

  if (/(idoso|60\+)/.test(q)) {
    const v = CALENDARIO_VACINAL.find(v => v.faixa.includes('Idosos'));
    return `<strong>Calendário vacinal — ${v.faixa}</strong><br>${v.vacina}<br>${v.doses}<br>${v.obs}`;
  }
  if (/(gestante|gr[aá]vida)/.test(q)) {
    const v = CALENDARIO_VACINAL.find(v => v.faixa.includes('Gestantes'));
    return `<strong>Calendário vacinal — ${v.faixa}</strong><br>${v.vacina}<br>${v.doses}<br>${v.obs}`;
  }

  const esp = iaFindEspecialidade(q);
  if (esp) {
    const profs = PROFISSIONAIS.filter(p => p.categoria === esp && p.disponivel);
    if (!profs.length) return `No momento não há profissionais dessa especialidade disponíveis. Confira a página <em>Profissionais</em> para os próximos horários.`;
    const lista = profs.map(p => `• <strong>${p.nome}</strong> — ${p.horario} (${p.posto})`).join('<br>');
    return `Profissionais disponíveis:<br>${lista}`;
  }

  if (/(hor[aá]rio|hoje)/.test(q)) {
    return `Hoje na UBS Centro:<br>Dentista: 8h–12h<br>Clínico Geral: 13h–17h<br>Pediatra: 14h–18h<br>Cardiologista: 9h–12h<br><br>Os horários variam por posto — veja a página <em>Profissionais</em>.`;
  }

  const match = SEARCH_INDEX.find(item => q.includes(item.label.toLowerCase()) || item.label.toLowerCase().includes(q));
  if (match) return `Encontrei isso na seção <strong>${match.label}</strong>. Vou te levar até lá.<!--nav:${match.page}-->`;

  return `Não encontrei uma resposta direta para isso ainda. Pergunte sobre: postos abertos, campanhas de vacinação (dengue, gripe, HPV...), especialidades médicas (dentista, pediatra, cardiologista...) ou datas do calendário de saúde.`;
}

function iaSubmit() {
  const val = iaInput.value.trim();
  if (!val) return;
  iaAddMsg(val, 'user');
  iaInput.value = '';
  setTimeout(() => {
    let resp = iaResponder(val);
    let navPage = null;
    const navMatch = resp.match(/<!--nav:(\w+)-->/);
    if (navMatch) { navPage = navMatch[1]; resp = resp.replace(navMatch[0], ''); }
    iaAddMsg(resp, 'bot');
    if (navPage) setTimeout(() => showPage(navPage), 700);
  }, 350);
}
document.getElementById('iaSend').addEventListener('click', iaSubmit);
iaInput.addEventListener('keydown', e => { if (e.key === 'Enter') iaSubmit(); });

// ── INIT ────────────────────────────────────────
function init() {
  normalizarStatusCampanhas();
  renderAvisos();
  renderStats();
  renderPostos('all');
  document.getElementById('campanhasGrid').innerHTML = CAMPANHAS.map(buildCampanhaCard).join('');
  document.getElementById('calVacinal').innerHTML = CALENDARIO_VACINAL.map(buildCalVacinalRow).join('');
  document.getElementById('historicoCards').innerHTML = HISTORICO.map(buildHistoricoCard).join('');
  renderProfissionais('todos');
  renderCalendario();
  startRealtimeClock();
}
init();


// ── SINCRONIZAÇÃO COM A API ─────────────────────
// A interface inicia com dados demonstrativos e os substitui pelos dados do SQLite
// quando a API está disponível. Sem conexão, o modo de demonstração continua funcional.
(async function carregarDadosDaAPI() {
  const meta = document.querySelector('meta[name="api-base-url"]');
  const base = (meta?.content || `${location.protocol === 'file:' ? 'http://localhost' : location.protocol + '//' + location.hostname}:3000`).replace(/\/$/, '');
  const buscar = async (rota) => {
    const resposta = await fetch(`${base}${rota}`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!resposta.ok) throw new Error(`API ${rota}: HTTP ${resposta.status}`);
    return resposta.json();
  };
  try {
    const [postos, campanhas, profissionais, eventos, calendario, historico] = await Promise.all([
      buscar('/api/postos'), buscar('/api/campanhas'), buscar('/api/profissionais'),
      buscar('/api/eventos'), buscar('/api/calendario-vacinal'), buscar('/api/historico')
    ]);
    if (!Array.isArray(postos) || !Array.isArray(campanhas) || !Array.isArray(profissionais)) throw new Error('Formato de dados inválido');

    POSTOS = postos.map(p => ({ ...p, aviso: Boolean(p.aviso), servicos: Array.isArray(p.servicos) ? p.servicos : [] }));
    CAMPANHAS = campanhas.map(c => ({
      ...c, desc: c.descricao || c.desc || '', icone: c.icone || '💉',
      inicio: c.inicio ? c.inicio.split('-').reverse().join('/') : 'Permanente',
      fim: c.fim ? c.fim.split('-').reverse().join('/') : 'Permanente',
      postos: Array.isArray(c.postos) ? c.postos : []
    }));
    PROFISSIONAIS = profissionais.map(p => ({ ...p, esp: p.esp || p.especialidade, init: p.init || p.iniciais || '', disponivel: Boolean(p.disponivel) }));
    EVENTOS_CALENDARIO = eventos.map(e => ({ ...e, desc: e.desc || e.descricao || '' }));
    CALENDARIO_VACINAL = calendario;
    HISTORICO = historico;

    normalizarStatusCampanhas();
    renderAvisos();
    renderStats();
    const filtroAtivo = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderPostos(filtroAtivo);
    document.getElementById('campanhasGrid').innerHTML = CAMPANHAS.map(buildCampanhaCard).join('');
    document.getElementById('calVacinal').innerHTML = CALENDARIO_VACINAL.map(buildCalVacinalRow).join('');
    document.getElementById('historicoCards').innerHTML = HISTORICO.map(buildHistoricoCard).join('');
    const espAtiva = document.querySelector('.esp-btn.active')?.dataset.esp || 'todos';
    renderProfissionais(espAtiva);
    renderCalendario();
    document.documentElement.dataset.apiStatus = 'online';
    document.dispatchEvent(new CustomEvent('saude:api-status', { detail: { online: true } }));
  } catch (erro) {
    console.warn('API indisponível; usando dados demonstrativos locais.', erro.message);
    document.documentElement.dataset.apiStatus = 'offline';
    document.dispatchEvent(new CustomEvent('saude:api-status', { detail: { online: false } }));
  }
})();
