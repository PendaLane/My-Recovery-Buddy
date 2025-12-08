import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import {
  Badge,
  Contact,
  JournalEntry,
  MeetingLog as MeetingLogType, // Fixed: Renamed to avoid conflict
  StepWork,
  Streak,
  UserProfile,
  View,
} from './types';

// --- COMPONENTS ---
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Journal } from './components/Journal';
import { AICoach } from './components/AICoach';
import { MeetingFinder } from './components/MeetingFinder';
import { MeetingLog } from './components/MeetingLog';
import { StepWorkComponent } from './components/StepWork';
import { Badges } from './components/Badges';
import { Readings } from './components/Readings';
import { PhoneBook } from './components/PhoneBook';
import { FindTreatment } from './components/FindTreatment'; // Added missing import
import { MyAccount } from './components/MyAccount'; // Added missing import
import { SignIn } from './components/SignIn'; // Added missing import
import { SignUp } from './components/SignUp'; // Added missing import
import { About } from './components/About'; // Added missing import

import { loadState, recordSessionAnalytics, saveState, RemoteFlags } from './services/cloudStore';

const defaultUser: UserProfile = {
  id: 'guest',
  displayName: 'Guest',
  email: 'guest@example.com',
  avatar: 'https://i.pravatar.cc/100?img=65',
  isLoggedIn: false,
};

const sampleBadges: Badge[] = [
  { id: '1', key: 'first-journal', label: 'First Journal', earnedAt: '2024-01-10', icon: 'Award' },
  { id: '2', key: 'first-checkin', label: 'First Check-in', earnedAt: '2024-01-12', icon: 'Check' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [sobrietyDate, setSobrietyDate] = useState<string | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  // Fixed: Use MeetingLogType for the data, not the Component
  const [meetingLogs, setMeetingLogs] = useState<MeetingLogType[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [streak, setStreak] = useState<Streak>({ current: 0, longest: 0, lastCheckInDate: null });
  const [stepWorkList, setStepWorkList] = useState<StepWork[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [flags, setFlags] = useState<RemoteFlags>({});
  
  // Session ID Logic
  const [sessionId] = useState(() => {
    // Guard against environments without crypto/localStorage so the app still renders
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return defaultUser.id;

    const existing = localStorage.getItem('sessionId');
    if (existing) return existing;

    const nextId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

    localStorage.setItem('sessionId', nextId);
    return nextId;
  });
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false); // Fixed: Added missing state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Fixed: Added missing state

  // --- EFFECTS ---
  useEffect(() => {
    const hydrate = async () => {
      const remote = await loadState(sessionId);
      if (remote.flags) setFlags(remote.flags);
      if (remote.state) {
        setUser(remote.state.user || defaultUser);
        setSobrietyDate(remote.state.sobrietyDate ?? null);
        setJournals(remote.state.journals ?? []);
        setMeetingLogs(remote.state.meetingLogs ?? []);
        setContacts(remote.state.contacts ?? []);
        setStreak(remote.state.streak ?? { current: 0, longest: 0, lastCheckInDate: null });
        setStepWorkList(remote.state.stepWorkList ?? []);
        setSessionStartedAt(remote.state.sessionStartedAt ?? null);
      }
      setHydrated(true);
    };
    hydrate();
  }, [sessionId]);

  useEffect(() => {
    if (!hydrated) return;
    saveState(sessionId, {
      user,
      sobrietyDate,
      journals,
      meetingLogs,
      contacts,
      streak,
      stepWorkList,
      sessionStartedAt,
    });
  }, [hydrated, user, sobrietyDate, journals, meetingLogs, contacts, streak, stepWorkList, sessionId, sessionStartedAt]);

  useEffect(() => {
    const handleUnload = () => {
      if (user.isLoggedIn && sessionStartedAt) {
        const endedAt = new Date().toISOString();
        recordSessionAnalytics({
          sessionId,
          userId: user.id,
          startedAt: sessionStartedAt,
          endedAt,
          durationMs: new Date(endedAt).getTime() - new Date(sessionStartedAt).getTime(),
        });
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionStartedAt, sessionId, user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- HANDLERS ---
  const addJournalEntry = (entry: JournalEntry) => {
    setJournals((prev) => [...prev, entry]);
  };

  const handleSignIn = (displayName?: string) => {
    const now = new Date().toISOString();
    if (displayName) {
        setUser((prev) => ({
        ...prev,
        id: prev.id === defaultUser.id ? sessionId : prev.id,
        displayName: displayName,
        isLoggedIn: true,
        }));
        setCurrentView(View.DASHBOARD);
    } else {
        setCurrentView(View.SIGN_IN);
    }
    setSessionStartedAt(now);
  };

  const handleSignOut = () => {
    if (user.isLoggedIn && sessionStartedAt) {
      const endedAt = new Date().toISOString();
      recordSessionAnalytics({
        sessionId,
        userId: user.id,
        startedAt: sessionStartedAt,
        endedAt,
        durationMs: new Date(endedAt).getTime() - new Date(sessionStartedAt).getTime(),
      });
    }
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    setSessionStartedAt(null);
    setCurrentView(View.DASHBOARD);
  };

  const saveStepWork = (work: StepWork) => {
    setStepWorkList((prev) => [...prev, work]);
  };

  const deleteStepWork = (id: string) => {
    setStepWorkList((prev) => prev.filter((item) => item.id !== id));
  };

  const saveContact = (contact: Omit<Contact, 'id'>) => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString();
    setContacts((prev) => [...prev, { ...contact, id }]);
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  const updateStreakOnCheckIn = (timestamp: Date) => {
    setStreak((prev) => {
      const lastDate = prev.lastCheckInDate ? new Date(prev.lastCheckInDate) : null;
      const isConsecutive =
        lastDate &&
        lastDate.getFullYear() === timestamp.getFullYear() &&
        lastDate.getMonth() === timestamp.getMonth() &&
        timestamp.getDate() - lastDate.getDate() === 1;

      const current = isConsecutive ? prev.current + 1 : 1;
      return {
        current,
        longest: Math.max(prev.longest, current),
        lastCheckInDate: timestamp.toISOString(),
      };
    });
  };

  const handleCheckIn = (location: string) => {
    const now = new Date();
    setMeetingLogs((prev) => [
      { id: Date.now().toString(), timestamp: now.toISOString(), type: 'Check-In', location },
      ...prev,
    ]);
    updateStreakOnCheckIn(now);
  };

  const handleCheckOut = (location: string) => {
    const now = new Date();
    setMeetingLogs((prev) => [
      { id: Date.now().toString(), timestamp: now.toISOString(), type: 'Check-Out', location },
      ...prev,
    ]);
  };

  const shareApp = () => {
    const shareData = {
      title: 'My Recovery Buddy',
      text: 'Check out My Recovery Buddy — a supportive companion for your sobriety journey.',
      url: window.location.origin,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.warn('Share failed', err));
    } else {
      navigator.clipboard
        .writeText(`${shareData.text} ${shareData.url}`)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Unable to share automatically. Copy the URL manually.'));
    }
  };

  const streakCount = useMemo(() => streak.current, [streak]);

  const handleProfileUpdate = (profile: UserProfile) => {
    setUser(profile);
  };

  const handleCreateAccount = () => {
    setCurrentView(View.SIGN_UP);
  };

  const handleSignUpSubmit = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...profile,
      id: sessionId,
      isLoggedIn: true,
    }));
    setCurrentView(View.MY_ACCOUNT);
  };

  const handleSignInSubmit = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...profile,
      id: sessionId,
      isLoggedIn: true,
    }));
    setCurrentView(View.MY_ACCOUNT);
  };

  const resetAccount = () => {
    setUser(defaultUser);
    setSobrietyDate(null);
    setJournals([]);
    setMeetingLogs([]);
    setContacts([]);
    setStreak({ current: 0, longest: 0, lastCheckInDate: null });
    setStepWorkList([]);
    setNotificationsEnabled(false);
  };

  const renderView = () => {
    switch (currentView) {
      case View.JOURNAL:
        return <Journal entries={journals} addEntry={addJournalEntry} user={user} />;
      case View.AI_COACH:
        return <AICoach />;
      case View.MEETINGS:
        return <MeetingFinder />;
      case View.MEETING_LOG:
        return <MeetingLog logs={meetingLogs} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />;
      case View.STEPWORK:
        return (
          <StepWorkComponent
            stepWorkList={stepWorkList}
            saveStepWork={saveStepWork}
            deleteStepWork={deleteStepWork}
          />
        );
      case View.FIND_TREATMENT:
        return <FindTreatment />;
      case View.BADGES:
        return <Badges badges={sampleBadges} streak={streak} />;
      case View.READINGS:
        return <Readings />;
      case View.CONTACTS:
        return <PhoneBook contacts={contacts} onSave={saveContact} onDelete={deleteContact} emergencyContact={user.emergencyContact} />;
      case View.MY_ACCOUNT:
        return (
          <MyAccount
            user={user}
            onUpdateProfile={handleProfileUpdate}
            stats={{ streakCount, journalCount: journals.length, meetingCount: meetingLogs.length }}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={setNotificationsEnabled}
            onToggleAuth={user.isLoggedIn ? handleSignOut : handleSignIn}
            onResetAccount={resetAccount}
          />
        );
      case View.SIGN_UP:
        return <SignUp user={user} onSubmit={handleSignUpSubmit} />;
      case View.SIGN_IN:
        return <SignIn user={user} onSubmit={handleSignInSubmit} />;
      case View.ABOUT:
        return <About />;
      case View.HELP:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-penda-purple">Help & Crisis Support</h2>
            <p className="text-sm text-penda-light">
              If you are in immediate danger or feel unsafe, please call your local emergency number right away.
            </p>
            <div className="bg-white p-4 rounded-soft border border-penda-border space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <a href="tel:988" className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-3 rounded-firm font-semibold shadow-md hover:bg-red-700">
                  Call 988
                </a>
                <a href="sms:988" className="flex items-center justify-center gap-2 bg-white text-red-700 border border-red-200 px-3 py-3 rounded-firm font-semibold shadow-sm hover:bg-red-50">
                  Text 988
                </a>
                <a href="https://988lifeline.org/chat/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-white text-red-700 border border-red-200 px-3 py-3 rounded-firm font-semibold shadow-sm hover:bg-red-50">
                  Chat Online
                </a>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard
            sobrietyDate={sobrietyDate}
            setSobrietyDate={setSobrietyDate}
            journals={journals}
            streakCount={streakCount}
            user={user}
            onNavigate={setCurrentView}
            onCreateAccount={handleCreateAccount}
            onToggleAuth={user.isLoggedIn ? handleSignOut : handleSignIn}
          />
        );
    }
  };

   const headerTitle =
    currentView === View.DASHBOARD ? 'Welcome to My Recovery Buddy' : 'My Recovery Buddy';
  const headerSubtitle = 'Meetings. Sponsor. Support. In your pocket.';
  const maintenanceMode = flags.maintenanceMode ?? false;

  return (
    <div className="min-h-screen bg-penda-bg text-penda-text">
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar
          currentView={currentView}
          setView={setCurrentView}
          isMobile={isMobile}
          isLoggedIn={user.isLoggedIn}
          onSignOut={handleSignOut}
          shareApp={shareApp}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {maintenanceMode && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm px-4 py-3 rounded-soft shadow-sm">
                Live sync is in maintenance. You can keep working and your updates will save when
                connectivity returns.
              </div>
            )}

            {/* Header card - LOGO REMOVED */}
            <div className="bg-white border border-penda-border rounded-soft p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <h1 className="text-xl font-extrabold text-penda-purple leading-tight">
                    {headerTitle}
                  </h1>
                  <p className="text-sm text-penda-light">{headerSubtitle}</p>
                </div>
              </div>

              {!user.isLoggedIn && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => handleSignIn('Member')}
                    className="bg-penda-purple text-white px-4 py-2 rounded-firm text-sm font-semibold hover:bg-penda-light transition-colors"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => handleSignIn()}
                    className="bg-white border border-penda-purple text-penda-purple px-4 py-2 rounded-firm text-sm font-semibold hover:bg-penda-bg"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
