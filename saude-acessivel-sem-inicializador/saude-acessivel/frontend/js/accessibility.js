/* Preferências de acessibilidade: tema e idioma (PT-BR, ES, EN). */
(() => {
  const html = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const languageSelect = document.getElementById('languageSelect');
  if (!themeButton || !languageSelect) return;

  const translations = {
    es: {
      'Início':'Inicio','Postos':'Centros de salud','Vacinação':'Vacunación','Profissionais':'Profesionales','Calendário':'Calendario',
      'Sair':'Salir','Informação que cuida. Saúde perto de você.':'Información que cuida. Salud cerca de ti.',
      'Índice de serviços':'Índice de servicios','Postos Próximos':'Centros cercanos','Vacinação':'Vacunación',
      'Campanhas ativas, calendário vacinal e seu histórico.':'Campañas activas, calendario de vacunas y tu historial.',
      'Profissionais Hoje':'Profesionales de hoy','Médicos e horários de atendimento por especialidade.':'Médicos y horarios de atención por especialidad.',
      'Calendário da Saúde':'Calendario de salud','Eventos, feriados e campanhas do ano.':'Eventos, festivos y campañas del año.',
      'Avisos Importantes':'Avisos importantes','Campanha Gripe 2026 em andamento':'Campaña contra la gripe 2026 en curso',
      'Campanha Dengue 2026 ativa':'Campaña contra el dengue 2026 activa','Todos':'Todos','Aberto Agora':'Abierto ahora',
      'Fechado':'Cerrado','Urgência 24h':'Urgencias 24 h','Detalhes':'Detalles','Rota':'Ruta','Ligar':'Llamar',
      'Campanhas':'Campañas','Calendário Vacinal':'Calendario de vacunación','Meu Histórico':'Mi historial',
      'Clínico Geral':'Medicina general','Pediatria':'Pediatría','Odontologia':'Odontología','Cardiologia':'Cardiología','Ginecologia':'Ginecología',
      'Modo claro':'Modo claro','Modo escuro':'Modo oscuro','Atendente Virtual':'Asistente virtual',
      'Tira dúvidas sobre saúde local':'Resuelve dudas sobre la salud local','Contatos de Emergência':'Contactos de emergencia',
      'Navegação':'Navegación','Buscar serviço ou especialidade...':'Buscar servicio o especialidad...',
      'Pergunte algo, ex: dentista hoje...':'Pregunta algo, ej.: dentista hoy...','Como Chegar':'Cómo llegar',
      'Horário & Fluxo':'Horario y afluencia','Serviços Disponíveis':'Servicios disponibles','Observação':'Observación',
      'Nenhum evento neste dia.':'No hay eventos en este día.','Disponível':'Disponible','Indisponível':'No disponible'
    },
    en: {
      'Início':'Home','Postos':'Health Centers','Vacinação':'Vaccination','Profissionais':'Professionals','Calendário':'Calendar',
      'Sair':'Log out','Informação que cuida. Saúde perto de você.':'Information that cares. Health close to you.',
      'Índice de serviços':'Service directory','Postos Próximos':'Nearby Health Centers',
      'Campanhas ativas, calendário vacinal e seu histórico.':'Active campaigns, vaccination schedule and your history.',
      'Profissionais Hoje':'Professionals Today','Médicos e horários de atendimento por especialidade.':'Doctors and appointment times by specialty.',
      'Calendário da Saúde':'Health Calendar','Eventos, feriados e campanhas do ano.':'Events, holidays and campaigns throughout the year.',
      'Avisos Importantes':'Important Notices','Campanha Gripe 2026 em andamento':'2026 Flu Campaign in progress',
      'Campanha Dengue 2026 ativa':'2026 Dengue Campaign active','Todos':'All','Aberto Agora':'Open Now',
      'Fechado':'Closed','Urgência 24h':'24-hour Emergency','Detalhes':'Details','Rota':'Directions','Ligar':'Call',
      'Campanhas':'Campaigns','Calendário Vacinal':'Vaccination Schedule','Meu Histórico':'My History',
      'Clínico Geral':'General Practitioner','Pediatria':'Pediatrics','Odontologia':'Dentistry','Cardiologia':'Cardiology','Ginecologia':'Gynecology',
      'Modo claro':'Light mode','Modo escuro':'Dark mode','Atendente Virtual':'Virtual Assistant',
      'Tira dúvidas sobre saúde local':'Answers questions about local healthcare','Contatos de Emergência':'Emergency Contacts',
      'Navegação':'Navigation','Buscar serviço ou especialidade...':'Search for a service or specialty...',
      'Pergunte algo, ex: dentista hoje...':'Ask something, e.g. dentist today...','Como Chegar':'Get Directions',
      'Horário & Fluxo':'Hours & Wait Times','Serviços Disponíveis':'Available Services','Observação':'Note',
      'Nenhum evento neste dia.':'No events on this day.','Disponível':'Available','Indisponível':'Unavailable'
    }
  };

  let currentLanguage = 'pt-BR';
  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  const ignored = new Set(['SCRIPT','STYLE','NOSCRIPT']);

  function translateText(value, language) {
    if (language === 'pt-BR') return value;
    const dict = translations[language];
    const trimmed = value.trim();
    if (dict[trimmed]) return value.replace(trimmed, dict[trimmed]);
    // Traduz rótulos compostos sem alterar nomes próprios ou endereços.
    let result = value;
    Object.entries(dict).sort((a,b) => b[0].length-a[0].length).forEach(([pt, translated]) => {
      result = result.replaceAll(pt, translated);
    });
    return result;
  }

  function translateTree(root, language) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim() || ignored.has(node.parentElement?.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      node.nodeValue = translateText(originalText.get(node), language);
    }
    root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(el => {
      ['placeholder','title','aria-label'].forEach(attr => {
        if (!el.hasAttribute(attr)) return;
        let saved = originalAttrs.get(el);
        if (!saved) { saved = {}; originalAttrs.set(el, saved); }
        if (!(attr in saved)) saved[attr] = el.getAttribute(attr);
        el.setAttribute(attr, translateText(saved[attr], language));
      });
    });
  }

  function updateTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem('saude-acessivel-theme', theme);
    const dark = theme === 'dark';
    themeButton.innerHTML = dark
      ? '<i class="fas fa-sun" aria-hidden="true"></i><span data-i18n="lightMode">Modo claro</span>'
      : '<i class="fas fa-moon" aria-hidden="true"></i><span data-i18n="darkMode">Modo escuro</span>';
    themeButton.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
    themeButton.title = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
    translateTree(themeButton, currentLanguage);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#11141b' : '#eaf0f7');
  }

  function updateLanguage(language) {
    currentLanguage = language;
    html.lang = language;
    translateTree(document.body, language);
    localStorage.setItem('saude-acessivel-language', language);
    // Reaplica o rótulo do botão no idioma selecionado.
    updateTheme(html.dataset.theme || 'dark');
  }

  const savedTheme = localStorage.getItem('saude-acessivel-theme') || 'dark';
  const savedLanguage = localStorage.getItem('saude-acessivel-language') || 'pt-BR';
  languageSelect.value = savedLanguage;
  updateTheme(savedTheme);
  updateLanguage(savedLanguage);

  themeButton.addEventListener('click', () => updateTheme(html.dataset.theme === 'dark' ? 'light' : 'dark'));
  languageSelect.addEventListener('change', () => updateLanguage(languageSelect.value));

  // Elementos criados pelo JavaScript (cards, calendário, modais e resultados) também recebem tradução.
  const observer = new MutationObserver(records => {
    if (currentLanguage === 'pt-BR') return;
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!originalText.has(node)) originalText.set(node, node.nodeValue);
        node.nodeValue = translateText(originalText.get(node), currentLanguage);
      } else if (node.nodeType === Node.ELEMENT_NODE) translateTree(node, currentLanguage);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
