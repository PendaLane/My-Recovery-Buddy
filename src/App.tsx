import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import {
  Badge,
  Contact,
  JournalEntry,
  MeetingLog,
  MembershipInfo,
  StepWork,
  Streak,
  UserProfile,
  View
} from './types';
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
import { MyAccount } from './components/MyAccount';
import { FindTreatment } from './components/FindTreatment';
import { SignUp } from './components/SignUp';
import { MembershipPortal } from './components/MembershipPortal';
import { createDefaultState, fetchState, PersistedState, saveState } from './services/stateService';

const getOrCreateClientId = () => {
  const existing = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('mrb_user_id='));

  if (existing) {
    return existing.split('=')[1];
  }

  const newId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `user-${Date.now()}`;
  document.cookie = `mrb_user_id=${newId}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  return newId;
};

const sampleBadges: Badge[] = [
  { id: '1', key: 'first-journal', label: 'First Journal', earnedAt: '2024-01-10', icon: 'Award' },
  { id: '2', key: 'first-checkin', label: 'First Check-in', earnedAt: '2024-01-12', icon: 'Check' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [clientId] = useState<string>(() => getOrCreateClientId());
  const [isHydrating, setIsHydrating] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(() => createDefaultState(getOrCreateClientId()).user);
  const [sobrietyDate, setSobrietyDate] = useState<string | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [meetingLogs, setMeetingLogs] = useState<MeetingLog[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [streak, setStreak] = useState<Streak>({ current: 0, longest: 0, lastCheckInDate: null });
  const [stepWorkList, setStepWorkList] = useState<StepWork[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [membership, setMembership] = useState<MembershipInfo>(() => createDefaultState(getOrCreateClientId()).membership);

  useEffect(() => {
    const defaultState = createDefaultState(clientId);

    const applyState = (state: PersistedState) => {
      setUser(state.user || defaultState.user);
      setSobrietyDate(state.sobrietyDate ?? defaultState.sobrietyDate);
      setJournals(state.journals ?? defaultState.journals);
      setMeetingLogs(state.meetingLogs ?? defaultState.meetingLogs);
      setContacts(state.contacts ?? defaultState.contacts);
      setStreak(state.streak ?? defaultState.streak);
      setStepWorkList(state.stepWorkList ?? defaultState.stepWorkList);
      setNotificationsEnabled(state.notificationsEnabled ?? defaultState.notificationsEnabled);
      setMembership(state.membership ?? defaultState.membership);
    };

    fetchState(clientId)
      .then((state) => {
        applyState(state || defaultState);
      })
      .catch((err) => {
        console.warn('Falling back to default state', err);
        applyState(defaultState);
      })
      .finally(() => setIsHydrating(false));
  }, [clientId]);

  useEffect(() => {
    if (isHydrating) return;
    const state: PersistedState = {
      user: { ...user, id: clientId },
      sobrietyDate,
      journals,
      meetingLogs,
      contacts,
      streak,
      stepWorkList,
      notificationsEnabled,
      membership,
    };

    saveState(clientId, state).catch((err) => {
      console.error('Failed to save state to Vercel KV', err);
    });
  }, [clientId, user, sobrietyDate, journals, meetingLogs, contacts, streak, stepWorkList, notificationsEnabled, isHydrating]);

  useEffect(() => {
    persistToStorage('notificationsEnabled', notificationsEnabled);
  }, [notificationsEnabled]);

  const addJournalEntry = (entry: JournalEntry) => {
    setJournals((prev) => [...prev, entry]);
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

  const handleSignInOut = () => {
    setUser((prev) => ({
      ...prev,
      id: clientId,
      isLoggedIn: !prev.isLoggedIn,
      joinedAt: prev.joinedAt || new Date().toISOString(),
    }));
  };

  const handleCreateAccount = () => {
    setCurrentView(View.SIGN_UP);
  };

  const handleSignUpSubmit = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...profile,
      id: clientId,
      isLoggedIn: true,
    }));
    setCurrentView(View.MY_ACCOUNT);
  };

  const updateMembership = (updates: Partial<MembershipInfo>) => {
    setMembership((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
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
      case View.MEMBERSHIP:
        return (
          <MembershipPortal
            membership={membership}
            user={user}
            onUpdateMembership={updateMembership}
            onUpdateProfile={handleProfileUpdate}
            onLogin={() => setUser((prev) => ({ ...prev, isLoggedIn: true }))}
            onLogout={() => setUser((prev) => ({ ...prev, isLoggedIn: false }))}
          />
        );
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
          />
        );
      case View.SIGN_UP:
        return <SignUp user={user} onSubmit={handleSignUpSubmit} />;
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a href="tel:18006624357" className="flex items-center justify-center gap-2 bg-penda-purple text-white px-3 py-3 rounded-firm font-semibold shadow-md hover:bg-penda-light">
                  SAMHSA Helpline 1-800-662-4357
                </a>
                <a href="tel:911" className="flex items-center justify-center gap-2 bg-penda-tan text-penda-purple px-3 py-3 rounded-firm font-semibold shadow-sm border border-penda-border">
                  Emergency Services (911)
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
            onToggleAuth={handleSignInOut}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-penda-bg text-penda-text">
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar
          currentView={currentView}
          setView={setCurrentView}
          isMobile={false}
          isLoggedIn={user.isLoggedIn}
          shareApp={shareApp}
        />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">{renderView()}</main>
          <footer className="border-t border-penda-border bg-white text-xs text-penda-light text-center py-3">
            © My Recovery Buddy by Penda Lane Behavioral Health — All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
