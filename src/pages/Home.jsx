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
          ♻️ PilahPoin
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
          <h2 style={{ fontSize:'24px', fontWeight:'900', letterSpacing:'-0.5px' }}>{user?.name} 👋</h2>
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
          <p style={{ fontSize:'13px', opacity:0.8, fontWeight:'600', marginBottom:'6px' }}>💳 Saldo E-Wallet</p>
          <p style={{ fontSize:'34px', fontWeight:'900', letterSpacing:'-1px', marginBottom:'16px' }}>
            Rp {balance.toLocaleString('id-ID')}
          </p>
          <div style={{ display:'flex', gap:'24px' }}>
            <div>
              <p style={{ fontSize:'11px', opacity:0.7, marginBottom:'2px' }}>POIN TERKUMPUL</p>
              <p style={{ fontSize:'16px', fontWeight:'800' }}>🏆 {points.toLocaleString()}</p>
            </div>
            <div style={{ width:'1px', background:'rgba(255,255,255,0.2)' }}/>
            <div>
              <p style={{ fontSize:'11px', opacity:0.7, marginBottom:'2px' }}>SAMPAH TERKUMPUL</p>
              <p style={{ fontSize:'16px', fontWeight:'800' }}>♻️ {collected} kg</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px' }}>
          {[
            { icon:'📷', label:'Tukar Sampah',  bg:'#dcfce7', c:'#14532d', fn:()=>setScanModal(true) },
            { icon:'💳', label:'Tarik Saldo',   bg:'#dbeafe', c:'#1d4ed8', fn:()=>alert('Fitur tarik saldo segera hadir!') },
            { icon:'📋', label:'Riwayat',       bg:'#fef3c7', c:'#92400e', fn:()=>document.getElementById('riwayat')?.scrollIntoView({behavior:'smooth'}) },
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
          <StatCard icon="♻️" label="Total Sampah"  value={`${collected}kg`}       color="var(--green)"/>
          <StatCard icon="🏆" label="Total Poin"    value={points.toLocaleString()} color="#f59e0b"/>
          <StatCard icon="📦" label="Transaksi"     value="6x"                      color="#8b5cf6"/>
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
          <div style={{ fontSize:'40px' }}>🤖</div>
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
            <h3 style={{ fontWeight:'800', fontSize:'16px' }}>📍 Titik Pengumpulan Terdekat</h3>
            <span style={{ fontSize:'12px', color:'var(--green)', fontWeight:'700' }}>7 lokasi</span>
          </div>
          <MapView />
        </div>

        {/* Transactions */}
        <div id="riwayat">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
            <h3 style={{ fontWeight:'800', fontSize:'16px' }}>📊 Transaksi Terbaru</h3>
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
            <h3 style={{ fontWeight:'900', fontSize:'20px', marginBottom:'6px' }}>🤖 Scan AI Sampah</h3>
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
                      <div style={{ fontSize:'48px', marginBottom:'12px' }}>🔍</div>
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
                      <div style={{ fontSize:'48px', marginBottom:'12px' }}>📷</div>
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
                    {scanning ? '⏳ Scanning...' : '📷 Mulai Scan'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ background:'#dcfce7', borderRadius:'20px', padding:'20px', marginBottom:'20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                    <span style={{ fontSize:'28px' }}>✅</span>
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
                  <button onClick={()=>{ alert('Permintaan penjemputan dikirim! ✅\nKurir PilahPoin akan segera menghubungi kamu.'); setScanModal(false); setScanResult(null); }} style={{ flex:2, padding:'14px', background:'linear-gradient(135deg,#14532d,#22c55e)', color:'white', borderRadius:'14px', fontWeight:'800', fontSize:'15px' }}>
                    🚚 Tukar Sekarang
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
