import { Contact, JournalEntry, MeetingLog, StepWork, Streak, UserProfile, MembershipInfo } from '../types';

export interface PersistedState {
  user: UserProfile;
  sobrietyDate: string | null;
  journals: JournalEntry[];
  meetingLogs: MeetingLog[];
  contacts: Contact[];
  streak: Streak;
  stepWorkList: StepWork[];
  notificationsEnabled: boolean;
  membership: MembershipInfo;
}

const API_ENDPOINT = '/api/state';

export const createDefaultState = (userId: string): PersistedState => ({
  user: {
    id: userId,
    displayName: 'Guest',
    email: 'guest@example.com',
    avatar: 'https://i.pravatar.cc/100?img=65',
    homegroup: '',
    servicePosition: '',
    state: '',
    emergencyContact: undefined,
    joinedAt: undefined,
    isLoggedIn: false,
  },
  sobrietyDate: null,
  journals: [],
  meetingLogs: [],
  contacts: [],
  streak: { current: 0, longest: 0, lastCheckInDate: null },
  stepWorkList: [],
  notificationsEnabled: true,
  membership: {
    plan: 'Free',
    status: 'none',
    renewalDate: undefined,
    memberId: undefined,
    lastLoginEmail: '',
    checkoutName: '',
    state: '',
    confirmationNumber: undefined,
    lastUpdated: undefined,
    orders: [],
  },
});

export const fetchState = async (userId: string): Promise<PersistedState | null> => {
  const response = await fetch(`${API_ENDPOINT}?userId=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    throw new Error('Unable to load saved data');
  }
  return (await response.json()) as PersistedState | null;
};

export const saveState = async (userId: string, state: PersistedState): Promise<void> => {
  const response = await fetch(`${API_ENDPOINT}?userId=${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...state, user: { ...state.user, id: userId } }),
  });

  if (!response.ok) {
    throw new Error('Failed to save data');
  }
};
