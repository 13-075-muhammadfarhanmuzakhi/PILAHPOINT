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
    { icon:'👤', label:'Profil Saya',       section:'profil'  },
    { icon:'📊', label:'Statistik Sampah',  section:'stats'   },
    { icon:'🔔', label:'Notifikasi',         section:'notif'   },
    { icon:'🎁', label:'Voucher & Hadiah',  section:'voucher' },
    { icon:'💳', label:'Metode Pembayaran', section:'pay'     },
    { icon:'❓', label:'Pusat Bantuan',     section:'help'    },
    { icon:'ℹ️', label:'Tentang Aplikasi',  section:'about'   },
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
          { label:'Total Sampah Terkumpul', value:`${collected} kg`, icon:'♻️', color:'#22c55e' },
          { label:'Total Poin Diraih',      value:`${points.toLocaleString()} poin`, icon:'🏆', color:'#f59e0b' },
          { label:'Total Saldo Diterima',   value:`Rp ${balance.toLocaleString('id-ID')}`, icon:'💰', color:'#3b82f6' },
          { label:'Transaksi Berhasil',     value:'6 transaksi', icon:'📋', color:'#8b5cf6' },
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
          { title:'Promo Weekend ♻️',    desc:'Tukar sampah Sabtu-Minggu, nilai 2x lipat!', time:'1 hari lalu', unread:true },
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
          { name:'GoPay Cashback 10%', poin:'1.000 poin', exp:'30 Jun 2026', emoji:'💳', available:true },
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
          <div style={{ fontSize:'52px', marginBottom:'12px' }}>♻️</div>
          <div style={{ fontWeight:'900', fontSize:'22px', color:'var(--green)' }}>PilahPoin</div>
          <div style={{ fontSize:'13px', color:'var(--text2)', marginTop:'4px' }}>Versi 1.0.0</div>
        </div>
        <div style={{ background:'var(--bg)', borderRadius:'14px', padding:'16px', fontSize:'14px', color:'var(--text2)', lineHeight:'1.7' }}>
          PilahPoin adalah platform digital yang memudahkan masyarakat menukar sampah terpilah menjadi saldo e-wallet berbasis AI Image Recognition. Bersama kita jaga lingkungan! 🌿
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
          }}>♻️</div>
          <div style={{ color:'white', fontWeight:'900', fontSize:'17px', letterSpacing:'-0.3px' }}>{user?.name}</div>
          <div style={{ color:'rgba(255,255,255,0.75)', fontSize:'13px', marginTop:'2px' }}>{user?.email}</div>
          <div style={{ marginTop:'12px', display:'flex', gap:'10px' }}>
            <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'10px', padding:'6px 12px', fontSize:'12px', color:'white', fontWeight:'700' }}>
              🏆 {(2575).toLocaleString()} Poin
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
                  <span style={{ fontSize:'20px', width:'28px', textAlign:'center' }}>{dark ? '🌙' : '☀️'}</span>
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
              🚪 Keluar dari Akun
            </button>
          </div>
        )}
      </div>
    </>
  );
}
