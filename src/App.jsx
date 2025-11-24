import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plane, Rocket, Search, Filter, Info, CheckCircle, XCircle, 
  Calculator, MapPin, ShieldCheck, Wind, Users, Briefcase, 
  ChevronRight, Menu, X, ArrowRightLeft, BadgeIndianRupee,
  Database, UploadCloud // <--- ADD THESE TWO NEW ICONS
} from 'lucide-react';

// --- ADD THESE FIREBASE IMPORTS ---
import { db } from './firebase'; 
import { collection, getDocs, addDoc } from 'firebase/firestore';

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

const App = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // REAL DATABASE STATE
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM FIREBASE
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        // If database is empty, we don't crash, just show empty state
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInventory(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // SEED DATABASE FUNCTION (Uses your local arrays to populate the cloud)
  const seedDatabase = async () => {
    const confirm = window.confirm("This will upload your local data to Firebase. Continue?");
    if (!confirm) return;
    
    setLoading(true);
    // Combine your existing local arrays
    const allItems = [...aircraftData, ...droneData];
    
    for (const item of allItems) {
      try {
        await addDoc(collection(db, "inventory"), item);
        console.log("Uploaded:", item.model);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    
    alert("Database Seeded! Refresh the page.");
    window.location.reload();
  };

  const filteredItems = inventory.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('all')}>
              <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Plane size={24} className="transform -rotate-45" /></div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Aero<span className="text-blue-600">Nex</span></span>
            </div>
            
            {/* ADMIN BUTTON FOR SEEDING DATA */}
            <button onClick={seedDatabase} className="hidden md:flex items-center gap-2 text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 border border-red-200">
              <UploadCloud size={14}/> Seed DB (Admin)
            </button>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => setActiveTab('aircraft')} className="text-sm font-medium text-slate-600 hover:text-blue-600">Private Jets</button>
              <button onClick={() => setActiveTab('drone')} className="text-sm font-medium text-slate-600 hover:text-blue-600">Drones</button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Buy with Confidence. <span className="text-blue-400">Fly without Red Tape.</span></h1>
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
            <input type="text" placeholder="Search models..." className="w-full px-4 py-3 rounded-lg outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold">Search</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Connecting to Google Cloud...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl cursor-pointer">
                <div className="h-48 overflow-hidden relative">
                  <img src={item.images ? item.images[0] : 'https://via.placeholder.com/400'} alt={item.model} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-slate-800">{item.category}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{item.model}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-900">
                    <span>{item.price}</span>
                    <span className="text-blue-600 flex items-center gap-1">Details <ChevronRight size={16} /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
            <Database size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Database is Empty</h3>
            <p className="text-slate-500 mb-4">Click the "Seed DB" button in the navigation bar to populate initial data.</p>
          </div>
        )}
      </div>

      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default App;