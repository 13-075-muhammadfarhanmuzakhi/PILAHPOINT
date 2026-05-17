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
                  <div>🕐 {p.hours}</div>
                  <div>📞 {p.phone}</div>
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
