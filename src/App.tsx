import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import {
  Badge,
  Contact,
  JournalEntry,
  MeetingLog,
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
import { StepWorkComponent } from './components/StepWork';
import { Badges } from './components/Badges';
import { Readings } from './components/Readings';
import { PhoneBook } from './components/PhoneBook';
import { MyAccount } from './components/MyAccount';

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch (err) {
    console.warn(`Failed to read ${key} from storage`, err);
    return fallback;
  }
};

const persistToStorage = <T,>(key: string, value: T) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save ${key} to storage`, err);
  }
};

const defaultUser: UserProfile = {
  id: 'guest',
  displayName: 'Guest',
  email: 'guest@example.com',
  avatar: 'https://i.pravatar.cc/100?img=65',
  homegroup: '',
  servicePosition: '',
  isLoggedIn: false,
};

const sampleBadges: Badge[] = [
  { id: '1', key: 'first-journal', label: 'First Journal', earnedAt: '2024-01-10', icon: 'Award' },
  { id: '2', key: 'first-checkin', label: 'First Check-in', earnedAt: '2024-01-12', icon: 'Check' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [user, setUser] = useState<UserProfile>(() => loadFromStorage<UserProfile>('userProfile', defaultUser));
  const [sobrietyDate, setSobrietyDate] = useState<string | null>(() => loadFromStorage('sobrietyDate', null));
  const [journals, setJournals] = useState<JournalEntry[]>(() =>
    loadFromStorage<JournalEntry[]>('journalEntries', [])
  );
  const [meetingLogs, setMeetingLogs] = useState<MeetingLog[]>(() =>
    loadFromStorage<MeetingLog[]>('meetingLogs', [])
  );
  const [contacts, setContacts] = useState<Contact[]>(() => loadFromStorage<Contact[]>('contacts', []));
  const [streak, setStreak] = useState<Streak>(() =>
    loadFromStorage<Streak>('streak', { current: 0, longest: 0, lastCheckInDate: null })
  );
  const [stepWorkList, setStepWorkList] = useState<StepWork[]>(() =>
    loadFromStorage<StepWork[]>('stepWork', [])
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() =>
    loadFromStorage<boolean>('notificationsEnabled', true)
  );

  useEffect(() => {
    persistToStorage('userProfile', user);
  }, [user]);

  useEffect(() => {
    persistToStorage('sobrietyDate', sobrietyDate);
  }, [sobrietyDate]);

  useEffect(() => {
    persistToStorage('journalEntries', journals);
  }, [journals]);

  useEffect(() => {
    persistToStorage('meetingLogs', meetingLogs);
  }, [meetingLogs]);

  useEffect(() => {
    persistToStorage('contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    persistToStorage('streak', streak);
  }, [streak]);

  useEffect(() => {
    persistToStorage('stepWork', stepWorkList);
  }, [stepWorkList]);

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

  const handleCheckIn = () => {
    const now = new Date();
    setMeetingLogs((prev) => [
      { id: Date.now().toString(), timestamp: now.toISOString(), type: 'Check-In' },
      ...prev,
    ]);
    updateStreakOnCheckIn(now);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setMeetingLogs((prev) => [
      { id: Date.now().toString(), timestamp: now.toISOString(), type: 'Check-Out' },
      ...prev,
    ]);
  };

  const shareApp = () => {
    const shareData = {
      title: 'Recovery Buddy',
      text: 'Check out Recovery Buddy — a supportive companion for your sobriety journey.',
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

  const renderView = () => {
    switch (currentView) {
      case View.JOURNAL:
        return <Journal entries={journals} addEntry={addJournalEntry} user={user} />;
      case View.AI_COACH:
        return <AICoach />;
      case View.MEETINGS:
        return <MeetingFinder logs={meetingLogs} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />;
      case View.STEPWORK:
        return (
          <StepWorkComponent
            stepWorkList={stepWorkList}
            saveStepWork={saveStepWork}
            deleteStepWork={deleteStepWork}
          />
        );
      case View.BADGES:
        return <Badges badges={sampleBadges} streak={streak} />;
      case View.READINGS:
        return <Readings />;
      case View.CONTACTS:
        return <PhoneBook contacts={contacts} onSave={saveContact} onDelete={deleteContact} />;
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
      case View.HELP:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-penda-purple">Help & Crisis Support</h2>
            <p className="text-sm text-penda-light">
              If you are in immediate danger or feel unsafe, please call your local emergency number right away.
            </p>
            <div className="bg-white p-4 rounded-soft border border-penda-border space-y-2">
              <p className="text-sm text-penda-text">SAMHSA National Helpline (USA): 1-800-662-4357</p>
              <p className="text-sm text-penda-text">988 Suicide & Crisis Lifeline: Dial or text 988</p>
              <p className="text-sm text-penda-text">Emergency Services: 911</p>
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
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-penda-bg via-penda-tan to-white text-penda-text">
      <div className="min-h-screen bg-penda-bg text-penda-text">
        <div className="flex flex-col md:flex-row min-h-screen">
          <Sidebar
            currentView={currentView}
            setView={setCurrentView}
            isMobile={false}
            isLoggedIn={user.isLoggedIn}
            shareApp={shareApp}
          />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">{renderView()}</main>
        </div>
      </div>
    </div>
  );
};

export default App;
