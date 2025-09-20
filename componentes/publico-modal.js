(function(){
  // Componente isolado para o modal de seleção de público
  var URL_COORDENADORES = 'coordenadores.html';
  var URL_DISCENTES = 'discentes.html';

  function template(){
    return (
      '<div id="publico-modal" aria-hidden="true" role="dialog" aria-labelledby="publico-modal-title" aria-modal="true"' +
      '     style="position:fixed;inset:0;display:none;z-index:1000">' +
      '  <div data-modal-overlay style="position:absolute;inset:0;background:rgba(0,0,0,.5)"></div>' +
      '  <div style="position:relative;max-width:560px;margin:8vh auto;background:#fff;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:hidden">' +
      '    <div style="padding:22px 22px 8px;display:flex;justify-content:space-between;align-items:center">' +
      '      <h4 id="publico-modal-title" style="margin:0;font-size:1.2rem">Para quem é o formulário?</h4>' +
      '      <button type="button" data-modal-close aria-label="Fechar" class="btn btn-outline"' +
      '              style="padding:.4rem .7rem;border-radius:10px">✕</button>' +
      '    </div>' +
      '    <div style="padding:0 22px 22px">' +
      '      <p style="margin:6px 0 18px;opacity:.85">Selecione o seu perfil para seguir para a versão correta do questionário.</p>' +
      '      <div style="display:flex;gap:12px;flex-wrap:wrap">' +
      '        <button type="button" class="btn btn-primary" id="btn-coordenadores">Para coordenadores</button>' +
      '        <button type="button" class="btn btn-primary" id="btn-discentes">Para discentes</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function ensureModalInDOM(){
    if (document.getElementById('publico-modal')) return;
    var wrapper = document.createElement('div');
    wrapper.innerHTML = template();
    document.body.appendChild(wrapper.firstChild);
  }

  function openModal(e){
    if (e) e.preventDefault();
    var modal = document.getElementById('publico-modal');
    if (!modal) return;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(function(){ var b = document.getElementById('btn-coordenadores'); if(b) b.focus(); }, 0);
    document.addEventListener('keydown', escListener);
  }

  function closeModal(){
    var modal = document.getElementById('publico-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', escListener);
  }

  function escListener(ev){ if (ev.key === 'Escape') closeModal(); }

  function wireUp(){
    ensureModalInDOM();
    var modal = document.getElementById('publico-modal');
    if (!modal) return;

    // Event delegation to handle late-injected elements (e.g., header via fetch)
    document.addEventListener('click', function(ev){
      var target = ev.target;
      // climb up to handle clicks on inner elements of the anchor/button
      while (target && target !== document) {
        if (target.matches && (target.matches('[data-open="publico-modal"]') ||
          (target.matches('a') && (
            target.getAttribute('href') === '#participar' ||
            target.getAttribute('href') === '#form' ||
            /#participar$/.test(target.getAttribute('href') || '') ||
            /#participar/.test(target.getAttribute('href') || '')
          )) || target.id === 'participar')) {
          openModal(ev);
          return;
        }
        target = target.parentNode;
      }
    });

    // Fechar
    var overlay = modal.querySelector('[data-modal-overlay]');
    var closer = modal.querySelector('[data-modal-close]');
    if (overlay) overlay.addEventListener('click', closeModal);
    if (closer) closer.addEventListener('click', closeModal);

    // Ações dos botões
    var btnCoord = document.getElementById('btn-coordenadores');
    var btnDisc = document.getElementById('btn-discentes');
    if (btnCoord) btnCoord.addEventListener('click', function(){ window.location.href = URL_COORDENADORES; });
    if (btnDisc) btnDisc.addEventListener('click', function(){ window.location.href = URL_DISCENTES; });

    // API simples para abertura programática
    window.PublicoModal = {
      open: openModal,
      close: closeModal,
      setUrls: function(opts){
        if (!opts) return;
        if (opts.coordenadores) URL_COORDENADORES = opts.coordenadores;
        if (opts.discentes) URL_DISCENTES = opts.discentes;
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireUp);
  } else {
    wireUp();
  }
})();
