import { User, UsageRecord, Goal, Recommendation, HouseholdInputs } from '../types';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errData.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  // Auth
  async login(email: string): Promise<{ user: User; token: string }> {
    return fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async register(data: {
    name: string;
    email: string;
    householdSize: number;
    location: string;
  }): Promise<{ user: User; token: string }> {
    return fetchJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getProfile(): Promise<{ profile: User }> {
    return fetchJson('/api/profile');
  },

  async updateProfile(profileData: Partial<User>): Promise<{ profile: User }> {
    return fetchJson('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Records CRUD
  async getRecords(): Promise<{ records: UsageRecord[] }> {
    return fetchJson('/api/records');
  },

  async createRecord(input: HouseholdInputs): Promise<{ record: UsageRecord }> {
    return fetchJson('/api/records', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateRecord(id: string, input: Partial<HouseholdInputs>): Promise<{ record: UsageRecord }> {
    return fetchJson(`/api/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  async deleteRecord(id: string): Promise<{ success: boolean }> {
    return fetchJson(`/api/records/${id}`, {
      method: 'DELETE',
    });
  },

  // Goals CRUD
  async getGoals(): Promise<{ goals: Goal[] }> {
    return fetchJson('/api/goals');
  },

  async createGoal(goal: Partial<Goal>): Promise<{ goal: Goal }> {
    return fetchJson('/api/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  },

  async updateGoal(id: string, goal: Partial<Goal>): Promise<{ goal: Goal }> {
    return fetchJson(`/api/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    });
  },

  async deleteGoal(id: string): Promise<{ success: boolean }> {
    return fetchJson(`/api/goals/${id}`, {
      method: 'DELETE',
    });
  },

  // Recommendations
  async getRecommendations(): Promise<{ recommendations: Recommendation[] }> {
    return fetchJson('/api/recommendations');
  },
};
