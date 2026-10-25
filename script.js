const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const goTo=el=>el.scrollIntoView({behavior:calm?'auto':'smooth'});

// меню
const mb=$('.menu-btn'),nav=$('#nav');
mb.onclick=()=>mb.setAttribute('aria-expanded',nav.classList.toggle('open'));
$$('#nav a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');mb.setAttribute('aria-expanded','false')});

// плавное появление блоков
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12}):null;
$$('.reveal').forEach(el=>io?io.observe(el):el.classList.add('in'));

// выбор услуги -> форма
const sel=$('#service');
function pick(name){sel.value=name;goTo($('#booking'));setTimeout(()=>$('#name').focus({preventScroll:true}),calm?0:600)}
$$('[data-service]').forEach(b=>b.onclick=()=>pick(b.dataset.service));

// квиз
const SV=[['Маникюр','от 2 500 ₽','Аккуратные руки и стойкое покрытие.'],['Педикюр','от 3 200 ₽','Бережный уход за стопами.'],['Уход за лицом','от 4 500 ₽','Свежая, отдохнувшая кожа.'],['Стрижка и укладка','от 3 000 ₽','Новая форма и образ для любого повода.'],['Брови и ресницы','от 2 800 ₽','Выразительный взгляд за один визит.'],['SPA-массаж','от 5 000 ₽','Полное расслабление и отдых.']];
const QZ=[
 {q:'Что хочется сегодня?',a:[['Красивые руки и ноги',{0:3,1:3}],['Свежую, отдохнувшую кожу',{2:3,4:1}],['Новый образ',{3:3,4:2}],['Просто расслабиться',{5:3,2:1}]]},
 {q:'Сколько времени у вас есть?',a:[['Около часа',{0:2,4:2,3:1}],['Пару часов',{1:2,2:2,3:2}],['Полдня, я не спешу',{5:3,2:1,1:1}]]},
 {q:'Что важнее всего?',a:[['Результат надолго',{0:2,4:2,3:1}],['Бережный уход',{2:2,5:2,1:1}],['Быстро к событию',{3:2,0:1,4:1}]]}];
let qi=0,sc=[0,0,0,0,0,0];
const box=$('#quiz-box');
function mk(tag,txt,cls){const e=document.createElement(tag);e.textContent=txt;if(cls)e.className=cls;return e}
function step(){
  box.textContent='';
  if(qi>=QZ.length)return result();
  const q=QZ[qi];
  box.append(mk('p','Вопрос '+(qi+1)+' из '+QZ.length,'qs'),mk('h3',q.q));
  q.a.forEach(([t,w])=>{const b=mk('button',t,'opt');b.type='button';b.onclick=()=>{for(const k in w)sc[k]+=w[k];qi++;step()};box.append(b)});
}
function result(){
  const i=sc.indexOf(Math.max(...sc)),s=SV[i],r=mk('div','', 'res');
  const go=mk('button','Записаться на эту услугу','btn'),again=mk('button','Пройти заново','btn o');
  go.type=again.type='button';go.onclick=()=>pick(s[0]);again.onclick=()=>{qi=0;sc=[0,0,0,0,0,0];step()};
  r.append(mk('p','Вам подойдёт','qs'),mk('h3',s[0]),mk('p',s[2],'muted'),mk('p',s[1]+' (демо-цена)','price'),go,again);
  box.append(r);
}
step();

// форма (демонстрационная)
const f=$('#form'),rules={
 name:v=>v.trim().length>=2||'Введите имя, минимум 2 буквы',
 phone:v=>v.replace(/\D/g,'').length>=10||'Введите номер телефона, минимум 10 цифр',
 service:v=>!!v||'Выберите услугу',
 consent:(v,el)=>el.checked||'Нужно ваше согласие'};
function check(k){const el=f.elements[k],r=rules[k](el.value,el),bad=r!==true;el.setAttribute('aria-invalid',bad);$('#e-'+k).textContent=bad?r:'';return bad?el:null}
f.addEventListener('input',e=>{if(rules[e.target.name]&&e.target.getAttribute('aria-invalid')==='true')check(e.target.name)});
f.onsubmit=e=>{
  e.preventDefault();
  const bad=Object.keys(rules).map(check).filter(Boolean),out=$('#form-msg');
  if(bad.length){out.textContent='';bad[0].focus();return}
  out.textContent='Это демонстрационная форма: заявка никуда не отправляется, данные не сохраняются. В рабочем проекте она придёт мастеру на почту или в мессенджер.';
  f.reset();
};
