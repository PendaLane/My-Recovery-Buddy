import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  CreditCard,
  FileText,
  Home,
  Info,
  KeyRound,
  LogOut,
  Receipt,
  ShieldCheck,
  UserRound,
  WalletCards,
} from 'lucide-react';
import { MembershipInfo, UserProfile } from '../types';

interface MembershipPortalProps {
  membership: MembershipInfo;
  user: UserProfile;
  onUpdateMembership: (data: Partial<MembershipInfo>) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogin: () => void;
  onLogout: () => void;
}

const pages = [
  { id: 'front', label: 'My Recovery Buddy (Front Page)', icon: Home },
  { id: 'about', label: 'About Us', icon: Info },
  { id: 'login', label: 'Login', icon: KeyRound },
  { id: 'levels', label: 'Membership Levels', icon: BadgeCheck },
  { id: 'checkout', label: 'Membership Checkout', icon: CreditCard },
  { id: 'confirmation', label: 'Membership Confirmation', icon: ShieldCheck },
  { id: 'billing', label: 'Membership Billing', icon: WalletCards },
  { id: 'cancel', label: 'Membership Cancel', icon: LogOut },
  { id: 'orders', label: 'Membership Orders', icon: Receipt },
  { id: 'profile', label: 'Your Profile', icon: UserRound },
  { id: 'logged-out', label: "You're logged out", icon: FileText },
];

export const MembershipPortal: React.FC<MembershipPortalProps> = ({
  membership,
  user,
  onUpdateMembership,
  onUpdateProfile,
  onLogin,
  onLogout,
}) => {
  const [activePage, setActivePage] = useState<string>('front');
  const [selectedPlan, setSelectedPlan] = useState<MembershipInfo['plan']>(membership.plan);
  const [checkoutForm, setCheckoutForm] = useState({
    name: membership.checkoutName || user.displayName || '',
    email: membership.lastLoginEmail || user.email || '',
    state: membership.state || user.state || '',
  });

  const currentStatusLabel = useMemo(() => {
    if (membership.status === 'active') return 'Active';
    if (membership.status === 'trialing') return 'Trial';
    if (membership.status === 'canceled') return 'Canceled';
    if (membership.status === 'paused') return 'Paused';
    if (membership.status === 'logged-out') return 'Logged out';
    return 'Not set';
  }, [membership.status]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    onUpdateMembership({ lastLoginEmail: checkoutForm.email, status: 'active' });
    setActivePage('levels');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-${Date.now()}`;
    const today = new Date();
    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + 1);

    onUpdateMembership({
      plan: selectedPlan,
      status: 'active',
      checkoutName: checkoutForm.name,
      lastLoginEmail: checkoutForm.email,
      state: checkoutForm.state,
      confirmationNumber: `CONF-${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`,
      renewalDate: renewal.toISOString(),
      memberId: membership.memberId || `MRB-${today.getTime()}`,
      orders: [
        {
          id: orderId,
          plan: selectedPlan,
          amount: selectedPlan === 'Annual' ? '$199/year' : selectedPlan === 'Monthly' ? '$24/month' : 'Free',
          date: today.toISOString(),
          status: 'paid',
        },
        ...membership.orders,
      ],
    });
    setActivePage('confirmation');
  };

  const handleProfileSave = (updates: Partial<UserProfile>) => {
    onUpdateProfile({ ...user, ...updates });
  };

  const handleCancelMembership = () => {
    onUpdateMembership({ status: 'canceled' });
  };

  const handleLogout = () => {
    onLogout();
    onUpdateMembership({ status: 'logged-out' });
    setActivePage('login');
  };

  const renderOrders = () => {
    if (!membership.orders.length) {
      return <p className="text-sm text-penda-text/70">No orders yet. Complete checkout to see receipts here.</p>;
    }

    return (
      <div className="space-y-2">
        {membership.orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between border border-penda-border rounded-soft p-3 bg-white">
            <div>
              <p className="font-semibold text-penda-text">{order.plan}</p>
              <p className="text-xs text-penda-text/70">{new Date(order.date).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-penda-purple">{order.amount}</p>
              <p className="text-xs text-penda-text/70 uppercase">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case 'about':
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">About Us</h3>
            <p className="text-sm text-penda-text">
              My Recovery Buddy is a private, stand-alone companion built by Penda Lane Behavioral Health. We provide meeting
              discovery, recovery journaling, treatment navigation, and safety tools without relying on WordPress or external portals.
            </p>
            <p className="text-sm text-penda-text">
              Your account, membership details, and check-ins are securely stored with Vercel so you can manage everything inside the
              app.
            </p>
          </div>
        );
      case 'login':
        return (
          <form onSubmit={handleLogin} className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">Member Login</h3>
            <p className="text-sm text-penda-text">Sign in to unlock your membership tools directly in the app.</p>
            <label className="block text-sm text-penda-text">
              Email
              <input
                type="email"
                value={checkoutForm.email}
                onChange={(e) => setCheckoutForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full mt-1 p-3 rounded-firm border border-penda-border"
                required
              />
            </label>
            <label className="block text-sm text-penda-text">
              Password
              <input type="password" className="w-full mt-1 p-3 rounded-firm border border-penda-border" required />
            </label>
            <button type="submit" className="w-full bg-penda-purple text-white py-3 rounded-firm font-semibold shadow">
              Sign In
            </button>
          </form>
        );
      case 'levels':
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">Membership Levels</h3>
            <p className="text-sm text-penda-text">Choose the plan that fits your support needs.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[{ label: 'Free', price: '$0', desc: 'Core tools and safety resources.' }, { label: 'Monthly', price: '$24/mo', desc: 'Full access with monthly billing.' }, { label: 'Annual', price: '$199/yr', desc: 'Best value with priority support.' }].map((plan) => (
                <button
                  key={plan.label}
                  onClick={() => {
                    setSelectedPlan(plan.label as MembershipInfo['plan']);
                    onUpdateMembership({ plan: plan.label as MembershipInfo['plan'] });
                    setActivePage('checkout');
                  }}
                  className={`border rounded-soft p-4 text-left shadow-sm transition ${
                    selectedPlan === plan.label ? 'border-penda-purple bg-penda-bg' : 'border-penda-border bg-white'
                  }`}
                >
                  <p className="text-lg font-bold text-penda-text">{plan.label}</p>
                  <p className="text-2xl font-extrabold text-penda-purple">{plan.price}</p>
                  <p className="text-sm text-penda-text/80">{plan.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 'checkout':
        return (
          <form onSubmit={handleCheckout} className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">Membership Checkout</h3>
            <p className="text-sm text-penda-text">Complete your details to start your {selectedPlan} plan.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block text-sm text-penda-text">
                Name on account
                <input
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full mt-1 p-3 rounded-firm border border-penda-border"
                  required
                />
              </label>
              <label className="block text-sm text-penda-text">
                Email
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full mt-1 p-3 rounded-firm border border-penda-border"
                  required
                />
              </label>
              <label className="block text-sm text-penda-text">
                State
                <input
                  value={checkoutForm.state}
                  onChange={(e) => setCheckoutForm((prev) => ({ ...prev, state: e.target.value }))}
                  className="w-full mt-1 p-3 rounded-firm border border-penda-border"
                  placeholder="e.g., Georgia"
                  required
                />
              </label>
            </div>
            <div className="p-3 rounded-soft border border-penda-border bg-penda-bg text-sm text-penda-text">
              We keep billing inside the app—no external WordPress checkout required.
            </div>
            <button type="submit" className="w-full bg-penda-purple text-white py-3 rounded-firm font-semibold shadow">
              Start {selectedPlan} Plan
            </button>
          </form>
        );
      case 'confirmation':
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">Membership Confirmation</h3>
            <p className="text-sm text-penda-text">Your membership is active. A confirmation is saved in-app.</p>
            <div className="border border-penda-border rounded-soft p-4 bg-white">
              <p className="text-sm text-penda-text">Plan: {membership.plan}</p>
              <p className="text-sm text-penda-text">Status: {currentStatusLabel}</p>
              <p className="text-sm text-penda-text">
                Confirmation #: {membership.confirmationNumber || 'Pending assignment'}
              </p>
              <p className="text-sm text-penda-text">
                Renews: {membership.renewalDate ? new Date(membership.renewalDate).toLocaleDateString() : 'Not scheduled'}
              </p>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">Membership Billing</h3>
            <p className="text-sm text-penda-text">
              View upcoming renewals and manage payment preferences without leaving the app.
            </p>
            <div className="border border-penda-border rounded-soft p-4 bg-white">
              <p className="text-sm text-penda-text">Current plan: {membership.plan}</p>
              <p className="text-sm text-penda-text">Status: {currentStatusLabel}</p>
              <p className="text-sm text-penda-text">
                Next renewal: {membership.renewalDate ? new Date(membership.renewalDate).toLocaleDateString() : 'Not scheduled'}
              </p>
            </div>
          </div>
        );
      case 'cancel':
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">Membership Cancel</h3>
            <p className="text-sm text-penda-text">Cancel your plan from here—no WordPress portal needed.</p>
            <button
              onClick={handleCancelMembership}
              className="bg-red-600 text-white px-4 py-3 rounded-firm font-semibold shadow hover:bg-red-700"
            >
              Cancel Membership
            </button>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">Membership Orders</h3>
            <p className="text-sm text-penda-text">Receipts and confirmations are saved with your profile.</p>
            {renderOrders()}
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">Your Profile</h3>
            <p className="text-sm text-penda-text">Update membership-facing details below.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block text-sm text-penda-text">
                Display Name
                <input
                  value={user.displayName}
                  onChange={(e) => handleProfileSave({ displayName: e.target.value })}
                  className="w-full mt-1 p-3 rounded-firm border border-penda-border"
                />
              </label>
              <label className="block text-sm text-penda-text">
                Email
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => handleProfileSave({ email: e.target.value })}
                  className="w-full mt-1 p-3 rounded-firm border border-penda-border"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateMembership({ status: 'active' })}
                className="bg-penda-purple text-white px-4 py-3 rounded-firm font-semibold"
              >
                Save Changes
              </button>
              <button onClick={handleLogout} className="bg-white text-penda-text px-4 py-3 rounded-firm border border-penda-border">
                Log Out
              </button>
            </div>
          </div>
        );
      case 'logged-out':
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">You’re logged out</h3>
            <p className="text-sm text-penda-text">Sign back in to access your membership benefits.</p>
            <button onClick={() => setActivePage('login')} className="bg-penda-purple text-white px-4 py-3 rounded-firm font-semibold">
              Go to Login
            </button>
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-penda-purple">Welcome to My Recovery Buddy</h3>
            <p className="text-sm text-penda-text">
              This is the in-app replacement for the old WordPress front page. Launch tools, view membership options, and manage
              your account without leaving My Recovery Buddy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-penda-border rounded-soft p-4 bg-white">
                <p className="text-sm text-penda-text font-semibold">Membership snapshot</p>
                <p className="text-2xl font-bold text-penda-purple">{membership.plan}</p>
                <p className="text-sm text-penda-text/70">Status: {currentStatusLabel}</p>
              </div>
              <div className="border border-penda-border rounded-soft p-4 bg-white">
                <p className="text-sm text-penda-text font-semibold">Next steps</p>
                <ul className="list-disc list-inside text-sm text-penda-text/80 space-y-1">
                  <li>Pick a membership level.</li>
                  <li>Finish checkout and save your confirmation.</li>
                  <li>Manage billing, orders, and cancelation here.</li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {pages.map((page) => {
          const Icon = page.icon;
          const isActive = activePage === page.id;
          return (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition ${
                isActive ? 'bg-penda-purple text-white border-penda-purple' : 'bg-white text-penda-text border-penda-border'
              }`}
            >
              <Icon size={16} />
              {page.label}
            </button>
          );
        })}
      </div>

      <div className="bg-penda-bg border border-penda-border rounded-soft p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-penda-text/70">Membership Center</p>
            <h2 className="text-2xl font-bold text-penda-purple">Standalone pages</h2>
            <p className="text-sm text-penda-text">
              These replace the previous WordPress pages—everything lives directly in the app now.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-penda-text/70">Plan</p>
            <p className="text-lg font-bold text-penda-purple">{membership.plan}</p>
            <p className="text-xs text-penda-text/60">Status: {currentStatusLabel}</p>
          </div>
        </div>

        <div className="bg-white border border-penda-border rounded-soft p-4 shadow-sm">{renderContent()}</div>
      </div>
    </div>
  );
};
