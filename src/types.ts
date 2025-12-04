export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatar: string;
  homegroup?: string;
  servicePosition?: string;
  state?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation?: string;
  };
  joinedAt?: string;
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
  role: 'Sponsor' | 'Peer Support' | 'Therapist' | 'Family' | 'Friend';
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
  memberName?: string;
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

export interface MembershipInfo {
  plan: 'Free' | 'Monthly' | 'Annual' | 'Day Pass';
  status: 'none' | 'trialing' | 'active' | 'canceled' | 'paused' | 'logged-out';
  renewalDate?: string;
  memberId?: string;
  lastLoginEmail?: string;
  checkoutName?: string;
  state?: string;
  confirmationNumber?: string;
  lastUpdated?: string;
  orders: Array<{
    id: string;
    plan: string;
    amount: string;
    date: string;
    status: 'paid' | 'pending' | 'refunded';
  }>;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  JOURNAL = 'JOURNAL',
  AI_COACH = 'AI_COACH',
  MEETINGS = 'MEETINGS',
  MEETING_LOG = 'MEETING_LOG',
  STEPWORK = 'STEPWORK',
  CONTACTS = 'CONTACTS',
  BADGES = 'BADGES',
  READINGS = 'READINGS',
  FIND_TREATMENT = 'FIND_TREATMENT',
  HELP = 'HELP',
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  ABOUT = 'ABOUT',
  MY_ACCOUNT = 'MY_ACCOUNT'
}
