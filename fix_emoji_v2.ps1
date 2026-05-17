$utf8NoBOM = New-Object System.Text.UTF8Encoding $false
$base = Get-Location

# src/index.css
$content_src_index_css = @'

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

:root {
  --bg:       #f0faf4;
  --bg2:      #ffffff;
  --text:     #0d2010;
  --text2:    #5a7a5a;
  --border:   #c8e6c9;
  --card:     #ffffff;
  --shadow:   0 2px 20px rgba(0,100,0,0.09);
  --green:    #16a34a;
  --green-lt: #22c55e;
  --green-bg: #dcfce7;
}
[data-theme="dark"] {
  --bg:       #071209;
  --bg2:      #0f1e11;
  --text:     #d1f0d1;
  --text2:    #6a9a6a;
  --border:   #1c3a1e;
  --card:     #0f1e11;
  --shadow:   0 2px 20px rgba(0,0,0,0.45);
  --green:    #4ade80;
  --green-lt: #86efac;
  --green-bg: #14291a;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  transition: background 0.35s, color 0.35s;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

button { cursor: pointer; border: none; font-family: inherit; outline: none; }
input  { font-family: inherit; outline: none; }
a      { text-decoration: none; color: inherit; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.leaflet-container { z-index: 1; }

'@
[System.IO.File]::WriteAllText((Join-Path $base "src/index.css"), $content_src_index_css, $utf8NoBOM)

# src/main.jsx
$content_src_main_jsx = @'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

'@
[System.IO.File]::WriteAllText((Join-Path $base "src/main.jsx"), $content_src_main_jsx, $utf8NoBOM)

# src/context/AppContext.jsx
$content_src_context_AppContext_jsx = @'

import { createContext, useContext, useState, useEffect } from 'react';
const Ctx = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pp_user')); } catch { return null; }
  });
  const [dark, setDark] = useState(() => localStorage.getItem('pp_dark') === 'true');
  const [balance]  = useState(25750);
  const [points]   = useState(2575);
  const [collected] = useState(12.4); // kg
  const [txs] = useState([
    { id:1, type:'in',  amount:5000,  label:'Botol Plastik 2kg',      date:'10 Mei 2026', icon:'[Bottle]', kg:2.0 },
    { id:2, type:'in',  amount:3200,  label:'Kertas & Kardus 1.5kg',  date:'09 Mei 2026', icon:'[Box]', kg:1.5 },
    { id:3, type:'out', amount:10000, label:'Tarik ke GoPay',          date:'08 Mei 2026', icon:'[Cash]', kg:0   },
    { id:4, type:'in',  amount:7500,  label:'Kaleng Aluminium 1kg',   date:'07 Mei 2026', icon:'[Can]', kg:1.0 },
    { id:5, type:'in',  amount:2000,  label:'Kaca Botol 0.8kg',       date:'06 Mei 2026', icon:'[Jar]', kg:0.8 },
    { id:6, type:'in',  amount:4300,  label:'Plastik Keras 1.8kg',    date:'05 Mei 2026', icon:'[Bucket]', kg:1.8 },
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('pp_dark', dark);
  }, [dark]);

  const login  = (d) => { setUser(d); localStorage.setItem('pp_user', JSON.stringify(d)); };
  const logout = ()  => { setUser(null); localStorage.removeItem('pp_user'); };

  return (
    <Ctx.Provider value={{ user, login, logout, dark, setDark, balance, points, collected, txs }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);

'@
[System.IO.File]::WriteAllText((Join-Path $base "src/context/AppContext.jsx"), $content_src_context_AppContext_jsx, $utf8NoBOM)

# src/App.jsx
$content_src_App_jsx = @'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login    from './pages/Login';
import Register from './pages/Register';
import Home     from './pages/Home';

function Guard({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/"         element={<Guard><Home /></Guard>} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

'@
[System.IO.File]::WriteAllText((Join-Path $base "src/App.jsx"), $content_src_App_jsx, $utf8NoBOM)

# src/pages/Login.jsx
$content_src_pages_Login_jsx = @'

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const nav = useNavigate();
  const [f, setF]     = useState({ email: '', pass: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.email || !f.pass) { setErr('Mohon isi email dan password!'); return; }
    if (f.pass.length < 6)   { setErr('Password minimal 6 karakter!'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const name = f.email.split('@')[0].replace(/[._-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
    login({ name, email: f.email });
    nav('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #052e16 0%, #14532d 40%, #16a34a 75%, #4ade80 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative circles */}
      {[
        { w:300, h:300, top:'-80px', left:'-80px', op:0.08 },
        { w:200, h:200, bottom:'-60px', right:'-60px', op:0.08 },
        { w:150, h:150, top:'40%', right:'-40px', op:0.06 },
      ].map((c,i) => (
        <div key={i} style={{
          position:'absolute', width:c.w, height:c.h,
          top:c.top, bottom:c.bottom, left:c.left, right:c.right,
          background:'white', borderRadius:'50%', opacity:c.op, pointerEvents:'none'
        }} />
      ))}

      <div style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderRadius: '28px',
        padding: '44px 36px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
        position: 'relative', zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{
            width:'72px', height:'72px', background:'linear-gradient(135deg,#14532d,#22c55e)',
            borderRadius:'20px', margin:'0 auto 14px', display:'flex',
            alignItems:'center', justifyContent:'center', fontSize:'36px',
            boxShadow:'0 8px 24px rgba(34,197,94,0.35)'
          }}>[R]</div>
          <h1 style={{ fontSize:'26px', fontWeight:'900', color:'#14532d', letterSpacing:'-0.8px' }}>PilahPoin</h1>
          <p style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px' }}>Pilah sampah · Raih poin · Hidup bersih</p>
        </div>

        <form onSubmit={submit}>
          <label style={{ display:'block', fontSize:'13px', fontWeight:'700', color:'#374151', marginBottom:'8px' }}>
            Email
          </label>
          <input
            type="email" placeholder="nama@email.com"
            value={f.email} onChange={e=>setF({...f,email:e.target.value})}
            style={{
              width:'100%', padding:'13px 16px', marginBottom:'16px',
              border:'2px solid #e5e7eb', borderRadius:'14px', fontSize:'15px',
              background:'#f9fafb', transition:'border .2s',
            }}
            onFocus={e=>e.target.style.border='2px solid #22c55e'}
            onBlur={e=>e.target.style.border='2px solid #e5e7eb'}
          />
          <label style={{ display:'block', fontSize:'13px', fontWeight:'700', color:'#374151', marginBottom:'8px' }}>
            Password
          </label>
          <input
            type="password" placeholder="••••••••"
            value={f.pass} onChange={e=>setF({...f,pass:e.target.value})}
            style={{
              width:'100%', padding:'13px 16px', marginBottom:'20px',
              border:'2px solid #e5e7eb', borderRadius:'14px', fontSize:'15px',
              background:'#f9fafb', transition:'border .2s',
            }}
            onFocus={e=>e.target.style.border='2px solid #22c55e'}
            onBlur={e=>e.target.style.border='2px solid #e5e7eb'}
          />
          {err && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', fontSize:'13px', padding:'10px 14px', borderRadius:'10px', marginBottom:'16px' }}>
              [!] {err}
            </div>
          )}
          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'15px',
            background: loading ? '#86efac' : 'linear-gradient(135deg,#14532d,#22c55e)',
            color:'#fff', borderRadius:'14px', fontSize:'16px', fontWeight:'800',
            boxShadow:'0 6px 20px rgba(34,197,94,0.4)', transition:'.2s',
            letterSpacing:'0.2px'
          }}>
            {loading ? '[Wait] Memproses...' : '[Go] Masuk Sekarang'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'24px', fontSize:'14px', color:'#9ca3af' }}>
          Belum punya akun?{' '}
          <Link to="/register" style={{ color:'#16a34a', fontWeight:'800' }}>Daftar Gratis →</Link>
        </p>
      </div>
    </div>
  );
}

'@
[System.IO.File]::WriteAllText((Join-Path $base "src/pages/Login.jsx"), $content_src_pages_Login_jsx, $utf8NoBOM)

# src/pages/Register.jsx
$content_src_pages_Register_jsx = @'

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { login } = useApp();
  const nav = useNavigate();
  const [f, setF]     = useState({ name:'', email:'', phone:'', pass:'' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name||!f.email||!f.phone||!f.pass) { setErr('Semua field wajib diisi!'); return; }
    if (f.pass.length < 6) { setErr('Password minimal 6 karakter!'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    login({ name: f.name, email: f.email, phone: f.phone });
    nav('/');
  };

  const inp = {
    width:'100%', padding:'13px 16px', border:'2px solid #e5e7eb',
    borderRadius:'14px', fontSize:'15px', background:'#f9fafb',
    marginBottom:'14px', transition:'border .2s'
  };
  const lbl = { display:'block', fontSize:'13px', fontWeight:'700', color:'#374151', marginBottom:'7px' };

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(145deg,#052e16,#14532d,#16a34a,#4ade80)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'20px',
      position:'relative', overflow:'hidden'
    }}>
      <div style={{ position:'absolute', width:'250px', height:'250px', top:'-60px', right:'-60px', background:'rgba(255,255,255,0.07)', borderRadius:'50%' }} />
      <div style={{ position:'absolute', width:'180px', height:'180px', bottom:'-40px', left:'-40px', background:'rgba(255,255,255,0.07)', borderRadius:'50%' }} />

      <div style={{
        background:'rgba(255,255,255,0.97)', borderRadius:'28px',
        padding:'40px 36px', width:'100%', maxWidth:'420px',
        boxShadow:'0 32px 80px rgba(0,0,0,0.25)', position:'relative', zIndex:1
      }}>
        <div style={{ textAlign:'center', marginBottom:'30px' }}>
          <div style={{
            width:'64px', height:'64px', background:'linear-gradient(135deg,#14532d,#22c55e)',
            borderRadius:'18px', margin:'0 auto 12px', display:'flex',
            alignItems:'center', justifyContent:'center', fontSize:'30px',
            boxShadow:'0 8px 24px rgba(34,197,94,0.35)'
          }}>[R]</div>
          <h1 style={{ fontSize:'24px', fontWeight:'900', color:'#14532d', letterSpacing:'-0.5px' }}>Buat Akun</h1>
          <p style={{ fontSize:'13px', color:'#6b7280', marginTop:'4px' }}>Bergabung & mulai tukar sampahmu!</p>
        </div>

        <form onSubmit={submit}>
          <label style={lbl}>Nama Lengkap</label>
          <input style={inp} placeholder="Nama kamu"
            value={f.name} onChange={e=>setF({...f,name:e.target.value})}
            onFocus={e=>e.target.style.border='2px solid #22c55e'}
            onBlur={e=>e.target.style.border='2px solid #e5e7eb'} />

          <label style={lbl}>Email</label>
          <input style={inp} type="email" placeholder="nama@email.com"
            value={f.email} onChange={e=>setF({...f,email:e.target.value})}
            onFocus={e=>e.target.style.border='2px solid #22c55e'}
            onBlur={e=>e.target.style.border='2px solid #e5e7eb'} />

          <label style={lbl}>No. HP / WhatsApp</label>
          <input style={inp} type="tel" placeholder="08xxxxxxxxxx"
            value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}
            onFocus={e=>e.target.style.border='2px solid #22c55e'}
            onBlur={e=>e.target.style.border='2px solid #e5e7eb'} />

          <label style={lbl}>Password</label>
          <input style={inp} type="password" placeholder="Min. 6 karakter"
            value={f.pass} onChange={e=>setF({...f,pass:e.target.value})}
            onFocus={e=>e.target.style.border='2px solid #22c55e'}
            onBlur={e=>e.target.style.border='2px solid #e5e7eb'} />

          {err && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', fontSize:'13px', padding:'10px 14px', borderRadius:'10px', marginBottom:'14px' }}>
              [!] {err}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'15px', marginTop:'4px',
            background: loading ? '#86efac' : 'linear-gradient(135deg,#14532d,#22c55e)',
            color:'#fff', borderRadius:'14px', fontSize:'16px', fontWeight:'800',
            boxShadow:'0 6px 20px rgba(34,197,94,0.4)'
          }}>
            {loading ? '[Wait] Mendaftarkan...' : '[OK] Buat Akun Gratis'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'22px', fontSize:'14px', color:'#9ca3af' }}>
          Sudah punya akun?{' '}
          <Link to="/login" style={{ color:'#16a34a', fontWeight:'800' }}>Masuk →</Link>
        </p>
      </div>
    </div>
  );
}

'@
[System.IO.File]::WriteAllText((Join-Path $base "src/pages/Register.jsx"), $content_src_pages_Register_jsx, $utf8NoBOM)

# src/components/MapView.jsx
$content_src_components_MapView_jsx = @'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const POINTS = [
  { id:1, lat:-5.3971, lng:105.2668, name:'Bank Sampah Kedaton',       type:'Bank Sampah', hours:'Sen-Sab 08:00-16:00', phone:'0812-3456-7890', color:'#f59e0b' },
  { id:2, lat:-5.4294, lng:105.2612, name:'TPS3R Rajabasa',            type:'TPS3R',       hours:'Sen-Ming 07:00-17:00', phone:'0813-2345-6789', color:'#3b82f6' },
  { id:3, lat:-5.4510, lng:105.2784, name:'Bank Sampah Sukarame',      type:'Bank Sampah', hours:'Sen-Jum 08:00-15:00', phone:'0821-3456-7890', color:'#f59e0b' },
  { id:4, lat:-5.3852, lng:105.2512, name:'Dropbox PilahPoin – Enggal',type:'Dropbox',     hours:'24 Jam',               phone:'–',             color:'#22c55e' },
  { id:5, lat:-5.4680, lng:105.2340, name:'Bank Sampah Langkapura',    type:'Bank Sampah', hours:'Sen-Sab 09:00-16:00', phone:'0822-9876-5432', color:'#f59e0b' },
  { id:6, lat:-5.4120, lng:105.2900, name:'Dropbox PilahPoin – Way Halim', type:'Dropbox', hours:'24 Jam',              phone:'–',              color:'#22c55e' },
  { id:7, lat:-5.4350, lng:105.2450, name:'TPS3R Tanjung Senang',      type:'TPS3R',       hours:'Sen-Sab 07:00-16:00', phone:'0815-1234-5678', color:'#3b82f6' },
];

const mkIcon = (color) => L.divIcon({
  html: `<div style="
    width:28px;height:28px;
    background:${color};
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    border:3px solid white;
    box-shadow:0 3px 10px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [28,28], iconAnchor: [14,28], className:''
});

export default function MapView() {
  return (
    <div>
      <MapContainer
        center={[-5.42, 105.26]} zoom={12}
        style={{ height:'260px', borderRadius:'18px', overflow:'hidden', border:'1px solid var(--border)' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {POINTS.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={mkIcon(p.color)}>
            <Popup>
              <div style={{ fontFamily:'Plus Jakarta Sans,system-ui,sans-serif', minWidth:'190px', lineHeight:'1.5' }}>
                <div style={{ fontWeight:'800', fontSize:'14px', color:'#14532d', marginBottom:'4px' }}>{p.name}</div>
                <span style={{ background: p.color+'22', color: p.color, fontSize:'11px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px' }}>{p.type}</span>
                <div style={{ marginTop:'8px', fontSize:'12px', color:'#555' }}>
                  <div>[Jam] {p.hours}</div>
                  <div>[Tel] {p.phone}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div style={{ display:'flex', gap:'16px', marginTop:'10px', flexWrap:'wrap' }}>
        {[['#f59e0b','Bank Sampah'],['#3b82f6','TPS3R'],['#22c55e','Dropbox 24 Jam']].map(([c,l])=>(
          <div key={l} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'var(--text2)' }}>
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:c, flexShrink:0 }}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

'@
[System.IO.File]::WriteAllText((Join-Path $base "src/components/MapView.jsx"), $content_src_components_MapView_jsx, $utf8NoBOM)

# src/components/HamburgerMenu.jsx
$content_src_components_HamburgerMenu_jsx = @'

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function HamburgerMenu({ open, onClose }) {
  const { user, logout, dark, setDark, balance, points, collected } = useApp();
  const nav = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const doLogout = () => {
    logout();
    nav('/login');
  };

  const menuItems = [
    { icon:'[User]', label:'Profil Saya',       section:'profil'  },
    { icon:'[Chart]', label:'Statistik Sampah',  section:'stats'   },
    { icon:'[Bell]', label:'Notifikasi',         section:'notif'   },
    { icon:'[Gift]', label:'Voucher & Hadiah',  section:'voucher' },
    { icon:'[S]', label:'Metode Pembayaran', section:'pay'     },
    { icon:'[?]', label:'Pusat Bantuan',     section:'help'    },
    { icon:'[i]', label:'Tentang Aplikasi',  section:'about'   },
  ];

  const sectionContent = {
    profil: (
      <div>
        <h3 style={{ fontWeight:'800', fontSize:'16px', marginBottom:'16px' }}>Profil Saya</h3>
        <div style={{ background:'var(--bg)', borderRadius:'14px', padding:'16px', marginBottom:'12px' }}>
          <div style={{ fontSize:'13px', color:'var(--text2)', marginBottom:'4px' }}>Nama</div>
          <div style={{ fontWeight:'700' }}>{user?.name}</div>
        </div>
        <div style={{ background:'var(--bg)', borderRadius:'14px', padding:'16px', marginBottom:'12px' }}>
          <div style={{ fontSize:'13px', color:'var(--text2)', marginBottom:'4px' }}>Email</div>
          <div style={{ fontWeight:'700' }}>{user?.email}</div>
        </div>
        <div style={{ background:'var(--bg)', borderRadius:'14px', padding:'16px' }}>
          <div style={{ fontSize:'13px', color:'var(--text2)', marginBottom:'4px' }}>No. HP</div>
          <div style={{ fontWeight:'700' }}>{user?.phone || '–'}</div>
        </div>
      </div>
    ),
    stats: (
      <div>
        <h3 style={{ fontWeight:'800', fontSize:'16px', marginBottom:'16px' }}>Statistik Sampah</h3>
        {[
          { label:'Total Sampah Terkumpul', value:`${collected} kg`, icon:'[R]', color:'#22c55e' },
          { label:'Total Poin Diraih',      value:`${points.toLocaleString()} poin`, icon:'[P]', color:'#f59e0b' },
          { label:'Total Saldo Diterima',   value:`Rp ${balance.toLocaleString('id-ID')}`, icon:'[Rp]', color:'#3b82f6' },
          { label:'Transaksi Berhasil',     value:'6 transaksi', icon:'[Doc]', color:'#8b5cf6' },
        ].map(s=>(
          <div key={s.label} style={{ background:'var(--bg)', borderRadius:'14px', padding:'14px 16px', marginBottom:'10px', display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'40px', height:'40px', background:s.color+'22', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize:'12px', color:'var(--text2)' }}>{s.label}</div>
              <div style={{ fontWeight:'800', fontSize:'16px', color:s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop:'16px' }}>
          <div style={{ fontSize:'13px', fontWeight:'700', color:'var(--text2)', marginBottom:'8px' }}>Progres Bulan Ini</div>
          <div style={{ background:'var(--border)', borderRadius:'8px', height:'10px', overflow:'hidden' }}>
            <div style={{ width:'62%', height:'100%', background:'linear-gradient(90deg,#14532d,#22c55e)', borderRadius:'8px' }} />
          </div>
          <div style={{ fontSize:'12px', color:'var(--text2)', marginTop:'6px' }}>7.7kg dari target 12kg</div>
        </div>
      </div>
    ),
    notif: (
      <div>
        <h3 style={{ fontWeight:'800', fontSize:'16px', marginBottom:'16px' }}>Notifikasi</h3>
        {[
          { title:'Poin baru masuk! 🎉', desc:'Kamu mendapat 500 poin dari Botol Plastik', time:'2 jam lalu', unread:true },
          { title:'Promo Weekend [R]',    desc:'Tukar sampah Sabtu-Minggu, nilai 2x lipat!', time:'1 hari lalu', unread:true },
          { title:'Tarik saldo sukses', desc:'Rp10.000 berhasil dikirim ke GoPay kamu', time:'3 hari lalu', unread:false },
        ].map((n,i)=>(
          <div key={i} style={{ background: n.unread ? 'var(--green-bg)' : 'var(--bg)', borderRadius:'14px', padding:'14px 16px', marginBottom:'10px', borderLeft: n.unread ? '3px solid var(--green)' : 'none' }}>
            <div style={{ fontWeight:'700', fontSize:'14px', marginBottom:'4px' }}>{n.title}</div>
            <div style={{ fontSize:'13px', color:'var(--text2)', marginBottom:'4px' }}>{n.desc}</div>
            <div style={{ fontSize:'12px', color:'var(--text2)' }}>{n.time}</div>
          </div>
        ))}
      </div>
    ),
    voucher: (
      <div>
        <h3 style={{ fontWeight:'800', fontSize:'16px', marginBottom:'16px' }}>Voucher & Hadiah</h3>
        {[
          { name:'GoPay Cashback 10%', poin:'1.000 poin', exp:'30 Jun 2026', emoji:'[S]', available:true },
          { name:'Diskon Tokopedia 15%', poin:'1.500 poin', exp:'15 Jul 2026', emoji:'🛒', available:true },
          { name:'Voucher PLN Rp20.000', poin:'2.000 poin', exp:'31 Mei 2026', emoji:'⚡', available:false },
        ].map((v,i)=>(
          <div key={i} style={{ background:'var(--bg)', borderRadius:'14px', padding:'14px 16px', marginBottom:'10px', display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ fontSize:'28px' }}>{v.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:'700', fontSize:'14px' }}>{v.name}</div>
              <div style={{ fontSize:'12px', color:'var(--text2)' }}>{v.poin} · Exp: {v.exp}</div>
            </div>
            <button style={{ padding:'6px 12px', borderRadius:'8px', fontSize:'12px', fontWeight:'700', background: v.available ? 'var(--green)' : '#e5e7eb', color: v.available ? 'white' : '#9ca3af' }}>
              {v.available ? 'Tukar' : 'Habis'}
            </button>
          </div>
        ))}
      </div>
    ),
    about: (
      <div>
        <h3 style={{ fontWeight:'800', fontSize:'16px', marginBottom:'16px' }}>Tentang PilahPoin</h3>
        <div style={{ textAlign:'center', padding:'20px 0', marginBottom:'16px' }}>
          <div style={{ fontSize:'52px', marginBottom:'12px' }}>[R]</div>
          <div style={{ fontWeight:'900', fontSize:'22px', color:'var(--green)' }}>PilahPoin</div>
          <div style={{ fontSize:'13px', color:'var(--text2)', marginTop:'4px' }}>Versi 1.0.0</div>
        </div>
        <div style={{ background:'var(--bg)', borderRadius:'14px', padding:'16px', fontSize:'14px', color:'var(--text2)', lineHeight:'1.7' }}>
          PilahPoin adalah platform digital yang memudahkan masyarakat menukar sampah terpilah menjadi saldo e-wallet berbasis AI Image Recognition. Bersama kita jaga lingkungan! [Leaf]
        </div>
      </div>
    ),
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={()=>{ setActiveSection(null); onClose(); }}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, backdropFilter:'blur(4px)' }} />

      {/* Drawer */}
      <div style={{
        position:'fixed', top:0, left:0, bottom:0, width:'300px',
        background:'var(--bg2)', zIndex:201,
        display:'flex', flexDirection:'column',
        boxShadow:'6px 0 40px rgba(0,0,0,0.25)',
      }}>
        {/* Header gradient */}
        <div style={{
          background:'linear-gradient(145deg,#052e16,#14532d,#22c55e)',
          padding:'48px 20px 24px', position:'relative', overflow:'hidden'
        }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', background:'rgba(255,255,255,0.08)', borderRadius:'50%' }} />
          <div style={{
            width:'60px', height:'60px', background:'rgba(255,255,255,0.2)',
            borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'28px', marginBottom:'12px', border:'2px solid rgba(255,255,255,0.3)'
          }}>[R]</div>
          <div style={{ color:'white', fontWeight:'900', fontSize:'17px', letterSpacing:'-0.3px' }}>{user?.name}</div>
          <div style={{ color:'rgba(255,255,255,0.75)', fontSize:'13px', marginTop:'2px' }}>{user?.email}</div>
          <div style={{ marginTop:'12px', display:'flex', gap:'10px' }}>
            <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'10px', padding:'6px 12px', fontSize:'12px', color:'white', fontWeight:'700' }}>
              [P] {(2575).toLocaleString()} Poin
            </div>
          </div>
        </div>

        {/* Sub-section content or menu list */}
        <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {activeSection ? (
            <div style={{ padding:'16px' }}>
              <button onClick={()=>setActiveSection(null)} style={{ background:'var(--bg)', border:'none', borderRadius:'10px', padding:'8px 14px', fontSize:'13px', fontWeight:'700', color:'var(--text)', marginBottom:'16px', display:'flex', alignItems:'center', gap:'6px' }}>
                ← Kembali
              </button>
              {sectionContent[activeSection]}
            </div>
          ) : (
            <>
              {menuItems.map(item=>(
                <button key={item.label} onClick={()=>setActiveSection(item.section)}
                  style={{
                    width:'100%', padding:'14px 20px',
                    display:'flex', alignItems:'center', gap:'14px',
                    background:'none', textAlign:'left',
                    borderBottom:'1px solid var(--border)',
                  }}>
                  <span style={{ fontSize:'20px', width:'28px', textAlign:'center' }}>{item.icon}</span>
                  <span style={{ fontSize:'15px', fontWeight:'600', color:'var(--text)', flex:1 }}>{item.label}</span>
                  <span style={{ color:'var(--text2)', fontSize:'16px' }}>›</span>
                </button>
              ))}

              {/* Dark Mode Toggle */}
              <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <span style={{ fontSize:'20px', width:'28px', textAlign:'center' }}>{dark ? '[Moon]' : '[Sun]'}</span>
                  <span style={{ fontSize:'15px', fontWeight:'600', color:'var(--text)' }}>Mode {dark ? 'Gelap' : 'Terang'}</span>
                </div>
                <button onClick={()=>setDark(!dark)} style={{
                  width:'52px', height:'28px', borderRadius:'14px',
                  background: dark ? '#22c55e' : '#d1d5db',
                  position:'relative', transition:'.3s'
                }}>
                  <div style={{
                    position:'absolute', top:'4px',
                    left: dark ? '26px' : '4px',
                    width:'20px', height:'20px',
                    background:'white', borderRadius:'50%',
                    transition:'.3s', boxShadow:'0 1px 4px rgba(0,0,0,0.25)'
                  }}/>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Logout button */}
        {!activeSection && (
          <div style={{ padding:'16px' }}>
            <button onClick={doLogout} style={{
              width:'100%', padding:'14px',
              background:'#fee2e2', color:'#dc2626',
              borderRadius:'14px', fontWeight:'800', fontSize:'15px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'
            }}>
              [Out] Keluar dari Akun
            </button>
          </div>
        )}
      </div>
    </>
  );
}

'@
[System.IO.File]::WriteAllText((Join-Path $base "src/components/HamburgerMenu.jsx"), $content_src_components_HamburgerMenu_jsx, $utf8NoBOM)

# src/pages/Home.jsx
$content_src_pages_Home_jsx = @'

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import MapView from '../components/MapView';
import HamburgerMenu from '../components/HamburgerMenu';

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background:'var(--card)', border:'1px solid var(--border)',
      borderRadius:'16px', padding:'14px', flex:1,
      boxShadow:'var(--shadow)', textAlign:'center'
    }}>
      <div style={{ fontSize:'22px', marginBottom:'6px' }}>{icon}</div>
      <div style={{ fontSize:'18px', fontWeight:'900', color }}>{value}</div>
      <div style={{ fontSize:'11px', color:'var(--text2)', marginTop:'2px', fontWeight:'600' }}>{label}</div>
    </div>
  );
}

export default function Home() {
  const { user, balance, points, collected, txs } = useApp();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning]   = useState(false);

  const mockScan = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 2200));
    const results = [
      { jenis:'Botol PET (Plastik)', kg:0.8, nilai:2000, confidence:94 },
      { jenis:'Kaleng Aluminium',    kg:0.3, nilai:2250, confidence:97 },
      { jenis:'Kardus Bekas',        kg:1.2, nilai:1440, confidence:91 },
    ];
    setScanResult(results[Math.floor(Math.random()*results.length)]);
    setScanning(false);
  };

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 18) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background:'var(--bg2)', borderBottom:'1px solid var(--border)',
        padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between',
        boxShadow:'var(--shadow)'
      }}>
        <button onClick={()=>setMenuOpen(true)} style={{
          background:'var(--bg)', borderRadius:'10px', padding:'8px',
          display:'flex', alignItems:'center', justifyContent:'center',
          border:'1px solid var(--border)'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div style={{ fontWeight:'900', fontSize:'18px', color:'var(--green)', letterSpacing:'-0.5px' }}>
          [R] PilahPoin
        </div>

        <button style={{ background:'var(--bg)', borderRadius:'10px', padding:'8px', position:'relative', border:'1px solid var(--border)', display:'flex' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={{ position:'absolute', top:'6px', right:'6px', width:'8px', height:'8px', background:'#ef4444', borderRadius:'50%', border:'2px solid var(--bg2)' }}/>
        </button>
      </nav>

      {/* ── Content ── */}
      <div style={{ padding:'20px', maxWidth:'500px', margin:'0 auto', paddingBottom:'40px' }}>

        {/* Greeting */}
        <div style={{ marginBottom:'20px' }}>
          <p style={{ fontSize:'14px', color:'var(--text2)', fontWeight:'600' }}>{greet()},</p>
          <h2 style={{ fontSize:'24px', fontWeight:'900', letterSpacing:'-0.5px' }}>{user?.name} [Hi]</h2>
        </div>

        {/* Balance Card */}
        <div style={{
          background:'linear-gradient(145deg,#052e16,#14532d 40%,#22c55e)',
          borderRadius:'24px', padding:'24px', marginBottom:'16px',
          color:'white', position:'relative', overflow:'hidden',
          boxShadow:'0 12px 40px rgba(34,197,94,0.3)'
        }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'140px', height:'140px', background:'rgba(255,255,255,0.07)', borderRadius:'50%' }}/>
          <div style={{ position:'absolute', bottom:'-50px', right:'60px', width:'100px', height:'100px', background:'rgba(255,255,255,0.05)', borderRadius:'50%' }}/>
          <p style={{ fontSize:'13px', opacity:0.8, fontWeight:'600', marginBottom:'6px' }}>[S] Saldo E-Wallet</p>
          <p style={{ fontSize:'34px', fontWeight:'900', letterSpacing:'-1px', marginBottom:'16px' }}>
            Rp {balance.toLocaleString('id-ID')}
          </p>
          <div style={{ display:'flex', gap:'24px' }}>
            <div>
              <p style={{ fontSize:'11px', opacity:0.7, marginBottom:'2px' }}>POIN TERKUMPUL</p>
              <p style={{ fontSize:'16px', fontWeight:'800' }}>[P] {points.toLocaleString()}</p>
            </div>
            <div style={{ width:'1px', background:'rgba(255,255,255,0.2)' }}/>
            <div>
              <p style={{ fontSize:'11px', opacity:0.7, marginBottom:'2px' }}>SAMPAH TERKUMPUL</p>
              <p style={{ fontSize:'16px', fontWeight:'800' }}>[R] {collected} kg</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px' }}>
          {[
            { icon:'[Cam]', label:'Tukar Sampah',  bg:'#dcfce7', c:'#14532d', fn:()=>setScanModal(true) },
            { icon:'[S]', label:'Tarik Saldo',   bg:'#dbeafe', c:'#1d4ed8', fn:()=>alert('Fitur tarik saldo segera hadir!') },
            { icon:'[Doc]', label:'Riwayat',       bg:'#fef3c7', c:'#92400e', fn:()=>document.getElementById('riwayat')?.scrollIntoView({behavior:'smooth'}) },
          ].map(a=>(
            <button key={a.label} onClick={a.fn} style={{
              background:'var(--card)', border:'1px solid var(--border)',
              borderRadius:'18px', padding:'16px 8px',
              display:'flex', flexDirection:'column', alignItems:'center', gap:'8px',
              boxShadow:'var(--shadow)', transition:'transform .15s',
            }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
            >
              <div style={{ width:'46px', height:'46px', background:a.bg, borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>
                {a.icon}
              </div>
              <span style={{ fontSize:'12px', fontWeight:'700', color:'var(--text)', textAlign:'center', lineHeight:'1.3' }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Status Cards */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'24px' }}>
          <StatCard icon="[R]" label="Total Sampah"  value={`${collected}kg`}       color="var(--green)"/>
          <StatCard icon="[P]" label="Total Poin"    value={points.toLocaleString()} color="#f59e0b"/>
          <StatCard icon="[Box]" label="Transaksi"     value="6x"                      color="#8b5cf6"/>
        </div>

        {/* AI Scan Banner */}
        <div onClick={()=>setScanModal(true)} style={{
          background:'linear-gradient(135deg,#1e3a8a,#3b82f6,#60a5fa)',
          borderRadius:'20px', padding:'20px', marginBottom:'24px',
          display:'flex', alignItems:'center', gap:'16px', color:'white',
          cursor:'pointer', boxShadow:'0 8px 30px rgba(59,130,246,0.35)',
          position:'relative', overflow:'hidden'
        }}>
          <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'100px', height:'100px', background:'rgba(255,255,255,0.08)', borderRadius:'50%' }}/>
          <div style={{ fontSize:'40px' }}>[AI]</div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:'800', fontSize:'15px', marginBottom:'3px' }}>AI Image Recognition</p>
            <p style={{ fontSize:'12px', opacity:0.85 }}>Foto sampahmu → AI kenali & hitung nilai otomatis!</p>
          </div>
          <div style={{ background:'rgba(255,255,255,0.25)', borderRadius:'12px', padding:'8px 14px', fontWeight:'800', fontSize:'13px', whiteSpace:'nowrap' }}>
            Scan →
          </div>
        </div>

        {/* Map */}
        <div style={{ marginBottom:'24px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
            <h3 style={{ fontWeight:'800', fontSize:'16px' }}>[Map] Titik Pengumpulan Terdekat</h3>
            <span style={{ fontSize:'12px', color:'var(--green)', fontWeight:'700' }}>7 lokasi</span>
          </div>
          <MapView />
        </div>

        {/* Transactions */}
        <div id="riwayat">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
            <h3 style={{ fontWeight:'800', fontSize:'16px' }}>[Chart] Transaksi Terbaru</h3>
            <button style={{ fontSize:'13px', color:'var(--green)', fontWeight:'700', background:'none' }}>Lihat Semua</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {txs.map(t=>(
              <div key={t.id} style={{
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:'16px', padding:'14px 16px',
                display:'flex', alignItems:'center', gap:'12px',
                boxShadow:'var(--shadow)'
              }}>
                <div style={{
                  width:'44px', height:'44px',
                  background: t.type==='in' ? '#dcfce7' : '#fee2e2',
                  borderRadius:'13px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px'
                }}>
                  {t.icon}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:'700', fontSize:'14px', marginBottom:'2px' }}>{t.label}</p>
                  <p style={{ fontSize:'12px', color:'var(--text2)' }}>{t.date}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontWeight:'800', fontSize:'15px', color: t.type==='in' ? '#16a34a' : '#dc2626' }}>
                    {t.type==='in'?'+':'-'}Rp {t.amount.toLocaleString('id-ID')}
                  </p>
                  {t.kg > 0 && <p style={{ fontSize:'11px', color:'var(--text2)' }}>{t.kg}kg</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hamburger Drawer ── */}
      <HamburgerMenu open={menuOpen} onClose={()=>setMenuOpen(false)} />

      {/* ── Scan Modal ── */}
      {scanModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:300, display:'flex', alignItems:'flex-end', backdropFilter:'blur(6px)' }}>
          <div style={{ background:'var(--bg2)', borderRadius:'28px 28px 0 0', width:'100%', padding:'28px 24px 40px', boxShadow:'0 -20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width:'40px', height:'4px', background:'var(--border)', borderRadius:'2px', margin:'0 auto 24px' }}/>
            <h3 style={{ fontWeight:'900', fontSize:'20px', marginBottom:'6px' }}>[AI] Scan AI Sampah</h3>
            <p style={{ fontSize:'14px', color:'var(--text2)', marginBottom:'24px' }}>Arahkan kamera ke sampah untuk dikenali AI</p>

            {!scanResult ? (
              <>
                <div style={{
                  height:'200px', background:'var(--bg)', borderRadius:'20px',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  border:'2px dashed var(--border)', marginBottom:'20px'
                }}>
                  {scanning ? (
                    <>
                      <div style={{ fontSize:'48px', marginBottom:'12px' }}>[Search]</div>
                      <p style={{ fontWeight:'700', color:'var(--green)', fontSize:'15px' }}>AI sedang menganalisis...</p>
                      <p style={{ fontSize:'13px', color:'var(--text2)', marginTop:'6px' }}>Mohon tunggu sebentar</p>
                      <div style={{ marginTop:'16px', display:'flex', gap:'6px' }}>
                        {[0,1,2].map(i=>(
                          <div key={i} style={{
                            width:'8px', height:'8px', background:'var(--green)', borderRadius:'50%',
                            animation:`pulse ${0.8+i*0.2}s ease-in-out infinite alternate`
                          }}/>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize:'48px', marginBottom:'12px' }}>[Cam]</div>
                      <p style={{ fontWeight:'700', color:'var(--text)', fontSize:'15px' }}>Klik tombol di bawah</p>
                      <p style={{ fontSize:'13px', color:'var(--text2)', marginTop:'4px' }}>untuk mensimulasikan scan</p>
                    </>
                  )}
                </div>
                <div style={{ display:'flex', gap:'12px' }}>
                  <button onClick={()=>{ setScanModal(false); setScanResult(null); }} style={{ flex:1, padding:'14px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', fontWeight:'700', fontSize:'15px', color:'var(--text)' }}>
                    Batal
                  </button>
                  <button onClick={mockScan} disabled={scanning} style={{ flex:2, padding:'14px', background:'linear-gradient(135deg,#14532d,#22c55e)', color:'white', borderRadius:'14px', fontWeight:'800', fontSize:'15px' }}>
                    {scanning ? '[Wait] Scanning...' : '[Cam] Mulai Scan'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ background:'#dcfce7', borderRadius:'20px', padding:'20px', marginBottom:'20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                    <span style={{ fontSize:'28px' }}>[OK]</span>
                    <div>
                      <p style={{ fontWeight:'900', fontSize:'16px', color:'#14532d' }}>Sampah Teridentifikasi!</p>
                      <p style={{ fontSize:'13px', color:'#16a34a' }}>Akurasi {scanResult.confidence}%</p>
                    </div>
                  </div>
                  <div style={{ background:'white', borderRadius:'14px', padding:'14px' }}>
                    <p style={{ fontSize:'13px', color:'#5a7a5a', marginBottom:'4px' }}>Jenis Sampah</p>
                    <p style={{ fontWeight:'800', fontSize:'16px', color:'#14532d', marginBottom:'12px' }}>{scanResult.jenis}</p>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <div>
                        <p style={{ fontSize:'12px', color:'#6b7280' }}>Estimasi Berat</p>
                        <p style={{ fontWeight:'800', color:'#14532d' }}>{scanResult.kg} kg</p>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <p style={{ fontSize:'12px', color:'#6b7280' }}>Nilai Poin</p>
                        <p style={{ fontWeight:'900', fontSize:'18px', color:'#22c55e' }}>+Rp {scanResult.nilai.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'12px' }}>
                  <button onClick={()=>{ setScanResult(null); }} style={{ flex:1, padding:'14px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'14px', fontWeight:'700', fontSize:'15px', color:'var(--text)' }}>
                    Ulang Scan
                  </button>
                  <button onClick={()=>{ alert('Permintaan penjemputan dikirim! [OK]\nKurir PilahPoin akan segera menghubungi kamu.'); setScanModal(false); setScanResult(null); }} style={{ flex:2, padding:'14px', background:'linear-gradient(135deg,#14532d,#22c55e)', color:'white', borderRadius:'14px', fontWeight:'800', fontSize:'15px' }}>
                    [Truck] Tukar Sekarang
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'@
[System.IO.File]::WriteAllText((Join-Path $base "src/pages/Home.jsx"), $content_src_pages_Home_jsx, $utf8NoBOM)

# index.html
$content_index_html = @'

<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>[R]</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PilahPoin – Platform Penukaran Sampah Digital</title>
    <meta name="description" content="Tukar sampah terpilah menjadi saldo e-wallet dengan teknologi AI Image Recognition" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

'@
[System.IO.File]::WriteAllText((Join-Path $base "index.html"), $content_index_html, $utf8NoBOM)
