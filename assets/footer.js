(function(){
  function injectFooter(){
    var placeholder = document.getElementById('footer-placeholder');
    if(!placeholder) return;
    fetch('assets/footer.html', {cache:'no-cache'})
      .then(function(r){ return r.text(); })
      .then(function(html){
        placeholder.innerHTML = html;
        var y = placeholder.querySelector('#y');
        if (y) { y.textContent = new Date().getFullYear(); }
      })
      .catch(function(err){
        // Fallback minimal footer if fetch fails
        placeholder.innerHTML = '<footer><div class="container"><p>© '+ new Date().getFullYear() +' Pesquisa Alteridade</p></div></footer>';
      });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();