import React, { useState } from 'react';
import { StepWork } from '../types';
import { Save, Trash2, User, Phone, Mail, List } from 'lucide-react';

interface StepWorkProps {
  stepWorkList: StepWork[];
  saveStepWork: (work: StepWork) => void;
  deleteStepWork: (id: string) => void;
}

export const StepWorkComponent: React.FC<StepWorkProps> = ({ stepWorkList, saveStepWork, deleteStepWork }) => {
  const [formData, setFormData] = useState({
    myName: '',
    sponsorName: '',
    phone: '',
    email: '',
    step: 'Step 1',
    plan: ''
  });

  const handleSubmit = () => {
    if (!formData.sponsorName) {
      alert("Please enter a sponsor name.");
      return;
    }
    const newWork: StepWork = {
      id: Date.now().toString(),
      memberName: formData.myName,
      sponsorName: formData.sponsorName,
      sponsorPhone: formData.phone,
      sponsorEmail: formData.email,
      currentStep: formData.step,
      weeklyPlan: formData.plan
    };
    saveStepWork(newWork);
    setFormData({ myName: '', sponsorName: '', phone: '', email: '', step: 'Step 1', plan: '' });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-penda-purple">My Step Work</h2>
        <div className="bg-penda-bg p-3 rounded-firm border border-dashed border-penda-light mt-2 text-xs text-penda-text">
            Log in or create a free account to save your sponsor and stepwork notes.
        </div>
      </header>

      <div className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-penda-light mb-1">My Name</label>
            <div className="relative">
                <User className="absolute left-3 top-2.5 text-penda-border" size={16} />
                <input
                    value={formData.myName}
                    onChange={e => setFormData({...formData, myName: e.target.value})}
                    className="w-full pl-9 p-2 rounded-firm border border-penda-border focus:outline-none focus:border-penda-purple"
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-penda-light mb-1">Sponsor's Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-2.5 text-penda-border" size={16} />
                    <input
                        value={formData.sponsorName}
                        onChange={e => setFormData({...formData, sponsorName: e.target.value})}
                        className="w-full pl-9 p-2 rounded-firm border border-penda-border focus:outline-none focus:border-penda-purple"
                    />
                </div>
             </div>
             <div>
                <label className="block text-xs font-medium text-penda-light mb-1">Phone</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-penda-border" size={16} />
                    <input
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-9 p-2 rounded-firm border border-penda-border focus:outline-none focus:border-penda-purple"
                    />
                </div>
             </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-penda-light mb-1">Sponsor's Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-penda-border" size={16} />
                <input
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    type="email"
                    className="w-full pl-9 p-2 rounded-firm border border-penda-border focus:outline-none focus:border-penda-purple"
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-penda-light mb-1">Step you're working together</label>
            <div className="relative">
                <List className="absolute left-3 top-2.5 text-penda-border" size={16} />
                <select 
                    value={formData.step}
                    onChange={e => setFormData({...formData, step: e.target.value})}
                    className="w-full pl-9 p-2 rounded-firm border border-penda-border focus:outline-none focus:border-penda-purple bg-white"
                >
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={`Step ${i+1}`}>Step {i+1}</option>
                    ))}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-penda-light mb-1">Weekly Work Plan</label>
            <textarea 
                value={formData.plan}
                onChange={e => setFormData({...formData, plan: e.target.value})}
                className="w-full p-2 h-24 rounded-firm border border-penda-border focus:outline-none focus:border-penda-purple resize-none"
            />
          </div>

          <button 
            onClick={handleSubmit}
            className="bg-penda-purple text-white px-4 py-2 rounded-firm flex items-center gap-2 hover:bg-penda-light transition-colors text-sm"
          >
            <Save size={16} /> Save Stepwork
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-penda-purple">Saved Stepwork Entries</h3>
        {stepWorkList.length === 0 && <p className="text-sm text-penda-light italic">No saved entries yet.</p>}
        {stepWorkList.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-firm border border-penda-border shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        {item.memberName && <div className="text-xs text-penda-light mb-1">{item.memberName}'s plan</div>}
                        <div className="font-bold text-penda-purple">{item.sponsorName}</div>
                        <div className="text-xs text-penda-light mb-2">{item.sponsorPhone} • {item.sponsorEmail}</div>
                        <div className="text-sm font-medium mb-1">Working on: {item.currentStep}</div>
                        <div className="text-xs bg-penda-bg p-2 rounded-firm text-penda-purple mt-2 whitespace-pre-wrap">
                            Weekly Plan: {item.weeklyPlan || "—"}
                        </div>
                    </div>
                    <button 
                        onClick={() => deleteStepWork(item.id)}
                        className="text-penda-light hover:text-red-500 bg-white border border-penda-border p-1 rounded"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
