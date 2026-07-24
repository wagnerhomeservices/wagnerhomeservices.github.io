const APP_CONFIG = {
  appsScriptUrl: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL",
  analyticsId: "G-WEZ9VVS4D8"
};

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  setupMenu(); setupFilters(); setupReviewCarousel(); setupForms(); setupServiceDate(); setupAnalytics();
});

function setupMenu(){
  const button=document.querySelector('.menu-button'),nav=document.querySelector('.site-nav');
  button?.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}
function setupFilters(){document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.project-card').forEach(card=>card.classList.toggle('hidden',f!=='all'&&card.dataset.category!==f));}));}
function setupServiceDate(){const input=document.getElementById('service-date');if(!input)return;const today=new Date();today.setHours(0,0,0,0);input.min=today.toISOString().split('T')[0];input.addEventListener('change',()=>{const day=new Date(input.value+'T12:00:00').getDay();input.setCustomValidity(day===4?'Thursday is closed. Please choose another day.':'');});}
function setupReviewCarousel(){
  const carousel=document.getElementById('review-carousel');if(!carousel)return;
  const track=carousel.querySelector('.review-track'),slides=[...carousel.querySelectorAll('.review-slide')],dots=carousel.querySelector('.review-dots'),counter=carousel.querySelector('.review-counter');let index=0,timer,touchStart=0;
  slides.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className='review-dot';b.setAttribute('aria-label',`Show review ${i+1}`);b.addEventListener('click',()=>go(i,true));dots.appendChild(b);});
  const dotList=[...dots.children];
  function go(i,restart=false){index=(i+slides.length)%slides.length;track.style.transform=`translateX(-${index*100}%)`;slides.forEach((s,n)=>s.setAttribute('aria-hidden',String(n!==index)));dotList.forEach((d,n)=>d.classList.toggle('active',n===index));counter.textContent=`Review ${index+1} of ${slides.length}`;if(restart)start();}
  function start(){clearInterval(timer);timer=setInterval(()=>go(index+1),6000);}
  carousel.querySelector('.review-prev').addEventListener('click',()=>go(index-1,true));carousel.querySelector('.review-next').addEventListener('click',()=>go(index+1,true));
  carousel.addEventListener('mouseenter',()=>clearInterval(timer));carousel.addEventListener('mouseleave',start);carousel.addEventListener('focusin',()=>clearInterval(timer));carousel.addEventListener('focusout',start);
  carousel.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(index-1,true);if(e.key==='ArrowRight')go(index+1,true);});
  carousel.addEventListener('touchstart',e=>touchStart=e.changedTouches[0].clientX,{passive:true});carousel.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>45)go(index+(delta<0?1:-1),true);},{passive:true});go(0);start();
}
function setupForms(){document.querySelectorAll('form[data-form-type]').forEach(form=>form.addEventListener('submit',submitForm));}
async function submitForm(e){
  e.preventDefault();const form=e.currentTarget,status=form.querySelector('.form-status');if(form.website?.value||!form.reportValidity())return;
  const url=APP_CONFIG.appsScriptUrl;
  if(!url||url.includes('YOUR_GOOGLE')){status.textContent='Online submission is not connected yet. Please call or text 720-770-1905.';status.style.color='#a12b1d';return;}
  const data=new FormData(form);data.append('page',location.href);data.append('referrer',document.referrer||'Direct');data.append('submittedAt',new Date().toISOString());status.textContent='Submitting…';status.style.color='inherit';
  try{await fetch(url,{method:'POST',body:new URLSearchParams(data),mode:'no-cors'});status.textContent='Request submitted. We will contact you after reviewing the details.';status.style.color='#147d35';track('form_submit',{form_type:form.dataset.formType});form.reset();}catch(err){status.textContent='Submission failed. Please call or text 720-770-1905.';status.style.color='#a12b1d';}
}
function setupAnalytics(){if(!APP_CONFIG.analyticsId||APP_CONFIG.analyticsId.includes('YOUR_'))return;const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.analyticsId}`;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',APP_CONFIG.analyticsId);document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>track('phone_click')));document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>track('email_click')));}
function track(name,params={}){if(typeof gtag==='function')gtag('event',name,params);}
