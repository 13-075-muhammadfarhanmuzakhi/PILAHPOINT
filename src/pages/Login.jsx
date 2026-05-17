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
          }}>♻️</div>
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
              ⚠️ {err}
            </div>
          )}
          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'15px',
            background: loading ? '#86efac' : 'linear-gradient(135deg,#14532d,#22c55e)',
            color:'#fff', borderRadius:'14px', fontSize:'16px', fontWeight:'800',
            boxShadow:'0 6px 20px rgba(34,197,94,0.4)', transition:'.2s',
            letterSpacing:'0.2px'
          }}>
            {loading ? '⏳ Memproses...' : '🚀 Masuk Sekarang'}
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
