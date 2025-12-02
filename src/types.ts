export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatar: string;
  homegroup?: string;
  servicePosition?: string;
  isLoggedIn: boolean;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  mood: string;
  text: string;
  aiReflection?: string;
  userId?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: 'Sponsor' | 'Peer' | 'Therapist' | 'Family';
  phone: string;
  fellowship: 'AA' | 'NA' | 'CA' | 'Other';
}

export interface MeetingLog {
  id: string;
  timestamp: string;
  location?: string;
  type: 'Check-In' | 'Check-Out';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface StepWork {
  id: string;
  sponsorName: string;
  sponsorPhone: string;
  sponsorEmail: string;
  currentStep: string;
  weeklyPlan: string;
}

export interface Badge {
  id: string;
  key: string;
  label: string;
  earnedAt: string;
  icon: string;
}

export interface Streak {
  current: number;
  longest: number;
  lastCheckInDate: string | null;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  JOURNAL = 'JOURNAL',
  AI_COACH = 'AI_COACH',
  MEETINGS = 'MEETINGS',
  STEPWORK = 'STEPWORK',
  CONTACTS = 'CONTACTS',
  BADGES = 'BADGES',
  READINGS = 'READINGS',
  HELP = 'HELP',
  MY_ACCOUNT = 'MY_ACCOUNT'
}
