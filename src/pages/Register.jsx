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
          }}>♻️</div>
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
              ⚠️ {err}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'15px', marginTop:'4px',
            background: loading ? '#86efac' : 'linear-gradient(135deg,#14532d,#22c55e)',
            color:'#fff', borderRadius:'14px', fontSize:'16px', fontWeight:'800',
            boxShadow:'0 6px 20px rgba(34,197,94,0.4)'
          }}>
            {loading ? '⏳ Mendaftarkan...' : '✅ Buat Akun Gratis'}
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
