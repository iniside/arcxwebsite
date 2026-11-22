(function(){
  var root=document.documentElement;
  root.classList.add('js');
  var stored=null;
  try{stored=localStorage.getItem('theme')}catch(e){}
  root.setAttribute('data-theme',stored||'dark');

  function ready(){
    document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){
      function label(){btn.setAttribute('aria-label',root.getAttribute('data-theme')==='dark'?'Switch to light theme':'Switch to dark theme')}
      label();
      btn.addEventListener('click',function(){
        var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
        root.setAttribute('data-theme',next);
        try{localStorage.setItem('theme',next)}catch(e){}
        label();
      });
    });

    document.querySelectorAll('[role="tablist"]').forEach(function(list){
      var tabs=[].slice.call(list.querySelectorAll('[role="tab"]'));
      function select(i,focus){
        tabs.forEach(function(t,j){
          var on=i===j;
          t.setAttribute('aria-selected',on?'true':'false');
          t.tabIndex=on?0:-1;
          t.classList.toggle('on',on);
          document.getElementById(t.getAttribute('aria-controls')).hidden=!on;
        });
        if(focus)tabs[i].focus();
      }
      tabs.forEach(function(t,i){
        t.addEventListener('click',function(){select(i)});
        t.addEventListener('keydown',function(e){
          if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select((i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length,true)}
        });
      });
      select(0);
    });

    document.querySelectorAll('.code').forEach(function(box){
      var hd=box.querySelector('.code-hd'),code=box.querySelector('pre code');
      if(!hd||!code||!navigator.clipboard)return;
      var b=document.createElement('button');
      b.type='button';b.className='btn btn-ghost btn-sm copy';b.textContent='Copy';
      b.setAttribute('aria-label','Copy '+(hd.querySelector('.fname')||{}).textContent);
      b.addEventListener('click',function(){
        navigator.clipboard.writeText(code.textContent).then(function(){
          b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1500);
        });
      });
      hd.appendChild(b);
    });

    var lb=document.querySelector('dialog.lb');
    var shots=[].slice.call(document.querySelectorAll('[data-lightbox]'));
    if(lb&&shots.length&&lb.showModal){
      var img=lb.querySelector('img'),cap=lb.querySelector('[data-lb-caption]'),cur=0;
      function show(i){
        cur=(i+shots.length)%shots.length;
        var a=shots[cur];
        img.src=a.getAttribute('href');
        img.alt=a.querySelector('img').alt;
        cap.textContent=a.getAttribute('data-lightbox')+' · '+(cur+1)+' / '+shots.length;
      }
      shots.forEach(function(a,i){
        a.addEventListener('click',function(e){e.preventDefault();show(i);lb.showModal()});
      });
      lb.querySelector('[data-lb-prev]').addEventListener('click',function(){show(cur-1)});
      lb.querySelector('[data-lb-next]').addEventListener('click',function(){show(cur+1)});
      lb.querySelector('[data-lb-close]').addEventListener('click',function(){lb.close()});
      lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
      lb.addEventListener('keydown',function(e){
        if(e.key==='ArrowRight')show(cur+1);
        if(e.key==='ArrowLeft')show(cur-1);
      });
      lb.addEventListener('close',function(){shots[cur].focus()});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
