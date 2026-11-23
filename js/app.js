const LOGO_SRC = 'img/logo.png';
(function(){
'use strict';

/* ================= UTIL ================= */
const $ = (s,r=document)=>r.querySelector(s);
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,3200)}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const koma=n=>String(n).replace('.',',');

/* ================= IKON ================= */
const IC = {
 home:'<svg viewBox="0 0 24 24"><path d="M3 11 12 3l9 8M5 9.500V20h5v-6h4v6h5V9.500"/></svg>',
 dash:'<svg viewBox="0 0 24 24"><path d="M3 20h18M7 20v-5M12 20V8M17 20v-9"/></svg>',
 sign:'<svg viewBox="0 0 24 24"><path d="M12 3v18M7 21h10M6 5h10l2 2.500-2 2.500H6zM18 12H8l-2 2.500L8 17h10z"/></svg>',
 globe:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
 road:'<svg viewBox="0 0 24 24"><path d="M8 3 4 21M16 3l4 18M12 4v3M12 11v3M12 18v3"/></svg>'
};
const KAT_COLOR={Peringatan:'#D97706',Larangan:'#DC2626',Perintah:'#2563EB',Petunjuk:'#10B981'};
function signSVG(kat,size=44){
  const c=KAT_COLOR[kat]||'#444';
  if(kat==='Peringatan') return `<svg width="${size}" height="${size}" viewBox="0 0 48 48"><path d="M24 5 3 42h42L24 5z" fill="#facc15" stroke="${c}" stroke-width="4" stroke-linejoin="round"/><rect x="22" y="18" width="4" height="12" fill="#111"/><circle cx="24" cy="35" r="2.300" fill="#111"/></svg>`;
  if(kat==='Larangan')   return `<svg width="${size}" height="${size}" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#fff" stroke="${c}" stroke-width="6"/><path d="M10 38 38 10" stroke="${c}" stroke-width="5"/></svg>`;
  if(kat==='Perintah')   return `<svg width="${size}" height="${size}" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="${c}"/><path d="M24 36V14m0 0-8 9m8-9 8 9" stroke="#fff" stroke-width="4.500" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="6" fill="${c}"/><text x="24" y="33" text-anchor="middle" font-size="26" font-weight="700" fill="#fff" font-family="Arial">i</text></svg>`;
}

/* ================= DATA DUMMY ================= */
const KECAMATAN = [
 ['Ampelgading',-8.18,112.87],['Bantur',-8.30,112.59],['Bululawang',-8.10,112.63],['Dampit',-8.21,112.77],['Dau',-7.91,112.55],
 ['Donomulyo',-8.28,112.43],['Gedangan',-8.30,112.65],['Gondanglegi',-8.19,112.63],['Jabung',-7.90,112.75],['Kalipare',-8.17,112.46],
 ['Karangploso',-7.84,112.60],['Kasembon',-7.78,112.34],['Kepanjen',-8.13,112.56],['Kromengan',-8.11,112.50],['Lawang',-7.75,112.69],
 ['Ngajum',-8.07,112.53],['Ngantang',-7.86,112.35],['Pagak',-8.25,112.54],['Pagelaran',-8.20,112.60],['Pakis',-7.94,112.68],
 ['Pakisaji',-8.03,112.59],['Poncokusumo',-8.00,112.80],['Pujon',-7.84,112.44],['Singosari',-7.82,112.65],['Sumbermanjing Wetan',-8.32,112.70],
 ['Sumberpucung',-8.14,112.49],['Tajinan',-8.02,112.65],['Tirtoyudo',-8.27,112.81],['Tumpang',-7.97,112.74],['Turen',-8.16,112.71],
 ['Wagir',-7.97,112.55],['Wajak',-8.09,112.74],['Wonosari',-8.06,112.46]
];
const RUAS = [
 ['Jalan Raya Contoh Utara','Jalan Nasional'],['Jalan Arteri Contoh Selatan','Jalan Nasional'],['Jalan Penghubung Contoh Barat','Jalan Provinsi'],
 ['Jalan Raya Contoh Timur','Jalan Provinsi'],['Jalan Lingkar Contoh 1','Jalan Kabupaten'],['Jalan Lingkar Contoh 2','Jalan Kabupaten'],['Jalan Lingkar Contoh 3','Jalan Kabupaten']
];
const RAMBU = [
 ['p1a','Peringatan','Peringatan Tikungan Tajam ke Kiri'],['p2a','Peringatan','Peringatan Tanjakan Curam'],['p19h','Peringatan','Peringatan Bagian Jalan Berbahaya / Lainnya'],
 ['l3c','Larangan','Larangan Putar Balik (U-Turn)'],['l4b','Larangan','Larangan Parkir Kendaraan (No Parking)'],['l6','Larangan','Batas Kecepatan Maksimum'],
 ['pr1b','Perintah','Perintah Wajib Belok Kiri'],['pr3a','Perintah','Perintah Jalur Khusus Sepeda'],
 ['pt8','Petunjuk','Petunjuk Tempat Parkir Resmi'],['pt9e','Petunjuk','Petunjuk Stasiun Pengisian Bahan Bakar (SPBU)'],['pt10','Petunjuk','Papan Nama Jalan']
];
const KONDISI = ['Baik','Baik','Baik','Baik','Baik','Sedang','Rusak'];
const KATEGORI = [
 {key:'Rambu',nama:'RAMBU LALU LINTAS',judul:'Rambu Lalu Lintas',unit:'Unit',kode:'RB',jml:20},
 {key:'Marka',nama:'MARKA JALAN',judul:'Marka Jalan',unit:'Titik',kode:'MK',jml:8},
 {key:'APILL',nama:'APILL',judul:'APILL',unit:'Unit',kode:'AP',jml:5},
 {key:'Guardrail',nama:'GUARDRAIL',judul:'Guardrail',unit:'Unit',kode:'GR',jml:7},
 {key:'Delineator',nama:'DELINEATOR',judul:'Delineator',unit:'Unit',kode:'DL',jml:6},
 {key:'Cermin',nama:'CERMIN TIKUNGAN',judul:'Cermin Tikungan',unit:'Unit',kode:'CM',jml:6}
];
const TIPE={Rambu:'Rambu',Marka:'Marka Jalan',APILL:'APILL',Guardrail:'Guardrail',Delineator:'Delineator',Cermin:'Cermin Tikungan'};
function buildData(){
  const R=rng(20261123), out=[], pick=a=>a[Math.floor(R()*a.length)];
  KATEGORI.forEach(k=>{
    for(let i=1;i<=k.jml;i++){
      const kec=pick(KECAMATAN), ruas=pick(RUAS), kond=pick(KONDISI);
      const lat=+(kec[1]+(R()-.5)*.03).toFixed(7), lng=+(kec[2]+(R()-.5)*.03).toFixed(7);
      const it={id:k.kode+'-'+String(i).padStart(4,'0'),kat:k.key,kecamatan:kec[0],ruas:ruas[0],status:ruas[1],
        km:'',lat,lng,kondisi:kond,arah:'',posisi:pick(['Kiri','Kanan','Median']),
        ket:kond==='Baik'?'Kondisi layak, tidak ada temuan.':(k.key==='Rambu'?'Daun rambu rusak':'Perlu tindak lanjut pada pemeriksaan berikutnya.')};
      if(k.key==='Rambu'){const r=pick(RAMBU);Object.assign(it,{kode:r[0],klas:r[1],jenis:r[2]})}
      else if(k.key==='Marka') it.jenis=pick(['Garis Membujur Putus-putus','Garis Membujur Utuh','Zebra Cross','Garis Melintang']);
      else if(k.key==='APILL') it.jenis=pick(['Traffic Light 3 Aspek','Warning Light','Lampu Penyeberangan']);
      else if(k.key==='Guardrail') it.jenis='Besi Guardrail';
      else if(k.key==='Delineator') it.jenis='Patok Delineator';
      else it.jenis='Cermin Tikungan';
      out.push(it);
    }
  });
  return out;
}
let ASET = buildData();
ASET.filter(a=>a.kat==='Rambu')[1].id='RB-0102'; // contoh data "sudah ada" untuk simulasi impor

let USERS = [
 {nama:'Administrator Contoh',user:'admin01',pass:'admin123',role:'Admin',aktif:true},
 {nama:'Staf Bidang Contoh',user:'staf01',pass:'staf123',role:'Staf',aktif:true},
 {nama:'Staf Bidang Contoh 2',user:'staf02',pass:'staf123',role:'Staf',aktif:false},
 {nama:'Petugas Lapangan 1',user:'petugas01',pass:'petugas123',role:'Petugas',aktif:true},
 {nama:'Petugas Lapangan 2',user:'petugas02',pass:'petugas123',role:'Petugas',aktif:true}
];
const PERAN={Admin:'Admin',Staf:'Staf',Petugas:'Petugas lapangan'};

/* ================= STATE ================= */
const S={user:null,view:'peta',active:'BERANDA',expanded:'',cats:{},kec:'',kecOpen:false,batas:false,ruas:{nasional:false,provinsi:false,kabupaten:false}};
KATEGORI.forEach(k=>S.cats[k.key]=false);
let map=null, layers={}, imp={file:'',rows:null};

/* ================= MASUK ================= */
$('#form-login').addEventListener('submit',e=>{
  e.preventDefault();
  const u=$('#u').value.trim().toLowerCase(), p=$('#p').value, err=$('#err');
  const acc=USERS.find(x=>x.user===u&&x.pass===p);
  err.hidden=false;
  if(!acc){err.textContent='Nama pengguna atau kata sandi salah.';return}
  if(!acc.aktif){err.textContent='Akun ini dinonaktifkan. Hubungi Admin.';return}
  if(acc.role==='Petugas'){err.textContent='Akun Petugas hanya dapat dipakai di aplikasi ponsel untuk input lapangan.';return}
  err.hidden=true;S.user=acc;resetPeta();
  $('#login').hidden=true;$('#app').hidden=false;
  initMap();go('peta','BERANDA');refreshMap();tutupMenu();
});
function logout(){S.user=null;$('#app').hidden=true;$('#login').hidden=false;$('#u').value='';$('#p').value='';closeModal()}
function resetPeta(){KATEGORI.forEach(k=>S.cats[k.key]=false);S.kec='';S.kecOpen=false;S.batas=false;S.expanded='';Object.keys(S.ruas).forEach(k=>S.ruas[k]=false)}

/* ================= SIDEBAR ================= */
const isAdmin=()=>S.user&&S.user.role==='Admin';
function item(act,label,icon,exp){
  return `<div class="menu-item ${S.active===act?'active':''}" data-a="${exp?'exp':'menu'}" data-v="${act}"><div class="menu-left">${icon}<span>${label}</span></div>${exp?`<span class="chev">${S.expanded===act?'▾':'‹'}</span>`:''}</div>`;
}
function renderSidebar(){
  const sb=$('#sidebar'), firstOn=KATEGORI.find(k=>S.cats[k.key]);
  let h=`<div class="sb-head"><img src="${LOGO_SRC}" alt="Logo"><p class="sb-title">Dinas Perhubungan</p><p class="sb-sub">Kabupaten Malang</p></div>
    ${item('BERANDA','BERANDA',IC.home)}${item('DASBOR','DASBOR',IC.dash)}${item('PERLENGKAPAN','PERLENGKAPAN JALAN',IC.sign,true)}`;
  if(S.expanded==='PERLENGKAPAN'){
    h+='<div class="sub">'+KATEGORI.map(k=>{
      let r=`<div class="cat ${S.cats[k.key]?'on':''}" data-a="cat" data-v="${k.key}"><div class="cb"></div><span>${k.nama}</span></div>`;
      if(firstOn&&firstOn.key===k.key){
        r+=`<div class="filter"><i>Filter Wilayah.</i><button class="btn-kec" data-a="kecbtn">▾ ${S.kec?esc(S.kec):'Pilih Kecamatan'}</button></div>`;
        if(S.kecOpen)r+=`<div class="kec-list"><div data-a="kecpick" data-v="" class="${S.kec?'':'pilih'}">Semua kecamatan</div>${KECAMATAN.map(c=>`<div data-a="kecpick" data-v="${c[0]}" class="${S.kec===c[0]?'pilih':''}">${c[0]}</div>`).join('')}</div>`;
      }
      return r}).join('')+'</div>';
  }
  h+=`${item('BATAS','BATAS WILAYAH',IC.globe)}${item('RUAS','RUAS JALAN',IC.road,true)}`;
  if(S.expanded==='RUAS'){
    h+='<div class="sub">'+[['nasional','JALAN NASIONAL','#FACC15'],['provinsi','JALAN PROVINSI','#2563EB'],['kabupaten','JALAN KABUPATEN','#EF4444']]
      .map(r=>`<div class="cat ${S.ruas[r[0]]?'on':''}" data-a="ruas" data-v="${r[0]}"><div class="cb"></div><span>${r[1]}</span><span class="sw" style="background:${r[2]}"></span></div>`).join('')+'</div>';
  }
  h+=`<div class="sb-bottom"><p class="sb-label">Manajemen Data</p>
    <button class="btn-side ${S.active==='IMPOR'?'aktif':''}" data-a="menu" data-v="IMPOR">IMPOR EXCEL (.XLSX)</button>
    <button class="btn-side" data-a="unduh">UNDUH LAPORAN EXCEL</button>
    ${isAdmin()?`<button class="btn-side ${S.active==='PENGGUNA'?'aktif':''}" data-a="menu" data-v="PENGGUNA">KELOLA PENGGUNA</button>`:''}</div>
    <div class="sb-foot"><div class="rolebox"><b>${esc(S.user.user)} · ${S.user.role}</b><button class="btn-keluar" data-a="keluar">Keluar</button></div></div>`;
  sb.innerHTML=h;
}
/* ---- menu samping di ponsel ---- */
function bukaMenu(){$('#sidebar').classList.add('buka');$('#scrim').hidden=false}
function tutupMenu(){$('#sidebar').classList.remove('buka');$('#scrim').hidden=true}
$('#burger').addEventListener('click',bukaMenu);
$('#scrim').addEventListener('click',tutupMenu);
$('#sidebar').addEventListener('click',e=>{
  const t=e.target.closest('[data-a]'); if(!t)return;
  const a=t.dataset.a,v=t.dataset.v;
  if(a==='menu'||a==='unduh'||a==='keluar')tutupMenu();
  if(a==='menu'){
    if(v==='BERANDA'){resetPeta();go('peta','BERANDA');refreshMap();map&&map.setView([-8.1319,112.5714],10)}
    else if(v==='DASBOR')go('dasbor','DASBOR');
    else if(v==='IMPOR')go('impor','IMPOR');
    else if(v==='PENGGUNA')go('pengguna','PENGGUNA');
    else if(v==='BATAS'){S.batas=!S.batas;go('peta',S.batas?'BATAS':'BERANDA');refreshMap()}
  }
  else if(a==='exp'){S.expanded=S.expanded===v?'':v;go('peta',S.expanded?v:'BERANDA')}
  else if(a==='cat'){S.cats[v]=!S.cats[v];if(!KATEGORI.some(k=>S.cats[k.key]))S.kecOpen=false;go('peta','PERLENGKAPAN');refreshMap()}
  else if(a==='ruas'){S.ruas[v]=!S.ruas[v];go('peta','RUAS');refreshMap()}
  else if(a==='kecbtn'){S.kecOpen=!S.kecOpen;renderSidebar()}
  else if(a==='kecpick'){S.kec=v;S.kecOpen=false;refreshMap();
    const k=KECAMATAN.find(x=>x[0]===S.kec); if(k)map.setView([k[1],k[2]],12); else map.setView([-8.1319,112.5714],10);
    renderSidebar()}
  else if(a==='unduh'){unduh()}
  else if(a==='keluar'){logout()}
});

/* ================= TAMPILAN ================= */
function go(view,active){
  if(view==='pengguna'&&!isAdmin()){toast('Anda tidak memiliki akses ke menu ini.');view='peta';active='BERANDA'}
  S.view=view;S.active=active;
  const p=view==='peta';
  $('#map').hidden=!p;$('#legend').hidden=!p;
  $('#view-dasbor').hidden=view!=='dasbor';$('#view-impor').hidden=view!=='impor';$('#view-pengguna').hidden=view!=='pengguna';
  if(p){setTimeout(()=>map&&map.invalidateSize(),50)}
  if(view==='dasbor')renderDasbor();
  if(view==='impor')renderImpor();
  if(view==='pengguna')renderPengguna();
  renderSidebar();
}

/* ================= PETA ================= */
function condColor(k){const c=String(k||'').toLowerCase();
  if(c==='rusak')return'#EF4444';if(c==='sedang')return'#F97316';return'#6366F1'}
function markerIcon(a){
  const col=condColor(a.kondisi), st='stroke="#0A3161" stroke-width="2.5"';
  const svg={
   Rambu:`<svg viewBox="0 0 24 24" width="20" height="20"><path d="M1 21h22L12 2 1 21z" fill="${col}" ${st}/></svg>`,
   Marka:`<svg viewBox="0 0 24 24" width="20" height="20"><rect x="2" y="8" width="20" height="8" rx="2" fill="${col}" ${st}/></svg>`,
   APILL:`<svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="4" fill="${col}" ${st}/></svg>`,
   Guardrail:`<svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 6h18v12H3z" fill="${col}" ${st}/></svg>`,
   Delineator:`<svg viewBox="0 0 24 24" width="20" height="20"><rect x="8" y="2" width="8" height="20" rx="3" fill="${col}" ${st}/></svg>`,
   Cermin:`<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="9" fill="${col}" ${st}/><circle cx="12" cy="12" r="3.5" fill="#fff"/></svg>`
  }[a.kat];
  return L.divIcon({className:'custom-map-marker',html:`<div style="filter:drop-shadow(0 3px 5px rgba(0,0,0,.5))">${svg}</div>`,iconSize:[24,24],iconAnchor:[12,12],popupAnchor:[0,-12]});
}
const ABU=['#EF4444','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#F97316','#6366F1','#84CC16','#06B6D4','#F43F5E','#0EA5E9'];
function warnaWil(n=''){let h=0;for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h);return ABU[Math.abs(h)%ABU.length]}
const gaya0={fillColor:'transparent',fillOpacity:0,weight:1.2,opacity:.85,color:'#475569'};
function jenisRuas(f){const h=String(f.properties.highway||'').toLowerCase();
  if(['motorway','trunk','primary'].includes(h))return'nasional';
  if(['secondary'].includes(h))return'provinsi';return'kabupaten'}
function initMap(){
  if(map){map.invalidateSize();return}
  map=L.map('map',{zoomControl:true}).setView([-8.1319,112.5714],10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap',maxZoom:19}).addTo(map);
  L.geoJSON(MALANG,{style:gaya0,onEachFeature:(f,l)=>{
    l.bindPopup(`<b>KECAMATAN<br>${esc((f.properties.NAME_3||'').toUpperCase())}</b>`);
    l.on({mouseover:e=>e.target.setStyle({weight:2.2,color:'#2563EB'}),mouseout:e=>e.target.setStyle(gaya0)});
  }}).addTo(map);
  layers.batas=L.layerGroup().addTo(map);layers.ruas=L.layerGroup().addTo(map);layers.mark=L.layerGroup().addTo(map);
  map.on('popupopen',e=>{const b=e.popup.getElement().querySelector('[data-detail]');
    if(b)b.onclick=()=>{openDetail(ASET.find(x=>x.id===b.dataset.detail))}});
  refreshMap();
}
function refreshMap(){
  if(!map)return;
  layers.batas.clearLayers();layers.ruas.clearLayers();layers.mark.clearLayers();
  if(S.batas)L.geoJSON(MALANG,{interactive:false,style:f=>({fillColor:warnaWil(f.properties.NAME_3),fillOpacity:.5,weight:0,color:'transparent'})}).addTo(layers.batas);
  if(S.ruas.nasional||S.ruas.provinsi||S.ruas.kabupaten){
    L.geoJSON(JALAN,{
      filter:f=>S.ruas[jenisRuas(f)],
      style:f=>({nasional:{color:'#FACC15',weight:5,opacity:.9},provinsi:{color:'#2563EB',weight:4,opacity:.9},kabupaten:{color:'#EF4444',weight:3,opacity:.9}})[jenisRuas(f)],
      onEachFeature:(f,l)=>l.bindPopup(`<b>${esc((f.properties.name||'Ruas').toUpperCase())}</b><br>Status: <i>${jenisRuas(f)}</i><br><small>(contoh ruas dummy)</small>`)
    }).addTo(layers.ruas);
  }
  KATEGORI.forEach(k=>{
    if(!S.cats[k.key])return;
    ASET.filter(a=>a.kat===k.key&&(!S.kec||a.kecamatan===S.kec)).forEach(a=>{
      const ikon=a.kat==='Rambu'?`<div style="text-align:center;margin:8px 0">${signSVG(a.klas,46)}</div>`:'<div style="height:6px"></div>';
      L.marker([a.lat,a.lng],{icon:markerIcon(a)}).addTo(layers.mark).bindPopup(
        `<div style="width:236px"><b>${esc(TIPE[a.kat])}</b>${a.kode?' ('+esc(a.kode.toUpperCase())+')':''}${ikon}
        Kec: ${esc(a.kecamatan)}<br>Ruas: ${esc(a.ruas)}<br>Status Jalan: ${esc(a.status)}<br>Jenis: ${esc(a.jenis)}<br>Kondisi: ${esc(a.kondisi)}
        <button class="btn-popup" data-detail="${a.id}">DETAIL LENGKAP</button></div>`);
    });
  });
}

/* ================= DASBOR ================= */
function stat(arr){let baik=0,sedang=0,rusak=0;
  arr.forEach(a=>{if(a.kondisi==='Rusak')rusak++;else if(a.kondisi==='Sedang')sedang++;else baik++});
  return{total:arr.length,baik,sedang,rusak}}
function pie(v){
  const tot=v.baik+v.sedang+v.rusak||1, cols=['#EF4444','#F97316','#10B981'], vals=[v.rusak,v.sedang,v.baik], R=84, cx=100, cy=100;
  let ang=-Math.PI/2,seg='';
  vals.forEach((n,i)=>{ if(!n)return;
    if(n===tot){seg+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${cols[i]}" stroke="#555" stroke-width="1.5"/>`;return}
    const a2=ang+n/tot*2*Math.PI, x1=cx+R*Math.cos(ang), y1=cy+R*Math.sin(ang), x2=cx+R*Math.cos(a2), y2=cy+R*Math.sin(a2);
    seg+=`<path d="M${cx} ${cy}L${x1.toFixed(2)} ${y1.toFixed(2)}A${R} ${R} 0 ${n/tot>.5?1:0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z" fill="${cols[i]}" stroke="#555" stroke-width="1.5"/>`;ang=a2});
  const pc=n=>Math.round(n/tot*100)+'%';
  return `<div style="text-align:center"><svg width="200" height="200" viewBox="0 0 200 200" style="margin:6px 0 10px">${seg}</svg>
    <div style="font-size:13px;line-height:1.9">Persentase kondisi:<br>
    <span style="white-space:nowrap;color:#EF4444">■ Rusak ${v.rusak} (${pc(v.rusak)})</span> &nbsp;<span style="white-space:nowrap;color:#F97316">■ Sedang ${v.sedang} (${pc(v.sedang)})</span> &nbsp;<span style="white-space:nowrap;color:#10B981">■ Baik ${v.baik} (${pc(v.baik)})</span></div></div>`;
}
function renderDasbor(){
  const all=stat(ASET), per=KATEGORI.map(k=>({k,s:stat(ASET.filter(a=>a.kat===k.key))}));
  const WN=['#D97706','#2563EB','#10B981','#8B5CF6','#EC4899','#F59E0B'];
  const kartu=(p,i)=>`<div class="card" style="border-left-color:${WN[i]}"><div class="t">${p.k.nama}</div><div class="v" style="color:${WN[i]}">${p.s.total}</div><div class="s">Baik: ${p.s.baik} | Sedang: ${p.s.sedang} | Rusak: ${p.s.rusak}</div></div>`;
  $('#view-dasbor').innerHTML=`<div class="toolbar"><div><h2>DASBOR STATISTIK INVENTARIS JALAN</h2><p class="lead">Monitoring &amp; rekapitulasi kondisi perlengkapan jalan Kabupaten Malang (contoh data)</p></div>
    <button class="btn" data-go="peta">KEMBALI KE PETA</button></div>
    <div class="cards"><div class="card"><div class="t">Total keseluruhan</div><div class="v">${all.total}</div><div class="s">&nbsp;</div></div>
    ${per.map(kartu).join('')}
    <div class="card putus"><div class="t">Perlu dipelihara</div><div class="v">${all.sedang+all.rusak}</div><div class="s">Sedang atau Rusak</div></div></div>
    <div class="grid-bawah"><div class="panel"><h3>Rincian kategori dan kondisi perlengkapan jalan</h3><table><thead><tr><th>No</th><th>Kategori</th><th>Jumlah</th><th>Baik</th><th>Sedang</th><th>Rusak</th></tr></thead><tbody>
    ${per.map((p,i)=>`<tr><td>${i+1}</td><td><b>${p.k.judul}</b></td><td>${p.s.total} ${p.k.unit}</td><td style="color:#10B981;font-weight:700">${p.s.baik}</td><td style="color:#F97316;font-weight:700">${p.s.sedang}</td><td style="color:#EF4444;font-weight:700">${p.s.rusak}</td></tr>`).join('')}</tbody></table></div>
    <div class="panel"><h3>Diagram Lingkaran</h3>${pie(all)}</div></div>`;
}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){resetPeta();go('peta','BERANDA');refreshMap()}});

/* ================= DETAIL ================= */
function openModal(html,lebar){const m=$('#modal');m.innerHTML=`<div class="mbox ${lebar?'lebar':''}">${html}</div>`;m.hidden=false}
function closeModal(){$('#modal').hidden=true;$('#modal').innerHTML=''}
$('#modal').addEventListener('mousedown',e=>{if(e.target.id==='modal')closeModal()});
function openDetail(a){
  if(!a)return;
  const p=(l,v)=>`<p><b>${l}:</b> ${v?esc(v):'-'}</p>`, rb=a.kat==='Rambu';
  openModal(`<h3>DETAIL LENGKAP INVENTARIS</h3><div class="detail">
    ${rb?`<div class="ikon">${signSVG(a.klas,76)}</div>`:''}
    ${p('Kategori Utama',a.kat==='Rambu'?'Rambu':TIPE[a.kat])}${p('Tipe Inventaris',TIPE[a.kat])}${rb?p('Kode Rambu',a.kode.toUpperCase()):''}${p('Nama / Jenis',a.jenis)}${rb?p('Klasifikasi Rambu',a.klas):''}
    ${p('Kecamatan',a.kecamatan)}${p('Ruas Jalan',a.ruas)}${p('Status Jalan',a.status)}${p('Lokasi / KM',a.km)}${p('Titik Koordinat',koma(a.lat)+', '+koma(a.lng))}
    ${p('Arah Jalur',a.arah)}${p('Posisi Penempatan',a.posisi)}${p('Kondisi Fisik',a.kondisi)}${p('Keterangan',a.ket)}
    <div class="foto"><h4>Tautan Foto:</h4><a id="foto">Buka Foto Asli di Tab Baru</a></div></div>
    <button class="btn gelap btn-block" data-close>TUTUP</button>`,true);
  $('#foto').onclick=()=>toast('Foto lapangan tidak tersedia pada prototipe (data dummy).');
}
$('#modal').addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeModal()});

/* ================= IMPOR / UNDUH ================= */
const CONTOH_IMPOR=[[2,'RB-0101','Peringatan'],[3,'RB-0102','Larangan'],[4,'RB-0103','Perintah']];
function renderImpor(){
  const v=$('#view-impor');
  v.innerHTML=`<div class="kartu"><h3>Impor Excel</h3>
    <p>Pindahkan data lama (ekspor aplikasi desktop atau templat). Baris yang sudah ada dilewati.</p>
    <div class="drop" id="drop">${imp.file?esc(imp.file):'Pilih berkas .xlsx'}</div>
    <input type="file" id="fileimp" accept=".xlsx,.xls,.csv" hidden>
    <div class="baris-btn"><button class="btn putih" id="tpl">Unduh Templat</button><button class="btn" id="prev">Pratinjau &amp; Impor</button></div>
    <div id="hasil"></div></div>`;
  if(imp.rows)tabelImpor();
  $('#drop').onclick=()=>$('#fileimp').click();
  $('#fileimp').onchange=ev=>{const f=ev.target.files[0];if(f){imp.file=f.name;imp.rows=null;renderImpor()}};
  $('#tpl').onclick=()=>download('Templat_Impor_Inventaris.csv','Kode,Kategori,Jenis,Kecamatan,Ruas Jalan,Status Jalan,Lokasi,Latitude,Longitude,Kondisi,Keterangan\n');
  $('#prev').onclick=()=>{
    if(!imp.file)imp.file='contoh_data_impor.xlsx (simulasi)';
    imp.rows=CONTOH_IMPOR.map(r=>({baris:r[0],kode:r[1],jenis:r[2],ada:ASET.some(a=>a.id===r[1])}));
    renderImpor();
  };
}
function tabelImpor(){
  const siap=imp.rows.filter(r=>!r.ada).length;
  $('#hasil').innerHTML=`<table><thead><tr><th>Baris</th><th>Kode</th><th>Jenis</th><th>Status</th></tr></thead><tbody>
    ${imp.rows.map(r=>`<tr><td>${r.baris}</td><td>${r.kode}</td><td>${r.jenis}</td><td>${r.ada?'Sudah ada, dilewati':'Siap diimpor'}</td></tr>`).join('')}</tbody></table>
    <div style="margin-top:12px"><button class="btn gelap" id="goimp" ${siap?'':'disabled'}>Impor ${siap} baris</button> <span style="font-size:12px;color:#666;margin-left:8px">${siap?'(simulasi: berkas tidak dibaca, memakai data dummy)':'Tidak ada baris baru untuk diimpor.'}</span></div>`;
  $('#goimp').onclick=()=>{
    const R=rng(Date.now()),kd={Peringatan:['p1a','Peringatan Tikungan Tajam ke Kiri'],Larangan:['l3c','Larangan Putar Balik (U-Turn)'],Perintah:['pr1b','Perintah Wajib Belok Kiri']};
    imp.rows.filter(r=>!r.ada).forEach(r=>{const k=KECAMATAN[Math.floor(R()*KECAMATAN.length)],d=kd[r.jenis];
      ASET.push({id:r.kode,kat:'Rambu',kecamatan:k[0],ruas:RUAS[4][0],status:RUAS[4][1],km:'',lat:+(k[1]+(R()-.5)*.03).toFixed(7),lng:+(k[2]+(R()-.5)*.03).toFixed(7),kondisi:'Baik',arah:'',posisi:'Kiri',ket:'Hasil impor Excel (simulasi).',kode:d[0],klas:r.jenis,jenis:d[1]})});
    toast(siap+' baris berhasil diimpor (simulasi).');imp.rows.forEach(r=>r.ada=true);refreshMap();renderImpor();
  };
}
function download(nama,teks){const b=new Blob(['﻿'+teks],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=nama;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function unduh(){
  const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  const head=['Kode','Kategori','Jenis','Kecamatan','Ruas Jalan','Status Jalan','Lokasi','Latitude','Longitude','Kondisi','Keterangan'];
  const rows=ASET.map(a=>[a.id,TIPE[a.kat],a.jenis,a.kecamatan,a.ruas,a.status,a.km,a.lat,a.lng,a.kondisi,a.ket].map(q).join(','));
  download('Laporan_Inventaris_Perlengkapan_Jalan_'+new Date().toISOString().slice(0,10)+'.csv',head.join(',')+'\n'+rows.join('\n'));
  toast('Laporan diunduh (format CSV untuk prototipe; dapat dibuka di Excel).');
}

/* ================= KELOLA PENGGUNA ================= */
function renderPengguna(){
  $('#view-pengguna').innerHTML=`<div class="kartu"><h3>Kelola Pengguna (khusus admin)</h3>
    <table><thead><tr><th>Nama</th><th>Nama pengguna</th><th>Peran</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
    ${USERS.map((u,i)=>`<tr><td>${esc(u.nama)}</td><td>${esc(u.user)}</td><td>${PERAN[u.role]}</td><td>${u.aktif?'Aktif':'Nonaktif'}</td>
      <td class="aksi"><a data-sunting="${i}">Sunting</a>${u.role==='Admin'&&u.user===S.user.user?'':` · <a data-toggle="${i}">${u.aktif?'Nonaktifkan':'Aktifkan'}</a>`}</td></tr>`).join('')}
    </tbody></table><div style="margin-top:12px"><button class="btn" id="tambah">+ Tambah Pengguna</button></div></div>`;
  $('#tambah').onclick=()=>formUser();
}
$('#view-pengguna').addEventListener('click',e=>{
  const s=e.target.closest('[data-sunting]'),t=e.target.closest('[data-toggle]');
  if(s)formUser(+s.dataset.sunting);
  if(t){const u=USERS[+t.dataset.toggle];u.aktif=!u.aktif;renderPengguna();toast('Akun '+u.user+(u.aktif?' diaktifkan.':' dinonaktifkan.'))}
});
function formUser(i){
  const u=i==null?null:USERS[i];
  openModal(`<h3>${u?'Sunting Pengguna':'Tambah Pengguna'}</h3><form id="fu">
    <label>Nama lengkap</label><input id="fn" required value="${u?esc(u.nama):''}">
    <label>Nama pengguna</label><input id="fk" required pattern="[a-z0-9_.]{3,}" title="Huruf kecil, angka, titik atau garis bawah (min. 3 karakter)" value="${u?esc(u.user):''}" ${u?'readonly':''}>
    <label>Peran</label><select id="fr">${['Staf','Admin','Petugas'].map(r=>`<option value="${r}" ${u&&u.role===r?'selected':''}>${PERAN[r]}</option>`).join('')}</select>
    <label>${u?'Kata sandi baru (kosongkan bila tidak diubah)':'Kata sandi awal'}</label><input id="fp" type="password" ${u?'':'required'} minlength="6">
    <div style="display:flex;gap:8px;margin-top:16px"><button type="button" class="btn putih" style="flex:1" data-close>Batal</button><button class="btn gelap" style="flex:1">Simpan</button></div></form>`);
  $('#fu').onsubmit=ev=>{ev.preventDefault();
    const k=$('#fk').value.trim().toLowerCase();
    if(u){u.nama=$('#fn').value.trim();u.role=$('#fr').value;if($('#fp').value)u.pass=$('#fp').value;closeModal();renderPengguna();toast('Data '+k+' diperbarui.');return}
    if(USERS.some(x=>x.user===k)){toast('Nama pengguna sudah dipakai.');return}
    USERS.push({nama:$('#fn').value.trim(),user:k,pass:$('#fp').value,role:$('#fr').value,aktif:true});
    closeModal();renderPengguna();toast('Pengguna '+k+' ditambahkan.');
  };
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
})();