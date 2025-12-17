export interface MembershipRegistration {
  displayName: string;
  email: string;
  password: string;
  state: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
}

export const registerMembership = async (payload: MembershipRegistration) => {
  const res = await fetch('/api/register-membership', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Unable to register with WordPress/PMPro');
  }
};
