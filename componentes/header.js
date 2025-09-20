(function(){
  function injectHeader(){
    var placeholder = document.getElementById('header-placeholder');
    if(!placeholder) return;
    // Busca o componente correto na pasta 'componentes'
    fetch('componentes/header.html', {cache:'no-cache'})
      .then(function(r){ return r.text(); })
      .then(function(html){
        // Se estivermos em uma página de formulário, removemos o botão "Responder formulário"
        var isFormPage = /coordenadores\.html$/.test(location.pathname) || /discentes\.html$/.test(location.pathname);
        if (isFormPage) {
          // remove o link com data-open="publico-modal" antes de injetar
          html = html.replace(/\n?\s*<a[^>]*data-open="publico-modal"[\s\S]*?<\/a>/i, '');
        }
        placeholder.innerHTML = html;
        // add class to body to offset content for fixed header
        try { document.body.classList.add('has-fixed-header'); } catch(_) {}
        try {
          // Torna a brand clicável para voltar ao site (index)
          var brand = placeholder.querySelector('.brand');
          if (brand) {
            brand.setAttribute('role', 'link');
            brand.setAttribute('tabindex', '0');
            brand.setAttribute('title', 'Voltar ao site');
            brand.style.cursor = 'pointer';
            var goHome = function(){ window.location.href = 'index.html'; };
            brand.addEventListener('click', goHome);
            brand.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); }});
          }
        } catch(_){}
      })
      .catch(function(){
        // Minimal fallback header
        placeholder.innerHTML = '<header><div class="container nav"><div class="brand"><h1>Alteridade</h1></div></div></header>';
        var brand = placeholder.querySelector('.brand');
        if (brand) {
          brand.style.cursor = 'pointer';
          brand.addEventListener('click', function(){ window.location.href = 'index.html'; });
          brand.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = 'index.html'; }});
          brand.setAttribute('role', 'link');
          brand.setAttribute('tabindex', '0');
          brand.setAttribute('title', 'Voltar ao site');
        }
      });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();
