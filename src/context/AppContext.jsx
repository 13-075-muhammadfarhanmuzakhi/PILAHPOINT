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
    { id:1, type:'in',  amount:5000,  label:'Botol Plastik 2kg',      date:'10 Mei 2026', icon:'🧴', kg:2.0 },
    { id:2, type:'in',  amount:3200,  label:'Kertas & Kardus 1.5kg',  date:'09 Mei 2026', icon:'📦', kg:1.5 },
    { id:3, type:'out', amount:10000, label:'Tarik ke GoPay',          date:'08 Mei 2026', icon:'💸', kg:0   },
    { id:4, type:'in',  amount:7500,  label:'Kaleng Aluminium 1kg',   date:'07 Mei 2026', icon:'🥫', kg:1.0 },
    { id:5, type:'in',  amount:2000,  label:'Kaca Botol 0.8kg',       date:'06 Mei 2026', icon:'🫙', kg:0.8 },
    { id:6, type:'in',  amount:4300,  label:'Plastik Keras 1.8kg',    date:'05 Mei 2026', icon:'🪣', kg:1.8 },
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
