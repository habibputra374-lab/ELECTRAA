'use strict';
(() => {
const missions=window.MISSIONS, physics=window.ElectraPhysics;
const states=missions.map(m=>({selection:null,confidence:null,revealed:false,result:null,practice:false,sim:physics.defaults(m.id)}));
let view=location.hash.startsWith('#materi')?'material':'game';
let current=Math.max(1,Math.min(5,Number(location.hash.match(/^#misi-([1-5])$/)?.[1]||1)));
const $=(q)=>document.querySelector(q);
const fmt=(n,d=2)=>new Intl.NumberFormat('id-ID',{maximumFractionDigits:d}).format(n);
const escape=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cardPath=n=>`assets/card-${n}.png`;
const imageButton=(n,code,title)=>`<button class="source-card" data-card="${n}" aria-label="Perbesar kartu ${code}: ${escape(title)}"><img src="${cardPath(n)}" alt="Kartu ${code}: ${escape(title)}" width="744" height="1039" ${n===2?'fetchpriority="high"':'loading="lazy"'}><span class="zoom-hint" aria-hidden="true">⌕</span></button>`;
const tag=(ok)=>`<span class="verdict ${ok?'':'wrong'}">${ok?'✓ Benar':'✕ Salah'}</span>`;
const meter=(label,value,unit='',highlight=false)=>`<div class="meter ${highlight?'highlight':''}"><small>${label}</small><b>${value} <span class="unit">${unit}</span></b></div>`;
const switchControl=(key,on,label,disabled=false)=>`<div class="switch-label"><button type="button" class="switch" role="switch" aria-checked="${on}" aria-label="${escape(label)}" data-switch="${key}" ${disabled?'disabled':''}></button><span>${label}: <b>${on?'ON':'OFF'}</b></span></div>`;
const range=(key,label,value,min,max,unit,step=1)=>`<label class="range-field"><span class="range-heading"><span>${label}</span><output id="value-${key}">${fmt(value)} ${unit}</output></span><input type="range" data-range="${key}" aria-label="${label}" aria-valuetext="${fmt(value)} ${unit}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
const wire=(d,extra='')=>`<path class="wire ${extra}" d="${d}"/>`;
const flow=(d,i=1)=>i>0?`<path class="active-wire" style="--flow-time:${Math.max(.6,Math.min(4,1.2/i))}s" d="${d}"/>`:'';
const text=(x,y,value,cls='',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${value}</text>`;
const node=(x,y)=>`<circle cx="${x}" cy="${y}" r="4" class="node"/>`;
function resistor(x,y,label,value='',ghost=false){return `<g class="${ghost?'faint':''}"><rect class="component" x="${x-26}" y="${y-10}" width="52" height="20" rx="1"/>${text(x,y-23,label)}${value?text(x,y+34,value,'subtext'):''}</g>`;}
function battery(x,y,label){return `<rect x="${x-21}" y="${y-29}" width="42" height="58" fill="#0a1828"/><path d="M${x-8} ${y-23}v46 M${x+8} ${y-13}v26" stroke="#d7e6f0" stroke-width="3"/>${text(x-24,y-12,'+','subtext')}${text(x+25,y-12,'−','subtext')}${text(x,y+45,label)}`;}
function lamp(x,y,label,power=0){const on=power>0;const opacity=on?Math.min(.45,.14+power*.055):0;return `<g>${on?`<circle cx="${x}" cy="${y}" r="32" fill="#ffd478" opacity="${opacity}"/>`:''}<circle cx="${x}" cy="${y}" r="19" class="${on?'lamp-on':'lamp-off'}"/><path d="M${x-13} ${y-13}l26 26 M${x+13} ${y-13}l-26 26" stroke="${on?'#ffe5a0':'#7e9aaf'}" stroke-width="2.4"/>${text(x,y-32,label,on?'bright-label':'')}</g>`;}
function switchSymbol(x,y,on,vertical=false,present=true){const transform=vertical?`rotate(90 ${x} ${y})`:'';return `<g transform="${transform}"><rect x="${x-25}" y="${y-24}" width="50" height="50" fill="#0a1828"/>${present?`<path d="M${x-19} ${y}L${x+19} ${on?y:y-21}" class="wire ${on?'switch-closed':'switch-open'}"/><circle cx="${x-20}" cy="${y}" r="3" class="component"/><circle cx="${x+20}" cy="${y}" r="3" class="component"/>`:`<path d="M${x-20} ${y}h40" class="wire ghost"/>`}</g>`;}
const svg=(label,body,height=280)=>`<svg class="circuit" viewBox="0 0 640 ${height}" role="img" aria-label="${escape(label)}"><title>${escape(label)}</title>${body}</svg>`;

function diagram(id,s,c){
 if(id===1){
  const upper='M85 160V60H550V160',middle='M85 160H550',base='M85 160V238H550V160';
  return svg(`Saklar ${s.closed?'tertutup. Kedua lampu menyala':'terbuka. Lampu atas padam dan lampu tengah menyala'}.`,wire(upper)+wire(middle)+wire(base)+flow(upper,c.upper)+flow(middle,c.middle)+flow('M296 238H85V160',c.total)+flow('M550 160V238H344',c.total)+switchSymbol(85,107,s.closed,true)+text(42,112,'S')+resistor(315,60,'R','10 Ω')+lamp(550,108,'L atas',c.upper*c.upper*10)+lamp(325,160,'L tengah',3.6)+battery(320,238,'6 V')+node(85,160)+node(550,160),300);
 }
 if(id===2){
  const top='M90 230V70H550V230',lower='M90 155H550';
  return svg(`Lampu pertama tetap menyala dengan daya 3 watt. ${s.added?'Lampu kedua terhubung paralel':'Cabang kedua belum terpasang'}.`,wire(top)+wire('M90 230H550')+wire(lower,s.added?'':'ghost')+flow('M296 230H90V70H550V230H344',.5)+flow(lower,s.added?.5:0)+lamp(320,70,'Lampu 1',3)+(s.added?lamp(320,155,'Lampu 2',3):text(320,140,'Cabang lampu tambahan','missing-label'))+text(465,55,'I₁ = 0,5 A','subtext')+(s.added?text(465,140,'I₂ = 0,5 A','subtext'):'')+battery(320,230,'6 V')+(s.added?node(90,155)+node(550,155):''),290);
 }
 if(id===3){
  return svg(`Baterai ${s.v} volt dan resistor ${s.r} ohm menghasilkan arus ${fmt(c.current)} ampere.`,wire('M90 170V62H550V170Z')+flow('M296 170H90V62H550V170H344',c.current)+resistor(370,62,'R',`${fmt(s.r)} Ω`)+battery(320,170,`${fmt(s.v)} V`)+text(177,39,`I = ${fmt(c.current)} A`,'bright-label'),230);
 }
 if(id===4){
  const parts=s.parts;
  let b=wire('M70 150H300')+wire('M590 150V310H70V150');
  b+=wire('M300 150V70H590V150',parts[2]?'':'ghost')+wire('M300 150V230H590V150',parts[3]?'':'ghost');
  b+=flow('M176 310H70V150H300',c.total)+flow('M590 150V310H224',c.total)+flow('M300 150V70H590V150',c.upper)+flow('M300 150V230H590V150',c.lower);
  b+=switchSymbol(132,150,s.closed,false,parts[0])+text(130,120,'S');
  if(parts[1])b+=resistor(225,150,'R','2 Ω');else b+=`<rect x="195" y="134" width="60" height="32" fill="#0a1828"/>`+wire('M197 150H253','ghost')+text(225,120,'R','missing-label');
  b+=parts[2]?lamp(380,70,'L₁',c.upper*c.upper*6)+lamp(490,70,'L₂',c.upper*c.upper*6):text(440,48,'Pasang cabang L₁–L₂','missing-label');
  b+=parts[3]?lamp(380,230,'L₃',c.lower*c.lower*6)+lamp(490,230,'L₄',c.lower*c.lower*6):text(440,210,'Pasang cabang L₃–L₄','missing-label');
  b+=battery(200,310,'12 V')+node(300,150)+node(590,150);
  return svg(`Rangkaian rakitan. ${parts.filter(Boolean).length} dari 4 bagian dipasang. Arus total ${fmt(c.total)} ampere.`,b,365);
 }
 if(id===5){
  let b=wire('M65 70H580V280H65V70')+wire('M300 70V188H580');
  b+=flow('M276 280H65V70H300',c.total)+flow('M300 70H580V188',c.upper)+flow('M300 70V188H580',c.lower)+flow('M580 188V280H324',c.total);
  b+=switchSymbol(123,70,s.closed)+text(123,36,'S')+resistor(222,70,'R₁',`${fmt(s.r1)} Ω`)+resistor(375,70,'R₂',`${fmt(s.r2)} Ω`)+resistor(503,70,'R₃',`${fmt(s.r3)} Ω`)+resistor(438,188,'R₄',`${fmt(s.r4)} Ω`)+battery(300,280,`${fmt(s.v)} V`)+node(300,70)+node(580,188)+text(434,133,`I atas = ${fmt(c.upper)} A`,'bright-label')+text(440,244,`I₄ = ${fmt(c.lower)} A`,'bright-label');
  return svg(`R1 seri dengan paralel R2 dan R3 pada cabang atas serta R4 pada cabang bawah. Arus atas ${fmt(c.upper)} dan arus bawah ${fmt(c.lower)} ampere.`,b,335);
 }
}
function graph(s){const maxI=24/s.r;const x=35+s.v/24*185,y=124-s.v/24*100;return `<svg class="graph" viewBox="0 0 255 160" role="img" aria-label="Grafik I terhadap V pada hambatan ${s.r} ohm. Garis lurus melalui titik nol."><path d="M35 15V124H232" stroke="#6d8ba0" fill="none"/><path d="M35 124L220 24" stroke="#f8cf57" stroke-width="2.5"/><path d="M${x} 124V${y}H35" fill="none" stroke="#577588" stroke-dasharray="3 4"/><circle cx="${x}" cy="${y}" r="5" fill="#f8cf57"/><text x="17" y="18">I (A)</text><text x="216" y="151">V (V)</text><text x="27" y="141">0</text><text x="211" y="140">24</text><text x="2" y="30">${fmt(maxI,1)}</text><text x="105" y="50">R = ${fmt(s.r)} Ω</text></svg>`;}
function simTemplate(m){const s=states[m.id-1].sim;
 let controls='';
 if(m.id===1)controls=`<div class="sim-controls">${switchControl('closed',s.closed,'Saklar S')}<button class="reset" data-reset>Atur ulang</button></div>`;
 if(m.id===2)controls=`<div class="sim-controls"><button class="button small primary" data-add-lamp>${s.added?'Lepaskan lampu kedua':'Tambahkan lampu paralel'}</button><button class="reset" data-reset>Atur ulang</button></div>`;
 if(m.id===3)controls=`<div class="range-grid">${range('v','Tegangan V',s.v,0,24,'V')}${range('r','Hambatan R',s.r,1,12,'Ω')}</div><div class="sim-controls"><span class="math-label">Geser untuk menguji I = V/R</span><button class="reset" data-reset>Kembali ke 12 V · 4 Ω</button></div>`;
 if(m.id===4)controls=`<div class="assembly-controls">${['Pasang saklar S','Pasang resistor utama','Hubungkan L₁–L₂','Hubungkan L₃–L₄'].map((label,i)=>`<button class="assembly-button" data-part="${i}" aria-pressed="${s.parts[i]}"><span class="step-mark">${s.parts[i]?'✓':i+1}</span>${label}</button>`).join('')}</div><div class="sim-controls">${switchControl('closed',s.closed,'Uji saklar',!s.parts[0])}<button class="reset" data-reset>Bongkar rangkaian</button></div>`;
 if(m.id===5)controls=`<div class="range-grid">${range('v','Sumber Vₛ',s.v,0,24,'V')}${range('r1','Resistor R₁',s.r1,1,12,'Ω')}${range('r2','Resistor R₂',s.r2,1,16,'Ω')}${range('r3','Resistor R₃',s.r3,1,16,'Ω')}${range('r4','Resistor R₄',s.r4,1,16,'Ω')}</div><div class="sim-controls">${switchControl('closed',s.closed,'Saklar S')}<button class="reset" data-reset>Nilai pada kartu</button></div>`;
 return `<div class="sim-top"><p class="panel-label"><span>02</span> Simulasi misi</p><span class="live-tag">SUMBER IDEAL</span></div><h2>${m.simTitle}</h2><p class="sim-instruction">${m.simInstruction}</p><div class="sim-board" id="circuit-view"></div>${controls}<div id="sim-results"></div><details class="model-details"><summary>Asumsi dan nilai simulasi</summary><p>${m.model}</p><p>Gerak titik menunjukkan arah arus konvensional secara ilustratif, bukan kecepatan elektron. Lampu dianggap memiliki hambatan tetap.</p></details>`;
}
function updateSimulation(){const m=missions[current-1],s=states[current-1].sim,c=physics.calculate(current,s);$('#circuit-view').innerHTML=diagram(current,s,c);let h='';
 if(current===1)h=`<div class="meter-grid">${meter('Arus lampu atas',fmt(c.upper),'A')}${meter('Arus lampu tengah',fmt(c.middle),'A',true)}${meter('Arus sumber',fmt(c.total),'A')}</div><div class="observation">${s.closed?'Saklar menutup jalur atas: kedua lampu menyala. Lampu atas lebih redup karena resistor seri membatasi arusnya.':'Jalur atas terputus: lampu atas padam. Lampu tengah tetap menyala karena jalurnya masih tertutup.'}</div>`;
 if(current===2)h=`<div class="meter-grid">${meter('Arus lampu 1',fmt(c.i1),'A',true)}${meter('Daya lampu 1',fmt(c.p1),'W',true)}${meter('Arus sumber',fmt(c.total),'A')}</div><div class="observation">${s.added?'Lampu 1 tetap sama terangnya. Arus total berubah dari 0,5 A menjadi 1 A; masing-masing cabang tetap mendapat 6 V.':'Lampu 1 mendapat 6 V: arusnya 0,5 A dan dayanya 3 W. Tambahkan cabang untuk membandingkan.'}</div>`;
 if(current===3)h=`<div class="graph-and-math"><div><div class="math-label">PERSAMAAN SAAT INI</div><div class="formula-large">I = V / R<br>= ${fmt(s.v)} / ${fmt(s.r)}<br>= <strong>${fmt(c.current)} A</strong></div></div>${graph(s)}</div><div class="observation">${s.v===12&&s.r===4?'Sesuai kartu: 12 V ÷ 4 Ω = 3 A. Periksa urutan simbol sekaligus angka pada setiap pilihan.':`Pada R = ${fmt(s.r)} Ω, arus berubah sebanding dengan tegangan. Jika V tetap, memperbesar hambatan akan memperkecil arus.`}</div>`;
 if(current===4)h=`<div class="meter-grid">${meter('Bagian terpasang',`${s.parts.filter(Boolean).length} / 4`)}${meter('Arus cabang atas',fmt(c.upper),'A')}${meter('Arus cabang bawah',fmt(c.lower),'A')}</div><div class="observation">${!s.parts.every(Boolean)?`${s.parts.filter(Boolean).length} dari 4 bagian terpasang. ${!s.parts[0]||!s.parts[1]?'Lengkapi saklar dan resistor pada jalur utama terlebih dahulu.':!s.parts[2]&&!s.parts[3]?'Hubungkan pasangan lampu pada salah satu cabang.':'Lengkapi kedua cabang agar sesuai deskripsi misi.'}`:!s.closed?'Susunan sudah lengkap. Tutup saklar untuk menguji rangkaian.':`Kedua cabang memiliki dua lampu seri. Arus total ${fmt(c.total)} A terbagi sama: ${fmt(c.upper)} A per cabang. Resistor utama dilalui arus total.`}</div>`;
 if(current===5)h=`<div class="meter-grid">${meter('R ekuivalen resistor',fmt(c.totalR),'Ω')}${meter('Arus total',fmt(c.total),'A',true)}${meter('Tegangan paralel',fmt(c.vp),'V')}</div><div class="equations"><div>R atas = R₂ + R₃ = <b>${fmt(c.upperR)} Ω</b><br>Rₚ = 1/(1/R atas + 1/R₄) = <b>${fmt(c.rp)} Ω</b></div><div>I atas = Vₚ/(R₂ + R₃) = <b>${fmt(c.upper)} A</b><br>I₄ = Vₚ/R₄ = <b>${fmt(c.lower)} A</b></div></div><div class="observation">${s.closed?`I total = I atas + I₄ = ${fmt(c.total)} A. Tegangan cabang paralel ${fmt(c.vp)} V; penurunan pada R₁ sebesar ${fmt(c.vr1)} V.`:'Saklar OFF: semua arus nol. Jaringan resistor tetap memiliki hambatan ekuivalen, tetapi jalur sumber terputus.'}</div>`;
 $('#sim-results').innerHTML=h;
 document.querySelectorAll('[data-range]').forEach(input=>{const key=input.dataset.range;const unit=key==='v'?'V':'Ω';$(`#value-${key}`).textContent=`${fmt(s[key])} ${unit}`;input.setAttribute('aria-valuetext',`${fmt(s[key])} ${unit}`);});
}
function scoreSummary(){return window.ElectraScoring.summary(states);}
function signed(n){return `${n>=0?'+':'−'}${Math.abs(n)}`;}
function renderScore(){
 const t=scoreSummary();
 $('#game-status').innerHTML=`<div class="score-main"><span>${t.completed===5?'SKOR AKHIR':'SKOR SEMENTARA'}</span><div><strong>${t.total}</strong><span>/ ${t.maximum} poin</span></div></div><div class="score-meta"><b>${t.completed} / 5 misi dinilai</b><span>Modal awal: 5 × 10 = 50 poin</span><small>Benar: +5 + keyakinan · Salah: −5 − keyakinan</small></div><button class="button subtle" id="open-score">Rekap poin</button>`;
 document.querySelectorAll('[data-section]').forEach(a=>{if(a.dataset.section===(view==='material'?'material':'game'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
}
function renderNav(){
 $('#mission-nav').innerHTML=missions.map(m=>{const r=states[m.id-1].result;return `<a href="#misi-${m.id}" class="mission-link ${view==='game'&&current===m.id?'active':''}" style="--mission-color:${m.color}" ${view==='game'&&current===m.id?'aria-current="page"':''}><span class="mission-num">${String(m.id).padStart(2,'0')}</span><span><strong>${m.label}</strong><small>${r?`${r.correct?'✓':'×'} ${r.score} poin`:m.short}</small></span></a>`;}).join('');
 const t=scoreSummary();$('#progress-text').textContent=`${t.completed} / 5`;$('#progress').value=t.completed;renderScore();
}
function scoreBreakdown(r){return `<div class="point-breakdown" aria-label="Perhitungan poin misi"><div><span>Modal misi</span><b>10</b></div><span class="point-op">${r.correct?'+':'−'}</span><div><span>Jawaban</span><b>5</b></div><span class="point-op">${r.correct?'+':'−'}</span><div><span>Keyakinan</span><b>${r.confidence}</b></div><span class="point-op">=</span><div class="point-total"><span>Poin misi</span><b>${r.score}</b></div></div>`;}
function renderAnswers(){
 const m=missions[current-1],s=states[current-1];
 $('#answers-content').innerHTML=`${s.practice?`<div class="practice-notice">Latihan ulang · poin pertandingan misi ini tetap <b>${s.result.score}</b>. Jawaban latihan tidak mengubah skor.</div>`:''}<div class="answer-grid">${m.options.map((o,i)=>{
 const ok=i===m.answer,title=s.revealed?o.title:`Pilihan kartu ${o.id}`;
 return `<article class="answer-card ${s.selection===i?'selected':''} ${s.revealed?(ok?'correct':'incorrect'):''}"><div class="answer-top"><span>Kartu ${o.id}</span>${s.revealed?tag(ok):''}</div>${imageButton(m.start+i+1,o.id,title)}<p class="answer-title">${s.revealed?o.title:m.label}</p><button class="choose-button" data-answer="${i}" aria-pressed="${s.selection===i}" ${s.revealed?'disabled':''}>${s.selection===i?'✓ Pilihanmu':s.revealed?'Sudah dibahas':'Pilih kartu ini'}</button>${s.revealed?`<div class="explanation ${ok?'':'wrong'}"><h3>${ok?'Mengapa benar?':'Mengapa salah?'}</h3><p>${o.reason}</p><div class="formula-box">${o.formula}</div></div>`:''}</article>`;
 }).join('')}</div>
 <section class="confidence-panel" aria-labelledby="confidence-title"><span class="confidence-icon" aria-hidden="true">∞</span><div><div class="confidence-heading"><h3 id="confidence-title">Seberapa yakin dengan pilihanmu?</h3><button class="text-button" data-card="27">Lihat kartu keyakinan</button></div><div class="confidence-options" role="group" aria-label="Tingkat keyakinan">${['Tidak yakin','Kurang yakin','Ragu-ragu','Yakin','Sangat yakin'].map((label,i)=>`<button data-confidence="${i+1}" aria-pressed="${s.confidence===i+1}" aria-label="${i+1}: ${label}" ${s.revealed?'disabled':''}><b>${i+1}</b><span>${label}</span></button>`).join('')}</div><p class="confidence-info">${s.practice?'Pada latihan ulang, pilihan keyakinan tidak mengubah poin.':'Jawaban benar: tambah nilai keyakinan. Jawaban salah: kurangi nilai keyakinan. Pilih sesuai keyakinanmu.'}</p></div></section>
 ${s.revealed?resultBanner(m,s):`<div class="answer-actions"><button id="check-answer" class="button primary" ${s.selection===null||s.confidence===null?'disabled':''}>${s.practice?'Periksa latihan':'Periksa & hitung poin'}</button><span class="action-hint">${s.selection===null?'Pilih satu jawaban dan tingkat keyakinanmu.':s.confidence===null?'Pilih keyakinan 1–5 sebelum memeriksa.':s.practice?'Latihan ini tidak mengubah poin pertandingan.':`Jika benar: ${15+s.confidence} poin. Jika salah: ${5-s.confidence} poin. Jawaban dikunci setelah diperiksa.`}</span></div>`}`;
 if(s.revealed&&scoreSummary().completed===5)$('#answers-content').insertAdjacentHTML('beforeend',`<div class="game-finished"><div><span>PERMAINAN SELESAI</span><h3>Skor akhir: ${scoreSummary().total} / 100</h3><p>${scoreSummary().correct} dari 5 misi dijawab benar. Lihat rekap untuk memeriksa perhitungan tiap misi.</p></div><button class="button primary" id="final-score">Lihat hasil lengkap</button></div>`);
}
function resultBanner(m,s){
 const ok=s.selection===m.answer;
 return `<div class="result-banner ${ok?'':'wrong'}" role="status"><span class="result-icon" aria-hidden="true">${ok?'✓':'×'}</span><div><h3>${s.practice?'Hasil latihan: ':''}${ok?'jawabanmu benar.':'jawabanmu belum tepat.'}</h3><p>Kartu yang benar: <b>${m.options[m.answer].id}</b>. Keyakinan yang dipilih: ${s.confidence}/5. ${s.practice?`Poin pertandingan tetap ${s.result.score}.`:'Rincian poin misi ini:'}</p>${s.practice?'':scoreBreakdown(s.result)}</div></div><div class="answer-actions"><button class="button subtle" id="retry-answer">Latihan ulang tanpa mengubah poin</button></div>`;
}
function renderScoreDialog(){
 const t=scoreSummary();
 $('#score-content').innerHTML=`<div class="recap-total"><span>${t.completed===5?'Skor akhir':'Skor sementara'}</span><strong>${t.total}<small> / 100</small></strong><p>${t.completed} dari 5 misi dinilai · ${t.correct} jawaban benar</p></div><div class="table-scroll"><table class="score-table"><caption>Modal 10 poin diberikan pada setiap misi.</caption><thead><tr><th>Misi</th><th>Hasil</th><th>Modal</th><th>Jawaban</th><th>Keyakinan</th><th>Poin</th></tr></thead><tbody>${missions.map((m,i)=>{const r=states[i].result;return `<tr><th>${m.id}<small>${m.label}</small></th><td>${r?(r.correct?'Benar':'Salah'):'Belum dijawab'}</td><td>10</td><td>${r?signed(r.answerDelta):'—'}</td><td>${r?`${r.confidence}/5 (${signed(r.confidenceDelta)})`:'—'}</td><td><b>${r?r.score:10}</b>${r?'':'<small>modal</small>'}</td></tr>`;}).join('')}</tbody><tfoot><tr><th colspan="5">Total ${t.completed===5?'akhir':'sementara'}</th><td><b>${t.total}</b></td></tr></tfoot></table></div><p class="model-note">Benar = 10 + 5 + keyakinan. Salah = 10 − 5 − keyakinan. Misi yang belum dijawab masih memegang modal 10 poin; selesaikan semua misi untuk memperoleh skor akhir.</p><div class="answer-actions"><button class="button subtle" id="request-restart">Mulai permainan baru</button><button class="button primary" data-close="score-dialog">${t.completed===5?'Tutup rekap':'Lanjutkan permainan'}</button></div><p class="session-note">Poin hanya berlaku selama sesi halaman ini. Memuat ulang halaman akan mengembalikan modal awal.</p>`;
}
function showScores(){renderScoreDialog();$('#score-dialog').showModal();}
function render(){
 renderNav();
 if(view==='material'){document.documentElement.style.setProperty('--accent','#69e5de');document.title='Materi Arus Listrik Searah — ELECTRA';$('#main').innerHTML=window.ELECTRA_MATERIAL;return;}
 const m=missions[current-1],s=states[current-1];document.documentElement.style.setProperty('--accent',m.color);document.title=`Misi ${current} · ${m.label} — ELECTRA`;
 $('#main').innerHTML=`<div class="mission-heading"><div><p class="eyebrow">MISI ${String(current).padStart(2,'0')} / 05 <span class="mission-points">${s.result?`${s.result.score} poin tercatat`:'Modal 10 poin'}</span></p><h1>${m.title}</h1><div class="representation">${m.label}</div></div><span class="large-number" aria-hidden="true">${String(current).padStart(2,'0')}</span></div><div class="workspace"><section class="panel source-panel" aria-label="Kartu misi ${current}"><p class="panel-label"><span>01</span> Kartu misi ${current}.1</p>${imageButton(m.start,`${current}.1`,m.label)}<details class="source-details" ${innerWidth<=700?'open':''}><summary>Baca teks misi</summary><p>${m.prompt}</p><p>${m.context}</p></details></section><section class="panel sim-panel" id="simulation" aria-label="${escape(m.simTitle)}">${simTemplate(m)}</section></div><section class="answers-section" aria-labelledby="answers-title"><div class="section-top"><div><span class="section-number">03 / HUBUNGKAN REPRESENTASINYA</span><h2 id="answers-title">Manakah kartu yang tepat?</h2><p>Pilih jawaban dan keyakinan, lalu periksa untuk melihat pembahasan.</p></div><span class="section-count">4 pilihan · 1 jawaban benar</span></div><div id="answers-content"></div></section><div class="next-row"><p>${current<5?`Selanjutnya: ${missions[current].label}`:'Tinjau semua misi melalui rekap poin, atau baca kembali materinya.'}</p><a class="button subtle" href="#${current<5?`misi-${current+1}`:'materi'}">${current<5?'Misi berikutnya':'Baca materi DC'}</a></div>`;
 renderAnswers();updateSimulation();
}
function rerenderSim(){if(view==='game'){$('#simulation').innerHTML=simTemplate(missions[current-1]);updateSimulation();}}
function chooseAnswer(index){if(!Number.isInteger(index)||index<0||index>3)throw new Error('Pilihan jawaban harus 0–3.');if(states[current-1].revealed)throw new Error('Jawaban telah diperiksa. Pilih Latihan ulang untuk berlatih tanpa mengubah skor.');states[current-1].selection=index;renderAnswers();}
function chooseConfidence(level){if(!Number.isInteger(level)||level<1||level>5)throw new Error('Keyakinan harus 1–5.');if(states[current-1].revealed)throw new Error('Jawaban dan keyakinan sudah dikunci.');states[current-1].confidence=level;renderAnswers();}
function reveal(){
 const s=states[current-1],m=missions[current-1];
 if(s.selection===null||s.confidence===null)throw new Error('Pilih jawaban dan tingkat keyakinan dahulu.');
 if(s.revealed)return;
 if(!s.result)s.result=Object.freeze({...window.ElectraScoring.mission(s.selection===m.answer,s.confidence),selection:s.selection});
 s.revealed=true;renderAnswers();renderNav();
 const chip=$('.mission-points');if(chip)chip.textContent=`${s.result.score} poin tercatat`;
}
function openCard(n){
 const dialog=$('#card-dialog');let title='',body='',code='';
 if(n===27){title='Kartu keyakinan';code='KEYAKINAN & POIN';body='<h3>Seberapa yakin kamu?</h3><p>1 Tidak yakin · 2 Kurang yakin · 3 Ragu-ragu · 4 Yakin · 5 Sangat yakin.</p><p>Jika jawaban benar, angka keyakinan ditambahkan. Jika jawaban salah, angka itu dikurangkan.</p><div class="formula-box">Benar: 10 + 5 + keyakinan<br>Salah: 10 − 5 − keyakinan</div><p>Contoh keyakinan 4: jawaban benar mendapat 19 poin; jawaban salah mendapat 1 poin. Jawaban pertama tiap misi dihitung satu kali.</p>';}
 else {const m=missions.find(m=>n>=m.start&&n<=m.start+4);if(!m)return;const idx=n-m.start;
  if(idx===0){title=`Kartu misi ${m.id}.1`;code=m.label;body=`<h3>${m.title}</h3><p>${m.prompt}</p><p>${m.context}</p><div class="formula-box">Modal awal misi: 10 poin.</div>`;}
  else {const o=m.options[idx-1],revealed=states[m.id-1].revealed,ok=idx-1===m.answer;title=`Kartu ${o.id}`;code=m.label;body=revealed?`<h3>${o.title}</h3><p>${o.description}</p>${tag(ok)}<p style="margin-top:15px">${o.reason}</p><div class="formula-box">${o.formula}</div>`:`<h3>Pilihan kartu ${o.id}</h3><p>Amati isi kartu, lalu tentukan jawaban dan tingkat keyakinan di halaman misi.</p><p>Pembahasan seluruh pilihan terbuka setelah jawaban diperiksa.</p>`;}
 }
 $('#dialog-title').textContent=title;$('#dialog-content').innerHTML=`<div class="dialog-card-layout"><img src="${cardPath(n)}" alt="${escape(title)}" width="744" height="1039"><div class="dialog-text"><span class="tag">${code}</span>${body}</div></div>`;dialog.showModal();dialog.scrollTop=0;
}
function navigate(id){if(!Number.isInteger(id)||id<1||id>5)throw new Error('Nomor misi harus 1–5.');if(current!==id||view!=='game'){current=id;view='game';history.replaceState(null,'',`#misi-${id}`);render();window.scrollTo({top:0,behavior:'instant'});}}
function routeFromHash(){
 const hash=location.hash;
 if(hash.startsWith('#materi')){const changed=view!=='material';view='material';if(changed)render();if(hash==='#materi')window.scrollTo({top:0,behavior:'instant'});else document.getElementById(hash.slice(1))?.scrollIntoView({behavior:'smooth',block:'start'});return;}
 const id=Number(hash.match(/^#misi-([1-5])$/)?.[1]||1);
 if(id!==current||view!=='game'){current=id;view='game';render();window.scrollTo({top:0,behavior:'instant'});}
}
function startNewGame(){
 for(const [i,s]of states.entries())Object.assign(s,{selection:null,confidence:null,revealed:false,result:null,practice:false,sim:physics.defaults(i+1)});
 document.querySelectorAll('dialog[open]').forEach(d=>d.close());current=1;view='game';history.replaceState(null,'','#misi-1');render();window.scrollTo({top:0,behavior:'instant'});
}
function changeSimulation(input){const s=states[current-1].sim;const allowed={1:{closed:'boolean'},2:{added:'boolean'},3:{v:[0,24],r:[1,12]},4:{closed:'boolean',parts:'parts'},5:{closed:'boolean',v:[0,24],r1:[1,12],r2:[1,16],r3:[1,16],r4:[1,16]}}[current];
 const next={...s};for(const [key,value]of Object.entries(input)){const spec=allowed[key];if(!spec)throw new Error(`Pengaturan ${key} tidak tersedia pada misi ini.`);if(spec==='boolean'){if(typeof value!=='boolean')throw new Error(`${key} harus boolean.`);}else if(spec==='parts'){if(!Array.isArray(value)||value.length!==4||value.some(v=>typeof v!=='boolean'))throw new Error('parts harus berisi empat boolean.');}else if(typeof value!=='number'||!Number.isInteger(value)||value<spec[0]||value>spec[1])throw new Error(`${key} di luar batas simulasi.`);next[key]=Array.isArray(value)?[...value]:value;}
 if(current===4&&!next.parts[0])next.closed=false;states[current-1].sim=next;rerenderSim();return physics.calculate(current,next);}
document.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.close){$('#'+b.dataset.close).close();return;}if(b.dataset.card){openCard(Number(b.dataset.card));return;}if(b.dataset.answer!==undefined){chooseAnswer(Number(b.dataset.answer));$(`[data-answer="${b.dataset.answer}"]`).focus({preventScroll:true});return;}if(b.dataset.confidence){chooseConfidence(Number(b.dataset.confidence));$(`[data-confidence="${b.dataset.confidence}"]`).focus({preventScroll:true});return;}
 if(b.dataset.switch){const key=b.dataset.switch;changeSimulation({[key]:!states[current-1].sim[key]});$(`[data-switch="${key}"]`).focus({preventScroll:true});return;}
 if(b.hasAttribute('data-add-lamp')){changeSimulation({added:!states[1].sim.added});$('[data-add-lamp]').focus({preventScroll:true});return;}
 if(b.dataset.part!==undefined){const parts=[...states[3].sim.parts];parts[Number(b.dataset.part)]=!parts[Number(b.dataset.part)];changeSimulation({parts});$(`[data-part="${b.dataset.part}"]`).focus({preventScroll:true});return;}
 if(b.hasAttribute('data-reset')){states[current-1].sim=physics.defaults(current);rerenderSim();$('[data-reset]').focus({preventScroll:true});return;}
 if(b.id==='check-answer'){reveal();$('#answers-title').scrollIntoView({behavior:'smooth',block:'start'});return;}
 if(b.id==='retry-answer'){Object.assign(states[current-1],{selection:null,confidence:null,revealed:false,practice:true});renderAnswers();renderNav();$('#answers-title').scrollIntoView({behavior:'smooth',block:'start'});return;}
 if(b.id==='open-score'||b.id==='final-score'){showScores();return;}
 if(b.id==='request-restart'){$('#score-dialog').close();$('#restart-dialog').showModal();return;}
 if(b.id==='confirm-restart'){startNewGame();return;}
 if(b.id==='help-button')$('#help-dialog').showModal();
});
document.addEventListener('input',e=>{if(e.target.matches('[data-range]')){const key=e.target.dataset.range;states[current-1].sim[key]=Number(e.target.value);updateSimulation();}});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
window.addEventListener('hashchange',routeFromHash);
render();
if(view==='material'&&location.hash!=='#materi')document.getElementById(location.hash.slice(1))?.scrollIntoView();

// Optional browser tools share the same state and actions as the visible controls.
const context=document.modelContext;
if(context?.registerTool){const lifecycle=new AbortController();const register=(tool)=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
 register({name:'read_electra_mission',description:'Read the current ELECTRA mission, selected answer, confidence, locked first-attempt score, total score, simulation settings and computed measurements.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({view,score:scoreSummary(),mission:current,title:missions[current-1].title,prompt:missions[current-1].prompt,...structuredClone(states[current-1]),measurements:physics.calculate(current,states[current-1].sim)})});
 register({name:'navigate_electra_mission',description:'Open a mission from 1 through 5 in ELECTRA.',inputSchema:{type:'object',properties:{mission:{type:'integer',minimum:1,maximum:5}},required:['mission'],additionalProperties:false},annotations:{readOnlyHint:false},execute:({mission})=>{navigate(mission);return {mission:current,title:missions[current-1].title};}});
 register({name:'configure_electra_simulation',description:'Change the current simulation using the visible controls. M1: closed. M2: added. M3: v (0–24), r (1–12). M4: parts (four booleans), closed. M5: v (0–24), r1 (1–12), r2/r3/r4 (1–16), closed. Values are integers; switches are booleans.',inputSchema:{type:'object',properties:{settings:{type:'object',properties:{closed:{type:'boolean'},added:{type:'boolean'},parts:{type:'array',items:{type:'boolean'},minItems:4,maxItems:4},v:{type:'integer',minimum:0,maximum:24},r:{type:'integer',minimum:1,maximum:12},r1:{type:'integer',minimum:1,maximum:12},r2:{type:'integer',minimum:1,maximum:16},r3:{type:'integer',minimum:1,maximum:16},r4:{type:'integer',minimum:1,maximum:16}},additionalProperties:false}},required:['settings'],additionalProperties:false},annotations:{readOnlyHint:false},execute:({settings})=>{if(!settings||typeof settings!=='object'||Array.isArray(settings))throw new Error('Pengaturan tidak valid.');if(view!=='game')navigate(current);const measurements=changeSimulation(settings);return {mission:current,settings:structuredClone(states[current-1].sim),measurements};}});
 register({name:'submit_electra_answer',description:'Submit an answer and confidence, award points once per mission, and reveal explanations. Practice retries preserve the locked first score.',inputSchema:{type:'object',properties:{card:{type:'string'},confidence:{type:'integer',minimum:1,maximum:5}},required:['card','confidence'],additionalProperties:false},annotations:{readOnlyHint:false},execute:({card,confidence})=>{const m=missions[current-1],i=m.options.findIndex(o=>o.id===card);if(i<0||!Number.isInteger(confidence)||confidence<1||confidence>5)throw new Error('Kartu atau keyakinan tidak valid.');if(states[current-1].revealed)throw new Error('Jawaban telah diperiksa. Gunakan Latihan ulang tanpa mengubah poin.');if(view!=='game')navigate(current);chooseAnswer(i);chooseConfidence(confidence);reveal();return {mission:current,missionScore:states[current-1].result.score,totalScore:scoreSummary().total,practice:states[current-1].practice,correct:i===m.answer,correctCard:m.options[m.answer].id,explanation:m.options[i].reason};}});
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
})();
