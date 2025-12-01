import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, BookHeart, BotMessageSquare, MapPin, Phone, 
  AlertCircle, FileText, Award, BookOpen, UserCog, LogOut, 
  TrendingUp, ShieldCheck, Send, Bot, Loader2, Sparkles, Save, 
  Plus, Trash2, User, Mail, Siren, CheckCircle, ExternalLink,
  Share2, Camera, Menu, X, Flame
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from '@google/genai';

// --- CONFIGURATION ---
const GEMINI_API_KEY = process.env.API_KEY || "";

// --- TYPES ---
type View = 'DASHBOARD' | 'MEETINGS' | 'AI_COACH' | 'JOURNAL' | 'STEPWORK' | 'BADGES' | 'READINGS' | 'CONTACTS' | 'HELP';

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  text: string;
  aiReflection?: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  fellowship: string;
}

interface StepWorkItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  step: string;
  plan: string;
}

interface MeetingLog {
  id: string;
  ts: string;
  type: 'Check-In' | 'Check-Out';
  location?: string;
}

interface Badge {
  id: string;
  key: string;
  label: string;
  earnedAt: string;
}

// --- AI SERVICE ---
let aiClient: GoogleGenAI | null = null;
if (GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (e) {
    console.error("AI Init Error", e);
  }
}

const getAICoachResponse = async (history: {role:string, text:string}[], msg: string) => {
  if (!aiClient) return "Please configure the API Key in Vercel Settings.";
  try {
    const model = "gemini-2.5-flash";
    const result = await aiClient.models.generateContent({
      model,
      contents: `You are "Recovery Buddy". Act as a compassionate, 12-step aware recovery coach and sponsor. Keep responses concise (under 100 words) and supportive. History: ${JSON.stringify(history.slice(-3))} User says: ${msg}`,
    });
    return result.text || "I'm here with you.";
  } catch (e) { 
    console.error(e);
    return "I'm having trouble connecting right now."; 
  }
};

const analyzeJournalEntry = async (text: string, mood: string) => {
  if (!aiClient) return "Good job writing this down.";
  try {
    const result = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Reflect on this journal (Mood: ${mood}): "${text}". Provide 2 sentences: one validation, one gentle encouragement.`,
    });
    return result.text || "Good job writing this down.";
  } catch (e) { return "Good job writing this down."; }
};

// --- MAIN APP COMPONENT ---
function App() {
  const [view, setView] = useState<View>('DASHBOARD');
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // -- STATE MANAGEMENT --
  const [sobrietyDate, setSobrietyDate] = useState(localStorage.getItem('mrb_date') || '');
  const [journals, setJournals] = useState<JournalEntry[]>(JSON.parse(localStorage.getItem('mrb_journals') || '[]'));
  const [contacts, setContacts] = useState<Contact[]>(JSON.parse(localStorage.getItem('mrb_contacts') || '[]'));
  const [stepwork, setStepwork] = useState<StepWorkItem[]>(JSON.parse(localStorage.getItem('mrb_stepwork') || '[]'));
  const [logs, setLogs] = useState<MeetingLog[]>(JSON.parse(localStorage.getItem('mrb_logs') || '[]'));
  const [badges, setBadges] = useState<Badge[]>(JSON.parse(localStorage.getItem('mrb_badges') || '[]'));
  const [streak, setStreak] = useState(parseInt(localStorage.getItem('mrb_streak') || '0'));
  const [lastCheckIn, setLastCheckIn] = useState(localStorage.getItem('mrb_last_checkin') || '');
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('mrb_photo') || "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g");
  const [userName, setUserName] = useState(localStorage.getItem('mrb_username') || "Recovery Buddy");

  // -- PERSISTENCE --
  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => localStorage.setItem('mrb_date', sobrietyDate), [sobrietyDate]);
  useEffect(() => localStorage.setItem('mrb_journals', JSON.stringify(journals)), [journals]);
  useEffect(() => localStorage.setItem('mrb_contacts', JSON.stringify(contacts)), [contacts]);
  useEffect(() => localStorage.setItem('mrb_stepwork', JSON.stringify(stepwork)), [stepwork]);
  useEffect(() => localStorage.setItem('mrb_logs', JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem('mrb_badges', JSON.stringify(badges)), [badges]);
  useEffect(() => localStorage.setItem('mrb_streak', streak.toString()), [streak]);
  useEffect(() => localStorage.setItem('mrb_last_checkin', lastCheckIn), [lastCheckIn]);
  useEffect(() => localStorage.setItem('mrb_photo', profilePhoto), [profilePhoto]);
  useEffect(() => localStorage.setItem('mrb_username', userName), [userName]);

  // -- CALCULATIONS & LOGIC --
  const daysSober = sobrietyDate ? Math.floor((new Date().getTime() - new Date(sobrietyDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const awardBadge = (key: string, label: string) => {
    if (!badges.find(b => b.key === key)) {
      setBadges([...badges, { id: Date.now().toString(), key, label, earnedAt: new Date().toISOString() }]);
      alert(`🎉 You earned a badge: ${label}`);
    }
  };

  const handleCheckIn = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationStr = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
          completeCheckIn(locationStr);
        },
        (error) => {
          console.warn("GPS Error", error);
          completeCheckIn("Location Unavailable");
        }
      );
    } else {
      completeCheckIn("GPS Not Supported");
    }
  };

  const completeCheckIn = (location: string) => {
    const today = new Date().toISOString().slice(0, 10);
    let newStreak = streak;
    
    if (lastCheckIn !== today) {
      if (lastCheckIn) {
        const diff = Math.floor((new Date(today).getTime() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60 * 24));
        newStreak = diff === 1 ? streak + 1 : 1;
      } else {
        newStreak = 1;
      }
      setStreak(newStreak);
      setLastCheckIn(today);
    }

    setLogs([{ id: Date.now().toString(), ts: new Date().toISOString(), type: 'Check-In', location }, ...logs]);
    
    if (logs.length === 0) awardBadge('first_mtg', 'First Meeting');
    if (newStreak === 7) awardBadge('streak_7', '7 Day Streak');
    if (newStreak === 30) awardBadge('streak_30', '30 Day Streak');
    alert("Checked In! " + location);
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const shareApp = async () => {
    const data = {
      title: 'My Recovery Buddy',
      text: 'Check out this free recovery companion app by Penda Lane.',
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch(e) {}
    } else {
      alert("Copy this link to share: " + window.location.href);
    }
  };

  const menuItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'MEETINGS', icon: MapPin, label: 'Meeting Finder' },
    { id: 'AI_COACH', icon: BotMessageSquare, label: 'AI Companion' },
    { id: 'JOURNAL', icon: BookHeart, label: 'Journal' },
    { id: 'STEPWORK', icon: FileText, label: 'My Stepwork' },
    { id: 'BADGES', icon: Award, label: 'Badges' },
    { id: 'READINGS', icon: BookOpen, label: 'Readings' },
    { id: 'CONTACTS', icon: Phone, label: 'Phone Book' },
  ];

  const handleNav = (id: string) => {
    setView(id as View);
    setMenuOpen(false);
  }

  const Sidebar = () => (
    <nav className="w-64 bg-[#f8e6f2] border-r border-[#e5cfe0] flex flex-col p-4 h-full shrink-0 overflow-y-auto">
        <div className="mb-8 text-center px-2">
          {/* USER PROFILE CARD (SIDEBAR) */}
          <div className="bg-white p-4 rounded-2xl border border-[#e5cfe0] mb-6 shadow-sm">
             <div className="relative group mx-auto w-16 h-16 mb-2">
                <img src={profilePhoto} alt="Profile" className="w-16 h-16 rounded-full border-2 border-[#7A0050] object-cover" />
                <label className="absolute bottom-0 right-0 bg-[#7A0050] text-white p-1 rounded-full cursor-pointer hover:bg-[#b33a89]">
                  <Camera size={12} />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
             </div>
             <input value={userName} onChange={e => setUserName(e.target.value)} className="text-center font-bold text-[#7A0050] w-full bg-transparent outline-none focus:bg-[#f8e6f2] rounded px-1" />
             
             {/* STATS ROW */}
             <div className="flex justify-center gap-3 mt-2 text-xs text-[#2d1b27]">
                <div className="flex items-center gap-1 bg-[#f8e6f2] px-2 py-1 rounded-full border border-[#e5cfe0]">
                    <Flame size={12} className="text-orange-500" /> 
                    <span className="font-bold">{streak}</span>
                </div>
                <div className="flex items-center gap-1 bg-[#f8e6f2] px-2 py-1 rounded-full border border-[#e5cfe0]">
                    <Award size={12} className="text-yellow-600" />
                    <span className="font-bold">{badges.length}</span>
                </div>
             </div>
          </div>
          
          <img 
            src="https://pendalane.com/wp-content/uploads/2024/04/cropped-Penda-Lane-Behavioral-Health-Logo.png" 
            alt="Penda Lane" 
            className="w-16 h-16 mx-auto mb-2 rounded-full object-cover mix-blend-multiply"
          />
          <h1 className="font-bold text-[#7A0050] text-lg leading-tight">My Recovery Buddy</h1>
          <p className="text-[10px] text-[#2d1b27] uppercase tracking-wide mt-1 font-semibold">By Penda Lane</p>
        </div>
      
      {menuItems.map(i => (
        <button key={i.id} onClick={() => handleNav(i.id)} className={`flex items-center gap-3 p-3 rounded-lg text-sm mb-1 whitespace-nowrap transition-all ${view === i.id ? 'bg-[#7A0050] text-white shadow-md' : 'text-[#7A0050] hover:bg-white hover:shadow-sm'}`}>
          <i.icon size={20} /> {i.label}
        </button>
      ))}

      <div className="mt-auto pt-4 border-t border-[#e5cfe0]/50 flex flex-col gap-2">
        <button onClick={shareApp} className="flex items-center gap-3 p-3 text-sm text-[#7A0050] hover:bg-white rounded-lg">
            <Share2 size={20} /> Share App
        </button>
        <a href="https://pendalane.com/membership-account/" className="flex items-center gap-3 p-3 text-sm text-[#7A0050] hover:bg-white rounded-lg">
            <UserCog size={20} /> My Membership
        </a>
        <button onClick={() => handleNav('HELP')} className="flex items-center gap-3 p-3 text-sm text-red-600 hover:bg-red-50 rounded-lg whitespace-nowrap font-medium">
            <AlertCircle size={20} /> Help & Crisis
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-[#FFF8EC] text-[#2d1b27]">
      {!mobile && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto relative">
        {/* MOBILE HEADER */}
        {mobile && (
          <div className="sticky top-0 z-40 bg-[#FFF8EC] border-b border-[#e5cfe0] shadow-sm">
             <div className="flex items-center justify-between p-4">
                {/* Branding Left */}
                <div className="flex items-center gap-3">
                    <img 
                        src="https://pendalane.com/wp-content/uploads/2024/04/cropped-Penda-Lane-Behavioral-Health-Logo.png" 
                        alt="Logo" 
                        className="w-10 h-10 rounded-full object-cover mix-blend-multiply border border-[#e5cfe0]"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-[#7A0050] text-sm leading-tight">Recovery Buddy</span>
                        <span className="text-[10px] text-[#b33a89]">Penda Lane</span>
                    </div>
                </div>

                {/* Right Profile & Menu */}
                <div className="flex items-center gap-4">
                    {/* User Stats / Profile */}
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-[#7A0050]">{userName}</span>
                            <div className="flex gap-2 text-[10px]">
                                <span className="flex items-center gap-0.5 text-orange-600"><Flame size={10} fill="currentColor" /> {streak}</span>
                                <span className="flex items-center gap-0.5 text-yellow-600"><Award size={10} fill="currentColor" /> {badges.length}</span>
                            </div>
                        </div>
                        <div className="relative">
                            <img 
                                src={profilePhoto} 
                                className="w-10 h-10 rounded-full border-2 border-[#7A0050] object-cover" 
                                onClick={() => document.getElementById('mob-photo')?.click()}
                            />
                            <input type="file" id="mob-photo" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </div>
                    </div>

                    {/* Hamburger Button */}
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)} 
                        className="p-2 bg-white rounded-lg border border-[#e5cfe0] text-[#7A0050]"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
             </div>

             {/* MOBILE DROPDOWN MENU */}
             {menuOpen && (
                 <div className="absolute top-full left-0 w-full bg-white border-b border-[#e5cfe0] shadow-xl rounded-b-2xl p-4 flex flex-col gap-2 z-50 animate-in slide-in-from-top-2">
                    {menuItems.map(i => (
                        <button 
                            key={i.id} 
                            onClick={() => handleNav(i.id)} 
                            className={`flex items-center gap-4 p-4 rounded-xl text-sm font-medium transition-all ${view === i.id ? 'bg-[#7A0050] text-white' : 'bg-[#f8e6f2] text-[#7A0050]'}`}
                        >
                            <i.icon size={20} /> {i.label}
                        </button>
                    ))}
                    <div className="h-px bg-[#e5cfe0] my-2"></div>
                    <a href="https://pendalane.com/membership-account/" className="flex items-center gap-4 p-4 rounded-xl text-sm font-medium bg-[#f8e6f2] text-[#7A0050]">
                        <UserCog size={20} /> My Membership
                    </a>
                    <button onClick={() => handleNav('HELP')} className="flex items-center gap-4 p-4 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-100">
                        <AlertCircle size={20} /> Help & Crisis
                    </button>
                 </div>
             )}
          </div>
        )}

        <div className="p-4 md:p-8 pb-24 max-w-5xl mx-auto">
            {/* --- VIEWS --- */}

            {view === 'DASHBOARD' && (
            <div className="space-y-6 animate-in fade-in">
                <div className="bg-gradient-to-r from-[#7A0050] to-[#b33a89] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                <Award className="absolute right-0 top-0 opacity-10" size={150} />
                <div className="relative z-10">
                    <h2 className="text-xl font-bold">Welcome Back, {userName}</h2>
                    <div className="mt-4 text-center">
                        <div className="text-5xl font-bold mb-1">{Math.max(0, daysSober)}</div>
                        <div className="text-sm opacity-90 uppercase tracking-wide">Days Sober</div>
                        {!sobrietyDate ? (
                            <div className="mt-4"><p className="text-sm mb-2">Set your date to start tracking:</p><input type="date" onChange={e => setSobrietyDate(e.target.value)} className="text-black p-2 rounded w-full max-w-xs" /></div>
                        ) : (
                            <button onClick={()=>setSobrietyDate('')} className="text-xs underline mt-4 opacity-70 hover:opacity-100">Reset Date</button>
                        )}
                    </div>
                </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-[#e5cfe0] shadow-sm">
                        <h3 className="font-bold text-[#7A0050] mb-4 flex items-center gap-2"><TrendingUp size={18}/> Mood History</h3>
                        <div className="h-48 w-full">
                            {journals.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={journals.slice(0,7).reverse().map(j => ({ score: j.mood === 'Great' ? 5 : j.mood === 'Crisis' ? 1 : 3 }))}>
                                        <Area type="monotone" dataKey="score" stroke="#7A0050" fill="#f8e6f2" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : <p className="text-sm text-gray-400 italic text-center pt-10">Log entries to see trends</p>}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-[#e5cfe0] shadow-sm space-y-4">
                        <h3 className="font-bold text-[#7A0050] mb-2 flex items-center gap-2"><ShieldCheck size={18}/> Stats</h3>
                        <div className="flex justify-between p-3 bg-[#f8e6f2] rounded-xl border border-[#e5cfe0]"><span>Check-in Streak</span><b className="text-[#7A0050]">{streak} Days</b></div>
                        <div className="flex justify-between p-3 bg-[#f8e6f2] rounded-xl border border-[#e5cfe0]"><span>Journal Entries</span><b className="text-[#7A0050]">{journals.length}</b></div>
                        <div className="flex justify-between p-3 bg-[#f8e6f2] rounded-xl border border-[#e5cfe0]"><span>Meetings Logged</span><b className="text-[#7A0050]">{logs.filter(l=>l.type==='Check-In').length}</b></div>
                    </div>
                </div>
            </div>
            )}

            {view === 'MEETINGS' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#7A0050]">Meeting Finder</h2>
                    <div className="bg-white p-6 rounded-2xl border border-[#e5cfe0] shadow-sm space-y-4">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                            <input id="loc" placeholder="City, Zip, or 'Near Me'" className="w-full p-3 pl-10 border border-[#e5cfe0] rounded-xl outline-none focus:border-[#7A0050]" />
                        </div>
                        <div className="flex gap-2">
                            {['AA','NA','CA'].map(t => (
                                <button key={t} onClick={() => {
                                    const loc = (document.getElementById('loc') as HTMLInputElement).value || 'near me';
                                    window.open(`https://google.com/maps/search/${t}+meeting+${loc}`, '_blank');
                                }} className="flex-1 bg-[#7A0050] text-white py-2 rounded-xl text-sm hover:bg-[#b33a89] transition-colors">{t} Meetings</button>
                            ))}
                        </div>
                        <div className="flex justify-center gap-4 text-xs">
                            <a href="https://aa.org" target="_blank" className="text-[#7A0050] hover:underline">AA.org</a>
                            <a href="https://na.org" target="_blank" className="text-[#7A0050] hover:underline">NA.org</a>
                            <a href="https://ca.org" target="_blank" className="text-[#7A0050] hover:underline">CA.org</a>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#e5cfe0] shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-[#7A0050]">Meeting Log</h3>
                            <div className="flex gap-2">
                                <button onClick={handleCheckIn} className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 hover:bg-green-700"><CheckCircle size={12}/> Check In</button>
                                <button onClick={() => setLogs([{id:Date.now().toString(), ts:new Date().toISOString(), type:'Check-Out'}, ...logs])} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs border border-gray-200 hover:bg-gray-200">Check Out</button>
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {logs.length === 0 ? <p className="text-sm text-gray-400 italic">No logs yet.</p> : logs.map(l => (
                                <div key={l.id} className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                    <div className="flex justify-between">
                                        <span>{new Date(l.ts).toLocaleString()}</span>
                                        <b className={l.type === 'Check-In' ? 'text-green-600' : 'text-gray-500'}>{l.type}</b>
                                    </div>
                                    {l.location && <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10}/> {l.location}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'AI_COACH' && <AICoachView />}
            
            {view === 'JOURNAL' && <JournalView journals={journals} setJournals={setJournals} awardBadge={awardBadge} />}

            {view === 'STEPWORK' && <StepWorkView list={stepwork} setList={setStepwork} />}

            {view === 'CONTACTS' && <ContactsView list={contacts} setList={setContacts} />}

            {view === 'BADGES' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#7A0050]">Badges & Achievements</h2>
                    <div className="bg-white p-6 rounded-2xl border border-[#e5cfe0] shadow-sm">
                        {badges.length === 0 ? <p className="text-gray-500 italic">No badges earned yet. Start using the app to unlock them!</p> : (
                            <div className="flex flex-wrap gap-3">
                                {badges.map(b => (
                                    <div key={b.id} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7A0050] bg-[#f8e6f2] text-[#7A0050]">
                                        <span className="text-xl">🏅</span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold">{b.label}</span>
                                            <span className="text-[10px] opacity-70">{new Date(b.earnedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {view === 'READINGS' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#7A0050]">Daily Readings</h2>
                    <div className="grid gap-3">
                        {[
                            {t:'Daily Reflections (AA)', u:'https://www.aa.org/daily-reflections', d:'Alcoholics Anonymous'},
                            {t:'Just For Today (NA)', u:'https://www.jftna.org/jft/', d:'Narcotics Anonymous'},
                            {t:'Hazelden Thought for the Day', u:'https://www.hazeldenbettyford.org/thought-for-the-day', d:'Daily Inspiration'},
                            {t:'Our Daily Bread', u:'https://odb.org', d:'Spiritual'}
                        ].map(r => (
                            <a key={r.t} href={r.u} target="_blank" className="flex justify-between items-center p-5 bg-white border border-[#e5cfe0] rounded-xl hover:bg-[#f8e6f2] transition-colors shadow-sm group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#f8e6f2] p-2 rounded-full text-[#7A0050] group-hover:bg-white"><BookOpen size={20}/></div>
                                    <div><div className="font-bold text-[#2d1b27]">{r.t}</div><div className="text-xs text-[#b33a89]">{r.d}</div></div>
                                </div>
                                <ExternalLink size={18} className="text-[#7A0050]"/>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {view === 'HELP' && (
                <div className="text-center pt-10 max-w-lg mx-auto">
                    <Siren size={80} className="mx-auto text-red-500 animate-pulse" />
                    <h2 className="text-3xl font-bold mt-6 mb-2 text-[#2d1b27]">Immediate Crisis Support</h2>
                    <p className="text-gray-600 mb-8">If you are in danger or need immediate help, these options connect you now.</p>
                    
                    <div className="space-y-4">
                        <a href="tel:988" className="block w-full bg-red-600 text-white p-4 rounded-xl font-bold text-xl hover:bg-red-700 shadow-lg transition-transform hover:scale-[1.02]">
                            CALL 988
                        </a>
                        <a href="sms:988" className="block w-full bg-white border-2 border-red-600 text-red-600 p-4 rounded-xl text-lg font-bold hover:bg-red-50 transition-colors">
                            TEXT 988
                        </a>
                        <a href="https://findtreatment.gov" target="_blank" className="block w-full bg-[#2d1b27] text-white p-4 rounded-xl text-lg font-bold hover:opacity-90">
                            FIND TREATMENT NEAR YOU
                        </a>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS (DEFINED LOCALLY TO KEEP SINGLE FILE) ---

const AICoachView = () => {
    const [msg, setMsg] = useState('');
    const [history, setHistory] = useState<{role:string, text:string}[]>([{role:'model', text:"Hi, I'm your Recovery Buddy. How are you feeling today?"}]);
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [history]);

    const send = async () => {
        if(!msg.trim()) return;
        const newHistory = [...history, {role:'user', text:msg}];
        setHistory(newHistory);
        setMsg('');
        setLoading(true);
        const response = await getAICoachResponse(newHistory, msg);
        setHistory([...newHistory, {role:'model', text: response}]);
        setLoading(false);
    }

    return (
        <div className="flex flex-col h-[70vh] bg-white rounded-2xl border border-[#e5cfe0] shadow-sm overflow-hidden">
            <div className="bg-[#f8e6f2] p-4 border-b border-[#e5cfe0] flex items-center gap-3">
                <div className="bg-white p-2 rounded-full text-[#7A0050]"><Bot size={20}/></div>
                <div><h3 className="font-bold text-[#7A0050]">AI Companion</h3><p className="text-xs text-[#b33a89]">Private & Secure</p></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.map((m, i) => (
                    <div key={i} className={`p-3 rounded-xl max-w-[85%] text-sm ${m.role==='user'?'ml-auto bg-[#7A0050] text-white':'bg-gray-100 text-[#2d1b27]'}`}>
                        {m.text}
                    </div>
                ))}
                {loading && <div className="text-xs text-gray-400 flex items-center gap-1"><Loader2 className="animate-spin" size={12}/> Thinking...</div>}
                <div ref={endRef} />
            </div>
            <div className="p-4 border-t border-[#e5cfe0] flex gap-2">
                <input className="flex-1 border border-[#e5cfe0] p-3 rounded-xl outline-none focus:border-[#7A0050]" value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type here..." />
                <button onClick={send} disabled={loading} className="bg-[#7A0050] text-white p-3 rounded-xl hover:bg-[#b33a89] disabled:opacity-50"><Send size={18}/></button>
            </div>
        </div>
    )
}

const JournalView = ({ journals, setJournals, awardBadge }: { journals: JournalEntry[], setJournals: any, awardBadge: any }) => {
    const [view, setView] = useState('list');
    const [mood, setMood] = useState('Okay');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const save = async () => {
        if(!text) return;
        setLoading(true);
        const ai = await analyzeJournalEntry(text, mood);
        const newEntry = { id: Date.now().toString(), date: new Date().toISOString(), mood, text, aiReflection: ai };
        const newList = [newEntry, ...journals];
        setJournals(newList);
        setLoading(false); setText(''); setView('list');
        if(newList.length === 1) awardBadge('journal_1', 'First Journal');
        if(newList.length === 5) awardBadge('journal_5', '5 Journal Entries');
    };

    if(view === 'new') return (
        <div className="bg-white p-6 rounded-2xl border border-[#e5cfe0] shadow-sm space-y-4">
            <h3 className="font-bold text-[#7A0050]">New Entry</h3>
            <div className="flex gap-2 flex-wrap">
                {['Great','Good','Okay','Struggling','Crisis'].map(m => (
                    <button key={m} onClick={()=>setMood(m)} className={`px-4 py-2 rounded-full text-sm border ${mood===m?'bg-[#7A0050] text-white':'bg-white text-gray-600'}`}>{m}</button>
                ))}
            </div>
            <textarea className="w-full border border-[#e5cfe0] p-4 rounded-xl h-40 outline-none focus:border-[#7A0050]" value={text} onChange={e=>setText(e.target.value)} placeholder="What's on your mind?" />
            <div className="flex gap-2">
                <button onClick={save} disabled={loading} className="flex-1 bg-[#7A0050] text-white py-3 rounded-xl font-bold hover:bg-[#b33a89] flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Save
                </button>
                <button onClick={()=>setView('list')} className="px-6 py-3 border border-[#e5cfe0] rounded-xl text-[#7A0050] hover:bg-gray-50">Cancel</button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#7A0050]">Journal</h2>
                <button onClick={()=>setView('new')} className="bg-[#7A0050] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-[#b33a89]"><Plus size={18}/> New Entry</button>
            </div>
            <div className="space-y-4">
                {journals.length === 0 ? <p className="text-gray-400 italic text-center py-10">No entries yet.</p> : journals.map(j => (
                    <div key={j.id} className="bg-white p-5 rounded-2xl border border-[#e5cfe0] shadow-sm">
                        <div className="flex justify-between mb-3 text-xs">
                            <span className="px-3 py-1 bg-[#f8e6f2] text-[#7A0050] rounded-full font-bold">{j.mood}</span>
                            <span className="text-gray-400">{new Date(j.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-[#2d1b27] mb-4 whitespace-pre-wrap">{j.text}</p>
                        {j.aiReflection && <div className="bg-[#f8e6f2] p-3 rounded-xl text-xs text-[#7A0050] flex gap-2"><Sparkles size={16} className="shrink-0"/> <div><b>AI Reflection:</b> {j.aiReflection}</div></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const StepWorkView = ({ list, setList }: { list: StepWorkItem[], setList: any }) => {
    const [f, setF] = useState({ name: '', phone: '', email: '', step: 'Step 1', plan: '' });
    const save = () => {
        if(!f.name) return;
        setList([...list, { ...f, id: Date.now().toString() }]);
        setF({ name: '', phone: '', email: '', step: 'Step 1', plan: '' });
    };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#7A0050]">My Stepwork</h2>
            <div className="bg-white p-6 rounded-2xl border border-[#e5cfe0] shadow-sm space-y-3">
                <input value={f.name} onChange={e=>setF({...f, name:e.target.value})} placeholder="Sponsor Name" className="w-full p-3 border border-[#e5cfe0] rounded-xl outline-none" />
                <div className="flex gap-3">
                    <input value={f.phone} onChange={e=>setF({...f, phone:e.target.value})} placeholder="Phone" className="w-full p-3 border border-[#e5cfe0] rounded-xl outline-none" />
                    <input value={f.email} onChange={e=>setF({...f, email:e.target.value})} placeholder="Email" className="w-full p-3 border border-[#e5cfe0] rounded-xl outline-none" />
                </div>
                <select value={f.step} onChange={e=>setF({...f, step:e.target.value})} className="w-full p-3 border border-[#e5cfe0] rounded-xl bg-white">{[...Array(12)].map((_,i)=><option key={i} value={`Step ${i+1}`}>Step {i+1}</option>)}</select>
                <textarea value={f.plan} onChange={e=>setF({...f, plan:e.target.value})} placeholder="Weekly Plan..." className="w-full p-3 border border-[#e5cfe0] rounded-xl h-24 outline-none" />
                <button onClick={save} className="w-full bg-[#7A0050] text-white py-3 rounded-xl font-bold hover:bg-[#b33a89]">Save Info</button>
            </div>
            <div className="space-y-3">
                {list.map(i => (
                    <div key={i.id} className="bg-white p-4 rounded-2xl border border-[#e5cfe0] flex justify-between items-start">
                        <div>
                            <div className="font-bold text-[#7A0050]">{i.name}</div>
                            <div className="text-xs text-gray-500 mb-2">{i.phone} • {i.email}</div>
                            <div className="text-sm font-medium">{i.step}</div>
                            <div className="text-xs bg-[#f8e6f2] p-2 rounded-lg mt-2">{i.plan}</div>
                        </div>
                        <button onClick={()=>setList(list.filter(l=>l.id!==i.id))} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ContactsView = ({ list, setList }: { list: Contact[], setList: any }) => {
    const [f, setF] = useState({ name: '', phone: '', role: 'Sponsor', fellowship: 'AA' });
    const save = () => {
        if(!f.name) return;
        setList([...list, { ...f, id: Date.now().toString() }]);
        setF({ name: '', phone: '', role: 'Sponsor', fellowship: 'AA' });
    };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#7A0050]">Phone Book</h2>
            <div className="bg-white p-6 rounded-2xl border border-[#e5cfe0] shadow-sm space-y-3">
                <div className="flex gap-3">
                    <input value={f.name} onChange={e=>setF({...f, name:e.target.value})} placeholder="Name" className="flex-1 p-3 border border-[#e5cfe0] rounded-xl outline-none" />
                    <input value={f.phone} onChange={e=>setF({...f, phone:e.target.value})} placeholder="Phone" className="w-32 p-3 border border-[#e5cfe0] rounded-xl outline-none" />
                </div>
                <div className="flex gap-3">
                    <select value={f.role} onChange={e=>setF({...f, role:e.target.value})} className="flex-1 p-3 border border-[#e5cfe0] rounded-xl bg-white"><option>Sponsor</option><option>Peer</option><option>Therapist</option></select>
                    <select value={f.fellowship} onChange={e=>setF({...f, fellowship:e.target.value})} className="flex-1 p-3 border border-[#e5cfe0] rounded-xl bg-white"><option>AA</option><option>NA</option><option>CA</option><option>Other</option></select>
                </div>
                <button onClick={save} className="w-full bg-[#7A0050] text-white py-3 rounded-xl font-bold hover:bg-[#b33a89]">Add Contact</button>
            </div>
            <div className="space-y-2">
                {list.map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-xl border border-[#e5cfe0] flex justify-between items-center shadow-sm">
                        <div>
                            <div className="font-bold text-[#2d1b27]">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.role} • {c.fellowship}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href={`tel:${c.phone}`} className="bg-[#f8e6f2] p-2 rounded-full text-[#7A0050] hover:bg-[#7A0050] hover:text-white transition-colors"><Phone size={18}/></a>
                            <button onClick={()=>setList(list.filter(l=>l.id!==c.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
