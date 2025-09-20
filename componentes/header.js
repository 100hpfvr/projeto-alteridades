(function(){
  function injectHeader(){
    var placeholder = document.getElementById('header-placeholder');
    if(!placeholder) return;
    // Busca o componente correto na pasta 'componentes'
    fetch('componentes/header.html', {cache:'no-cache'})
      .then(function(r){ return r.text(); })
      .then(function(html){
        placeholder.innerHTML = html;
      })
      .catch(function(){
        // Minimal fallback header
        placeholder.innerHTML = '<header><div class="container nav"><div class="brand"><h1>Alteridade</h1></div></div></header>';
      });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();
