(function(){
  function template(){
    return (
      '<div id="privacidade-modal" aria-hidden="true" role="dialog" aria-labelledby="privacidade-title" aria-modal="true" style="position:fixed;inset:0;display:none;z-index:6000">' +
      '  <style>@media(max-width:640px){#privacidade-modal>div[role="document"]{width:92% !important}} #privacidade-modal[aria-hidden="false"]{display:flex !important;align-items:center;justify-content:center}</style>'+
      '  <div data-overlay style="position:absolute;inset:0;background:rgba(0,0,0,.55)"></div>'+
      '  <div role="document" style="position:relative;max-width:80vw;width:100%;margin:0 auto;background:#fff;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:auto;max-height:58vh">' +
      '    <div style="padding:18px 22px;display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid #eee">' +
      '      <h4 id="privacidade-title" style="margin:0;font-size:1.15rem">Política de Privacidade da Pesquisa</h4>' +
      '      <button type="button" data-close class="btn btn-outline" style="padding:.35rem .7rem;border-radius:10px">Fechar</button>' +
      '    </div>' +
      '    <div style="padding:18px 22px;line-height:1.55">' +
      '      <p><strong>Esta pesquisa é realizada em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD).</strong></p>'+
      '      <p><strong>1. Finalidade</strong><br>As informações coletadas têm finalidade exclusivamente estatística e acadêmica, destinadas à análise dos resultados da pesquisa.</p>'+
      '      <p><strong>2. Anonimato</strong><br>Não coletamos dados pessoais identificáveis (como nome, e‑mail, telefone, endereço IP ou localização precisa). Todas as respostas são anônimas e não permitem a identificação dos participantes.</p>'+
      '      <p><strong>3. Uso e Compartilhamento</strong><br>Os dados coletados serão utilizados apenas pela equipe responsável pela pesquisa. Os resultados poderão ser divulgados em relatórios, artigos ou materiais de caráter científico e/ou institucional, sempre de forma agregada e não individualizada.</p>'+
      '      <p><strong>4. Armazenamento e Segurança</strong><br>As informações serão armazenadas em ambiente seguro e pelo período necessário à conclusão da pesquisa. Não haverá transferência ou comercialização de dados a terceiros.</p>'+
      '      <p><strong>5. Direitos do Participante</strong><br>Como não são coletados dados pessoais, não há possibilidade de identificar ou excluir respostas individuais após o envio. A participação é voluntária e pode ser interrompida a qualquer momento antes da finalização.</p>'+
      '      <p><strong>6. Contato</strong><br>Em caso de dúvidas, entre em contato pelo e‑mail: <a href="mailto:p.alteridade@gmail.com">p.alteridade@gmail.com</a></p>'+
      '      <p>Agradecemos a sua participação!</p>'+
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function ensure(){
    if (document.getElementById('privacidade-modal')) return;
    var w = document.createElement('div');
    w.innerHTML = template();
    document.body.appendChild(w.firstChild);
  }

  function open(ev){ if(ev) ev.preventDefault(); var m=document.getElementById('privacidade-modal'); if(!m) return; m.style.display='flex'; m.setAttribute('aria-hidden','false'); document.addEventListener('keydown', esc); }
  function close(){ var m=document.getElementById('privacidade-modal'); if(!m) return; m.style.display='none'; m.setAttribute('aria-hidden','true'); document.removeEventListener('keydown', esc); }
  function esc(e){ if(e.key==='Escape') close(); }

  function wire(){
    ensure();
    var m=document.getElementById('privacidade-modal');
    if(!m) return;
    var overlay=m.querySelector('[data-overlay]');
    var closeBtn=m.querySelector('[data-close]');
    if(overlay) overlay.addEventListener('click', close);
    if(closeBtn) closeBtn.addEventListener('click', close);

    // delegação: link do footer pode ser injetado depois
    document.addEventListener('click', function(ev){
      var t = ev.target;
      while(t && t !== document){
        if (t.matches && (t.matches('a[data-open="privacidade"]') || (t.matches('a') && /política de privacidade/i.test(t.textContent || '')))){
          open(ev); return;
        }
        t = t.parentNode;
      }
    });

    window.PrivacidadeModal = { open: open, close: close };
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', wire);
  } else { wire(); }
})();