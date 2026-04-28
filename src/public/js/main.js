document.querySelectorAll('[data-loading]').forEach((btn)=>{
  btn.addEventListener('click',()=>{ btn.disabled=true; btn.innerText='Processando...'; });
});
