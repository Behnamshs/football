(function(){
  const bench = document.querySelector('.sub');
  const subs = Array.from(bench.querySelectorAll('.subs'));
  const lockedPlayer = subs[subs.length-1];
  const field = document.createElement('div');
  field.id = 'field-dropzone';
  document.body.appendChild(field);

  subs.forEach((p,i)=> p.dataset.benchIndex = i);

  let playersOnField = 0;
  let dragged = null, offsetX=0, offsetY=0;

  function startDrag(el, clientX, clientY){
    if(el===lockedPlayer) return;
    dragged = el;
    el.classList.add('dragging');
    const rect = el.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  }
  function moveDrag(clientX, clientY){
    if(!dragged) return;
    dragged.style.position='absolute';
    dragged.style.left=(clientX-offsetX)+'px';
    dragged.style.top=(clientY-offsetY)+'px';
    dragged.style.zIndex=10000;
    document.body.appendChild(dragged);
  }
  function endDrag(clientX, clientY){
    if(!dragged) return;
    const fieldRect = field.getBoundingClientRect();
    const inField = clientX>fieldRect.left && clientX<fieldRect.right && clientY>fieldRect.top && clientY<fieldRect.bottom;
    if(inField){
      if(playersOnField>=11 && !dragged.dataset.onField){
        alert("بیشتر از ۱۱ بازیکن نمیشه!");
        returnToBench(dragged);
      } else {
        dragged.dataset.onField = "true";
        playersOnField = document.querySelectorAll('[data-on-field="true"]').length;
      }
    } else {
      returnToBench(dragged);
    }
    dragged.classList.remove('dragging');
    dragged=null;
  }
  function returnToBench(player){
    delete player.dataset.onField;
    playersOnField = document.querySelectorAll('[data-on-field="true"]').length;
    player.style.position='';
    player.style.left='';
    player.style.top='';
    player.style.zIndex='';
    const index = parseInt(player.dataset.benchIndex,10);
    const allBench = bench.querySelectorAll('.subs');
    if(index>=allBench.length){
      bench.appendChild(player);
    } else {
      bench.insertBefore(player, allBench[index]);
    }
  }

  // ماوس
  subs.forEach(p=>{
    if(p===lockedPlayer) return;
    p.addEventListener('mousedown',e=>{startDrag(p,e.clientX,e.clientY);});
  });
  document.addEventListener('mousemove',e=>{if(dragged) moveDrag(e.clientX,e.clientY);});
  document.addEventListener('mouseup',e=>{if(dragged) endDrag(e.clientX,e.clientY);});

  // تاچ با جلوگیری از اسکرول
  subs.forEach(p=>{
    if(p===lockedPlayer) return;
    p.addEventListener('touchstart',e=>{
      const t=e.touches[0];
      startDrag(p,t.clientX,t.clientY);
    });
  });
  document.addEventListener('touchmove', e=>{
    if(!dragged) return;
    e.preventDefault(); // ⚠ جلوگیری از اسکرول صفحه
    const t = e.touches[0];
    moveDrag(t.clientX,t.clientY);
  }, { passive: false });
  document.addEventListener('touchend',e=>{
    if(!dragged) return;
    const t=e.changedTouches[0];
    endDrag(t.clientX,t.clientY);
  });
})();

(function(){
  const sliders = Array.from(document.querySelectorAll('.slider'));

  sliders.forEach(slider=>{
    const imgs = Array.from(slider.querySelectorAll('img'));
    const dotsContainer = slider.querySelector('.dots');
    let current = 0;

    // ایجاد دایره‌ها
    imgs.forEach((_, i)=>{
      const dot = document.createElement('span');
      if(i===0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    // نمایش اولیه تصاویر
    imgs.forEach((img,i)=> img.style.transform = i===0 ? 'translateX(0%)' : 'translateX(100%)');

    let startX = 0, isDragging = false;

    function showSlide(index){
      imgs.forEach((img,i)=>{
        img.style.transform = `translateX(${100*(i - index)}%)`;
      });
      dots.forEach((d,i)=> d.classList.toggle('active', i===index));
    }

    // ماوس
    slider.addEventListener('mousedown', e=>{
      isDragging = true;
      startX = e.clientX;
    });
    slider.addEventListener('mouseup', e=>{
      if(!isDragging) return;
      const diff = e.clientX - startX;
      if(diff < -30) current = (current+1) % imgs.length;   // بعدی (چرخشی)
      else if(diff > 30) current = (current-1 + imgs.length) % imgs.length; // قبلی (چرخشی)
      showSlide(current);
      isDragging = false;
    });

    // تاچ
    slider.addEventListener('touchstart', e=>{
      isDragging = true;
      startX = e.touches[0].clientX;
    }, {passive:true});
    slider.addEventListener('touchmove', e=>{
      if(isDragging) e.preventDefault(); // جلوگیری از اسکرول صفحه
    }, {passive:false});
    slider.addEventListener('touchend', e=>{
      if(!isDragging) return;
      const diff = e.changedTouches[0].clientX - startX;
      if(diff < -30) current = (current+1) % imgs.length;
      else if(diff > 30) current = (current-1 + imgs.length) % imgs.length;
      showSlide(current);
      isDragging = false;
    });
  });
})();

const texts = [
  ["No Press","Passive Shape","Trigger Press","Mid Block","Delayed Press","Mixed Press","Trap Zones","Immediate Chase","High Press","All Out Press"],
  ["Ultra Defensive","Deep Block","Defensive Shape","Balanced Defensive","Balanced","Controlled Attack","Forward Leaning","High Line","Aggrensive Attack","All Out Attack"],
  ["Ultra Slow","Slow Circulation","Possession Build UP","Controlled Rhythm","Balanced Tempo","Quick Tuches","Fast Circultion","One Touch Play","High Tempo","Frenetic Passing"],
  ["Passive","Stay on Feet","Soft Contact","Tactical Fouls","Controlled Pressure","Interceptions","Shoulder Challenges","Hard Tackle","High Risk","Reckless"]
];

document.querySelectorAll('.control').forEach((ctrl, idx)=>{
  const input = ctrl.querySelector('input');
  const valueSpan = ctrl.querySelector('.value');

  function updateText(val){
    valueSpan.textContent = texts[idx][val-1];
  }

  updateText(input.value); // مقدار اولیه
  input.addEventListener('input', e=>{
    updateText(e.target.value);
  });
});

function calculateUserTeamPower(){
  let power = 0;

  // جمع امتیاز تاکتیک‌ها
  document.querySelectorAll('.control input').forEach(input=>{
    power += parseInt(input.value);
  });

  // جمع قدرت بازیکن‌های روی زمین
  document.querySelectorAll('.field-player').forEach(p=>{
    power += parseInt(p.dataset.power || 5);
  });

  return power;
}
document.getElementById('quick-match-btn').addEventListener('click', ()=>{
  const userPower = calculateUserTeamPower();
  const cityPower = 80; // قدرت تیم منچستر سیتی ثابت

  let userGoals = 0;
  let cityGoals = 0;

  for(let i=0;i<90;i++){ // شبیه‌سازی هر دقیقه
    if(Math.random()*userPower/(userPower+cityPower) > 0.95){
      userGoals++;
    }
    if(Math.random()*cityPower/(userPower+cityPower) > 0.95){
      cityGoals++;
    }
  }

  alert(`Quick Match Result: Liverpool ${userGoals} - ${cityGoals} Manchester City`);
});