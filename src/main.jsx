import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  HelpCircle,
  Home,
  Laptop,
  MapPin,
  MessageCircle,
  Plus,
  Refrigerator,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Star,
  User,
  WashingMachine,
  Wrench,
  X
} from 'lucide-react';
import './styles.css';

const productsSeed = [
  {
    id: 'washer',
    name: 'LG Washing Machine',
    type: 'Front Load',
    year: '2021',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80',
    status: 'Needs attention',
    note: 'Maintenance due',
    lastServiced: '8 months ago',
    warranty: 'Expired 12 Jan 2026',
    health: 'attention'
  },
  {
    id: 'fridge',
    name: 'LG Refrigerator',
    type: 'Double Door',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=80',
    status: 'Up to date',
    note: 'Cooling well',
    lastServiced: '5 months ago',
    warranty: 'Expired 04 Mar 2026',
    health: 'ok'
  },
  {
    id: 'laptop',
    name: 'Dell Inspiron',
    type: 'Laptop',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    status: 'Up to date',
    note: 'Battery health good',
    lastServiced: 'Never repaired',
    warranty: 'Active until 23 Nov 2026',
    health: 'ok'
  },
  {
    id: 'tv',
    name: 'Samsung Smart TV',
    type: '43 inch LED',
    year: '2020',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80',
    status: 'Monitor',
    note: 'Panel check suggested',
    lastServiced: '11 months ago',
    warranty: 'Expired 02 Feb 2024',
    health: 'monitor'
  }
];

const repairers = [
  { id: 'rajesh', name: 'Rajesh Kumar Services', rating: 4.8, repairs: 236, distance: '2.4 km', fee: 299, availability: 'Today, 5:30 PM', specialty: 'LG washer specialist', verified: true },
  { id: 'fixpoint', name: 'FixPoint Appliances', rating: 4.7, repairs: 418, distance: '3.1 km', fee: 349, availability: 'Tomorrow, 10:00 AM', specialty: 'Multi-brand appliances', verified: true },
  { id: 'hometech', name: 'HomeTech Repairs', rating: 4.5, repairs: 189, distance: '4.8 km', fee: 249, availability: 'Today, 7:00 PM', specialty: 'Budget visit fee', verified: true }
];

const screensWithNav = ['home', 'products', 'product', 'repairs', 'repair-history', 'repair-record', 'me', 'personal', 'addresses', 'notifications', 'settings', 'help', 'payments', 'about'];

function usePersistentState() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('mend-state');
    return saved ? JSON.parse(saved) : {
      onboarded: false,
      products: productsSeed,
      route: 'welcome',
      selectedProductId: 'washer',
      repairStatus: 'booked',
      issue: '',
      description: '',
      uploaded: false,
      aiAnswers: [],
      selectedRepairerId: 'rajesh',
      reminderSet: false,
      profile: { name: 'Anshu Soni', phone: '+91 98765 43210', email: 'anshu.soni@email.com' }
    };
  });
  useEffect(() => localStorage.setItem('mend-state', JSON.stringify(state)), [state]);
  const patch = (next) => setState((s) => ({ ...s, ...next }));
  return [state, patch];
}

function App() {
  const [state, patch] = usePersistentState();
  const product = state.products.find((p) => p.id === state.selectedProductId) || state.products[0];
  const repairer = repairers.find((r) => r.id === state.selectedRepairerId) || repairers[0];
  const go = (route, extra = {}) => patch({ route, ...extra });
  const completeRepair = () => patch({
    route: 'completed',
    repairStatus: 'complete',
    products: state.products.map((p) => p.id === 'washer' ? { ...p, status: 'Up to date', note: 'Repair completed', health: 'ok', lastServiced: 'Today' } : p)
  });

  return (
    <main className="page">
      <section className="phone-shell">
        <div className="statusbar"><span>9:41</span><span>Delhi NCR</span></div>
        {state.route !== 'welcome' && state.route !== 'how' && <TopBar title={titleFor(state.route)} go={go} />}
        <div className="screen">
          {state.route === 'welcome' && <Welcome go={go} />}
          {state.route === 'how' && <How go={go} />}
          {state.route === 'add' && <AddProduct go={go} patch={patch} state={state} />}
          {state.route === 'home' && <HomeScreen go={go} product={product} state={state} />}
          {state.route === 'products' && <Products go={go} state={state} />}
          {state.route === 'product' && <ProductDetails go={go} product={product} state={state} />}
          {state.route === 'wrong' && <Wrong go={go} patch={patch} state={state} product={product} />}
          {state.route === 'describe' && <Describe go={go} patch={patch} state={state} />}
          {state.route === 'media' && <Media go={go} patch={patch} state={state} />}
          {state.route === 'questions' && <Questions go={go} patch={patch} state={state} />}
          {state.route === 'analysing' && <Analysing go={go} />}
          {state.route === 'causes' && <Causes go={go} />}
          {state.route === 'estimate' && <Estimate go={go} />}
          {state.route === 'repairers' && <Repairers go={go} patch={patch} />}
          {state.route === 'repairer' && <RepairerDetails go={go} repairer={repairer} />}
          {state.route === 'schedule' && <Schedule go={go} repairer={repairer} />}
          {state.route === 'confirmed' && <Confirmed go={go} repairer={repairer} />}
          {state.route === 'tracking' && <Tracking go={go} repairer={repairer} status={state.repairStatus} patch={patch} />}
          {state.route === 'quote' && <Quote go={go} patch={patch} />}
          {state.route === 'approved' && <Approved go={go} repairer={repairer} completeRepair={completeRepair} />}
          {state.route === 'completed' && <Completed go={go} patch={patch} state={state} />}
          {state.route === 'repairs' && <Repairs go={go} state={state} />}
          {state.route === 'repair-history' && <RepairHistory go={go} />}
          {state.route === 'repair-record' && <RepairRecord />}
          {state.route === 'me' && <Me go={go} state={state} />}
          {state.route === 'personal' && <Personal state={state} patch={patch} />}
          {state.route === 'addresses' && <Addresses />}
          {state.route === 'notifications' && <Notifications />}
          {state.route === 'settings' && <SettingsScreen go={go} />}
          {state.route === 'help' && <Help />}
          {state.route === 'payments' && <Payments />}
          {state.route === 'about' && <About />}
        </div>
        {screensWithNav.includes(state.route) && <BottomNav route={state.route} go={go} />}
      </section>
    </main>
  );
}

const titleFor = (r) => ({
  home: 'MEND', products: 'Products', product: 'Product details', repairs: 'Repairs', me: 'Me',
  wrong: "What's wrong?", describe: 'Describe problem', media: 'Add media', questions: 'Diagnosis',
  analysing: 'Analysing', causes: 'Possible causes', estimate: 'Repair or replace', repairers: 'Verified repairers',
  repairer: 'Repairer details', schedule: 'Choose time', confirmed: 'Booking confirmed', tracking: 'Track repair',
  quote: 'Repair quote', approved: 'Repair approved', completed: 'Repair completed'
}[r] || 'MEND');

function TopBar({ title, go }) {
  return <div className="topbar"><button className="icon" onClick={() => go('home')}><ChevronLeft size={20}/></button><b>{title}</b><button className="icon"><Bell size={18}/></button></div>;
}
function BottomNav({ route, go }) {
  return <nav className="bottom-nav">
    {[[Home,'home','Home'],[Refrigerator,'products','Products'],[Wrench,'repairs','Repairs'],[User,'me','Me']].map(([Icon, id, label]) =>
      <button key={id} className={route === id || (id === 'products' && route === 'product') ? 'active' : ''} onClick={() => go(id)}><Icon size={20}/><span>{label}</span></button>)}
  </nav>;
}
function Brand() { return <div className="brand"><span className="logo">M</span><span>MEND</span></div>; }
function Primary({ children, onClick, light }) { return <button className={light ? 'btn light' : 'btn'} onClick={onClick}>{children}</button>; }
function Card({ children, className = '', onClick }) { return <div className={`card ${className}`} onClick={onClick}>{children}</div>; }
function Pill({ children, tone = '' }) { return <span className={`pill ${tone}`}>{children}</span>; }

function Welcome({ go }) {
  return <div className="welcome">
    <Brand/><h1>Repair without the guesswork.</h1><p>A smarter repair record for every appliance your family depends on.</p>
    <div className="cycle">{['Own','Diagnose','Compare','Repair','Record','Maintain'].map((x,i)=><span key={x}>{x}{i<5 && <ChevronRight size={14}/>}</span>)}</div>
    <img alt="" src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"/>
    <Primary onClick={() => go('how')}>Get started</Primary><button className="text-btn" onClick={() => go('home')}>Sign in</button>
  </div>;
}
function How({ go }) {
  return <div><h1>Repair without the guesswork.</h1><p className="muted">MEND helps you move from symptom to trusted service with context saved for later.</p>
    <div className="grid3">{[['Diagnose','Answer a few focused questions.'],['Compare','See price ranges and verified repairers.'],['Repair','Book, approve, and keep records.']].map(([a,b])=><Card key={a}><Wrench/><h3>{a}</h3><p>{b}</p></Card>)}</div>
    <Primary onClick={() => go('add')}>Continue</Primary></div>;
}
function AddProduct({ go, state }) {
  return <div><h1>Start with your products.</h1><div className="category-row">{[[Refrigerator,'Refrigerator'],[WashingMachine,'Washing Machine'],[Laptop,'Laptop'],[Smartphone,'TV']].map(([I,l])=><button className="chip" key={l}><I size={18}/>{l}</button>)}</div>
    <input placeholder="Brand" defaultValue="LG"/><input placeholder="Model" defaultValue="Front Load Washing Machine"/><Primary onClick={() => go('home', { onboarded: true })}>Add product</Primary><button className="text-btn" onClick={() => go('home')}>Skip</button></div>;
}
function HomeScreen({ go, product, state }) {
  return <div><div className="headline"><div><h1>Good morning, Anshu</h1><p>Here's what needs your attention.</p></div><button className="icon"><Bell size={19}/></button></div>
    <Card className="hero"><p>SOMETHING NOT WORKING?</p><h2>Diagnose a problem</h2><span>Get an AI-assisted estimate before booking a technician.</span><Primary light onClick={() => go('wrong')}>Start diagnosis</Primary></Card>
    <Section title="Needs Your Attention"/><ProductCard product={product} go={go}/>
    <Section title="Active Repair"/><Progress status={state.repairStatus}/><Card onClick={() => go('tracking')}><h3>LG Washing Machine</h3><p>Rajesh Kumar Services visiting today at 5:30 PM.</p></Card>
    <Section title="My Products"/><div className="mini-grid">{state.products.map(p=><ProductMini key={p.id} p={p} go={go}/>)}</div></div>;
}
function Section({ title }) { return <h2 className="section">{title}</h2>; }
function ProductCard({ product, go }) { return <Card className="product-card" onClick={() => go('product', { selectedProductId: product.id })}><img src={product.image}/><div><Pill tone={product.health}>{product.status}</Pill><h3>{product.name}</h3><p>{product.note} · last serviced {product.lastServiced}</p></div><ChevronRight/></Card>; }
function ProductMini({ p, go }) { return <Card className="mini" onClick={() => go('product', { selectedProductId: p.id })}><img src={p.image}/><h3>{p.name}</h3><p>{p.type} · {p.year}</p></Card>; }
function Products({ go, state }) {
  return <div><h1>My Products</h1><p className="muted">4 products / 1 needs attention</p><label className="search"><Search size={16}/><input placeholder="Search products"/></label><div className="tabs"><button>All</button><button>Needs Attention</button></div>{state.products.map(p=><ProductCard key={p.id} product={p} go={go}/>)}
  <Primary onClick={() => go('add')}>Add another product</Primary></div>;
}
function ProductDetails({ go, product, state }) {
  const updated = state.repairStatus === 'complete' && product.id === 'washer';
  return <div><h1>{product.name}</h1><p className="muted">{product.type} · {product.year}</p><img className="wide-img" src={product.image}/><Pill tone={updated ? 'ok' : product.health}>{updated ? 'Up to date' : product.status}</Pill>
    <Primary onClick={() => go('wrong')}>Diagnose a problem</Primary><InfoRows rows={updated ? ['Repair warranty active until 14 Dec 2026','Maintenance up to date','Last repaired Today'] : [product.warranty,'Maintenance due 2 weeks ago','Last serviced 8 months ago']}/>
    <Section title="Repair history"/><HistoryCards updated={updated}/><Section title="Product information"/><Card><p>Serial saved · Purchased in Delhi NCR · Household use</p></Card></div>;
}
function InfoRows({ rows }) { return <Card>{rows.map(r=><div className="row" key={r}><Check size={16}/><span>{r}</span></div>)}</Card>; }
function HistoryCards({ updated }) { return <>{updated && <Card><h3>Drum bearing replaced</h3><p>15 Sep 2026 · ₹2,650 · 90-day warranty</p></Card>}<Card><h3>Drain pump replaced</h3><p>18 Jun 2025 · ₹2,400 · 90-day warranty</p></Card></>; }
function Wrong({ go, patch, state, product }) { const opts=['Unusual noise','Not draining/filling','Not turning on','Not cleaning','Leaking','Something else']; return <div><h1>{product.name}</h1><p className="muted">Select the closest symptom.</p>{opts.map(o=><button className={`option ${state.issue===o?'selected':''}`} onClick={()=>patch({issue:o})} key={o}>{o}<ChevronRight size={16}/></button>)}<Primary onClick={()=>go('describe')}>Continue</Primary></div>; }
function Describe({ go, patch, state }) { return <div><Card><b>{state.issue || 'Unusual noise'}</b><p>LG Washing Machine · Spin cycle</p></Card><textarea defaultValue={state.description} onChange={e=>patch({description:e.target.value})} placeholder="Describe what you noticed">Makes a loud grinding noise while spinning, especially with heavier clothes.</textarea><div className="tabs"><button>Always</button><button>Sometimes</button><button>Spin</button></div><Primary onClick={()=>go('media')}>Continue</Primary></div>; }
function Media({ go, patch, state }) { return <div><h1>Add photo or video</h1><p className="muted">A short clip of the sound can improve the estimate.</p><button className="upload" onClick={()=>patch({uploaded:true})}>{state.uploaded ? <><Check/> Noise clip added</> : <><Camera/> Simulate upload</>}</button><Card><b>Tips</b><p>Record from a safe distance. Capture the spin sound and control panel.</p></Card><Primary onClick={()=>go('questions')}>{state.uploaded?'Continue':'Skip for now'}</Primary></div>; }
function Questions({ go, patch, state }) { const qs=['Does the drum move loosely by hand?','Is the washer vibrating more than usual?','Does the sound continue when empty?']; const i=state.aiAnswers.length; if(i>=qs.length) return <Done go={go}/>; return <div><h1>Quick check</h1><p className="muted">{i+1} of 3</p><Card><h2>{qs[i]}</h2>{['Yes','No','Not sure'].map(a=><button className="option" onClick={()=>patch({aiAnswers:[...state.aiAnswers,a]})} key={a}>{a}</button>)}</Card></div>; }
function Done({ go }) { return <div><h1>Ready to analyse</h1><Primary onClick={()=>go('analysing')}>Run AI-assisted estimate</Primary></div>; }
function Analysing({ go }) { useEffect(()=>{ const t=setTimeout(()=>go('causes'),1800); return()=>clearTimeout(t);},[]); return <div><h1>Analysing symptoms</h1><div className="loader"></div><InfoRows rows={['Checking product age and issue pattern','Comparing common LG front-load failures','Preparing AI-assisted estimate']}/><p className="muted">This is not a final diagnosis. Technician inspection may be required.</p></div>; }
function Causes({ go }) { return <div><h1>Here's what we found</h1><Card className="ai"><Pill>AI-assisted assessment</Pill><h2>Likely drum system issue</h2><p>Confidence: High</p></Card>{['Unbalanced drum','Worn drum bearing','Loose internal component'].map(c=><Card key={c}><h3>{c}</h3><p>Matches noise during spin and age of product.</p></Card>)}<Primary onClick={()=>go('estimate')}>See repair estimate</Primary><button className="text-btn" onClick={()=>go('repairers')}>Get inspected instead</button></div>; }
function Estimate({ go }) { return <div><h1>Repair or replace?</h1><Card className="estimate"><p>Estimated repair</p><h2>₹1,800-₹3,200</h2><Pill tone="ok">REPAIR MAY BE WORTH IT</Pill><p>About 20% of a similar new washing machine. Repair first, then decide after technician quote.</p></Card><InfoRows rows={['Inspection/labour ₹400-₹700','Drum bearing ₹1,500-₹2,300','Age: 5 years']}/><Primary onClick={()=>go('repairers')}>Find verified repairer</Primary><button className="text-btn">Save assessment</button></div>; }
function Repairers({ go, patch }) { return <div><Card className="estimate"><b>LG Washing Machine estimate</b><p>₹1,800-₹3,200 · Drum system issue</p></Card><div className="tabs"><button>Nearby</button><button>Top rated</button><button>Lowest fee</button></div>{repairers.map(r=><Card className="repairer" key={r.id} onClick={()=>go('repairer',{selectedRepairerId:r.id})}><div><h3>{r.name}</h3><p><Star size={14}/> {r.rating} · {r.repairs} repairs · {r.distance}</p><p>{r.specialty}</p></div><b>₹{r.fee}</b></Card>)}</div>; }
function RepairerDetails({ go, repairer }) { return <div><Card className="profile"><ShieldCheck/><h1>{repairer.name}</h1><p>{repairer.rating}/5 · {repairer.repairs} repairs · {repairer.distance}</p><Pill tone="ok">Verified</Pill></Card><InfoRows rows={[repairer.specialty,'₹299 inspection fee','Available today or tomorrow','90-day repair warranty on eligible parts']}/><Section title="Reviews"/><Card><p>“Clear quote, arrived on time, and explained the issue well.”</p></Card><Primary onClick={()=>go('schedule')}>Select repairer</Primary><button className="text-btn" onClick={()=>go('repairers')}>Compare another</button></div>; }
function Schedule({ go, repairer }) { return <div><Card><h3>{repairer.name}</h3><p>Inspection fee ₹299</p></Card><div className="tabs"><button>Today</button><button>Tomorrow</button><button>Friday</button></div><div className="time-grid">{['5:30 PM','6:30 PM','7:00 PM'].map(t=><button key={t}>{t}</button>)}</div><Card><MapPin/> <p>Home · 24 Green Park, New Delhi 110016</p></Card><Primary onClick={()=>go('confirmed')}>Confirm booking</Primary></div>; }
function Confirmed({ go, repairer }) { return <div className="success"><Check/><h1>Booking confirmed</h1><p>{repairer.name} will visit today at 5:30 PM.</p><InfoRows rows={['Technician inspects product','You receive a final quote','Repair starts only after approval']}/><Primary onClick={()=>go('tracking')}>Track repair</Primary><button className="text-btn">Add to calendar</button></div>; }
function Progress() { return <div className="progress">{['Booked','Inspection','Repair','Done'].map((s,i)=><span className={i<2?'on':''} key={s}>{s}</span>)}</div>; }
function Tracking({ go, repairer, patch }) { return <div><Progress/><Card><h2>Technician visit</h2><p>Today, 5:30 PM · 24 Green Park</p><p>{repairer.name} · Inspection fee ₹299</p></Card><InfoRows rows={['Booked','Technician visit','Inspection & quote','Repair','Complete']}/><Primary onClick={()=>go('quote')}>View quote</Primary><div className="split"><button><MessageCircle/> Message</button><button>Call</button></div></div>; }
function Quote({ go, patch }) { return <div><Card className="estimate"><p>Within your estimated range</p><h1>₹2,650</h1><p>Original estimate ₹1,800-₹3,200</p></Card><InfoRows rows={['Inspection/labour ₹500','Drum bearing ₹1,800','Service/visit ₹350','Genuine compatible part','90-day warranty']}/><Primary onClick={()=>go('approved',{repairStatus:'repair'})}>Approve repair</Primary><button className="text-btn">Ask about quote</button><button className="text-btn">Decline</button></div>; }
function Approved({ go, repairer, completeRepair }) { return <div className="success"><Check/><h1>Repair approved</h1><p>Approved total ₹2,650. {repairer.name} has started the repair.</p><Primary onClick={completeRepair}>Mark repair completed</Primary><button className="text-btn">Call repairer</button></div>; }
function Completed({ go, patch, state }) { return <div className="success"><Check/><h1>Repair completed</h1><p>Final amount ₹2,650 · warranty active until 14 Dec 2026.</p><InfoRows rows={['Drum bearing replaced','Repair record saved','Next maintenance: 15 Mar 2027']}/><Primary onClick={()=>patch({reminderSet:true})}>{state.reminderSet?'Reminder set':'Set reminder'}</Primary><button className="text-btn" onClick={()=>go('product')}>Back to My Products</button></div>; }
function Repairs({ go, state }) { return <div><h1>Repairs</h1><div className="tabs"><button>Active</button><button>History</button></div>{state.repairStatus !== 'complete' && <ProductCard product={state.products[0]} go={()=>go('tracking')}/>}<Card onClick={()=>go('repair-record')}><h3>Drum bearing replaced</h3><p>15 Sep 2026 · ₹2,650 · Rajesh Kumar Services</p></Card><button className="text-btn" onClick={()=>go('repair-history')}>View full history</button></div>; }
function RepairHistory({ go }) { return <div><h1>Repair History</h1><label className="search"><Search size={16}/><input placeholder="Search records"/></label><HistoryCards updated/></div>; }
function RepairRecord() { return <div><h1>Repair record</h1><Card className="estimate"><h2>₹2,650</h2><p>Completed 15 Sep 2026</p></Card><InfoRows rows={['Problem: unusual spin noise','Diagnosis: worn drum bearing','Part: genuine compatible drum bearing','Repairer: Rajesh Kumar Services','Warranty: 90 days']}/><Primary>Save/share record</Primary></div>; }
function Me({ go, state }) { const items=[['Personal details','personal'],['Addresses','addresses'],['Notifications','notifications'],['Payment methods','payments'],['Settings','settings'],['Help & support','help'],['About MEND','about']]; return <div><Card className="profile"><User/><h1>{state.profile.name}</h1><p>Delhi NCR · Family household</p></Card>{items.map(([l,r])=><button className="option" onClick={()=>go(r)} key={l}>{l}<ChevronRight size={16}/></button>)}</div>; }
function Personal({ state, patch }) { return <div><h1>Personal details</h1><input defaultValue={state.profile.name}/><input defaultValue={state.profile.phone}/><input defaultValue={state.profile.email}/><Primary onClick={()=>patch({profile:state.profile})}>Save details</Primary></div>; }
function Addresses() { return <div><h1>Addresses</h1><Card><h3>Home</h3><p>24 Green Park, New Delhi 110016</p></Card><Card><h3>Office</h3><p>12 Nehru Place, New Delhi 110019</p></Card><Primary>Add address</Primary></div>; }
function Notifications() { return <div><h1>Notifications</h1>{['Repair updates','Maintenance reminders','Warranty alerts'].map(x=><label className="toggle" key={x}>{x}<input type="checkbox" defaultChecked/></label>)}</div>; }
function SettingsScreen({ go }) { return <div><h1>Settings</h1>{['Notifications','Language','Appearance','Data & privacy','Permissions','Sign out','Delete account'].map(x=><button className="option" key={x}>{x}<ChevronRight size={16}/></button>)}</div>; }
function Help() { return <div><h1>Help & Support</h1><label className="search"><Search size={16}/><input placeholder="Search help"/></label>{['How accurate is diagnosis?','When do I pay?','Can I cancel a booking?'].map(x=><Card key={x}><h3>{x}</h3><p>Quick answer available in support.</p></Card>)}<Primary>Contact support</Primary></div>; }
function Payments() { return <div><h1>Payment Methods</h1><Card><h3>UPI</h3><p>anshu@okaxis · Default</p></Card><Card><CreditCard/><h3>HDFC ••••4821</h3></Card><p className="muted">Repair amount is paid after quote approval. Inspection fees may be separate. Prototype only, no real gateway.</p><Primary>Add payment</Primary></div>; }
function About() { return <div><Brand/><h1>Repair without the guesswork.</h1><p>MEND helps households diagnose, compare, repair, record, and maintain post-warranty products.</p><InfoRows rows={['Diagnose','Compare','Repair','Maintain','Version 1.0.0','Terms · Privacy · Licences']}/></div>; }

createRoot(document.getElementById('root')).render(<App />);
