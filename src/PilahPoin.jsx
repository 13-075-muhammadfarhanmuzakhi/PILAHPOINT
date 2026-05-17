import { useState, useEffect } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const INIT_TXS = [
  { id:1, type:"in",  kg:2.0, jenis:"Botol PET",        nilai:5000,  date:"10 Mei 2026", icon:"♻️",  status:"selesai" },
  { id:2, type:"in",  kg:1.5, jenis:"Kertas & Kardus",   nilai:3200,  date:"09 Mei 2026", icon:"📦",  status:"selesai" },
  { id:3, type:"out", kg:0,   jenis:"Tarik GoPay",       nilai:10000, date:"08 Mei 2026", icon:"💸",  status:"selesai" },
  { id:4, type:"in",  kg:1.0, jenis:"Kaleng Aluminium",  nilai:7500,  date:"07 Mei 2026", icon:"🥫",  status:"selesai" },
  { id:5, type:"in",  kg:0.8, jenis:"Kaca Botol",        nilai:2000,  date:"06 Mei 2026", icon:"🪴",  status:"selesai" },
  { id:6, type:"in",  kg:1.8, jenis:"Plastik Keras",     nilai:4300,  date:"05 Mei 2026", icon:"🪣",  status:"selesai" },
  { id:7, type:"in",  kg:0.5, jenis:"Minyak Jelantah",   nilai:1750,  date:"04 Mei 2026", icon:"🫙",  status:"selesai" },
  { id:8, type:"out", kg:0,   jenis:"Tarik OVO",         nilai:15000, date:"03 Mei 2026", icon:"💸",  status:"selesai" },
];

const JENIS_SAMPAH = [
  { id:"pet",    icon:"🪣", nama:"Plastik PET",     harga:2500, satuan:"kg", contoh:"Botol air mineral, botol minuman" },
  { id:"hdpe",   icon:"🪣", nama:"Plastik HDPE",    harga:1500, satuan:"kg", contoh:"Jerigen, ember, pipa" },
  { id:"kertas", icon:"📦", nama:"Kertas/Kardus",   harga:1500, satuan:"kg", contoh:"Koran, majalah, kardus bekas" },
  { id:"alu",    icon:"🥫", nama:"Aluminium",       harga:8000, satuan:"kg", contoh:"Kaleng minuman, foil aluminium" },
  { id:"besi",   icon:"🔩", nama:"Besi/Logam",      harga:3000, satuan:"kg", contoh:"Peralatan logam, baut bekas" },
  { id:"kaca",   icon:"🪴", nama:"Kaca Bening",     harga:500,  satuan:"kg", contoh:"Botol kaca, cermin bekas" },
  { id:"minyak", icon:"🫙", nama:"Minyak Jelantah", harga:3500, satuan:"liter", contoh:"Minyak goreng bekas masak" },
  { id:"ewaste", icon:"📱", nama:"Elektronik Kecil",harga:5000, satuan:"kg", contoh:"HP rusak, kabel, adaptor bekas" },
];

const LOKASI = [
  { id:1, nama:"Bank Sampah Kedaton",         jarak:"1.2 km", jam:"Sen-Sab 08:00–16:00", telp:"0812-3456-7890" },
  { id:2, nama:"Dropbox PilahPoin – Enggal",  jarak:"0.8 km", jam:"24 Jam",              telp:"-" },
  { id:3, nama:"TPS3R Rajabasa",              jarak:"3.1 km", jam:"Sen-Ming 07:00–17:00", telp:"0813-2345-6789" },
  { id:4, nama:"Bank Sampah Sukarame",        jarak:"2.5 km", jam:"Sen-Jum 08:00–15:00", telp:"0821-3456-7890" },
  { id:5, nama:"Dropbox PilahPoin – Way Halim",jarak:"1.9 km",jam:"24 Jam",              telp:"-" },
];

const EWALLET = [
  { id:"gopay",     nama:"GoPay",       icon:"💚", min:10000, color:"#00AED6" },
  { id:"ovo",       nama:"OVO",         icon:"💜", min:10000, color:"#4C3494" },
  { id:"dana",      nama:"DANA",        icon:"💙", min:10000, color:"#108EE9" },
  { id:"shopeepay", nama:"ShopeePay",   icon:"🧡", min:10000, color:"#EE4D2D" },
  { id:"bri",       nama:"Transfer BRI",icon:"🏦", min:50000, color:"#003B8E" },
  { id:"bca",       nama:"Transfer BCA",icon:"🏦", min:50000, color:"#006CB4" },
];

// ── THEME / STYLES ────────────────────────────────────────────────────────────
const LIGHT = {
  bg:       "#f2fbf4",
  sidebar:  "#0a1f0d",
  card:     "#ffffff",
  border:   "#d4edda",
  text:     "#0d1f10",
  text2:    "#5a7a5e",
  green:    "#16a34a",
  greenLt:  "#22c55e",
  greenBg:  "#dcfce7",
  shadow:   "0 1px 16px rgba(0,80,0,0.08)",
  input:    "#ffffff",
  inputBdr: "#c3d9c7",
};
const DARK = {
  bg:       "#07120a",
  sidebar:  "#030b05",
  card:     "#0d1e10",
  border:   "#1a3320",
  text:     "#d2f0d5",
  text2:    "#5a8060",
  green:    "#4ade80",
  greenLt:  "#86efac",
  greenBg:  "#102516",
  shadow:   "0 1px 16px rgba(0,0,0,0.5)",
  input:    "#0d1e10",
  inputBdr: "#1a3320",
};

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"home",    label:"Dashboard",          icon:"🏠" },
  { id:"setoran", label:"Setor Sampah",        icon:"♻️" },
  { id:"riwayat", label:"Riwayat",             icon:"📋" },
  { id:"peta",    label:"Titik Pengumpulan",   icon:"📍" },
  { id:"tukar",   label:"Tukar Saldo",         icon:"💰" },
  { id:"profil",  label:"Profil",              icon:"👤" },
];

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function PilahPoin() {
  const [dark, setDark]             = useState(false);
  const [page, setPage]             = useState("login");
  const [user, setUser]             = useState(null);
  const [txs, setTxs]               = useState(INIT_TXS);
  const [balance, setBalance]       = useState(27750);
  const [points, setPoints]         = useState(2775);
  const [collected, setCollected]   = useState(12.4);
  const [activeNav, setActiveNav]   = useState("home");

  const T = dark ? DARK : LIGHT;

  const login  = (u) => { setUser(u); setPage("app"); };
  const logout = ()  => { setUser(null); setPage("login"); };

  const addTx = (tx) => {
    const newTx = { id: Date.now(), ...tx };
    setTxs(prev => [newTx, ...prev]);
    if (tx.type === "in") {
      setBalance(b => b + tx.nilai);
      setPoints(p => p + Math.floor(tx.nilai / 10));
      setCollected(c => parseFloat((c + tx.kg).toFixed(1)));
    } else if (tx.type === "out") {
      setBalance(b => b - tx.nilai);
    }
  };

  const ctx = { T, dark, setDark, user, login, logout, txs, balance, points, collected, addTx, setActiveNav };

  if (page === "login")    return <LoginPage    ctx={ctx} onRegister={() => setPage("register")} />;
  if (page === "register") return <RegisterPage ctx={ctx} onBack={() => setPage("login")} />;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.bg, fontFamily:"'Nunito',system-ui,sans-serif", color:T.text }}>
      <Sidebar T={T} active={activeNav} setActive={setActiveNav} user={user} onLogout={logout} dark={dark} setDark={setDark} />
      <div style={{ flex:1, minWidth:0, overflowY:"auto" }}>
        {activeNav==="home"    && <HomePage    ctx={ctx} />}
        {activeNav==="setoran" && <SetoranPage ctx={ctx} />}
        {activeNav==="riwayat" && <RiwayatPage ctx={ctx} />}
        {activeNav==="peta"    && <PetaPage    ctx={ctx} />}
        {activeNav==="tukar"   && <TukarPage   ctx={ctx} />}
        {activeNav==="profil"  && <ProfilPage  ctx={ctx} />}
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ T, active, setActive, user, onLogout, dark, setDark }) {
  return (
    <div style={{ width:240, background:T.sidebar, display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", overflowY:"auto", flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px 18px", borderBottom:`1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:28 }}>♻️</span>
          <div>
            <div style={{ color:"#4ade80", fontWeight:900, fontSize:18, letterSpacing:"-0.5px" }}>PilahPoin</div>
            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11 }}>Sampah Jadi Saldo</div>
          </div>
        </div>
      </div>
      {/* User */}
      {user && (
        <div style={{ padding:"14px 16px", borderBottom:`1px solid rgba(255,255,255,0.06)` }}>
          <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"10px 12px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(74,222,128,0.2)", border:"2px solid rgba(74,222,128,0.4)", display:"flex", alignItems:"center", justifyContent:"center", color:"#4ade80", fontWeight:900, fontSize:15 }}>
                {user.name?.[0]?.toUpperCase()||"U"}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ color:"white", fontWeight:700, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Nav */}
      <nav style={{ flex:1, padding:"12px 10px" }}>
        {NAV.map(n => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => setActive(n.id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", marginBottom:2, borderRadius:10, textAlign:"left",
              background: on ? "rgba(74,222,128,0.12)" : "transparent",
              border: on ? "1px solid rgba(74,222,128,0.22)" : "1px solid transparent",
              cursor:"pointer", transition:"all .15s",
            }}>
              <span style={{ fontSize:17, width:22, textAlign:"center" }}>{n.icon}</span>
              <span style={{ fontSize:13.5, fontWeight: on ? 700 : 500, color: on ? "#4ade80" : "rgba(255,255,255,0.6)" }}>{n.label}</span>
            </button>
          );
        })}
      </nav>
      {/* Bottom */}
      <div style={{ padding:"10px", borderTop:`1px solid rgba(255,255,255,0.06)` }}>
        <button onClick={() => setDark(!dark)} style={{
          width:"100%", padding:"9px 12px", marginBottom:6, display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, cursor:"pointer",
        }}>
          <span style={{ fontSize:13, color:"rgba(255,255,255,0.55)", fontWeight:600 }}>{dark ? "🌙 Mode Gelap" : "☀️ Mode Terang"}</span>
          <div style={{ width:34, height:18, borderRadius:9, background: dark ? "#22c55e" : "#444", position:"relative", transition:".3s" }}>
            <div style={{ position:"absolute", top:2, left: dark ? 17 : 2, width:14, height:14, background:"white", borderRadius:"50%", transition:".3s" }}/>
          </div>
        </button>
        <button onClick={onLogout} style={{ width:"100%", padding:"9px 12px", background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.18)", borderRadius:10, color:"#f87171", fontSize:13, fontWeight:700, cursor:"pointer" }}>
          🚪 Keluar
        </button>
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginPage({ ctx, onRegister }) {
  const { T, login } = ctx;
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [err, setErr]       = useState("");
  const [loading, setLoad]  = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !pass) { setErr("Mohon isi email dan password!"); return; }
    setLoad(true);
    await new Promise(r => setTimeout(r, 600));
    const name = email.split("@")[0].replace(/[._-]/g," ").replace(/\b\w/g,c=>c.toUpperCase());
    login({ name, email });
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Nunito',system-ui,sans-serif" }}>
      {/* Left hero */}
      <div style={{ flex:1, background:"linear-gradient(150deg,#052e16,#15803d,#4ade80)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 48px", color:"white" }}>
        <div style={{ fontSize:80, marginBottom:24 }}>♻️</div>
        <h1 style={{ fontSize:52, fontWeight:900, letterSpacing:"-2px", marginBottom:14 }}>PilahPoin</h1>
        <p style={{ fontSize:18, opacity:.8, textAlign:"center", maxWidth:360, lineHeight:1.65, marginBottom:48 }}>
          Setor sampah terpilah ke titik pengumpulan — dapat saldo e-wallet langsung!
        </p>
        {["📋 Pilah & kumpulkan sampahmu","📍 Antar ke lokasi terdekat","⚖️ Ditimbang petugas","💰 Saldo masuk otomatis"].map(s=>(
          <div key={s} style={{ width:"100%", maxWidth:300, marginBottom:10, background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"11px 16px", fontSize:14, fontWeight:600 }}>{s}</div>
        ))}
        <div style={{ marginTop:40, textAlign:"center" }}>
          <div style={{ fontSize:42, fontWeight:900 }}>2.847</div>
          <div style={{ fontSize:13, opacity:.7 }}>pengguna aktif di Bandar Lampung</div>
        </div>
      </div>
      {/* Right form */}
      <div style={{ width:480, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px", background: T.card }}>
        <div style={{ width:"100%", maxWidth:360 }}>
          <h2 style={{ fontSize:30, fontWeight:900, marginBottom:6, color:T.text }}>Masuk</h2>
          <p style={{ fontSize:14, color:T.text2, marginBottom:32 }}>Kelola sampah & saldo kamu</p>
          <form onSubmit={submit}>
            <Label T={T}>Email</Label>
            <Input T={T} type="email" placeholder="nama@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <Label T={T} style={{marginTop:14}}>Password</Label>
            <Input T={T} type="password" placeholder="Minimal 6 karakter" value={pass} onChange={e=>setPass(e.target.value)} />
            {err && <ErrBox>{err}</ErrBox>}
            <Btn style={{marginTop:20}} loading={loading}>{loading ? "Memproses..." : "Masuk →"}</Btn>
          </form>
          <p style={{ textAlign:"center", marginTop:24, fontSize:14, color:T.text2 }}>
            Belum punya akun?{" "}
            <button onClick={onRegister} style={{ background:"none", border:"none", color:"#16a34a", fontWeight:800, fontSize:14, cursor:"pointer" }}>Daftar Gratis</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
function RegisterPage({ ctx, onBack }) {
  const { T, login } = ctx;
  const [f, setF]     = useState({ name:"", email:"", phone:"", pass:"" });
  const [err, setErr] = useState("");
  const [loading, setLoad] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name||!f.email||!f.phone||!f.pass) { setErr("Semua field wajib diisi!"); return; }
    if (f.pass.length < 6) { setErr("Password minimal 6 karakter!"); return; }
    setLoad(true);
    await new Promise(r => setTimeout(r, 700));
    login({ name:f.name, email:f.email, phone:f.phone });
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Nunito',system-ui,sans-serif" }}>
      <div style={{ flex:1, background:"linear-gradient(150deg,#052e16,#15803d,#4ade80)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 48px", color:"white" }}>
        <div style={{ fontSize:72, marginBottom:20 }}>♻️</div>
        <h1 style={{ fontSize:44, fontWeight:900, letterSpacing:"-1.5px", marginBottom:12 }}>PilahPoin</h1>
        <p style={{ fontSize:16, opacity:.8, textAlign:"center", maxWidth:320, lineHeight:1.65 }}>Bergabung dengan ribuan warga Bandar Lampung yang sudah peduli lingkungan!</p>
        <div style={{ marginTop:40, background:"rgba(255,255,255,0.12)", borderRadius:20, padding:"28px 40px", textAlign:"center" }}>
          <div style={{ fontSize:48, fontWeight:900 }}>127 ton</div>
          <div style={{ fontSize:14, opacity:.8 }}>sampah berhasil didaur ulang</div>
        </div>
      </div>
      <div style={{ width:480, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px", background:T.card }}>
        <div style={{ width:"100%", maxWidth:360 }}>
          <h2 style={{ fontSize:28, fontWeight:900, marginBottom:6, color:T.text }}>Buat Akun</h2>
          <p style={{ fontSize:14, color:T.text2, marginBottom:24 }}>Mulai tukar sampah jadi saldo!</p>
          <form onSubmit={submit}>
            {[["Nama Lengkap","text","Nama kamu","name"],["Email","email","nama@email.com","email"],["No. HP / WhatsApp","tel","08xxxxxxxxxx","phone"],["Password","password","Min. 6 karakter","pass"]].map(([lbl,type,ph,key])=>(
              <div key={key}>
                <Label T={T}>{lbl}</Label>
                <Input T={T} type={type} placeholder={ph} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})} />
              </div>
            ))}
            {err && <ErrBox>{err}</ErrBox>}
            <Btn style={{marginTop:16}} loading={loading}>{loading ? "Mendaftarkan..." : "Buat Akun Gratis →"}</Btn>
          </form>
          <p style={{ textAlign:"center", marginTop:20, fontSize:14, color:T.text2 }}>
            Sudah punya akun?{" "}
            <button onClick={onBack} style={{ background:"none", border:"none", color:"#16a34a", fontWeight:800, fontSize:14, cursor:"pointer" }}>Masuk</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomePage({ ctx }) {
  const { T, user, balance, points, collected, txs, setActiveNav } = ctx;
  const greet = () => { const h=new Date().getHours(); return h<12?"Selamat Pagi":h<18?"Selamat Siang":"Selamat Malam"; };
  const inCount = txs.filter(t=>t.type==="in").length;

  return (
    <div style={{ padding:"32px 36px", maxWidth:1300 }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:13, color:T.text2, fontWeight:700 }}>{greet()},</p>
        <h1 style={{ fontSize:34, fontWeight:900, letterSpacing:"-1px", color:T.text }}>{user?.name} 👋</h1>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[
          { label:"Saldo E-Wallet", value:`Rp ${balance.toLocaleString("id-ID")}`, icon:"💳", accent:"#22c55e", bg:"#052e16" },
          { label:"Total Poin",     value:points.toLocaleString(),                  icon:"🏆", accent:"#f59e0b", bg:"#78350f" },
          { label:"Sampah Disetor", value:`${collected} kg`,                        icon:"♻️", accent:"#38bdf8", bg:"#0c4a6e" },
          { label:"Total Setor",    value:`${inCount}x setor`,                      icon:"📊", accent:"#a78bfa", bg:"#3b0764" },
        ].map(s=>(
          <div key={s.label} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"20px 22px", boxShadow:T.shadow }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:11, fontWeight:700, color:T.text2, textTransform:"uppercase", letterSpacing:.5 }}>{s.label}</span>
              <div style={{ width:36, height:36, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
            </div>
            <p style={{ fontSize:24, fontWeight:900, color:s.accent, letterSpacing:"-0.5px" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:20, marginBottom:20 }}>
        {/* How it works */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"24px 28px", boxShadow:T.shadow }}>
          <h3 style={{ fontWeight:800, fontSize:17, marginBottom:20, color:T.text }}>Cara Kerja PilahPoin</h3>
          {[
            { icon:"🗂️", title:"1. Pilah Sampahmu", desc:"Pisahkan sampah berdasarkan jenisnya: plastik, kertas, kaca, logam, atau minyak jelantah." },
            { icon:"📍", title:"2. Antar ke Titik Terdekat", desc:"Bawa ke Bank Sampah, TPS3R, atau Dropbox PilahPoin 24 jam terdekat di kotamu." },
            { icon:"⚖️", title:"3. Ditimbang Petugas", desc:"Petugas menimbang dan mencatat berat serta jenis sampahmu langsung di sistem." },
            { icon:"💰", title:"4. Saldo Masuk Otomatis", desc:"Saldo e-wallet langsung masuk sesuai berat & jenis sampah yang berhasil disetor." },
          ].map((s,i,arr)=>(
            <div key={s.title} style={{ display:"flex", gap:16, paddingBottom: i<arr.length-1 ? 18 : 0, position:"relative" }}>
              {i<arr.length-1 && <div style={{ position:"absolute", left:19, top:40, width:2, height:"calc(100% - 18px)", background:T.border }}/>}
              <div style={{ width:40, height:40, borderRadius:12, background:T.greenBg, border:`2px solid ${T.green}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, zIndex:1 }}>{s.icon}</div>
              <div>
                <p style={{ fontWeight:800, fontSize:14, marginBottom:4, color:T.text }}>{s.title}</p>
                <p style={{ fontSize:13, color:T.text2, lineHeight:1.55 }}>{s.desc}</p>
              </div>
            </div>
          ))}
          <button onClick={() => ctx.setActiveNav("setoran")} style={{ marginTop:22, width:"100%", padding:13, background:"linear-gradient(135deg,#14532d,#22c55e)", color:"white", borderRadius:14, fontWeight:800, fontSize:15, border:"none", cursor:"pointer" }}>
            Mulai Setor Sampah →
          </button>
        </div>

        {/* Right col */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Harga hari ini */}
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"18px 20px", boxShadow:T.shadow }}>
            <h3 style={{ fontWeight:800, fontSize:14, marginBottom:14, color:T.text }}>💹 Harga Sampah Hari Ini</h3>
            {[["🪣","Plastik PET","2.500/kg"],["📦","Kertas/Kardus","1.500/kg"],["🥫","Aluminium","8.000/kg"],["🪴","Kaca Bening","500/kg"],["🔩","Besi/Logam","3.000/kg"],["🫙","Minyak Jelantah","3.500/ltr"]].map(([ic,nm,hr])=>(
              <div key={nm} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:15 }}>{ic}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{nm}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:T.green }}>Rp {hr}</span>
              </div>
            ))}
          </div>
          {/* Quick actions */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[["📍","Cari Lokasi","peta"],["💸","Tarik Saldo","tukar"],["📋","Riwayat","riwayat"],["👤","Profil","profil"]].map(([ic,lbl,pg])=>(
              <button key={pg} onClick={()=>setActiveNav(pg)} style={{ padding:"14px 10px", background:T.card, border:`1px solid ${T.border}`, borderRadius:14, boxShadow:T.shadow, fontWeight:700, fontSize:13, color:T.text, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:22 }}>{ic}</span>{lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent txs */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"24px 28px", boxShadow:T.shadow }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <h3 style={{ fontWeight:800, fontSize:16, color:T.text }}>Transaksi Terbaru</h3>
          <button onClick={()=>setActiveNav("riwayat")} style={{ fontSize:13, color:T.green, fontWeight:700, background:"none", border:"none", cursor:"pointer" }}>Lihat Semua →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:10 }}>
          {txs.slice(0,6).map(t=>(
            <TxCard key={t.id} t={t} T={T} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TxCard({ t, T }) {
  const color = t.type==="in" ? "#16a34a" : t.type==="out" ? "#dc2626" : "#d97706";
  const bg    = t.type==="in" ? "#dcfce7"  : t.type==="out" ? "#fee2e2"  : "#fef3c7";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:T.bg, borderRadius:14, border:`1px solid ${T.border}` }}>
      <div style={{ width:40, height:40, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{t.icon}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontWeight:700, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:T.text }}>{t.jenis}</p>
        <p style={{ fontSize:12, color:T.text2 }}>{t.date}{t.kg>0?` • ${t.kg}kg`:""}</p>
      </div>
      <p style={{ fontWeight:800, fontSize:14, color, flexShrink:0 }}>{t.type==="in"?"+":t.type==="out"?"-":"~"}Rp {t.nilai.toLocaleString("id-ID")}</p>
    </div>
  );
}

// ── SETOR SAMPAH ─────────────────────────────────────────────────────────────
function SetoranPage({ ctx }) {
  const { T, addTx } = ctx;
  const [step, setStep]         = useState(1);
  const [selected, setSelected] = useState([]);
  const [kg, setKg]             = useState({});
  const [lokasi, setLokasi]     = useState(null);
  const [done, setDone]         = useState(false);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
  const setKgV = (id, v) => setKg(k => ({...k, [id]: parseFloat(v)||0}));

  const totalNilai = selected.reduce((a,id)=>{ const j=JENIS_SAMPAH.find(j=>j.id===id); return a+(j.harga*(kg[id]||0)); },0);
  const totalKg    = selected.reduce((a,id)=>a+(kg[id]||0), 0);

  const submit = () => {
    selected.forEach(id => {
      const j = JENIS_SAMPAH.find(j=>j.id===id);
      if ((kg[id]||0) > 0) addTx({ type:"in", kg:kg[id]||0, jenis:j.nama, nilai:j.harga*(kg[id]||0), date:new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}), icon:j.icon, status:"selesai" });
    });
    setDone(true);
  };

  const reset = () => { setStep(1); setSelected([]); setKg({}); setLokasi(null); setDone(false); };

  if (done) return (
    <div style={{ padding:40, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"80vh" }}>
      <div style={{ textAlign:"center", maxWidth:440, background:T.card, border:`1px solid ${T.border}`, borderRadius:24, padding:"44px 40px", boxShadow:T.shadow }}>
        <div style={{ fontSize:72, marginBottom:20 }}>✅</div>
        <h2 style={{ fontSize:28, fontWeight:900, marginBottom:10, color:T.text }}>Setoran Berhasil!</h2>
        <p style={{ color:T.text2, fontSize:15, marginBottom:8 }}>Saldo kamu bertambah</p>
        <p style={{ fontSize:40, fontWeight:900, color:T.green, marginBottom:8 }}>+Rp {totalNilai.toLocaleString("id-ID")}</p>
        <p style={{ fontSize:14, color:T.text2, marginBottom:32 }}>Total: {totalKg.toFixed(1)} kg • {LOKASI.find(l=>l.id===lokasi)?.nama}</p>
        <button onClick={reset} style={{ padding:"13px 32px", background:"linear-gradient(135deg,#14532d,#22c55e)", color:"white", borderRadius:14, fontWeight:800, fontSize:15, border:"none", cursor:"pointer" }}>Setor Lagi</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"32px 36px", maxWidth:1000 }}>
      <h1 style={{ fontSize:28, fontWeight:900, marginBottom:6, color:T.text }}>Setor Sampah</h1>
      <p style={{ color:T.text2, marginBottom:28 }}>Pilih jenis sampah, masukkan berat, lalu pilih lokasi setor.</p>

      {/* Steps */}
      <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:32 }}>
        {["Pilih Jenis","Masukkan Berat","Pilih Lokasi","Konfirmasi"].map((s,i)=>(
          <div key={s} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background: step>i+1?"#22c55e":step===i+1?"#14532d":T.border, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:13 }}>
                {step>i+1?"✓":i+1}
              </div>
              <span style={{ fontSize:13, fontWeight:step===i+1?700:500, color:step===i+1?T.text:T.text2 }}>{s}</span>
            </div>
            {i<3 && <div style={{ width:32, height:2, background:T.border, margin:"0 8px" }}/>}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step===1 && (
        <div>
          <p style={{ fontWeight:700, marginBottom:16, color:T.text }}>Pilih jenis sampah yang akan disetor (bisa lebih dari satu):</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginBottom:24 }}>
            {JENIS_SAMPAH.map(j=>{
              const on = selected.includes(j.id);
              return (
                <button key={j.id} onClick={()=>toggle(j.id)} style={{ padding:"16px", borderRadius:16, textAlign:"left", background: on ? T.greenBg : T.card, border: on ? `2px solid ${T.green}` : `1px solid ${T.border}`, boxShadow:T.shadow, cursor:"pointer", transition:"all .15s" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{j.icon}</div>
                  <p style={{ fontWeight:800, fontSize:14, marginBottom:4, color:T.text }}>{j.nama}</p>
                  <p style={{ fontSize:12, color:T.text2, marginBottom:6, lineHeight:1.4 }}>{j.contoh}</p>
                  <p style={{ fontSize:13, fontWeight:800, color:T.green }}>Rp {j.harga.toLocaleString()}/{j.satuan}</p>
                </button>
              );
            })}
          </div>
          <button disabled={!selected.length} onClick={()=>setStep(2)} style={{ padding:"13px 32px", background:selected.length?"linear-gradient(135deg,#14532d,#22c55e)":T.border, color:selected.length?"white":T.text2, borderRadius:14, fontWeight:800, fontSize:15, border:"none", cursor:selected.length?"pointer":"default" }}>
            Lanjut ({selected.length} dipilih) →
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step===2 && (
        <div>
          <p style={{ fontWeight:700, marginBottom:16, color:T.text }}>Masukkan berat masing-masing sampah:</p>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
            {selected.map(id=>{
              const j=JENIS_SAMPAH.find(j=>j.id===id);
              const val=kg[id]||0;
              return (
                <div key={id} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"18px 22px", display:"flex", alignItems:"center", gap:16, boxShadow:T.shadow }}>
                  <span style={{ fontSize:32 }}>{j.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:800, fontSize:15, marginBottom:2, color:T.text }}>{j.nama}</p>
                    <p style={{ fontSize:13, color:T.green, fontWeight:700 }}>Rp {j.harga.toLocaleString()}/{j.satuan}</p>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div>
                      <input type="number" min="0" step="0.1" placeholder="0.0" value={val||""} onChange={e=>setKgV(id,e.target.value)}
                        style={{ width:90, padding:"9px 12px", border:`1.5px solid ${T.inputBdr}`, borderRadius:10, fontSize:16, fontWeight:700, background:T.input, color:T.text, textAlign:"right" }} />
                      <p style={{ fontSize:12, color:T.text2, marginTop:2, textAlign:"right" }}>{j.satuan}</p>
                    </div>
                    <div style={{ minWidth:100, textAlign:"right" }}>
                      <p style={{ fontSize:16, fontWeight:900, color:T.green }}>Rp {(j.harga*val).toLocaleString("id-ID")}</p>
                      <p style={{ fontSize:12, color:T.text2 }}>estimasi</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background:T.greenBg, border:`1px solid ${T.green}`, borderRadius:14, padding:"14px 20px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ fontSize:12, color:T.text2, fontWeight:700 }}>Total Estimasi</p>
              <p style={{ fontSize:26, fontWeight:900, color:T.green }}>Rp {totalNilai.toLocaleString("id-ID")}</p>
            </div>
            <p style={{ fontWeight:700, color:T.text2, fontSize:15 }}>{totalKg.toFixed(1)} kg</p>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={()=>setStep(1)} style={{ padding:"12px 24px", background:T.card, border:`1px solid ${T.border}`, borderRadius:14, fontWeight:700, fontSize:14, color:T.text, cursor:"pointer" }}>← Kembali</button>
            <button disabled={!totalKg} onClick={()=>setStep(3)} style={{ flex:1, padding:13, background:totalKg?"linear-gradient(135deg,#14532d,#22c55e)":T.border, color:totalKg?"white":T.text2, borderRadius:14, fontWeight:800, fontSize:15, border:"none", cursor:totalKg?"pointer":"default" }}>Pilih Lokasi →</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step===3 && (
        <div>
          <p style={{ fontWeight:700, marginBottom:16, color:T.text }}>Pilih tempat penyetoran:</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
            {LOKASI.map(l=>{
              const on = lokasi===l.id;
              return (
                <button key={l.id} onClick={()=>setLokasi(l.id)} style={{ padding:"16px 20px", borderRadius:16, textAlign:"left", display:"flex", alignItems:"center", gap:16, background: on?T.greenBg:T.card, border: on?`2px solid ${T.green}`:`1px solid ${T.border}`, boxShadow:T.shadow, cursor:"pointer" }}>
                  <span style={{ fontSize:28 }}>📍</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:800, fontSize:15, color:T.text }}>{l.nama}</p>
                    <p style={{ fontSize:13, color:T.text2 }}>🕒 {l.jam} {l.telp!=="-"&&`• 📞 ${l.telp}`}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontWeight:700, color:T.green, fontSize:14 }}>{l.jarak}</p>
                    <p style={{ fontSize:12, color:T.text2 }}>dari lokasimu</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={()=>setStep(2)} style={{ padding:"12px 24px", background:T.card, border:`1px solid ${T.border}`, borderRadius:14, fontWeight:700, color:T.text, cursor:"pointer" }}>← Kembali</button>
            <button disabled={!lokasi} onClick={()=>setStep(4)} style={{ flex:1, padding:13, background:lokasi?"linear-gradient(135deg,#14532d,#22c55e)":T.border, color:lokasi?"white":T.text2, borderRadius:14, fontWeight:800, fontSize:15, border:"none", cursor:lokasi?"pointer":"default" }}>Konfirmasi →</button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step===4 && (
        <div>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"24px 28px", boxShadow:T.shadow, marginBottom:16 }}>
            <h3 style={{ fontWeight:800, fontSize:16, marginBottom:20, color:T.text }}>Ringkasan Setoran</h3>
            {selected.map(id=>{ const j=JENIS_SAMPAH.find(j=>j.id===id); return (
              <div key={id} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontWeight:600, color:T.text }}>{j.icon} {j.nama} ({kg[id]||0} {j.satuan})</span>
                <span style={{ fontWeight:800, color:T.green }}>Rp {(j.harga*(kg[id]||0)).toLocaleString("id-ID")}</span>
              </div>
            );})}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 0 0" }}>
              <span style={{ fontWeight:800, fontSize:16, color:T.text }}>Total</span>
              <span style={{ fontWeight:900, fontSize:22, color:T.green }}>Rp {totalNilai.toLocaleString("id-ID")}</span>
            </div>
            <div style={{ marginTop:16, padding:"12px 16px", background:T.bg, borderRadius:12 }}>
              <p style={{ fontSize:13, color:T.text2, marginBottom:4 }}>Lokasi Setoran</p>
              <p style={{ fontWeight:700, color:T.text }}>📍 {LOKASI.find(l=>l.id===lokasi)?.nama}</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={()=>setStep(3)} style={{ padding:"12px 24px", background:T.card, border:`1px solid ${T.border}`, borderRadius:14, fontWeight:700, color:T.text, cursor:"pointer" }}>← Kembali</button>
            <button onClick={submit} style={{ flex:1, padding:14, background:"linear-gradient(135deg,#14532d,#22c55e)", color:"white", borderRadius:14, fontWeight:800, fontSize:15, border:"none", cursor:"pointer" }}>✅ Konfirmasi Setoran</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RIWAYAT ───────────────────────────────────────────────────────────────────
function RiwayatPage({ ctx }) {
  const { T, txs, balance, points, collected } = ctx;
  const [filter, setFilter] = useState("semua");

  const filtered = txs.filter(t => filter==="semua" ? true : t.type===filter);

  return (
    <div style={{ padding:"32px 36px", maxWidth:1100 }}>
      <h1 style={{ fontSize:28, fontWeight:900, marginBottom:6, color:T.text }}>Riwayat Transaksi</h1>
      <p style={{ color:T.text2, marginBottom:24 }}>Semua aktivitas setor sampah dan penarikan saldo.</p>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Total Saldo",   value:`Rp ${balance.toLocaleString("id-ID")}`, color:"#22c55e" },
          { label:"Sampah Disetor", value:`${collected} kg`,                       color:"#38bdf8" },
          { label:"Total Poin",    value:points.toLocaleString(),                  color:"#f59e0b" },
        ].map(s=>(
          <div key={s.label} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"18px 20px", boxShadow:T.shadow }}>
            <p style={{ fontSize:12, color:T.text2, fontWeight:700, marginBottom:6 }}>{s.label}</p>
            <p style={{ fontSize:24, fontWeight:900, color:s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["semua","Semua"],["in","Pemasukan"],["out","Penarikan"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{ padding:"7px 18px", borderRadius:20, fontWeight:700, fontSize:13, background:filter===v?T.greenBg:T.card, border:filter===v?`1.5px solid ${T.green}`:`1px solid ${T.border}`, color:filter===v?T.green:T.text2, cursor:"pointer" }}>{l}</button>
        ))}
        <span style={{ marginLeft:"auto", fontSize:13, color:T.text2, alignSelf:"center" }}>{filtered.length} transaksi</span>
      </div>

      {/* Table */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, overflow:"hidden", boxShadow:T.shadow }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:T.bg, borderBottom:`1px solid ${T.border}` }}>
              {["Jenis","Tanggal","Berat","Nilai","Status"].map(h=>(
                <th key={h} style={{ padding:"12px 20px", textAlign:"left", fontSize:12, fontWeight:700, color:T.text2, textTransform:"uppercase", letterSpacing:.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t=>{
              const color = t.type==="in"?"#16a34a":t.type==="out"?"#dc2626":"#d97706";
              const bg    = t.type==="in"?"#dcfce7":t.type==="out"?"#fee2e2":"#fef3c7";
              return (
                <tr key={t.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"12px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{t.icon}</div>
                      <span style={{ fontWeight:700, fontSize:14, color:T.text }}>{t.jenis}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 20px", fontSize:13, color:T.text2 }}>{t.date}</td>
                  <td style={{ padding:"12px 20px", fontSize:14, fontWeight:600, color:T.text }}>{t.kg>0?`${t.kg} kg`:"—"}</td>
                  <td style={{ padding:"12px 20px", fontWeight:800, fontSize:14, color }}>{t.type==="in"?"+":t.type==="out"?"-":"~"}Rp {t.nilai.toLocaleString("id-ID")}</td>
                  <td style={{ padding:"12px 20px" }}>
                    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:700, background:t.status==="selesai"?"#dcfce7":"#fef3c7", color:t.status==="selesai"?"#14532d":"#92400e" }}>
                      {t.status==="selesai"?"✅ Selesai":"⏳ Diproses"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && (
          <div style={{ textAlign:"center", padding:"48px", color:T.text2 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
            <p style={{ fontWeight:700 }}>Belum ada transaksi</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PETA ──────────────────────────────────────────────────────────────────────
const PETA_POINTS = [
  { id:1, nama:"Bank Sampah Kedaton",          type:"Bank Sampah", jam:"Sen-Sab 08:00–16:00", telp:"0812-3456-7890", color:"#f59e0b", x:62, y:35 },
  { id:2, nama:"TPS3R Rajabasa",               type:"TPS3R",       jam:"Sen-Ming 07:00–17:00", telp:"0813-2345-6789", color:"#3b82f6", x:48, y:58 },
  { id:3, nama:"Bank Sampah Sukarame",         type:"Bank Sampah", jam:"Sen-Jum 08:00–15:00", telp:"0821-3456-7890", color:"#f59e0b", x:72, y:65 },
  { id:4, nama:"Dropbox PilahPoin – Enggal",   type:"Dropbox",     jam:"24 Jam",              telp:"-",              color:"#22c55e", x:38, y:32 },
  { id:5, nama:"Bank Sampah Langkapura",       type:"Bank Sampah", jam:"Sen-Sab 09:00–16:00", telp:"0822-9876-5432", color:"#f59e0b", x:25, y:70 },
  { id:6, nama:"Dropbox PilahPoin – Way Halim",type:"Dropbox",     jam:"24 Jam",              telp:"-",              color:"#22c55e", x:78, y:48 },
  { id:7, nama:"TPS3R Tanjung Senang",         type:"TPS3R",       jam:"Sen-Sab 07:00–16:00", telp:"0815-1234-5678", color:"#3b82f6", x:52, y:78 },
];

function PetaPage({ ctx }) {
  const { T } = ctx;
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("Semua");

  const filtered = PETA_POINTS.filter(p => filter==="Semua" || p.type===filter);
  const sel = PETA_POINTS.find(p=>p.id===active);

  return (
    <div style={{ padding:"32px 36px", maxWidth:1200 }}>
      <h1 style={{ fontSize:28, fontWeight:900, marginBottom:6, color:T.text }}>Titik Pengumpulan</h1>
      <p style={{ color:T.text2, marginBottom:24 }}>Temukan lokasi setor sampah terdekat di Bandar Lampung.</p>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["Semua","Bank Sampah","TPS3R","Dropbox"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 18px", borderRadius:20, fontWeight:700, fontSize:13, background:filter===f?T.greenBg:T.card, border:filter===f?`1.5px solid ${T.green}`:`1px solid ${T.border}`, color:filter===f?T.green:T.text2, cursor:"pointer" }}>{f}</button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
        {/* Fake map */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, overflow:"hidden", boxShadow:T.shadow, position:"relative" }}>
          <div style={{ height:520, background: T === LIGHT ? "linear-gradient(145deg,#e8f5e9,#f1f8e9)" : "linear-gradient(145deg,#0a1a0c,#0d1e0f)", position:"relative", overflow:"hidden" }}>
            {/* Grid lines */}
            {[...Array(8)].map((_,i)=>(
              <div key={`h${i}`} style={{ position:"absolute", left:0, right:0, top:`${(i+1)*12}%`, height:1, background: T === LIGHT ? "rgba(0,100,0,0.08)" : "rgba(74,222,128,0.06)" }}/>
            ))}
            {[...Array(8)].map((_,i)=>(
              <div key={`v${i}`} style={{ position:"absolute", top:0, bottom:0, left:`${(i+1)*12}%`, width:1, background: T === LIGHT ? "rgba(0,100,0,0.08)" : "rgba(74,222,128,0.06)" }}/>
            ))}
            {/* Roads */}
            <svg style={{ position:"absolute", inset:0 }} width="100%" height="100%">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke={T===LIGHT?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.04)"} strokeWidth="8"/>
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke={T===LIGHT?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.04)"} strokeWidth="8"/>
              <line x1="0" y1="30%" x2="100%" y2="70%" stroke={T===LIGHT?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.03)"} strokeWidth="4"/>
              <line x1="20%" y1="0" x2="80%" y2="100%" stroke={T===LIGHT?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.03)"} strokeWidth="4"/>
            </svg>
            {/* Pins */}
            {PETA_POINTS.map(p=>{
              const isF = filter==="Semua" || p.type===filter;
              return (
                <button key={p.id} onClick={()=>setActive(active===p.id?null:p.id)}
                  style={{ position:"absolute", left:`${p.x}%`, top:`${p.y}%`, transform:"translate(-50%,-100%)", background:"none", border:"none", cursor:"pointer", opacity:isF?1:0.25, transition:"opacity .2s", zIndex:active===p.id?10:1 }}>
                  <div style={{ position:"relative" }}>
                    <div style={{ width:28, height:28, borderRadius:"50% 50% 50% 0", transform:"rotate(-45deg)", background:p.color, border:"3px solid white", boxShadow:"0 3px 10px rgba(0,0,0,0.3)" }}/>
                    {active===p.id && (
                      <div style={{ position:"absolute", bottom:"110%", left:"50%", transform:"translateX(-50%)", background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"10px 14px", minWidth:180, boxShadow:T.shadow, zIndex:20 }}>
                        <p style={{ fontWeight:800, fontSize:13, color:T.text, marginBottom:4 }}>{p.nama}</p>
                        <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, background:p.color+"22", color:p.color }}>{p.type}</span>
                        <p style={{ fontSize:12, color:T.text2, marginTop:6 }}>🕒 {p.jam}</p>
                        {p.telp!=="-" && <p style={{ fontSize:12, color:T.text2 }}>📞 {p.telp}</p>}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
            {/* Label */}
            <div style={{ position:"absolute", bottom:16, left:16, fontSize:12, color:T.text2, fontWeight:600 }}>📍 Bandar Lampung</div>
          </div>
        </div>

        {/* List */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:4 }}>
            {[["#f59e0b","Bank Sampah"],["#3b82f6","TPS3R"],["#22c55e","Dropbox 24 Jam"]].map(([c,l])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:T.text2, background:T.card, border:`1px solid ${T.border}`, padding:"5px 10px", borderRadius:20 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c }}/>{l}
              </div>
            ))}
          </div>
          <div style={{ overflowY:"auto", maxHeight:500, display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(p=>(
              <button key={p.id} onClick={()=>setActive(active===p.id?null:p.id)} style={{ padding:"14px 16px", background: active===p.id ? T.greenBg : T.card, border: active===p.id ? `2px solid ${T.green}` : `1px solid ${T.border}`, borderRadius:14, textAlign:"left", cursor:"pointer", boxShadow:T.shadow }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:p.color, flexShrink:0, marginTop:5 }}/>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:800, fontSize:13, color:T.text, marginBottom:4 }}>{p.nama}</p>
                    <span style={{ fontSize:11, fontWeight:700, background:p.color+"22", color:p.color, padding:"2px 8px", borderRadius:20 }}>{p.type}</span>
                    <p style={{ fontSize:12, color:T.text2, marginTop:6 }}>🕒 {p.jam}</p>
                    {p.telp!=="-" && <p style={{ fontSize:12, color:T.text2 }}>📞 {p.telp}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TUKAR SALDO ───────────────────────────────────────────────────────────────
function TukarPage({ ctx }) {
  const { T, balance, addTx } = ctx;
  const [ew, setEw]       = useState(null);
  const [nominal, setNom] = useState("");
  const [norek, setNorek] = useState("");
  const [err, setErr]     = useState("");
  const [done, setDone]   = useState(false);

  const sel = EWALLET.find(e=>e.id===ew);
  const nom = parseInt(nominal)||0;

  const submit = () => {
    if (!ew)                        { setErr("Pilih metode penarikan!"); return; }
    if (nom < (sel?.min||10000))    { setErr(`Minimal penarikan Rp ${(sel?.min||10000).toLocaleString("id-ID")}`); return; }
    if (nom > balance)              { setErr("Saldo tidak cukup!"); return; }
    if (!norek)                     { setErr("Masukkan nomor rekening/akun!"); return; }
    addTx({ type:"out", kg:0, jenis:`Tarik ${sel.nama}`, nilai:nom, date:new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}), icon:"💸", status:"selesai" });
    setDone(true);
  };

  if (done) return (
    <div style={{ padding:40, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"80vh" }}>
      <div style={{ textAlign:"center", maxWidth:420, background:T.card, border:`1px solid ${T.border}`, borderRadius:24, padding:"44px 40px", boxShadow:T.shadow }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h2 style={{ fontSize:26, fontWeight:900, marginBottom:8, color:T.text }}>Penarikan Berhasil!</h2>
        <p style={{ color:T.text2, marginBottom:8 }}>Saldo telah ditransfer ke {sel?.nama}</p>
        <p style={{ fontSize:36, fontWeight:900, color:"#16a34a", marginBottom:6 }}>Rp {nom.toLocaleString("id-ID")}</p>
        <p style={{ fontSize:14, color:T.text2, marginBottom:28 }}>No. {norek}</p>
        <button onClick={()=>{setDone(false);setNom("");setNorek("");setEw(null);}} style={{ padding:"12px 28px", background:"linear-gradient(135deg,#14532d,#22c55e)", color:"white", borderRadius:13, fontWeight:800, border:"none", cursor:"pointer" }}>Selesai</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"32px 36px", maxWidth:760 }}>
      <h1 style={{ fontSize:28, fontWeight:900, marginBottom:6, color:T.text }}>Tukar Saldo</h1>
      <p style={{ color:T.text2, marginBottom:24 }}>Tarik saldo kamu ke e-wallet atau rekening bank.</p>

      {/* Balance card */}
      <div style={{ background:"linear-gradient(145deg,#052e16,#14532d,#22c55e)", borderRadius:20, padding:"24px 28px", marginBottom:28, color:"white" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ opacity:.7, fontSize:13, marginBottom:6 }}>Saldo Tersedia</p>
            <p style={{ fontSize:40, fontWeight:900, letterSpacing:"-1px" }}>Rp {balance.toLocaleString("id-ID")}</p>
          </div>
          <div style={{ fontSize:48 }}>💳</div>
        </div>
      </div>

      <p style={{ fontWeight:700, marginBottom:12, color:T.text }}>Pilih Metode Penarikan:</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:24 }}>
        {EWALLET.map(e=>{
          const on = ew===e.id;
          return (
            <button key={e.id} onClick={()=>{setEw(e.id);setErr("");}} style={{ padding:"14px 10px", borderRadius:14, textAlign:"center", background:on?T.greenBg:T.card, border:on?`2px solid ${T.green}`:`1px solid ${T.border}`, boxShadow:T.shadow, cursor:"pointer" }}>
              <div style={{ fontSize:26, marginBottom:6 }}>{e.icon}</div>
              <p style={{ fontWeight:700, fontSize:13, color:T.text }}>{e.nama}</p>
              <p style={{ fontSize:11, color:T.text2 }}>Min. Rp {e.min.toLocaleString()}</p>
            </button>
          );
        })}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:20 }}>
        <div>
          <Label T={T}>No. Akun / No. Rekening</Label>
          <Input T={T} placeholder="08xxxxxxxxxx atau no. rekening" value={norek} onChange={e=>setNorek(e.target.value)} />
        </div>
        <div>
          <Label T={T}>Nominal Penarikan</Label>
          <Input T={T} type="number" placeholder="Masukkan nominal" value={nominal} onChange={e=>setNom(e.target.value)} />
          <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
            {[10000,25000,50000,100000,250000].map(v=>(
              <button key={v} onClick={()=>setNom(String(v))} style={{ padding:"6px 14px", background:T.card, border:`1px solid ${T.border}`, borderRadius:20, fontSize:13, fontWeight:600, color:T.text, cursor:"pointer" }}>
                Rp {v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {nom > 0 && sel && (
        <div style={{ background:T.greenBg, border:`1px solid ${T.green}`, borderRadius:14, padding:"12px 18px", marginBottom:16, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:14, color:T.text2 }}>Ke {sel.nama} • {norek||"—"}</span>
          <span style={{ fontWeight:800, color:T.green }}>Rp {nom.toLocaleString("id-ID")}</span>
        </div>
      )}

      {err && <ErrBox>{err}</ErrBox>}
      <button onClick={submit} style={{ width:"100%", padding:14, background:"linear-gradient(135deg,#14532d,#22c55e)", color:"white", borderRadius:14, fontWeight:800, fontSize:16, border:"none", cursor:"pointer" }}>
        Tarik Saldo →
      </button>
    </div>
  );
}

// ── PROFIL ────────────────────────────────────────────────────────────────────
function ProfilPage({ ctx }) {
  const { T, user, balance, points, collected, txs, dark, setDark, logout } = ctx;
  const level    = points < 1000 ? "Pemula" : points < 5000 ? "Pejuang Hijau" : "Pahlawan Lingkungan";
  const nextLvl  = points < 1000 ? 1000 : points < 5000 ? 5000 : 10000;
  const progress = Math.min((points / nextLvl) * 100, 100);

  return (
    <div style={{ padding:"32px 36px", maxWidth:900 }}>
      <h1 style={{ fontSize:28, fontWeight:900, marginBottom:24, color:T.text }}>Profil Saya</h1>

      {/* Profile hero */}
      <div style={{ background:"linear-gradient(145deg,#052e16,#14532d)", borderRadius:20, padding:"28px 32px", marginBottom:20, color:"white", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, background:"rgba(255,255,255,0.04)", borderRadius:"50%" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:22 }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(74,222,128,0.18)", border:"2px solid rgba(74,222,128,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, fontWeight:900, color:"#4ade80" }}>
            {user?.name?.[0]?.toUpperCase()||"U"}
          </div>
          <div>
            <h2 style={{ fontSize:22, fontWeight:900 }}>{user?.name}</h2>
            <p style={{ opacity:.65, fontSize:14 }}>{user?.email}</p>
            {user?.phone && <p style={{ opacity:.55, fontSize:13 }}>📞 {user.phone}</p>}
            <span style={{ background:"rgba(74,222,128,0.18)", border:"1px solid rgba(74,222,128,0.35)", color:"#4ade80", fontSize:12, fontWeight:700, padding:"3px 12px", borderRadius:20, marginTop:6, display:"inline-block" }}>
              🏆 {level}
            </span>
          </div>
        </div>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, opacity:.65, marginBottom:6 }}>
            <span>Progress ke level berikutnya</span>
            <span>{points} / {nextLvl} poin</span>
          </div>
          <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:8, height:8, overflow:"hidden" }}>
            <div style={{ width:`${progress}%`, height:"100%", background:"#4ade80", borderRadius:8, transition:"width .5s" }}/>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Total Saldo",   value:`Rp ${balance.toLocaleString("id-ID")}`, color:"#22c55e" },
          { label:"Total Poin",    value:points.toLocaleString(),                  color:"#f59e0b" },
          { label:"Sampah Disetor",value:`${collected} kg`,                        color:"#38bdf8" },
        ].map(s=>(
          <div key={s.label} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:"18px 20px", boxShadow:T.shadow, textAlign:"center" }}>
            <p style={{ fontSize:12, color:T.text2, fontWeight:700, marginBottom:6 }}>{s.label}</p>
            <p style={{ fontSize:24, fontWeight:900, color:s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Environmental impact */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:"24px 28px", marginBottom:16, boxShadow:T.shadow }}>
        <h3 style={{ fontWeight:800, fontSize:16, marginBottom:16, color:T.text }}>🌿 Dampak Lingkunganmu</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {[
            ["🌳",`${(collected*0.5).toFixed(1)} kg`,"CO₂ dikurangi"],
            ["💧",`${(collected*12).toFixed(0)} L`,"Air diselamatkan"],
            ["⚡",`${(collected*0.3).toFixed(1)} kWh`,"Energi dihemat"],
            ["🏅",`${txs.filter(t=>t.type==="in").length}x`,"Total setoran"],
          ].map(([ic,val,lab])=>(
            <div key={lab} style={{ textAlign:"center", padding:"16px 12px", background:T.greenBg, borderRadius:14 }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{ic}</div>
              <p style={{ fontWeight:900, fontSize:18, color:T.green }}>{val}</p>
              <p style={{ fontSize:12, color:T.text2 }}>{lab}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:20, overflow:"hidden", boxShadow:T.shadow }}>
        <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontWeight:700, color:T.text }}>{dark?"🌙 Mode Gelap":"☀️ Mode Terang"}</span>
          <button onClick={()=>setDark(!dark)} style={{ width:48, height:26, borderRadius:13, background:dark?"#22c55e":T.border, border:"none", position:"relative", transition:".3s", cursor:"pointer" }}>
            <div style={{ position:"absolute", top:3, left:dark?24:3, width:20, height:20, background:"white", borderRadius:"50%", transition:".3s" }}/>
          </button>
        </div>
        <button onClick={logout} style={{ width:"100%", padding:"16px 24px", display:"flex", alignItems:"center", gap:12, background:"none", border:"none", textAlign:"left", color:"#dc2626", fontWeight:700, fontSize:15, cursor:"pointer" }}>
          🚪 Keluar dari Akun
        </button>
      </div>
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function Label({ T, children, style }) {
  return <label style={{ display:"block", fontSize:13, fontWeight:700, color:T.text2, marginBottom:6, ...style }}>{children}</label>;
}
function Input({ T, ...props }) {
  return <input {...props} style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${T.inputBdr}`, borderRadius:12, fontSize:15, background:T.input, color:T.text, marginBottom:0, ...(props.style||{}) }} />;
}
function Btn({ children, loading, style, ...props }) {
  return <button {...props} disabled={loading} style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,#14532d,#22c55e)", color:"white", borderRadius:12, fontSize:16, fontWeight:800, border:"none", cursor:"pointer", ...style }}>{children}</button>;
}
function ErrBox({ children }) {
  return <div style={{ background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", fontSize:13, padding:"10px 14px", borderRadius:10, margin:"12px 0" }}>{children}</div>;
}