(function(){
  // URL do PDF de consentimento (padrão). Altere para o caminho real do PDF quando adicioná-lo à pasta assets.
  var consentPdfUrl = 'assets/consentimento.pdf';
  // Texto fallback exibido se o PDF não puder ser carregado.
  var consentFallbackHtml = ''+
    '<p><strong>Registro de Consentimento para Estudos Online</strong></p>'+
    '<p>Não foi possível exibir o PDF de consentimento neste dispositivo/navegador. Você pode abrir o documento em uma nova aba pelo link abaixo e, em seguida, marcar que leu para continuar.</p>'+
    '<p><a id="consent-fallback-link" href="#" target="_blank" rel="noopener">Abrir PDF do consentimento</a></p>'+
    '<p>Se tiver dúvidas, escreva para: <a href="mailto:p.alteridade@gmail.com">p.alteridade@gmail.com</a>.</p>';

  function template(){
    return (
      '<div id="consentimento-modal" aria-hidden="true" role="dialog" aria-labelledby="consent-title" aria-modal="true" style="position:fixed;inset:0;display:none;z-index:6500">'+
      '  <style>@media(max-width:640px){#consentimento-modal>div[role="document"]{width:92% !important}} #consentimento-modal[aria-hidden="false"]{display:flex !important;align-items:center;justify-content:center} .pdf-wrap{height:60vh; max-height:70vh; border:1px solid #eee; border-radius:12px; overflow:hidden; background:#fafafa} .pdf-wrap iframe, .pdf-wrap embed{width:100%; height:100%; border:0} </style>'+
      '  <div data-overlay style="position:absolute;inset:0;background:rgba(0,0,0,.55)"></div>'+
      '  <div role="document" style="position:relative;max-width:900px;width:100%;margin:0 auto;background:#fff;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:auto;max-height:82vh">'+
      '    <div style="padding:18px 22px;display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid #eee">'+
      '      <h4 id="consent-title" style="margin:0;font-size:1.15rem">Registro de Consentimento para Estudos Online</h4>'+
      '      <button type="button" data-close class="btn btn-outline" style="padding:.35rem .7rem;border-radius:10px">Fechar</button>'+
      '    </div>'+
      '    <div style="padding:18px 22px;line-height:1.55">'+
      '      <div id="consent-viewer" class="pdf-wrap" role="region" aria-label="Visualização do PDF de consentimento"></div>'+
      '      <div id="consent-fallback" style="display:none; margin-top:12px">'+ consentFallbackHtml +'</div>'+
      '      <div style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">'+
      '        <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="consent-check"> <span>Li e estou de acordo</span></label>'+
      '        <button type="button" id="consent-accept" class="btn btn-primary" disabled>Aceitar e continuar</button>'+
      '      </div>'+
      '    </div>'+
      '  </div>'+
      '</div>'
    );
  }

  function ensure(){
    if(document.getElementById('consentimento-modal')) return;
    var w=document.createElement('div');
    w.innerHTML=template();
    document.body.appendChild(w.firstChild);
  }

  var nextUrl = null;
  function tryEmbedPdf(){
    var viewer = document.getElementById('consent-viewer');
    var fallback = document.getElementById('consent-fallback');
    if(!viewer) return;
    if (!consentPdfUrl){
      if (fallback){
        fallback.style.display = 'block';
        var a = document.getElementById('consent-fallback-link');
        if (a) a.href = '#';
      }
      return;
    }
    // Prefer iframe for broad support; if it errors, show fallback link
    var iframe = document.createElement('iframe');
    iframe.setAttribute('title','PDF de consentimento');
    iframe.src = consentPdfUrl;
    iframe.onload = function(){ /* loaded */ };
    iframe.onerror = function(){ showFallback(); };
    // Add a timeout to detect blocked loads
    var loaded = false;
    iframe.addEventListener('load', function(){ loaded = true; });
    setTimeout(function(){ if(!loaded){ showFallback(); } }, 2500);
    viewer.innerHTML = '';
    viewer.appendChild(iframe);

    function showFallback(){
      viewer.style.display = 'none';
      if (fallback){
        fallback.style.display = 'block';
        var a = document.getElementById('consent-fallback-link');
        if (a) a.href = consentPdfUrl;
      }
    }
  }

  function open(url){
    ensure();
    nextUrl = url || null;
    var m=document.getElementById('consentimento-modal'); if(!m) return; m.style.display='flex'; m.setAttribute('aria-hidden','false');
    tryEmbedPdf();
    document.addEventListener('keydown', esc);
  }
  function close(){ var m=document.getElementById('consentimento-modal'); if(!m) return; m.style.display='none'; m.setAttribute('aria-hidden','true'); document.removeEventListener('keydown', esc); }
  function esc(e){ if(e.key==='Escape') close(); }

  function wire(){
    ensure();
    var m=document.getElementById('consentimento-modal'); if(!m) return;
    var overlay=m.querySelector('[data-overlay]');
    var closeBtn=m.querySelector('[data-close]');
    var chk=m.querySelector('#consent-check');
    var accept=m.querySelector('#consent-accept');
    if(overlay) overlay.addEventListener('click', close);
    if(closeBtn) closeBtn.addEventListener('click', close);
    if(chk && accept){
      chk.addEventListener('change', function(){ accept.disabled = !chk.checked; });
      accept.addEventListener('click', function(){ if(!chk.checked) return; if(nextUrl){ window.location.href = nextUrl; } close(); });
    }
    window.ConsentimentoModal = {
      open: open,
      close: close,
      // Permite configurar a URL do PDF e re-renderizar o viewer
      setPdfUrl: function(url){ consentPdfUrl = url || ''; tryEmbedPdf(); },
      // Mantém compatibilidade com versão anterior baseada em HTML
      setContent: function(html){
        // Se alguém ainda usar setContent, mostra esse HTML no fallback
        var fb=document.getElementById('consent-fallback');
        if(fb){ fb.innerHTML = html; fb.style.display='block'; var v=document.getElementById('consent-viewer'); if(v) v.style.display='none'; }
      }
    };
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', wire);
  } else { wire(); }
})();