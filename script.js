const APP_CONFIG = {
  // Deploy google-apps-script.gs as a Web App, then paste the /exec URL here.
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbxoa7rR5eTaGaBdCtv2uY08U_tue3S-BN4TzLEA35x8HV3GfM5SzehxHl7IPCwUGfuR8g/exec",
  analyticsId: "G-WEZ9VVS4D8"
};

const PRODUCTS = [
  {id:"3H x 2W",price:249,image:"image/products/3h-2w.png",capacity:6,height:57,width:45.5},
  {id:"3H x 3W",price:289,image:"image/products/3h-3w.png",capacity:9,height:57,width:67.5},
  {id:"3H x 4W",price:329,image:"image/products/3h-4w.png",capacity:12,height:57,width:89.5},
  {id:"4H x 2W",price:289,image:"image/products/4h-2w.png",capacity:8,height:75,width:45.5},
  {id:"4H x 3W",price:339,image:"image/products/4h-3w.png",capacity:12,height:75,width:67.5},
  {id:"4H x 4W",price:429,image:"image/products/4h-4w.png",capacity:16,height:75,width:89.5}
];

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("year").textContent=new Date().getFullYear();
  setupMenu(); renderProducts(); setupFilters(); setupReviewCarousel(); setupForms(); setupEstimate(); setupServiceDate(); setupAnalytics();
});

function setupMenu(){const b=document.querySelector('.menu-button'),n=document.querySelector('.site-nav');b?.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',String(o))});n?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')))}

function renderProducts(){
  const grid=document.getElementById('product-grid'),select=document.getElementById('rack-model');
  PRODUCTS.forEach(p=>{
    const card=document.createElement('article'); card.className='product-card';
    card.innerHTML=`<img src="${p.image}" alt="${p.id} HDX tote storage rack illustration"><div class="product-body"><div class="product-top"><h3>${p.id}</h3><span class="price">$${p.price}</span></div><p class="meta">${p.capacity} totes · ${p.height}" H × ${p.width}" W × 28.5" D</p><button class="button button-primary choose-product" data-product="${p.id}">Choose this size</button></div>`;
    grid.appendChild(card);
    const opt=document.createElement('option');opt.value=p.id;opt.textContent=`${p.id} — $${p.price}`;select.appendChild(opt);
  });
  const custom=document.createElement('option');custom.value='Custom width';custom.textContent='Custom width — quote required';select.appendChild(custom);
  document.querySelectorAll('.choose-product').forEach(btn=>btn.addEventListener('click',()=>{select.value=btn.dataset.product;updateEstimate();document.getElementById('order').scrollIntoView({behavior:'smooth'})}));
}

function setupFilters(){document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.project-card').forEach(c=>c.classList.toggle('hidden',f!=='all'&&c.dataset.category!==f))}))}

function setupEstimate(){['rack-model','rack-qty','casters','tote-qty','finish','delivery-miles','fulfillment'].forEach(id=>document.getElementById(id)?.addEventListener('input',updateEstimate));updateEstimate()}
function updateEstimate(){
  const model=document.getElementById('rack-model')?.value||PRODUCTS[0].id;
  const p=PRODUCTS.find(x=>x.id===model); const qty=Math.max(1,+document.getElementById('rack-qty')?.value||1);
  if(!p){document.getElementById('estimate-total').textContent='Custom quote';document.getElementById('estimate-deposit').textContent='TBD';return}
  const casters=(+document.getElementById('casters')?.value||0)*qty;
  const totes=Math.max(0,+document.getElementById('tote-qty')?.value||0)*9.99;
  const paint=document.getElementById('finish')?.value==='paint'?p.capacity*.99*qty:0;
  const delivery=document.getElementById('fulfillment')?.value==='Delivery'?Math.max(20,(+document.getElementById('delivery-miles')?.value||0)*.72):0;
  const total=p.price*qty+casters+totes+paint+delivery;
  document.getElementById('estimate-total').textContent=money(total);document.getElementById('estimate-deposit').textContent=money(total/2);
}
function money(n){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n)}

function setupServiceDate(){const input=document.getElementById('service-date');if(!input)return;const min=new Date('2026-08-10T00:00:00');const today=new Date();const d=today>min?today:min;input.min=d.toISOString().split('T')[0];input.addEventListener('change',()=>{const day=new Date(input.value+'T12:00:00').getDay();if(day===4){input.setCustomValidity('Thursday is closed. Please choose another day.')}else{input.setCustomValidity('')}})}

function setupReviewCarousel(){
  const carousel=document.getElementById('review-carousel');if(!carousel)return;
  const track=carousel.querySelector('.review-track'),slides=[...carousel.querySelectorAll('.review-slide')],dots=carousel.querySelector('.review-dots'),counter=carousel.querySelector('.review-counter');
  let index=0,timer,touchStart=0;
  slides.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className='review-dot';b.setAttribute('aria-label',`Show review ${i+1}`);b.addEventListener('click',()=>go(i,true));dots.appendChild(b)});
  const dotList=[...dots.children];
  function go(i,restart=false){index=(i+slides.length)%slides.length;track.style.transform=`translateX(-${index*100}%)`;slides.forEach((s,n)=>s.setAttribute('aria-hidden',String(n!==index)));dotList.forEach((d,n)=>d.classList.toggle('active',n===index));counter.textContent=`Review ${index+1} of ${slides.length}`;if(restart)start()}
  function start(){clearInterval(timer);timer=setInterval(()=>go(index+1),6000)}
  carousel.querySelector('.review-prev').addEventListener('click',()=>go(index-1,true));carousel.querySelector('.review-next').addEventListener('click',()=>go(index+1,true));
  carousel.addEventListener('mouseenter',()=>clearInterval(timer));carousel.addEventListener('mouseleave',start);carousel.addEventListener('focusin',()=>clearInterval(timer));carousel.addEventListener('focusout',start);
  carousel.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(index-1,true);if(e.key==='ArrowRight')go(index+1,true)});
  carousel.addEventListener('touchstart',e=>touchStart=e.changedTouches[0].clientX,{passive:true});carousel.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>45)go(index+(delta<0?1:-1),true)},{passive:true});
  go(0);start();
}

function setupForms(){document.querySelectorAll('form[data-form-type]').forEach(form=>form.addEventListener('submit',submitForm))}
async function submitForm(e){
  e.preventDefault();const form=e.currentTarget,status=form.querySelector('.form-status');
  if(form.website?.value)return;
  if(!form.reportValidity())return;
  const url=APP_CONFIG.appsScriptUrl;
  if(!url||url.includes('YOUR_GOOGLE')){status.textContent='The form is built, but the Google Apps Script endpoint still needs to be deployed and pasted into script.js. Your information was not sent.';status.style.color='#b42318';return}
  const data=new FormData(form);data.append('page',location.href);data.append('referrer',document.referrer||'Direct');data.append('submittedAt',new Date().toISOString());
  status.textContent='Submitting…';status.style.color='inherit';
  try{await fetch(url,{method:'POST',body:new URLSearchParams(data),mode:'no-cors'});status.textContent='Request submitted. We will review it and contact you to confirm details.';status.style.color='#147d35';track('form_submit',{form_type:form.dataset.formType});form.reset();updateEstimate()}catch(err){status.textContent='Submission failed. Please call or text 720-770-1905.';status.style.color='#b42318'}
}

function setupAnalytics(){if(!APP_CONFIG.analyticsId||APP_CONFIG.analyticsId.includes('YOUR_'))return;const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.analyticsId}`;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',APP_CONFIG.analyticsId);document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>track('phone_click')));document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>track('email_click')))}
function track(name,params={}){if(typeof gtag==='function')gtag('event',name,params)}
