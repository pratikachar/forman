/* ═══════════════════════════════════════════════
   FOREMAN AI — Landing Page Script
   ═══════════════════════════════════════════════ */

/* ─── COLOR MAP ─── */
const C={
  'brand-purple':'#4F3A96','brand-blue':'#4085EC','background':'#0a0a0a',
  'surface-dim':'#121212','surface-variant':'#1e1e1e','surface-bright':'#2a2a2a',
  'surface-container-high':'#1a1a1a','on-surface-variant':'#cac4d3',
  'outline-variant':'#2a2a2a','slate-900':'#0f172a','slate-800':'#1e293b',
  'slate-500':'#64748b','slate-600':'#475569','slate-700':'#334155',
  'slate-400':'#94a3b8','slate-300':'#cbd5e1','slate-950':'#020617',
  'white':'#fff','black':'#000','zinc-950':'#09090b',
  'emerald-500':'#10b981','emerald-600':'#059669','emerald-400':'#34d399',
  'red-500':'#ef4444','red-400':'#f87171','red-300':'#fca5a5','red-950':'#450a0a',
  'green-500':'#22c55e','green-400':'#4ade80','yellow-500':'#eab308',
  'blue-500':'#3b82f6','purple-500':'#a855f7','gray-800':'#1f2937',
  'gray-500':'#6b7280','gray-600':'#4b5563','gray-700':'#374151'
};
const D={'rounded-sm':'2px','rounded':'4px','rounded-md':'6px','rounded-lg':'8px','rounded-xl':'12px','rounded-2xl':'16px','rounded-full':'9999px'};
const S={'0':'0','0.5':'.125rem','1':'.25rem','1.5':'.375rem','2':'.5rem','2.5':'.625rem','3':'.75rem','3.5':'.875rem','4':'1rem','5':'1.25rem','6':'1.5rem','7':'1.75rem','8':'2rem','9':'2.25rem','10':'2.5rem','12':'3rem','14':'3.5rem','16':'4rem','20':'5rem','24':'6rem','32':'8rem','40':'10rem','48':'12rem','56':'14rem','64':'16rem','72':'18rem','80':'20rem','96':'24rem'};
const T={'xs':'.75rem','sm':'.875rem','base':'1rem','lg':'1.125rem','xl':'1.25rem','2xl':'1.5rem','3xl':'1.875rem','4xl':'2.25rem','5xl':'3rem'};
const W={'w':'width','h':'height','min-w':'min-width','max-w':'max-width','min-h':'min-height','max-h':'max-height'};
const BP={'sm':'640px','md':'768px','lg':'1024px'};

function rc(name,opacity){
  const c=C[name]||'#000';
  if(opacity===void 0||opacity===null)return c;
  const o=Math.min(parseInt(opacity)/100,1);
  if(c.startsWith('#')){
    const r=parseInt(c.slice(1,3),16),g=parseInt(c.slice(3,5),16),b=parseInt(c.slice(5,7),16);
    return `rgba(${r},${g},${b},${o})`;
  }
  return c;
}

let _hoverRules=[],_sid=0;
function parseClass(cls){
  const s={};if(!cls)return s;
  let m;

  /* bg-xxx/opacity or bg-xxx */
  m=cls.match(/^bg-([a-z][a-z0-9-]*)\/(\d+)$/);if(m){s.background=rc(m[1],m[2]);return s}
  m=cls.match(/^bg-([a-z][a-z0-9-]*)$/);if(m&&C[m[1]]){s.background=C[m[1]];return s}

  /* text-xxx/opacity or text-xxx */
  m=cls.match(/^text-([a-z][a-z0-9-]*)\/(\d+)$/);if(m){s.color=rc(m[1],m[2]);return s}
  m=cls.match(/^text-([a-z][a-z0-9-]*)$/);if(m&&C[m[1]]){s.color=C[m[1]];return s}

  /* border-xxx/opacity or border-xxx */
  m=cls.match(/^border-([a-z][a-z0-9-]*)\/(\d+)$/);if(m){s['border-color']=rc(m[1],m[2]);return s}
  m=cls.match(/^border-([a-z][a-z0-9-]*)$/);if(m&&C[m[1]]){s['border-color']=C[m[1]];return s}

  /* from/via/to-xxx/opacity */
  m=cls.match(/^(from|via|to)-([a-z][a-z0-9-]*)\/(\d+)$/);if(m){s[`--tg-${m[1]}`]=rc(m[2],m[3]);return s}
  m=cls.match(/^(from|via|to)-([a-z][a-z0-9-]*)$/);if(m){s[`--tg-${m[1]}`]=rc(m[2]);return s}

  /* gradient direction */
  m=cls.match(/^bg-gradient-to-([trbl]+)$/);
  if(m){const dirs={'r':'90deg','l':'270deg','t':'to bottom','b':'to top','tr':'to top right','tl':'to top left','br':'to bottom right','bl':'to bottom left'};
    s.backgroundImage=`linear-gradient(${dirs[m[1]]||'90deg'},var(--tg-from,#4F3A96),var(--tg-via,transparent),var(--tg-to,#4085EC))`;return s}

  /* fonts */
  if(cls==='font-label-mono'||cls==='font-mono'){s.fontFamily='var(--font-mn)';return s}
  if(cls==='font-body-md'||cls==='font-sans'){s.fontFamily='var(--font-bd)';return s}
  if(cls==='font-headline-lg'||cls==='font-display-lg'||cls==='font-hl'){s.fontFamily='var(--font-hl)';return s}

  /* font sizes */
  m=cls.match(/^text-\[([\d.]+)px\]$/);if(m){s.fontSize=m[1]+'px';return s}
  m=cls.match(/^text-\[([\d.]+)rem\]$/);if(m){s.fontSize=m[1]+'rem';return s}
  if(T[cls]){s.fontSize=T[cls];return s}

  /* spacing */
  m=cls.match(/^([pm][xytlrb]?)-\[([\d.]+)px\]$/);if(m){const v=m[2]+'px',map={p:'padding',m:'margin',x:'Inline',y:'Block',t:'Top',r:'Right',b:'Bottom',l:'Left'};
    if(m[1].length===1)s[map[m[1]]]=v;else s[`${map[m[1][0]]}${map[m[1][1]]}`]=v;return s}
  m=cls.match(/^([pm][xytlrb]?)-(\d+\.?\d*)$/);if(m){const v=S[m[2]]||(m[2]*.25)+'rem',map={p:'padding',m:'margin',x:'Inline',y:'Block',t:'Top',r:'Right',b:'Bottom',l:'Left'};
    if(m[1].length===1)s[map[m[1]]]=v;else s[`${map[m[1][0]]}${map[m[1][1]]}`]=v;return s}

  /* gap / space-y */
  m=cls.match(/^gap-(\d+\.?\d*)$/);if(m){s.gap=S[m[1]]||(m[1]*.25)+'rem';return s}
  m=cls.match(/^space-y-(\d+\.?\d*)$/);if(m){s['--spc']=S[m[1]]||(m[1]*.25)+'rem';return s}

  /* grid */
  m=cls.match(/^grid-cols-(\d+)$/);if(m){s.gridTemplateColumns=`repeat(${m[1]},minmax(0,1fr))`;return s}
  m=cls.match(/^col-span-(\d+)$/);if(m){s.gridColumn=`span ${m[1]}`;return s}
  m=cls.match(/^row-span-(\d+)$/);if(m){s.gridRow=`span ${m[1]}`;return s}

  /* sizing */
  for(const[pfx,props]of Object.entries(W)){
    m=cls.match(new RegExp(`^${pfx}-(\\d+\\.?\\d*)$`));if(m){const v=S[m[1]]||(m[1]*.25)+'rem';for(const p of props)s[p]=v;return s}}
  if(cls==='w-full'){s.width='100%';return s}if(cls==='w-auto'){s.width='auto';return s}
  if(cls==='h-full'){s.height='100%';return s}if(cls==='h-auto'){s.height='auto';return s}
  if(cls==='max-w-lg'){s.maxWidth='32rem';return s}if(cls==='max-w-2xl'){s.maxWidth='42rem';return s}
  m=cls.match(/^w-\[([\d.]+)%\]$/);if(m){s.width=m[1]+'%';return s}
  m=cls.match(/^w-\[([\d.]+)px\]$/);if(m){s.width=m[1]+'px';return s}
  m=cls.match(/^h-\[([\d.]+)px\]$/);if(m){s.height=m[1]+'px';return s}
  m=cls.match(/^h-\[([\d.]+)%\]$/);if(m){s.height=m[1]+'%';return s}
  m=cls.match(/^w-(\d+)\/(\d+)$/);if(m){s.width=((m[1]/m[2])*100)+'%';return s}
  m=cls.match(/^h-(\d+)\/(\d+)$/);if(m){s.height=((m[1]/m[2])*100)+'%';return s}
  m=cls.match(/^max-w-\[(\d+)px\]$/);if(m){s.maxWidth=m[1]+'px';return s}
  m=cls.match(/^max-h-\[(\d+)px\]$/);if(m){s.maxHeight=m[1]+'px';return s}

  /* border-radius */
  m=cls.match(/^rounded-(\w+)$/);if(m&&D['rounded-'+m[1]]){s.borderRadius=D['rounded-'+m[1]];return s}
  if(cls==='rounded-sm'){s.borderRadius='2px';return s}if(cls==='rounded'){s.borderRadius='4px';return s}

  /* border */
  if(cls==='border'){s.border='1px solid #2a2a2a';return s}
  if(cls==='border-0'){s.border='0';return s}if(cls==='border-2'){s.borderWidth='2px';return s}
  if(cls==='border-4'){s.borderWidth='4px';return s}if(cls==='border-t'){s.borderTop='1px solid #2a2a2a';return s}
  if(cls==='border-b'){s.borderBottom='1px solid #2a2a2a';return s}if(cls==='border-l'){s.borderLeft='1px solid #2a2a2a';return s}
  if(cls==='border-r'){s.borderRight='1px solid #2a2a2a';return s}
  if(cls==='border-dashed'){s.borderStyle='dashed';return s}if(cls==='border-dotted'){s.borderStyle='dotted';return s}

  /* font weight */
  if(cls==='font-bold'){s.fontWeight='700';return s}if(cls==='font-semibold'){s.fontWeight='600';return s}
  if(cls==='font-medium'){s.fontWeight='500';return s}if(cls==='font-normal'){s.fontWeight='400';return s}
  if(cls==='font-black'){s.fontWeight='900';return s}if(cls==='font-extrabold'){s.fontWeight='800';return s}

  /* tracking */
  if(cls==='tracking-wider'){s.letterSpacing='.05em';return s}if(cls==='tracking-widest'){s.letterSpacing='.1em';return s}
  if(cls==='tracking-tight'){s.letterSpacing='-.025em';return s}if(cls==='tracking-tighter'){s.letterSpacing='-.05em';return s}

  /* text transform */
  if(cls==='uppercase'){s.textTransform='uppercase';return s}if(cls==='lowercase'){s.textTransform='lowercase';return s}
  if(cls==='capitalize'){s.textTransform='capitalize';return s}
  if(cls==='truncate'){s.overflow='hidden';s.textOverflow='ellipsis';s.whiteSpace='nowrap';return s}
  m=cls.match(/^line-clamp-(\d+)$/);if(m){s.display='-webkit-box';s.WebkitLineClamp=m[1];s.WebkitBoxOrient='vertical';s.overflow='hidden';return s}

  /* opacity */
  m=cls.match(/^opacity-(\d+)$/);if(m){s.opacity=parseInt(m[1])/100;return s}

  /* display */
  if(cls==='hidden'){s.display='none';return s}if(cls==='block'){s.display='block';return s}
  if(cls==='inline'){s.display='inline';return s}if(cls==='inline-block'){s.display='inline-block';return s}
  if(cls==='flex'){s.display='flex';return s}if(cls==='inline-flex'){s.display='inline-flex';return s}
  if(cls==='grid'){s.display='grid';return s}

  /* flex */
  if(cls==='flex-col'){s.flexDirection='column';return s}if(cls==='flex-row'){s.flexDirection='row';return s}
  if(cls==='flex-wrap'){s.flexWrap='wrap';return s}if(cls==='flex-nowrap'){s.flexWrap='nowrap';return s}
  if(cls==='flex-1'){s.flex='1 1 0%';return s}if(cls==='flex-grow'){s.flexGrow='1';return s}
  if(cls==='flex-shrink-0'){s.flexShrink='0';return s}

  /* align / justify */
  if(cls==='items-center'){s.alignItems='center';return s}if(cls==='items-start'){s.alignItems='flex-start';return s}
  if(cls==='items-end'){s.alignItems='flex-end';return s}if(cls==='items-stretch'){s.alignItems='stretch';return s}
  if(cls==='justify-center'){s.justifyContent='center';return s}if(cls==='justify-between'){s.justifyContent='space-between';return s}
  if(cls==='justify-end'){s.justifyContent='flex-end';return s}if(cls==='justify-start'){s.justifyContent='flex-start';return s}
  if(cls==='self-start'){s.alignSelf='flex-start';return s}if(cls==='self-end'){s.alignSelf='flex-end';return s}
  if(cls==='text-center'){s.textAlign='center';return s}if(cls==='text-left'){s.textAlign='left';return s}if(cls==='text-right'){s.textAlign='right';return s}

  /* position */
  if(cls==='relative'){s.position='relative';return s}if(cls==='absolute'){s.position='absolute';return s}
  if(cls==='fixed'){s.position='fixed';return s}if(cls==='sticky'){s.position='sticky';return s}
  if(cls==='top-0'){s.top='0';return s}if(cls==='left-0'){s.left='0';return s}if(cls==='right-0'){s.right='0';return s}
  if(cls==='bottom-0'){s.bottom='0';return s}if(cls==='inset-0'){s.top='0';s.right='0';s.bottom='0';s.left='0';return s}
  m=cls.match(/^(top|left|right|bottom)-(\d+\.?\d*)$/);if(m){s[m[1]]=S[m[2]]||(m[2]*.25)+'rem';return s}
  m=cls.match(/^(top|left|right|bottom)-\[([\d.]+)px\]$/);if(m){s[m[1]]=m[2]+'px';return s}
  m=cls.match(/^(top|left|right|bottom)-\[([\d.]+)%\]$/);if(m){s[m[1]]=m[2]+'%';return s}
  if(cls==='z-10'){s.zIndex='10'}if(cls==='z-20'){s.zIndex='20'}if(cls==='z-30'){s.zIndex='30'}
  if(cls==='z-40'){s.zIndex='40'}if(cls==='z-50'){s.zIndex='50'}if(cls==='z-[5]'){s.zIndex='5'}
  if(cls==='z-0'){s.zIndex='0'}

  /* transform */
  if(cls==='-translate-x-1/2'){s.transform='translateX(-50%)';return s}if(cls==='-translate-y-1/2'){s.transform='translateY(-50%)';return s}
  if(cls==='translate-x-1/2'){s.transform='translateX(50%)';return s}if(cls==='translate-y-1/2'){s.transform='translateY(50%)';return s}
  if(cls==='-translate-x-full'){s.transform='translateX(-100%)';return s}if(cls==='-translate-y-full'){s.transform='translateY(-100%)';return s}
  if(cls==='transform'){return{}}

  /* cursor */
  if(cls==='cursor-pointer'){s.cursor='pointer';return s}if(cls==='cursor-crosshair'){s.cursor='crosshair';return s}
  if(cls==='cursor-ew-resize'){s.cursor='ew-resize';return s}if(cls==='cursor-grab'){s.cursor='grab';return s}

  /* interaction */
  if(cls==='pointer-events-none'){s.pointerEvents='none';return s}if(cls==='select-none'){s.userSelect='none';return s}

  /* shadows */
  if(cls==='shadow'){s.boxShadow='0 1px 3px rgba(0,0,0,.3)';return s}if(cls==='shadow-sm'){s.boxShadow='0 1px 2px rgba(0,0,0,.2)';return s}
  if(cls==='shadow-md'){s.boxShadow='0 4px 6px rgba(0,0,0,.3)';return s}if(cls==='shadow-lg'){s.boxShadow='0 10px 15px rgba(0,0,0,.4)';return s}
  if(cls==='shadow-xl'){s.boxShadow='0 20px 25px rgba(0,0,0,.5)';return s}if(cls==='shadow-2xl'){s.boxShadow='0 25px 50px rgba(0,0,0,.5)';return s}

  /* backdrop blur */
  if(cls==='backdrop-blur-md'){s.backdropFilter='blur(12px)';s['-webkit-backdrop-filter']='blur(12px)';return s}
  if(cls==='backdrop-blur-sm'){s.backdropFilter='blur(4px)';s['-webkit-backdrop-filter']='blur(4px)';return s}
  if(cls==='backdrop-blur-lg'){s.backdropFilter='blur(16px)';s['-webkit-backdrop-filter']='blur(16px)';return s}
  if(cls==='backdrop-blur-xl'){s.backdropFilter='blur(24px)';s['-webkit-backdrop-filter']='blur(24px)';return s}

  /* overflow */
  if(cls==='overflow-hidden'){s.overflow='hidden';return s}if(cls==='overflow-y-auto'){s.overflowY='auto';return s}
  if(cls==='overflow-x-auto'){s.overflowX='auto';return s}if(cls==='overflow-visible'){s.overflow='visible';return s}

  /* misc */
  if(cls==='object-cover'){s.objectFit='cover';return s}if(cls==='appearance-none'){s.WebkitAppearance='none';s.appearance='none';return s}
  if(cls==='resize-none'){s.resize='none';return s}if(cls==='leading-relaxed'){s.lineHeight='1.625';return s}
  if(cls==='leading-none'){s.lineHeight='1';return s}if(cls==='leading-tight'){s.lineHeight='1.25';return s}
  if(cls==='leading-normal'){s.lineHeight='1.5';return s}if(cls==='whitespace-nowrap'){s.whiteSpace='nowrap';return s}
  if(cls==='min-w-0'){s.minWidth='0';return s}if(cls==='max-w-full'){s.maxWidth='100%';return s}
  if(cls==='scale-125'){s.transform='scale(1.25)';return s}if(cls==='scale-95'){s.transform='scale(.95)';return s}
  m=cls.match(/^aspect-\[(\d+)\/(\d+)\]$/);if(m){s.aspectRatio=m[1]+'/'+m[2];return s}
  if(cls==='transition-all'){s.transition='all .3s';return s}if(cls==='transition-colors'){s.transition='color .3s,background .3s,border-color .3s';return s}
  if(cls==='transition'){s.transition='.3s';return s}
  if(cls==='text-clip'){s['-webkit-background-clip']='text';s.backgroundClip='text';return s}
  m=cls.match(/^hover:scale-(\d+)$/);if(m){_hoverRules.push(`.tw-${_sid}:hover{transform:scale(${m[1]/100})}`);return{}}

  return null;
}

function convertEl(el){
  if(!el||el._twDone)return;
  const cs=el.getAttribute('class');
  if(!cs)return;
  const cls=cs.split(/\s+/),keep=[],ds={};
  let hasGrad=false,hasSpc=false,spcV='',hoverCls=[];
  const allowed=['glass-panel','glass-card','glow-primary','hud-border','scanlines','compare-container','modal-overlay','modal-content','toast','anim-fi','anim-spin','anim-sprev','anim-ping','anim-pulse','social-btn','ping-dot'];

  for(let c of cls){
    if(!c)continue;
    if(allowed.includes(c)){keep.push(c);continue}
    if(c==='hidden'||c==='md\\:block'||c==='sm\\:inline'||c==='lg\\:block'){keep.push(c);continue}
    if(c.startsWith('tw-')){keep.push(c);continue}

    let resp='',orig=c;
    if(c.startsWith('sm\\:')){resp='sm';c=c.slice(4)}
    else if(c.startsWith('md\\:')){resp='md';c=c.slice(4)}
    else if(c.startsWith('lg\\:')){resp='lg';c=c.slice(4)}

    let isHover=c.startsWith('hover\\:')||c.startsWith('group-hover\\:');
    if(isHover)c=c.includes('hover\\:')?c.slice(7):c.slice(14);

    if(isHover&&resp){
      const ss=parseClass(c);
      if(ss&&Object.keys(ss).length){
        _sid++;const nm='tw-h'+_sid;
        keep.push(nm);
        _hoverRules.push(`@media(min-width:${BP[resp]}){.${nm}:hover{${Object.entries(ss).map(([k,v])=>`${k}:${v}`).join(';')}}}`);
      }
      continue;
    }
    if(isHover){
      const ss=parseClass(c);
      if(ss&&Object.keys(ss).length){
        _sid++;const nm='tw-h'+_sid;
        keep.push(nm);
        _hoverRules.push(`.${nm}:hover{${Object.entries(ss).map(([k,v])=>`${k}:${v}`).join(';')}}`);
      }
      continue;
    }
    if(resp){
      const ss=parseClass(c);
      if(ss&&Object.keys(ss).length){
        _sid++;const nm='tw-r'+_sid;
        keep.push(nm);
        _hoverRules.push(`@media(min-width:${BP[resp]}){.${nm}{${Object.entries(ss).map(([k,v])=>`${k}:${v}`).join(';')}}}`);
      }
      continue;
    }

    const ss=parseClass(c);
    if(ss===null){keep.push(orig)}
    else{
      if(ss.backgroundImage&&ss.backgroundImage.includes('gradient'))hasGrad=true;
      if(ss['--spc']){hasSpc=true;spcV=ss['--spc']}
      Object.assign(ds,ss);
    }
  }

  for(const[k,v]of Object.entries(ds)){
    if(k.startsWith('--tg-'))el.style.setProperty(k.replace('--tg-','--tw-gradient-'),v);
    else el.style[k]=v;
  }
  if(hasGrad){
    const f=el.style.getPropertyValue('--tw-gradient-from')||'#4F3A96';
    const v=el.style.getPropertyValue('--tw-gradient-via')||'';
    const t=el.style.getPropertyValue('--tw-gradient-to')||'#4085EC';
    let bg=el.style.backgroundImage||'';
    if(bg.includes('gradient')){
      if(v)bg=bg.replace('var(--tg-from)',f).replace('var(--tg-via)',v).replace('var(--tg-to)',t);
      else bg=bg.replace('var(--tg-from)',f).replace('var(--tg-via),','').replace('var(--tg-to)',t);
      el.style.backgroundImage=bg;
    }
    el.style.removeProperty('--tw-gradient-from');
    el.style.removeProperty('--tw-gradient-via');
    el.style.removeProperty('--tw-gradient-to');
  }
  if(hasSpc&&spcV){
    const ch=document.createElement('style'),uid='s'+Math.random().toString(36).slice(2,8);
    el.classList.add(uid);
    ch.textContent=`.${uid}>*+*{margin-top:${spcV}!important}`;
    document.head.appendChild(ch);
  }

  const nv=keep.join(' ').trim();
  if(nv)el.setAttribute('class',nv);else el.removeAttribute('class');
  el._twDone=true;
}

function injectHover(){
  if(!_hoverRules.length)return;
  const st=document.createElement('style');
  st.textContent=_hoverRules.join('\n');
  document.head.appendChild(st);
  _hoverRules.length=0;
}

const mo=new MutationObserver(muts=>{
  let h=false;
  for(const m of muts){
    m.addedNodes.forEach(n=>{
      if(n.nodeType===1){convertEl(n);n.querySelectorAll('[class]').forEach(convertEl);h=true}
    });
  }
  if(h)injectHover();
});
mo.observe(document.documentElement,{childList:true,subtree:true});

/* ═══════════════════════════════════════════════
   APP CODE
   ═══════════════════════════════════════════════ */

const $=(sel,ctx)=>(ctx||document).querySelector(sel);
const $$=(sel,ctx)=>[...(ctx||document).querySelectorAll(sel)];
function uid(){return Math.random().toString(36).substr(2,9)}

/* ─── STATE ─── */
let pricingPeriod='monthly',selectedTrade='electrical',activeTool='junction_box',zoom=100,customFile=null,selectedPkg='crew';
let markers=[
  {id:'1',x:25,y:35,type:'junction_box',label:'UL Metallic J-Box',price:3.25},
  {id:'2',x:45,y:40,type:'breaker',label:'Square D 20A Breaker',price:8.99},
  {id:'3',x:38,y:72,type:'cable_run',label:'12/2 Copper Run (10ft)',price:45.99}
];
let manualItems=[{id:'m1',name:'Master Foreman Layout Labor',category:'electrical',quantity:1,unitPrice:120,unit:'Svc'}];

const tradeTools={
  electrical:[
    {id:'junction_box',label:'Junction Box',price:3.25,color:'#4085EC'},
    {id:'breaker',label:'Breaker 20A',price:8.99,color:'#4F3A96'},
    {id:'cable_run',label:'12/2 Copper Run (10ft)',price:45.99,color:'#ffd6fa'}
  ],
  plumbing:[
    {id:'pipe',label:'2" PVC Pipe x 10ft',price:12.50,color:'#FFA9FE'},
    {id:'valve',label:'Brass Shutoff Valve',price:24.95,color:'#faba73'},
    {id:'junction_box',label:'Drain Trap',price:18.50,color:'#4085EC'}
  ],
  hvac:[
    {id:'vent',label:'Floor Air Vent',price:14.20,color:'#ccbdff'},
    {id:'conduit',label:'Flexible Ducting x 25ft',price:38.00,color:'#ffddbb'},
    {id:'breaker',label:'Thermostat Control Switch',price:89.00,color:'#4F3A96'}
  ]
};

const suppliersList=[
  {id:'copper_wire',name:'COPPER CABLE 12/2 ROMEX ROLL (250FT)',price:114.99,unit:'Roll',stockStatus:'IN STOCK',category:'electrical'},
  {id:'cable_run',name:'COPPER CABLE 12/2 ROMEX ROW (10FT)',price:4.59,unit:'Pc',stockStatus:'IN STOCK',category:'electrical'},
  {id:'breaker',name:'SQUARE D QO 20 AMP BREAKER',price:8.99,unit:'Ea',stockStatus:'IN STOCK',category:'electrical'},
  {id:'junction_box',name:'UL METALLIC J-BOX 4-INCH',price:3.25,unit:'Ea',stockStatus:'LOW STOCK',category:'electrical'},
  {id:'pvc_pipe',name:'SCH 40 PVC PIPE 2-INCH x 10FT',price:12.50,unit:'Pc',stockStatus:'IN STOCK',category:'plumbing'},
  {id:'brass_valve',name:'APOLLO BRASS SHUTOFF BALL VALVE 3/4"',price:24.95,unit:'Ea',stockStatus:'IN STOCK',category:'plumbing'},
  {id:'drain_trap',name:'PVC P-TRAP ASSEMBLY 1-1/2"',price:18.50,unit:'Ea',stockStatus:'LOW STOCK',category:'plumbing'},
  {id:'vent',name:'STEEL FLOOR AIR REGISTER VENT 4x10',price:14.20,unit:'Ea',stockStatus:'IN STOCK',category:'hvac'},
  {id:'ducting',name:'INSULATED FLEXIBLE DUCTING 6" x 25FT',price:38.00,unit:'Pc',stockStatus:'IN STOCK',category:'hvac'},
  {id:'thermostat',name:'HONEYWELL T3 INTUITIVE CONTROL SWITCH',price:89.00,unit:'Ea',stockStatus:'OUT OF STOCK',category:'hvac'},
];

/* ─── HELPERS ─── */
function showToast(msg){
  const t=document.createElement('div');
  t.className='toast glass-panel p-4 rounded-lg border border-brand-blue/40';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(()=>t.remove(),300)},3000);
}

function openModal(id){
  const el=document.getElementById(id);
  if(el)el.style.display='flex';
}
function closeModal(id){
  const el=document.getElementById(id);
  if(el)el.style.display='none';
}

/* ─── NAV ─── */
let mobileOpen=false;
const menuToggle=$('#menuToggle'),mobileMenu=$('#mobileMenu');
if(menuToggle){
  menuToggle.addEventListener('click',()=>{
    mobileOpen=!mobileOpen;
    if(mobileMenu)mobileMenu.style.display=mobileOpen?'block':'none';
    const o=$('#menuIconOpen'),c=$('#menuIconClose');
    if(o)o.style.display=mobileOpen?'none':'block';
    if(c)c.style.display=mobileOpen?'block':'none';
  });
}
window.closeMenu=function(){
  mobileOpen=false;
  if(mobileMenu)mobileMenu.style.display='none';
  const o=$('#menuIconOpen'),c=$('#menuIconClose');
  if(o)o.style.display='block';if(c)c.style.display='none';
};

/* ─── BACK TO TOP ─── */
const backToTop=$('#backToTop');
window.addEventListener('scroll',()=>{if(backToTop)backToTop.style.display=window.scrollY>300?'flex':'none'});

/* ─── PRICING ─── */
const pricingData={
  monthly:[
    {id:'solo',name:'Solo Operator',price:79,desc:'Designed for independent tradesmen automating their custom estimates and contract proposals.',features:['50 Estimates / Month','Voice-to-Text Parsing','Contract Deliverables']},
    {id:'crew',name:'Crew Leader',price:149,desc:'Advanced digital tools for scaling general contractors and active multi-trade teams.',features:['UNLIMITED ESTIMATES','Visual Photo Takeoffs','Distributor API links','Up to 3 Active Users'],highlight:true},
    {id:'fleet',name:'Fleet Array',price:299,desc:'Comprehensive enterprise-grade tooling for massive contracting and supplier fleets.',features:['Everything in Crew Leader','Enterprise ERP Syncs','Custom Sourcing Catalogs']}
  ],
  annually:[
    {id:'solo',name:'Solo Operator',price:63,desc:'Designed for independent tradesmen automating their custom estimates and contract proposals.',features:['50 Estimates / Month','Voice-to-Text Parsing','Contract Deliverables']},
    {id:'crew',name:'Crew Leader',price:119,desc:'Advanced digital tools for scaling general contractors and active multi-trade teams.',features:['UNLIMITED ESTIMATES','Visual Photo Takeoffs','Distributor API links','Up to 3 Active Users'],highlight:true},
    {id:'fleet',name:'Fleet Array',price:239,desc:'Comprehensive enterprise-grade tooling for massive contracting and supplier fleets.',features:['Everything in Crew Leader','Enterprise ERP Syncs','Custom Sourcing Catalogs']}
  ]
};

function renderPricingSection(){
  const el=$('#pricingSection');if(!el)return;
  const data=pricingData[pricingPeriod];
  el.innerHTML=`
    <div class="text-center mb-12">
      <div class="flex items-center justify-center gap-1.5 bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-sm uppercase text-[10px] font-label-mono text-brand-purple font-semibold tracking-wider">
        <span class="w-1.5 h-1.5 bg-brand-purple rounded-full"></span>
        PRICING
      </div>
      <h2 class="font-display-lg text-4xl text-white font-black tracking-tight mb-4">Simple, transparent pricing.</h2>
      <p class="text-on-surface-variant text-sm max-w-lg mx-auto mb-8">Choose a plan that fits your operation. No hidden fees.</p>
      <div class="flex bg-surface-variant p-1 rounded-sm border border-outline-variant" style="display:inline-flex">
        <button id="billMonthly" class="px-4 py-2 text-xs font-label-mono uppercase tracking-wider rounded-sm transition-all ${pricingPeriod==='monthly'?'bg-brand-purple text-white font-bold shadow-md':'text-on-surface-variant hover:text-white'}">Monthly</button>
        <button id="billAnnually" class="px-4 py-2 text-xs font-label-mono uppercase tracking-wider rounded-sm transition-all ${pricingPeriod==='annually'?'bg-brand-purple text-white font-bold shadow-md':'text-on-surface-variant hover:text-white'}">Annual</button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-5xl mx-auto">
      ${data.map(p=>`
        <div class="glass-panel p-8 rounded-lg ${p.highlight?'border-2 border-brand-purple bg-surface-container-high/60 relative transform lg:-translate-y-4 flex flex-col justify-between text-left shadow-2xl glow-primary':'border border-outline-variant flex flex-col justify-between text-left'}">
          ${p.highlight?'<div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-purple text-white font-label-mono px-4 py-1 rounded-sm uppercase text-[9px] font-black tracking-widest">POPULAR</div>':''}
          <div>
            <div class="text-xs font-label-mono text-brand-purple uppercase tracking-widest font-bold mb-2">${p.name}</div>
            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-4xl font-bold font-display-lg text-white">$${p.price}</span>
              <span class="text-sm text-on-surface-variant">/mo</span>
            </div>
            <p class="text-sm text-on-surface-variant mb-6 leading-relaxed">${p.desc}</p>
            <ul class="space-y-3 font-label-mono text-xs ${p.highlight?'text-white':'text-on-surface-variant'}">
              ${p.features.map(f=>`<li class="flex items-start gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F3A96" stroke-width="3" class="mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>${f}</li>`).join('')}
            </ul>
          </div>
          <a href="#contact" class="w-full text-center mt-8 py-3 font-label-mono text-xs uppercase tracking-widest font-bold rounded-sm transition-all ${p.highlight?'bg-brand-purple hover:bg-brand-blue text-white':'bg-transparent border border-outline-variant hover:bg-surface-variant text-white'}">${p.id==='solo'?'Start Free Trial':p.id==='fleet'?'Contact Sales':'Get Started'}</a>
        </div>
      `).join('')}
    </div>
  `;
  const bm=$('#billMonthly'),ba=$('#billAnnually');
  if(bm)bm.addEventListener('click',()=>{pricingPeriod='monthly';renderPricingSection();});
  if(ba)ba.addEventListener('click',()=>{pricingPeriod='annually';renderPricingSection();});
}

/* ─── CAD BOARD ─── */
function renderCadBoard(){
  const el=$('#cadBoard');if(!el)return;
  el.innerHTML=`
    <div class="text-center mb-12">
      <div class="flex items-center justify-center gap-1.5 bg-brand-blue/10 border border-brand-blue/20 px-2 py-0.5 rounded-sm uppercase text-[10px] font-label-mono text-brand-blue font-semibold tracking-wider">
        <span class="w-1.5 h-1.5 bg-brand-blue rounded-full"></span>
        INTERACTIVE ESTIMATOR
      </div>
      <h2 class="font-display-lg text-4xl text-white font-black tracking-tight mb-4">Interactive <span class="text-brand-purple">CAD Board</span></h2>
      <p class="text-on-surface-variant text-sm max-w-lg mx-auto mb-8">Place fixtures, run conduit, and calculate material costs in real-time.</p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        ${Object.keys(tradeTools).map(t=>`
          <button class="trade-btn px-4 py-1.5 font-label-mono text-xs rounded-sm uppercase transition-colors ${selectedTrade===t?'bg-brand-purple text-white shadow-md':'text-on-surface-variant hover:text-white border border-white/5'}">${t}</button>
        `).join('')}
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8">
        <div class="hud-border p-4" style="min-height:500px">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 text-[10px] font-label-mono text-brand-blue">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              CAD FLOOR PLAN <span class="text-on-surface-variant">v2.4</span>
            </div>
            <div class="flex gap-2">
              <button id="cadUndo" class="text-[10px] font-label-mono uppercase tracking-wider text-on-surface-variant hover:text-white px-2 py-1 rounded-sm border border-white/5 transition-colors">Undo</button>
              <button id="cadClear" class="text-[10px] font-label-mono uppercase tracking-wider text-red-400 hover:text-red-300 px-2 py-1 rounded-sm border border-white/5 transition-colors">Clear</button>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mb-4">
            ${tradeTools[selectedTrade].map(t=>`
              <button class="tool-btn px-3 py-1.5 text-[10px] font-label-mono uppercase tracking-wider rounded-sm transition-all ${activeTool===t.id?'bg-brand-blue/20 text-brand-blue border border-brand-blue/30 font-bold':'bg-surface-dim border border-outline-variant text-on-surface-variant hover:bg-surface-variant/50'}">${t.label}</button>
            `).join('')}
          </div>
          <div id="cadCanvas" class="relative w-full" style="height:380px;background-image:radial-gradient(circle,rgba(64,133,236,.06) 1px,transparent 1px);background-size:20px 20px;cursor:crosshair;overflow:hidden">
            <div id="markersContainer" class="absolute inset-0 z-10"></div>
          </div>
          <div class="flex justify-between items-center mt-4 pt-3 border-t border-white/5 text-[10px] font-label-mono text-on-surface-variant">
            <span>Markers: <span id="markerCount" class="text-white">${markers.length}</span></span>
            <span>Material Total: $<span id="markerTotal" class="text-white font-bold">${markers.reduce((s,m)=>s+m.price,0).toFixed(2)}</span></span>
            <span>Click the canvas to place <span class="text-brand-blue">${activeTool}</span></span>
          </div>
        </div>
      </div>
      <div class="lg:col-span-4 space-y-4">
        <div class="glass-panel p-4 rounded-lg">
          <div class="text-[10px] font-label-mono text-brand-blue uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
            PLACED MARKERS
          </div>
          <div id="placedMarkers" class="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
            ${markers.length?markers.map(m=>`
              <div class="flex items-center justify-between p-2 rounded-sm border transition-all border-white/5 hover:border-white/10 bg-black/20 text-slate-300 text-[11px]">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></span>
                  <span class="truncate">${m.label}</span>
                </div>
                <span class="text-white font-bold flex-shrink-0">$${m.price.toFixed(2)}</span>
              </div>
            `).join(''):'<div class="text-center py-8 text-xs text-on-surface-variant">No markers placed. Click the CAD canvas above.</div>'}
          </div>
        </div>
        <div class="glass-panel p-4 rounded-lg">
          <div class="text-[10px] font-label-mono text-brand-purple uppercase tracking-widest font-bold mb-3">QUICK TOTAL</div>
          <div class="text-3xl font-bold font-display-lg text-white">$${markers.reduce((s,m)=>s+m.price,0).toFixed(2)}</div>
          <div class="text-xs text-on-surface-variant mt-1">${markers.length} material(s) placed</div>
        </div>
      </div>
    </div>
  `;
  bindCadEvents();
  updateCadStatus();
}

function bindCadEvents(){
  $$('.trade-btn').forEach(b=>b.addEventListener('click',()=>{selectedTrade=b.textContent.toLowerCase().trim();renderCadBoard();}));
  $$('.tool-btn').forEach(b=>b.addEventListener('click',()=>{activeTool=b.dataset.tool;renderCadBoard();}));
  const canvas=$('#cadCanvas');
  if(canvas){
    canvas.addEventListener('click',e=>{
      const r=canvas.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width)*100,y=((e.clientY-r.top)/r.height)*100;
      const tool=tradeTools[selectedTrade].find(t=>t.id===activeTool);
      if(tool){markers.push({id:uid(),x,y,type:activeTool,label:tool.label,price:tool.price});renderCadMarkers();updateCadStatus();}
    });
  }
  $('#cadUndo')?.addEventListener('click',()=>{markers.pop();renderCadMarkers();updateCadStatus();});
  $('#cadClear')?.addEventListener('click',()=>{markers=[];renderCadMarkers();updateCadStatus();});
}

function renderCadMarkers(){
  const c=$('#markersContainer');if(!c)return;
  c.innerHTML=markers.map(m=>`
    <div class="absolute" style="left:${m.x}%;top:${m.y}%;transform:translate(-50%,-50%);z-index:10">
      <div style="width:12px;height:12px;background:#4085EC;border:2px solid #4F3A96;transform:rotate(45deg);box-shadow:0 0 8px rgba(79,58,150,.6);cursor:grab"></div>
      <div class="absolute hidden group-hover:block whitespace-nowrap bg-background text-white text-[10px] font-mono px-2 py-1 rounded-sm border border-outline-variant -top-8 left-1/2 -translate-x-1/2 shadow-xl z-50">${m.label}</div>
    </div>
  `).join('');
}

function updateCadStatus(){
  const mc=$('#markerCount'),mt=$('#markerTotal');
  if(mc)mc.textContent=markers.length;
  if(mt)mt.textContent=markers.reduce((s,m)=>s+m.price,0).toFixed(2);
}

/* ─── SUPPLIER HUD ─── */
function renderSupplierHud(){
  const el=$('#supplierHud');if(!el)return;
  el.innerHTML=`
    <div class="text-center mb-12">
      <div class="flex items-center justify-center gap-1.5 bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-sm uppercase text-[10px] font-label-mono text-brand-purple font-semibold tracking-wider">
        <span class="w-1.5 h-1.5 bg-brand-purple rounded-full"></span>
        SUPPLIER PRICE HUD
      </div>
      <h2 class="font-display-lg text-4xl text-white font-black tracking-tight mb-4">Live Supplier <span class="text-brand-blue">Catalog</span></h2>
      <p class="text-on-surface-variant text-sm max-w-lg mx-auto mb-8">Real-time distributor pricing with stock status.</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <input id="supplierSearch" type="text" placeholder="SEARCH MATERIALS..." class="w-full sm:w-64 bg-surface-variant border border-outline-variant text-white px-4 py-2.5 rounded-sm focus:border-brand-blue outline-none font-label-mono text-sm">
        <select id="supplierFilter" class="w-full sm:w-auto bg-surface-variant border border-outline-variant text-white px-4 py-2.5 rounded-sm focus:border-brand-blue outline-none font-label-mono text-sm uppercase cursor-pointer">
          <option value="all">ALL TRADES</option>
          <option value="electrical">ELECTRICAL</option>
          <option value="plumbing">PLUMBING</option>
          <option value="hvac">HVAC</option>
        </select>
      </div>
    </div>
    <div id="supplierGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"></div>
  `;
  renderSupplierGrid();
  $('#supplierSearch')?.addEventListener('input',renderSupplierGrid);
  $('#supplierFilter')?.addEventListener('change',renderSupplierGrid);
}

function renderSupplierGrid(){
  const g=$('#supplierGrid');if(!g)return;
  const sq=$('#supplierSearch'),sf=$('#supplierFilter');
  let items=suppliersList;
  if(sf&&sf.value!=='all')items=items.filter(s=>s.category===sf.value);
  if(sq&&sq.value)items=items.filter(s=>s.name.toLowerCase().includes(sq.value.toLowerCase()));
  g.innerHTML=items.length?items.map(s=>`
    <div class="glass-panel p-4 rounded-lg hover:border-brand-purple/40 transition-all cursor-default">
      <div class="flex items-center gap-1.5 mb-2">
        <span class="flex h-2 w-2 rounded-full ${s.stockStatus==='IN STOCK'?'bg-emerald-500':s.stockStatus==='LOW STOCK'?'bg-yellow-500':'bg-red-500'} animate-ping"></span>
        <span class="text-[10px] font-label-mono uppercase tracking-wider font-semibold ${s.stockStatus==='IN STOCK'?'text-emerald-400':s.stockStatus==='LOW STOCK'?'text-yellow-500':'text-red-400'}">${s.stockStatus}</span>
      </div>
      <div class="text-xs font-label-mono text-on-surface-variant leading-relaxed mb-3 line-clamp-2">${s.name}</div>
      <div class="flex items-end justify-between">
        <span class="font-display-lg text-xl text-white font-bold">$${s.price.toFixed(2)}</span>
        <span class="text-[10px] font-label-mono text-slate-400">/${s.unit}</span>
      </div>
    </div>
  `).join(''):'<div class="col-span-full text-center py-16 text-sm text-on-surface-variant font-label-mono uppercase tracking-wider">No materials found matching your search.</div>';
}

/* ─── FEATURES ─── */
function renderFeaturesGrid(){
  const el=$('#featuresGrid');if(!el)return;
  const features=[
    {icon:'estimate',title:'Live Material Estimator',desc:'Real-time material takeoffs from BIM models and visual blueprint overlays with automatic cost aggregation by trade.'},
    {icon:'price',title:'Supplier Price Intelligence',desc:'Direct distributor API connections provide live pricing from 200+ suppliers ensuring accurate bid estimates.'},
    {icon:'cad',title:'CAD-to-Bid Engine',desc:'Import DXF or PDF plans and auto-identify fixtures, runs, and load requirements with ML-powered recognition.'},
    {icon:'photo',title:'Visual Photo Takeoffs',desc:'Snap a photo of existing conditions or rough plans and let Foreman extract measurements and material counts.'},
    {icon:'voice',title:'Voice-to-Estimate',desc:'Dictate material lists and quantities while walking the job site — Foreman converts speech to line items.'},
    {icon:'contract',title:'Instant Contract Proposals',desc:'Generate polished, itemized proposal PDFs ready for e-signature directly from your estimate data.'}
  ];
  const icons={
    estimate:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4085EC" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    price:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4085EC" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
    cad:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4085EC" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
    photo:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4085EC" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    voice:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4085EC" stroke-width="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
    contract:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4085EC" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
  };
  el.innerHTML=`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    ${features.map(f=>`
      <div class="glass-panel p-6 rounded-lg hover-glow transition-all cursor-default">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-blue/10 border border-brand-blue/30 mb-4">${icons[f.icon]}</div>
        <h3 class="font-headline-lg text-lg text-white font-semibold mb-2">${f.title}</h3>
        <p class="text-sm text-on-surface-variant leading-relaxed">${f.desc}</p>
      </div>
    `).join('')}
  </div>`;
}

/* ─── THREE-STEP ─── */
function renderThreeStep(){
  const el=$('#threeStep');if(!el)return;
  el.innerHTML=`
    <div class="text-center mb-16">
      <div class="flex items-center justify-center gap-1.5 bg-brand-blue/10 border border-brand-blue/20 px-2 py-0.5 rounded-sm uppercase text-[10px] font-label-mono text-brand-blue font-semibold tracking-wider">
        <span class="w-1.5 h-1.5 bg-brand-blue rounded-full"></span>
        HOW IT WORKS
      </div>
      <h2 class="font-display-lg text-4xl text-white font-black tracking-tight mb-4">Three steps to win more bids.</h2>
      <p class="text-on-surface-variant text-sm max-w-lg mx-auto">From job site to signed contract in record time.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      ${[
        {n:'01',t:'Snap or Upload',d:'Photograph the job site or upload blueprints. Foreman\'s AI instantly analyzes dimensions, materials, and labor requirements.'},
        {n:'02',t:'Review & Adjust',d:'Fine-tune quantities, toggle material grades, and compare live supplier pricing — all in one interactive dashboard.'},
        {n:'03',t:'Submit & Win',d:'Generate a professional bid proposal with full cost breakdown, timeline, and terms. Send for e-signature on the spot.'}
      ].map(s=>`
        <div class="glass-panel p-8 rounded-lg text-center">
          <div class="w-14 h-14 rounded-full bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center mx-auto mb-6">
            <span class="font-display-lg text-2xl font-black text-brand-purple">${s.n}</span>
          </div>
          <h3 class="font-headline-lg text-lg text-white font-semibold mb-3">${s.t}</h3>
          <p class="text-sm text-on-surface-variant leading-relaxed">${s.d}</p>
        </div>
      `).join('')}
    </div>
  `;
}

/* ─── TRADE PILLARS ─── */
function renderTradePillars(){
  const el=$('#tradePillars');if(!el)return;
  const trades=[
    {name:'Electrical',color:'#4F3A96',items:['Load Center Calculations','Branch Circuit Design','Raceway Fill Schedules','Voltage Drop Analysis','Panel Schedule Generation']},
    {name:'Plumbing',color:'#4085EC',items:['Fixture Count & Flow Rates','Pipe Sizing (Wet/Domestic)','Vent Stack Routing','Water Heater Sizing','DWV System Layout']},
    {name:'HVAC',color:'#34d399',items:['Manual J Load Calculations','Duct Sizing (CFM/Static)','Equipment Selection','Ventilation Rate Analysis','Refrigerant Line Sizing']}
  ];
  el.innerHTML=`
    <div class="text-center mb-16">
      <div class="flex items-center justify-center gap-1.5 bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-sm uppercase text-[10px] font-label-mono text-brand-purple font-semibold tracking-wider">
        <span class="w-1.5 h-1.5 bg-brand-purple rounded-full"></span>
        TRADE SPECIALTIES
      </div>
      <h2 class="font-display-lg text-4xl text-white font-black tracking-tight mb-4">Multi-trade intelligence.</h2>
      <p class="text-on-surface-variant text-sm max-w-lg mx-auto">Purpose-built estimation modules for every major construction trade.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      ${trades.map(t=>`
        <div class="glass-panel p-6 rounded-lg">
          <div class="flex items-center gap-3 mb-6">
            <span style="width:10px;height:10px;border-radius:50%;background:${t.color};box-shadow:0 0 10px ${t.color}"></span>
            <h3 class="font-headline-lg text-xl text-white font-bold">${t.name}</h3>
          </div>
          <ul class="space-y-3">
            ${t.items.map(i=>`
              <li class="flex items-center gap-2.5 text-sm text-on-surface-variant">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${t.color}" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                ${i}
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;
}

/* ─── SPLITE COMPARE ─── */
function renderSpliteCompare(){
  const el=$('#spliteSection');if(!el)return;
  el.innerHTML=`
    <div class="text-center mb-12">
      <h2 class="font-display-lg text-4xl text-white font-black tracking-tight mb-4">Before & After — <span class="text-brand-blue">in seconds.</span></h2>
      <p class="text-on-surface-variant text-sm max-w-lg mx-auto">Slide to see how Foreman transforms raw blueprints into a quantified, bid-ready estimate.</p>
    </div>
    <div id="spliteContainer" class="compare-container">
      <div id="spliteAfter" class="absolute inset-0 flex items-center justify-center bg-surface-container-high">
        <div class="text-center">
          <div class="absolute top-4 right-4 bg-brand-purple/90 border border-brand-purple text-white rounded-sm px-3 py-1 text-[9px] font-label-mono uppercase tracking-wider">FOREMAN AI</div>
          <div class="grid grid-cols-2 gap-6" style="max-width:420px">
            <div class="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-6 text-center">
              <div class="font-display-lg text-3xl font-black text-brand-blue">47</div>
              <div class="text-[10px] font-label-mono text-on-surface-variant mt-1 uppercase tracking-wider">Material Lines</div>
            </div>
            <div class="bg-brand-purple/10 border border-brand-purple/20 rounded-lg p-6 text-center">
              <div class="font-display-lg text-3xl font-black text-brand-purple">$12,847</div>
              <div class="text-[10px] font-label-mono text-on-surface-variant mt-1 uppercase tracking-wider">Total Estimated</div>
            </div>
            <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 text-center">
              <div class="font-display-lg text-3xl font-black text-emerald-400">8 Mins</div>
              <div class="text-[10px] font-label-mono text-on-surface-variant mt-1 uppercase tracking-wider">Generation Time</div>
            </div>
            <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
              <div class="font-display-lg text-3xl font-black text-yellow-500">98.3%</div>
              <div class="text-[10px] font-label-mono text-on-surface-variant mt-1 uppercase tracking-wider">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>
      <div id="spliteBefore" class="absolute top-0 left-0 bottom-0 flex items-center justify-center bg-background/95 border-r-2 border-brand-purple overflow-hidden" style="width:50%">
        <div class="absolute top-4 left-4 bg-black/60 border border-white/10 text-slate-400 rounded-sm px-3 py-1 text-[9px] font-label-mono uppercase tracking-wider">RAW BLUEPRINT</div>
        <svg width="140" height="140" viewBox="0 0 100 100" stroke="#4F3A96" stroke-width="0.5" fill="none" class="opacity-30"><line x1="10" y1="10" x2="90" y2="10"/><line x1="10" y1="10" x2="10" y2="90"/><line x1="90" y1="10" x2="90" y2="90"/><line x1="10" y1="90" x2="90" y2="90"/><circle cx="50" cy="50" r="20"/><rect x="35" y="35" width="30" height="30" rx="2"/></svg>
      </div>
      <div id="spliteHandle" style="position:absolute;top:0;bottom:0;left:50%;width:4px;background:#4F3A96;cursor:ew-resize;z-index:10;transform:translateX(-2px);box-shadow:0 0 10px rgba(79,58,150,.5)"></div>
    </div>
  `;
  setTimeout(()=>{
    const c=$('#spliteContainer'),h=$('#spliteHandle'),b=$('#spliteBefore');
    if(!c||!h||!b)return;
    let dragging=false;
    function move(e){
      if(!dragging)return;
      const r=c.getBoundingClientRect();
      let x=(e.clientX||(e.touches&&e.touches[0].clientX))-r.left;
      x=Math.max(0,Math.min(x,r.width));
      const p=(x/r.width)*100;
      b.style.width=p+'%';h.style.left=p+'%';
    }
    h.addEventListener('mousedown',()=>dragging=true);
    window.addEventListener('mousemove',move);
    window.addEventListener('mouseup',()=>dragging=false);
    c.addEventListener('touchstart',e=>{dragging=true;move(e);},{passive:true});
    window.addEventListener('touchmove',move,{passive:true});
    window.addEventListener('touchend',()=>dragging=false);
  },100);
}

/* ─── CONTACT ─── */
let captchaAnswer='';
function renderContactForm(){
  const el=$('#contactSection');if(!el)return;
  el.innerHTML=`
    <div class="max-w-lg mx-auto text-center">
      <div class="flex items-center justify-center gap-1.5 bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-sm uppercase text-[10px] font-label-mono text-brand-purple font-semibold tracking-wider">
        <span class="w-1.5 h-1.5 bg-brand-purple rounded-full"></span>
        GET IN TOUCH
      </div>
      <h2 class="font-display-lg text-4xl text-white font-black tracking-tight mb-4">Ready to streamline your estimates?</h2>
      <p class="text-on-surface-variant text-sm mb-10 leading-relaxed">Fill out the form below and a Foreman specialist will reach out within 24 hours.</p>
    </div>
    <form id="contactForm" class="max-w-lg mx-auto" onsubmit="handleContactSubmit(event)">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input type="text" name="firstName" placeholder="First Name" required class="w-full bg-surface-variant border border-outline-variant text-white px-4 py-3 rounded-sm focus:border-brand-blue outline-none font-label-mono text-sm">
        <input type="text" name="lastName" placeholder="Last Name" required class="w-full bg-surface-variant border border-outline-variant text-white px-4 py-3 rounded-sm focus:border-brand-blue outline-none font-label-mono text-sm">
      </div>
      <div class="mb-4">
        <input type="email" name="email" placeholder="Email Address" required class="w-full bg-surface-variant border border-outline-variant text-white px-4 py-3 rounded-sm focus:border-brand-blue outline-none font-label-mono text-sm">
      </div>
      <div class="mb-4">
        <input type="tel" name="phone" placeholder="Phone Number" class="w-full bg-surface-variant border border-outline-variant text-white px-4 py-3 rounded-sm focus:border-brand-blue outline-none font-label-mono text-sm">
      </div>
      <div class="mb-4">
        <select name="trade" required class="w-full bg-surface-variant border border-outline-variant text-white px-4 py-3 rounded-sm focus:border-brand-blue outline-none font-label-mono text-sm appearance-none cursor-pointer">
          <option value="">Select Your Trade</option>
          <option value="electrical">Electrical</option>
          <option value="plumbing">Plumbing</option>
          <option value="hvac">HVAC</option>
          <option value="general">General Contracting</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="mb-6">
        <textarea name="message" placeholder="Tell us about your project..." rows="4" class="w-full bg-surface-variant border border-outline-variant text-white px-4 py-3 rounded-sm focus:border-brand-blue outline-none font-label-mono text-sm resize-none"></textarea>
      </div>
      <div id="captchaBox" class="flex items-center gap-3 justify-center bg-surface-dim/60 border border-outline-variant rounded-sm p-4 mb-6">
        <span class="text-xs font-label-mono text-on-surface-variant select-none">Verify:</span>
        <span id="captchaPrompt" class="font-display-lg text-lg font-bold text-brand-blue tracking-widest select-none"></span>
        <span class="text-xs text-on-surface-variant">=</span>
        <input id="captchaInput" type="text" class="w-16 bg-surface-variant border border-outline-variant text-white px-2 py-1.5 rounded-sm text-center font-label-mono text-sm uppercase outline-none" maxlength="4" required>
        <button type="button" id="captchaRefresh" class="text-[10px] font-label-mono text-on-surface-variant hover:text-white px-2 py-1.5 border border-white/5 rounded-sm transition-colors">REFRESH</button>
      </div>
      <button type="submit" class="w-full bg-brand-purple hover:bg-brand-blue text-white font-label-mono text-sm uppercase tracking-widest font-bold py-4 rounded-sm transition-all flex items-center justify-center gap-2">
        Submit Inquiry
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </form>
  `;
  generateCaptcha();
}

function generateCaptcha(){
  const p=$('#captchaPrompt');if(!p)return;
  const a=Math.floor(Math.random()*10)+1,b=Math.floor(Math.random()*10)+1;
  captchaAnswer=(a+b).toString();
  p.textContent=`${a} + ${b}`;
  $('#captchaRefresh')?.addEventListener('click',generateCaptcha);
}

window.handleContactSubmit=function(e){
  e.preventDefault();
  const input=$('#captchaInput');
  if(!input||input.value.trim()!==captchaAnswer){
    alert('Captcha verification failed. Please try again.');
    generateCaptcha();input&&(input.value='');
    return;
  }
  alert('Thank you! Your inquiry has been submitted. A Foreman specialist will contact you within 24 hours.');
  e.target.reset();
  generateCaptcha();
};

/* ─── FOOTER MODALS ─── */
const legalDocs={
  privacy:`<h3 class="font-headline-lg text-xl text-white font-bold mb-4">Privacy Policy</h3><p class="text-sm text-on-surface-variant leading-relaxed mb-3">This is a demo landing page. No real data is collected or stored. Any information submitted through the contact form is used solely for demonstration purposes.</p><p class="text-sm text-on-surface-variant leading-relaxed">Foreman AI respects your privacy. In a production environment, we would detail our data collection, storage, and protection practices here.</p>`,
  terms:`<h3 class="font-headline-lg text-xl text-white font-bold mb-4">Terms of Service</h3><p class="text-sm text-on-surface-variant leading-relaxed mb-3">This is a demo landing page. The Foreman AI service and all related materials are provided for demonstration purposes only.</p><p class="text-sm text-on-surface-variant leading-relaxed">No binding agreement is formed by using this demo. All trademarks and intellectual property belong to their respective owners.</p>`,
  cookies:`<h3 class="font-headline-lg text-xl text-white font-bold mb-4">Cookie Policy</h3><p class="text-sm text-on-surface-variant leading-relaxed mb-3">This demo page does not use cookies or tracking technologies. Any cookies shown would typically be used for analytics, authentication, and preference management in a production environment.</p><p class="text-sm text-on-surface-variant leading-relaxed">You can manage cookie preferences through your browser settings at any time.</p>`
};

function renderFooterModals(){
  const container=document.getElementById('footerModals')||(()=>{
    const d=document.createElement('div');d.id='footerModals';document.body.appendChild(d);return d;
  })();
  container.innerHTML=Object.entries(legalDocs).map(([id,content])=>`
    <div id="${id}Modal" class="modal-overlay" style="display:none" onclick="if(event.target===this)closeModal('${id}Modal')">
      <div class="modal-content">${content}
        <button onclick="closeModal('${id}Modal')" class="mt-6 text-xs font-label-mono text-on-surface-variant hover:text-white bg-transparent border border-white/10 px-4 py-2 rounded-sm transition-colors uppercase tracking-wider">Close</button>
      </div>
    </div>
  `).join('');
}

/* ─── ENV ESTIMATOR (3D WORKSPACE) ─── */
function renderEnvEstimator(){
  const el=$('#envEstimator');if(!el)return;
  el.innerHTML=`
    <div class="hud-border p-6 rounded-sm">
      <div class="flex items-center gap-2 mb-6">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4085EC" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="text-[10px] font-label-mono text-brand-blue uppercase tracking-widest font-bold">3D WORKSPACE ENV</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div><div class="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider mb-1">Temperature</div><div class="font-display-lg text-2xl font-black text-white">72°F</div></div>
        <div><div class="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider mb-1">Humidity</div><div class="font-display-lg text-2xl font-black text-white">45%</div></div>
        <div><div class="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider mb-1">Lighting</div><div class="font-display-lg text-2xl font-black text-white">3200K</div></div>
        <div><div class="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider mb-1">Noise</div><div class="font-display-lg text-2xl font-black text-white">48 dB</div></div>
      </div>
      <div class="mt-4 pt-4 border-t border-outline-variant/30 flex items-center gap-3 text-[10px] font-label-mono text-on-surface-variant">
        <span class="flex items-center gap-1"><span class="w-2 h-2 bg-brand-blue rounded-full animate-ping"></span> ACTIVE SESSION</span>
        <span>|</span>
        <span>FPS: 60</span>
        <span>|</span>
        <span>LAT: 12ms</span>
      </div>
    </div>
  `;
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded',()=>{
  renderCadBoard();
  renderSupplierHud();
  renderFeaturesGrid();
  renderThreeStep();
  renderTradePillars();
  renderSpliteCompare();
  renderPricingSection();
  renderContactForm();
  renderEnvEstimator();
  renderFooterModals();

  document.querySelectorAll('[class]').forEach(convertEl);
  injectHover();
});
