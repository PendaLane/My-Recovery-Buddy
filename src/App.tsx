import React, { useState, useEffect } from 'react';
import { View, JournalEntry, MeetingLog, Contact, StepWork, Badge, Streak, UserProfile } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AICoach } from './components/AICoach';
import { Journal } from './components/Journal';
import { StepWorkComponent } from './components/StepWork';
import { Readings } from './components/Readings';
import { Badges } from './components/Badges';
import { MeetingFinder } from './components/MeetingFinder';
import { Phone, AlertCircle, Siren, LogOut, LogIn, Share2, Award, Flame, Menu, X, Trash2, LayoutDashboard, MapPin, BotMessageSquare, BookHeart, FileText, BookOpen } from 'lucide-react';
import { getCurrentUser, loadState, saveState, WPState, subscribeToJournals } from './services/backend';

// Contacts View Helper (Defined outside to prevent re-render focus loss)
const ContactsView = ({ list, setList }: { list: Contact[], setList: React.Dispatch<React.SetStateAction<Contact[]>> }) => {
  const [f, setF] = useState<{
    name: string;
    phone: string;
    role: Contact['role'];
    fellowship: Contact['fellowship'];
  }>({ name: '', phone: '', role: 'Sponsor', fellowship: 'AA' });
  
  const save = () => {
      if(!f.name) return;
      setList([...list, { ...f, id: Date.now().toString() }]);
      setF({ name: '', phone: '', role: 'Sponsor', fellowship: 'AA' });
  };
  return (
      <div className="space-y-6">
          <header>
            <h2 className="text-2xl font-bold text-penda-purple">Phone Book</h2>
            <p className="text-sm text-penda-light mt-1">Keep your support network close.</p>
          </header>
          
          <div className="bg-white p-6 rounded-soft border border-penda-border shadow-sm space-y-3">
              <h3 className="font-bold text-penda-purple mb-2">Add Contact</h3>
              <div className="flex gap-3">
                  <input value={f.name} onChange={e=>setF({...f, name:e.target.value})} placeholder="Name" className="flex-1 p-3 border border-penda-border rounded-firm outline-none focus:border-penda-purple" />
                  <input value={f.phone} onChange={e=>setF({...f, phone:e.target.value})} placeholder="Phone" className="w-32 p-3 border border-penda-border rounded-firm outline-none focus:border-penda-purple" />
              </div>
              <div className="flex gap-3">
                  <select value={f.role} onChange={e=>setF({...f, role:e.target.value as Contact['role']})} className="flex-1 p-3 border border-penda-border rounded-firm bg-white"><option>Sponsor</option><option>Peer</option><option>Therapist</option><option>Family</option></select>
                  <select value={f.fellowship} onChange={e=>setF({...f, fellowship:e.target.value as Contact['fellowship']})} className="flex-1 p-3 border border-penda-border rounded-firm bg-white"><option>AA</option><option>NA</option><option>CA</option><option>Other</option></select>
              </div>
              <button onClick={save} className="w-full bg-penda-purple text-white py-3 rounded-firm font-bold hover:bg-penda-light transition-colors">Save Contact</button>
          </div>

          <div className="space-y-3">
              {list.length === 0 && <p className="text-penda-light text-sm italic">No contacts saved yet.</p>}
              {list.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-firm border border-penda-border flex justify-between items-center shadow-sm">
                      <div>
                          <div className="font-bold text-penda-text">{c.name}</div>
                          <div className="text-xs text-penda-light">{c.role} • {c.fellowship}</div>
                      </div>
                      <div className="flex items-center gap-3">
                          <a href={`tel:${c.phone}`} className="bg-penda-bg p-2 rounded-full text-penda-purple hover:bg-penda-purple hover:text-white transition-colors"><Phone size={18}/></a>
                          <button onClick={()=>setList(list.filter((l: Contact)=>l.id!==c.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.DASHBOARD);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App Data State
  const [sobrietyDate, setSobrietyDate] = useState<string | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [logs, setLogs] = useState<MeetingLog[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stepWork, setStepWork] = useState<StepWork[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [streak, setStreak] = useState<Streak>({ current: 0, longest: 0, lastCheckInDate: null });
  const [journalCount, setJournalCount] = useState(0);
  
  // Profile Photo & Name
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('mrb_photo') || "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g");
  const [userName, setUserName] = useState("Recovery Buddy");

  // 1. Initialize User & Load State
  useEffect(() => {
    const init = async () => {
      // Fetch User
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Update username display
      if (currentUser.isLoggedIn && currentUser.displayName) {
        setUserName(currentUser.displayName);
        if (!localStorage.getItem('mrb_photo')) {
            setProfilePhoto(currentUser.avatar);
        }
      } else {
        setUserName(localStorage.getItem('mrb_username') || "Recovery Buddy");
      }

      // Fetch WP State
      const state = await loadState(currentUser.isLoggedIn);
      if (state) {
        setSobrietyDate(state.sobrietyDate);
        setLogs(state.logs || []);
        setContacts(state.contacts || []);
        setStepWork(state.sponsors || []);
        setBadges(state.badges || []);
        setStreak(state.streak || { current: 0, longest: 0, lastCheckInDate: null });
        setJournalCount(state.journalCount || 0);
      }
      setIsLoading(false);
    };

    init();
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Sync Journal from Firebase
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToJournals(user, (entries) => {
        setJournals(entries);
    });
    return () => unsubscribe();
  }, [user]);

  // 3. Save State Effect
  useEffect(() => {
    if (isLoading || !user) return;
    
    const currentState: WPState = {
        logs,
        contacts,
        sponsors: stepWork,
        sobrietyDate,
        badges,
        streak,
        journalCount,
        chatCount: 0
    };

    saveState(currentState, user.isLoggedIn);
    
    // Local backups
    localStorage.setItem('mrb_date', sobrietyDate || '');
    localStorage.setItem('mrb_photo', profilePhoto);
    localStorage.setItem('mrb_username', userName);
  }, [logs, contacts, stepWork, sobrietyDate, badges, streak, journalCount, user, isLoading, profilePhoto, userName]);

  // Helper Functions
  const awardBadge = (key: string, label: string) => {
      if (badges.find(b => b.key === key)) return;
      const newBadge: Badge = { id: Date.now().toString(), key, label, earnedAt: new Date().toISOString(), icon: '🏅' };
      setBadges(prev => [...prev, newBadge]);
      alert(`🎉 You earned a badge: ${label}`);
  };

  const handleAddJournal = (entry: JournalEntry) => {
    const newCount = journalCount + 1;
    setJournalCount(newCount);
    if (newCount === 1) awardBadge('first_journal', 'First Journal Entry');
    if (newCount === 5) awardBadge('five_journals', '5 Journal Entries');
  };

  const handleCheckIn = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
          completeCheckIn(loc);
        },
        () => completeCheckIn("GPS Unavailable")
      );
    } else {
      completeCheckIn("GPS Not Supported");
    }
  };

  const completeCheckIn = (location: string) => {
    const newLog: MeetingLog = { id: Date.now().toString(), timestamp: new Date().toISOString(), type: 'Check-In', location };
    setLogs(prev => [newLog, ...prev]);
    
    const today = new Date().toISOString().slice(0,10);
    let newCurrent = streak.current;
    
    if (streak.lastCheckInDate !== today) {
        if (streak.lastCheckInDate) {
            const diff = Math.floor((new Date(today).getTime() - new Date(streak.lastCheckInDate).getTime()) / (1000 * 60 * 60 * 24));
            newCurrent = diff === 1 ? streak.current + 1 : 1;
        } else {
            newCurrent = 1;
        }
        setStreak({ current: newCurrent, longest: Math.max(newCurrent, streak.longest), lastCheckInDate: today });
    }

    const logCount = logs.filter(l => l.type === 'Check-In').length + 1;
    if (logCount === 1) awardBadge('first_meeting', 'First Check-In');
    if (logCount === 7) awardBadge('seven_meetings', '7 Meetings Logged');
    if (newCurrent === 7) awardBadge('seven_streak', '7-Day Streak');
    alert("Checked in successfully!");
  };

  const handleCheckOut = () => {
      const newLog: MeetingLog = { id: Date.now().toString(), timestamp: new Date().toISOString(), type: 'Check-Out' };
      setLogs(prev => [newLog, ...prev]);
      alert("Checked out.");
  };

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

  const handleNav = (id: View) => {
    setView(id);
    setMenuOpen(false);
  };

  if (isLoading) {
      return <div className="h-screen flex items-center justify-center bg-penda-cream text-penda-purple">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-penda-cream text-penda-text">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        isMobile={isMobile} 
        isLoggedIn={user?.isLoggedIn || false}
        shareApp={shareApp}
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 z-40 bg-penda-cream border-b border-penda-border shadow-sm -mx-4 -mt-4 p-4 mb-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex flex-col leading-tight min-w-0">
                        <span className="font-bold text-penda-purple text-sm truncate">My Recovery Buddy</span>
                        <span className="text-[9px] text-penda-text uppercase font-bold truncate">By Penda Lane Behavioral Health</span>
                        <span className="text-[8px] text-penda-light italic truncate">"Meetings. Sponsors. Support. In your pocket."</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)} 
                        className="p-2 bg-white rounded-lg border border-penda-border text-penda-purple hover:bg-penda-bg"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
             </div>

             {/* Mobile Menu */}
             {menuOpen && (
                 <div className="absolute top-full left-0 w-full bg-white border-b border-penda-border shadow-xl rounded-b-2xl p-4 flex flex-col gap-2 z-50 animate-in slide-in-from-top-2">
                    {/* Mobile Profile Card */}
                    <div className="bg-penda-bg p-4 rounded-xl flex items-center gap-3 mb-2">
                        <img src={profilePhoto} className="w-12 h-12 rounded-full border-2 border-penda-purple object-cover" onClick={() => document.getElementById('mob-photo')?.click()} />
                        <input type="file" id="mob-photo" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        
                        <div>
                            <div className="font-bold text-penda-purple">{userName}</div>
                            <div className="flex gap-2 text-xs mt-1">
                                <span className="flex items-center gap-1"><Flame size={12} className="text-orange-500"/> {streak.current}</span>
                                <span className="flex items-center gap-1"><Award size={12} className="text-yellow-600"/> {badges.length}</span>
                            </div>
                        </div>
                    </div>

                    {[
                        { id: View.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
                        { id: View.MEETINGS, icon: MapPin, label: 'Meeting Finder' },
                        { id: View.AI_COACH, icon: BotMessageSquare, label: 'AI Companion' },
                        { id: View.JOURNAL, icon: BookHeart, label: 'Journal' },
                        { id: View.STEPWORK, icon: FileText, label: 'My Stepwork' },
                        { id: View.BADGES, icon: Award, label: 'Badges' },
                        { id: View.READINGS, icon: BookOpen, label: 'Readings' },
                        { id: View.CONTACTS, icon: Phone, label: 'Phone Book' },
                    ].map(i => (
                        <button 
                            key={i.id} 
                            onClick={() => handleNav(i.id)} 
                            className={`flex items-center gap-4 p-3 rounded-xl text-sm font-medium transition-all ${view === i.id ? 'bg-penda-purple text-white' : 'bg-gray-50 text-penda-purple'}`}
                        >
                            <i.icon size={20} /> {i.label}
                        </button>
                    ))}
                    <div className="h-px bg-penda-border my-2"></div>
                    <button onClick={shareApp} className="flex items-center gap-4 p-3 rounded-xl text-sm font-medium bg-white border border-penda-border text-penda-purple">
                        <Share2 size={20} /> Share App
                    </button>
                    {user?.isLoggedIn ? (
                        <a href="/wp-login.php?action=logout&redirect_to=/" className="flex items-center gap-4 p-3 rounded-xl text-sm font-medium bg-white border border-penda-border text-penda-purple">
                            <LogOut size={20} /> Log Out
                        </a>
                    ) : (
                        <a href="/login/" className="flex items-center gap-4 p-3 rounded-xl text-sm font-medium bg-white border border-penda-border text-penda-purple">
                            <LogIn size={20} /> Sign In
                        </a>
                    )}
                    <button onClick={() => handleNav(View.HELP)} className="flex items-center gap-4 p-3 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-100">
                        <AlertCircle size={20} /> Help & Crisis
                    </button>
                 </div>
             )}
          </div>
        )}

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
            {view === View.DASHBOARD && <Dashboard sobrietyDate={sobrietyDate} setSobrietyDate={setSobrietyDate} journals={journals} streakCount={streak.current} />}
            {view === View.MEETINGS && <MeetingFinder logs={logs} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />}
            {view === View.AI_COACH && <AICoach />}
            {view === View.JOURNAL && <Journal entries={journals} addEntry={handleAddJournal} user={user!} />}
            {view === View.STEPWORK && <StepWorkComponent stepWorkList={stepWork} saveStepWork={w=>setStepWork(prev=>[...prev, w])} deleteStepWork={id=>setStepWork(prev=>prev.filter(i=>i.id!==id))} />}
            {view === View.BADGES && <Badges badges={badges} streak={streak} />}
            {view === View.READINGS && <Readings />}
            {view === View.CONTACTS && <ContactsView list={contacts} setList={setContacts} />}
            {view === View.HELP && (
                <div className="text-center pt-10 max-w-lg mx-auto">
                    <Siren size={80} className="mx-auto text-red-500 animate-pulse" />
                    <h2 className="text-3xl font-bold mt-6 mb-2 text-penda-text">Immediate Crisis Support</h2>
                    <p className="text-penda-light mb-8">If you are in danger or need immediate help, these options connect you now.</p>
                    <div className="space-y-4">
                        <a href="tel:988" className="block w-full bg-red-600 text-white p-4 rounded-xl font-bold text-xl hover:bg-red-700 shadow-lg">CALL 988</a>
                        <a href="sms:988" className="block w-full bg-white border-2 border-red-600 text-red-600 p-4 rounded-xl text-lg font-bold hover:bg-red-50">TEXT 988</a>
                        <a href="https://findtreatment.gov" target="_blank" className="block w-full bg-penda-text text-white p-4 rounded-xl text-lg font-bold hover:opacity-90">FIND TREATMENT NEAR YOU</a>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
