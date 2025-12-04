import React, { useState } from 'react';
import { Contact } from '../types';
import { Phone, UserPlus, Trash2, Shield } from 'lucide-react';

interface PhoneBookProps {
  contacts: Contact[];
  onSave: (contact: Omit<Contact, 'id'>) => void;
  onDelete: (id: string) => void;
  emergencyContact?: { name: string; phone: string; relation?: string };
}

const roleOptions: Contact['role'][] = ['Sponsor', 'Peer', 'Therapist', 'Family', 'Friend'];
const fellowshipOptions: Contact['fellowship'][] = [
  'AA',
  'NA',
  'CA',
  'ACA',
  'DRA',
  'LifeRing',
  'SMART Recovery',
  'White Bison',
  'Recovery Dharma',
  'Refuge Recovery',
  'Celebrate Recovery',
  'Alcoholics for Christ',
  'Pioneer Association',
  'MAT',
  'Recovery 2.0',
  'Phoenix',
  'ROCovery Fitness',
  'Fit To Recover',
  'In The Rooms',
  'Other',
];

export const PhoneBook: React.FC<PhoneBookProps> = ({ contacts, onSave, onDelete, emergencyContact }) => {
  const [form, setForm] = useState<Omit<Contact, 'id'>>({
    name: '',
    role: 'Sponsor',
    phone: '',
    fellowship: 'AA',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    onSave({
      name: form.name.trim(),
      role: form.role,
      phone: form.phone.trim(),
      fellowship: form.fellowship,
    });
    setForm({ name: '', role: 'Sponsor', phone: '', fellowship: 'AA' });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-penda-purple">Trusted Phone Book</h2>
        <p className="text-sm text-penda-light">
          Keep your sponsor, peers, and providers handy. Contacts are saved securely to My Recovery Buddy.
        </p>
      </header>

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="text-penda-purple" size={20} />
          <h3 className="font-bold text-penda-purple">Add a Contact</h3>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-penda-light mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-penda-border rounded-firm focus:outline-none focus:border-penda-purple"
              placeholder="Sponsor, peer, or provider"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-penda-light mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as Contact['role'] }))}
              className="w-full p-2 border border-penda-border rounded-firm focus:outline-none focus:border-penda-purple bg-white"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-penda-light mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full p-2 border border-penda-border rounded-firm focus:outline-none focus:border-penda-purple"
              placeholder="555-123-4567"
              type="tel"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-penda-light mb-1">Fellowship</label>
            <select
              value={form.fellowship}
              onChange={(e) => setForm((prev) => ({ ...prev, fellowship: e.target.value as Contact['fellowship'] }))}
              className="w-full p-2 border border-penda-border rounded-firm focus:outline-none focus:border-penda-purple bg-white"
            >
              {fellowshipOptions.map((fellowship) => (
                <option key={fellowship} value={fellowship}>
                  {fellowship}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-penda-purple text-white px-4 py-2 rounded-firm text-sm font-semibold hover:bg-penda-light transition-colors disabled:opacity-50"
              disabled={!form.name.trim() || !form.phone.trim()}
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="text-penda-purple" size={20} />
          <h3 className="font-bold text-penda-purple">Contacts</h3>
        </div>
        {emergencyContact && (
          <div className="p-3 border border-penda-border rounded-firm bg-penda-tan flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
            <div>
              <div className="font-semibold text-penda-text">{emergencyContact.name}</div>
              <div className="text-xs text-penda-light">Emergency Contact{emergencyContact.relation ? ` • ${emergencyContact.relation}` : ''}</div>
              <a className="text-sm text-penda-purple underline" href={`tel:${emergencyContact.phone}`}>
                {emergencyContact.phone}
              </a>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${emergencyContact.phone}`}
                className="flex items-center gap-2 bg-penda-purple text-white px-3 py-2 rounded-firm text-sm hover:bg-penda-light"
              >
                <Phone size={16} /> Call
              </a>
            </div>
          </div>
        )}
        {contacts.length === 0 ? (
          <p className="text-sm text-penda-light italic">No contacts yet. Add your sponsor, therapist, or trusted peers.</p>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 border border-penda-border rounded-firm bg-penda-bg"
              >
                <div>
                  <div className="font-semibold text-penda-text">{contact.name}</div>
                  <div className="text-xs text-penda-light">
                    {contact.role} • {contact.fellowship}
                  </div>
                  <a
                    className="text-sm text-penda-purple underline"
                    href={`tel:${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 bg-penda-purple text-white px-3 py-2 rounded-firm text-sm hover:bg-penda-light"
                  >
                    <Phone size={16} /> Call
                  </a>
                  <button
                    onClick={() => onDelete(contact.id)}
                    className="flex items-center gap-2 bg-white border border-red-200 text-red-700 px-3 py-2 rounded-firm text-sm hover:bg-red-50"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
