import { Contact, JournalEntry, MeetingLog, StepWork, Streak, UserProfile } from '../types';

export interface PersistedState {
  user: UserProfile;
  sobrietyDate: string | null;
  journals: JournalEntry[];
  meetingLogs: MeetingLog[];
  contacts: Contact[];
  streak: Streak;
  stepWorkList: StepWork[];
  sessionStartedAt?: string | null;
}

export interface RemoteFlags {
  maintenanceMode?: boolean;
  analyticsEnabled?: boolean;
}

export interface RemoteStateResponse {
  state: PersistedState | null;
  flags: RemoteFlags;
}

const headers = {
  'Content-Type': 'application/json',
};

export const loadState = async (sessionId: string): Promise<RemoteStateResponse> => {
  try {
    const res = await fetch(`/api/state?sessionId=${encodeURIComponent(sessionId)}`);
    if (!res.ok) return { state: null, flags: {} };
    const data = (await res.json()) as RemoteStateResponse;
    return {
      state: data.state ?? null,
      flags: data.flags ?? {},
    };
  } catch (err) {
    console.warn('State load failed', err);
    return { state: null, flags: {} };
  }
};

const maybeUploadAvatar = async (user: UserProfile): Promise<UserProfile> => {
  if (!user.avatar || !user.avatar.startsWith('data:image')) return user;
  try {
    const res = await fetch('/api/upload-avatar', {
      method: 'POST',
      headers,
      body: JSON.stringify({ dataUrl: user.avatar }),
    });
    if (!res.ok) return user;
    const payload = (await res.json()) as { url?: string };
    if (payload.url) {
      return { ...user, avatar: payload.url };
    }
  } catch (err) {
    console.warn('Avatar upload failed, keeping inline data URL', err);
  }
  return user;
};

export const saveState = async (sessionId: string, state: PersistedState) => {
  try {
    const safeUser = await maybeUploadAvatar(state.user);
    const res = await fetch('/api/state', {
      method: 'POST',
      headers,
      body: JSON.stringify({ sessionId, state: { ...state, user: safeUser } }),
    });
    if (!res.ok) {
      console.warn('State save failed', await res.text());
    }
  } catch (err) {
    console.warn('State save crashed', err);
  }
};

export const recordSessionAnalytics = async (payload: {
  sessionId: string;
  userId: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
}) => {
  try {
    const res = await fetch('/api/session-analytics', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.warn('Analytics submit failed', await res.text());
    }
  } catch (err) {
    console.warn('Analytics crashed', err);
  }
};
