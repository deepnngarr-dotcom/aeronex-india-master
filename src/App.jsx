import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plane, Rocket, Search, Filter, Info, CheckCircle, XCircle, 
  Calculator, MapPin, ShieldCheck, Wind, Users, Briefcase, 
  ChevronRight, Menu, X, ArrowRightLeft, BadgeIndianRupee,
  
  //Icons for Admin/Database
  Database, UploadCloud, Lock, LogOut, User 
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { db, auth } from './firebase'; 
import { collection, getDocs, addDoc, query, where, deleteDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; 

/** MOCK DATA */
const aircraftData = [
  {
    id: 'a1',
    type: 'aircraft',
    category: 'Light Jet',
    manufacturer: 'Honda',
    model: 'HondaJet Elite II',
    price: '₹ 58 Cr - ₹ 65 Cr',
    range: '1,547 nm',
    speed: '422 ktas',
    capacity: '4-5 Passengers',
    description: 'The fastest, furthest, highest-flying, and most fuel-efficient aircraft in its class.',
    images: [
      'https://www.hondajet.com/-/media/HondaJet/Photos/Products/Hondajet%20Elite%20II/Hero/Elite2-banner-black-2_1200.jpg',
      'https://images.unsplash.com/photo-1583063528828-0955743c7b38?q=80&w=800&auto=format&fit=crop'
    ],
    compliance: 'Import Eligible',
    minRunway: '3,699 ft',
    hourlyCost: 185000,
    fixedCost: 25000000
  },
  {
    id: 'a2',
    type: 'aircraft',
    category: 'Turboprop',
    manufacturer: 'Pilatus',
    model: 'PC-12 NGX',
    price: '₹ 45 Cr - ₹ 52 Cr',
    range: '1,803 nm',
    speed: '290 ktas',
    capacity: '6-9 Passengers',
    description: 'Versatile turboprop capable of landing on unpaved runways.',
    images: [
      'https://www.aerotime.aero/images/2025/04/Pilatus-aircraft-.jpg',
      'https://images.unsplash.com/photo-1559627582-849c7161b203?q=80&w=800&auto=format&fit=crop'
    ],
    compliance: 'Import Eligible',
    minRunway: '2,485 ft',
    hourlyCost: 120000,
    fixedCost: 15000000
  },
  {
    id: 'a3',
    type: 'aircraft',
    category: 'Midsize Jet',
    manufacturer: 'Cessna',
    model: 'Citation XLS+',
    price: '₹ 75 Cr - ₹ 85 Cr',
    range: '1,858 nm',
    speed: '441 ktas',
    capacity: '8-9 Passengers',
    description: 'Popular midsize jet known for reliability and comfort.',
    images: [
      'https://www.jetcraft.com/wp-content/uploads/2019/12/CessnaCitationXLS-exterior.jpg',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=800&auto=format&fit=crop'
    ],
    compliance: 'Import Eligible',
    minRunway: '3,560 ft',
    hourlyCost: 220000,
    fixedCost: 30000000
  }
];

const droneData = [
  {
    id: 'd1',
    type: 'drone',
    category: 'Agricultural',
    manufacturer: 'ideaForge',
    model: 'Q6 UAV',
    price: '₹ 15 Lakh - ₹ 20 Lakh',
    range: '10 km',
    speed: '35 km/h',
    capacity: 'Payload dependent',
    description: 'Indigenous design optimized for surveillance and mapping.',
    images: [
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?q=80&w=800&auto=format&fit=crop'
    ],
    compliance: 'DGCA Type Certified',
    flightTime: '60+ mins',
    hourlyCost: 2000,
    fixedCost: 50000
  },
  {
    id: 'd2',
    type: 'drone',
    category: 'Cinematography',
    manufacturer: 'DJI',
    model: 'Mavic 3 Cine',
    price: '₹ 4.5 Lakh - ₹ 5.5 Lakh',
    range: '15 km',
    speed: '68 km/h',
    capacity: 'Integrated Camera',
    description: 'Professional grade aerial photography.',
     images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=800&auto=format&fit=crop'
    ],
    compliance: 'Import Eligible',
    flightTime: '46 mins',
    hourlyCost: 500,
    fixedCost: 10000
  },
  {
    id: 'd3',
    type: 'drone',
    category: 'Cinematography',
    manufacturer: 'Potensic',
    model: 'Atom',
    price: '₹ 4.5 Lakh - ₹ 5.5 Lakh',
    range: '6 km',
    speed: '57.6 km/h',
    capacity: 'Integrated Camera',
    description: 'compact & lightweight aerial photography.',
   images: [
      'https://cdn.mos.cms.futurecdn.net/7PomYV2XXJjtqFh8pbLW3C.jpg',
      'https://cdn.mos.cms.futurecdn.net/7ersQDBcCWgZFM6czoQLHe.jpg'
    ],
    compliance: 'Import Restricted',
    flightTime: '32 mins',
    hourlyCost: 200,
    fixedCost: 5000
  }
];

const TCOCalculator = ({ hourlyCost, fixedCost }) => {
  const [hours, setHours] = useState(150);
  const totalVariable = hours * hourlyCost;
  const totalCost = fixedCost + totalVariable;
  const costPerHour = Math.round(totalCost / hours);

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="text-blue-600" size={24} />
        <h3 className="text-lg font-bold text-slate-800">Total Cost of Ownership (TCO) Calculator</h3>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Estimated Annual Flight Hours: <span className="text-blue-600 font-bold">{hours} hrs</span>
        </label>
        <input type="range" min="50" max="800" step="10" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Est. Annual Cost</p>
          <p className="text-2xl font-bold text-slate-800">₹ {(totalCost / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Effective Hourly Rate</p>
          <p className="text-2xl font-bold text-blue-600">₹ {costPerHour.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const DetailModal = ({ item, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-slate-100 rounded-full z-10 transition-colors"><X size={24} className="text-slate-700" /></button>
        <div className="h-64 md:h-96 w-full relative bg-slate-100 group">
          <img src={item.images[activeImage]} alt="Vehicle" className="w-full h-full object-cover transition-opacity duration-300" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl">
            {item.images.map((img, idx) => (
              <button key={idx} onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }} className={`w-12 h-12 md:w-16 md:h-12 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-500 scale-110' : 'border-white/50 opacity-70 hover:opacity-100'}`}>
                <img src={img} className="w-full h-full object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{item.manufacturer} {item.model}</h2>
          <p className="text-slate-600 mb-6">{item.description}</p>
          <TCOCalculator hourlyCost={item.hourlyCost} fixedCost={item.fixedCost} />
        </div>
      </div>
    </div>
  );
};

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Admin Login</h2>
          <button onClick={onClose}><X size={20} className="text-slate-500" /></button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Password" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Sign In</button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // AUTH STATE
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Listen for Login
  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const q = await getDocs(collection(db, "inventory"));
        setInventory(q.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchInventory();
  }, []);

  // Admin Functions
  const seedDatabase = async () => {
    if (!user) return;
    if (!window.confirm("Upload local data?")) return;
    setLoading(true);
    
    const allItems = [...aircraftData, ...droneData];
    for (const item of allItems) {
      const q = query(collection(db, "inventory"), where("model", "==", item.model));
      const snap = await getDocs(q);
      if (snap.empty) await addDoc(collection(db, "inventory"), item);
    }
    alert("Done!"); window.location.reload();
  };

  const clearDatabase = async () => {
    if (!user) return;
    if (!window.confirm("Clear database?")) return;
    setLoading(true);
    const snap = await getDocs(collection(db, "inventory"));
    await Promise.all(snap.docs.map(d => deleteDoc(doc(db, "inventory", d.id))));
    alert("Cleared!"); window.location.reload();
  };

  const filteredItems = inventory.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('all')}>
            <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Plane size={24} /></div>
            <span className="text-2xl font-bold text-slate-900">Aero<span className="text-blue-600">Nex</span></span>
          </div>
          
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <button onClick={seedDatabase} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex gap-1"><UploadCloud size={14}/> Seed</button>
              <button onClick={clearDatabase} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full flex gap-1"><XCircle size={14}/> Clear</button>
              <button onClick={() => signOut(auth)} className="text-sm text-red-600 flex gap-1 ml-2"><LogOut size={16}/> Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} className="hidden md:flex text-sm font-medium text-slate-600 hover:text-blue-600 gap-1"><Lock size={16}/> Login</button>
          )}
          
           {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative bg-slate-900 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1483304528321-0674f0040030?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Aviation Background"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6 backdrop-blur-sm">
            The #1 Marketplace for Indian Aviation
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Buy with Confidence.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Fly without Red Tape.
            </span>
          </h1>
          
          {/* Search Box */}
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search 'HondaJet', 'DJI Mavic', 'Survey Drone'..." 
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 focus:bg-white border border-transparent focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-200/50">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <p className="text-center text-slate-500">Loading...</p>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white rounded-2xl border hover:shadow-xl cursor-pointer overflow-hidden">
                <img src={item.images ? item.images[0] : ''} className="h-48 w-full object-cover" alt={item.model} />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{item.model}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between font-semibold text-sm">
                    <span>{item.price}</span>
                    <span className="text-blue-600 flex items-center">Details <ChevronRight size={16}/></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <Database size={48} className="mx-auto text-slate-300 mb-4"/>
            <h3 className="text-xl font-bold">Database Empty</h3>
            <p className="text-slate-500">Admin login required to seed data.</p>
          </div>
        )}
      </div>

        {/* --- SECTIONS FOR THE LINKS --- */}
      <section id="regulatory" className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Regulatory Hub</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to know about India's Drone Rules 2021, Green Zones, and Aircraft Import Guidelines (DGCA CAR).</p>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Our Services</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">From Aviation Financing and Insurance to connecting you with DGCA-certified Pilot Training schools.</p>
        </div>
      </section>

        {/* --- ABOUT THE PROJECT --- */}
      <section id="about" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Master's Project 2025</span>
              <span className='ml-2 text-sm text-slate-500'>by Deepak Nagar</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 mt-2">Bridging the Gap in Indian Aviation</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                The Indian aviation market is fragmented. Buyers struggle to find transparent pricing for private jets, while drone operators face complex regulatory hurdles (DGCA).
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                <strong className="text-slate-900">AeroNex India</strong> was built to solve this by providing a unified platform that combines real-time inventory with automated regulatory compliance checks.
              </p>
              <div className="flex gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-2xl text-blue-600">20+</h4>
                  <p className="text-xs text-slate-500">Models Listed</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-2xl text-emerald-600">100%</h4>
                  <p className="text-xs text-slate-500">DGCA Compliant</p>
                </div>
              </div>
            </div>
            <div className="relative h-80 bg-slate-100 rounded-2xl overflow-hidden shadow-2xl">
               <img src="https://www.parcelandpostaltechnologyinternational.com/wp-content/uploads/2023/02/Featured-pic-e1676909991205-1024x489.jpg" className="w-full h-full object-cover opacity-90" alt="About Us" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
                 <p className="text-white font-medium">"Democratizing the skies for everyone."</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 AeroNex India. All rights reserved.</p>
        </div>
      </footer>

      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default App;
