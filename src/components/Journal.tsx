import React, { useState } from 'react';
import { JournalEntry, UserProfile } from '../types';
import { analyzeJournalEntry } from '../services/geminiService';
import { saveJournalEntryToFirebase } from '../services/backend';
import { Sparkles, Save, Book, Plus, Lock } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  user: UserProfile;
}

export const Journal: React.FC<JournalProps> = ({ entries, addEntry, user }) => {
  const [view, setView] = useState<'list' | 'new'>('list');
  const [mood, setMood] = useState<JournalEntry['mood']>('Okay');
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    const reflection = await analyzeJournalEntry(text, mood);
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      text,
      aiReflection: reflection
    };

    addEntry(newEntry);

    if (user.isLoggedIn) {
        try {
            await saveJournalEntryToFirebase(newEntry, user);
        } catch (e) {
            console.error("Failed to sync to cloud", e);
        }
    }

    setIsAnalyzing(false);
    setText('');
    setMood('Okay');
    setView('list');
  };

  const moodColors: Record<string, string> = {
    'Great': 'bg-green-100 text-green-800 border-green-200',
    'Good': 'bg-blue-100 text-blue-800 border-blue-200',
    'Okay': 'bg-penda-bg text-penda-purple border-penda-border',
    'Struggling': 'bg-orange-100 text-orange-800 border-orange-200',
    'Crisis': 'bg-red-100 text-red-800 border-red-200',
  };

  if (view === 'new') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-soft shadow-sm border border-penda-border overflow-hidden">
        <div className="p-5 border-b border-penda-border bg-penda-bg">
          <h2 className="text-xl font-bold text-penda-purple">New Journal Entry</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {!user.isLoggedIn && (
              <div className="bg-amber-50 p-3 rounded-firm border border-amber-200 flex gap-2 items-start text-xs text-amber-800">
                <Lock size={14} className="mt-0.5" />
                <span>You are in Guest mode. Your entries will be saved to this device only. Log in to save securely to your account.</span>
              </div>
          )}

          <div>
            <label className="block text-sm font-medium text-penda-light mb-2">How are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {(['Great', 'Good', 'Okay', 'Struggling', 'Crisis'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    mood === m ? 'bg-penda-purple text-white border-penda-purple' : 'bg-white text-penda-light border-penda-border hover:border-penda-purple'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-penda-light mb-2">What’s on your mind?</label>
             <textarea
                className="w-full h-48 p-4 rounded-firm border border-penda-border focus:outline-none focus:ring-1 focus:ring-penda-purple text-penda-text resize-none"
                placeholder="Type your thoughts, wins, and worries here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
             />
          </div>

          <div className="flex gap-3">
             <button
               onClick={handleSave}
               disabled={isAnalyzing || !text.trim()}
               className="flex-1 bg-penda-purple text-white py-3 rounded-firm font-medium hover:bg-penda-light transition-colors flex items-center justify-center gap-2 disabled:opacity-70 border border-penda-purple"
             >
                {isAnalyzing ? (
                    <>
                        <Sparkles className="animate-spin" size={18} />
                        Thinking...
                    </>
                ) : (
                    <>
                        <Save size={18} />
                        Save Entry
                    </>
                )}
             </button>
             <button
               onClick={() => setView('list')}
               className="px-6 py-3 rounded-firm border border-penda-border text-penda-purple bg-white hover:bg-penda-bg font-medium"
             >
                Cancel
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-penda-purple">Journal</h2>
            <p className="text-penda-light text-sm">Log your thoughts and feelings.</p>
        </div>
        <button
          onClick={() => setView('new')}
          className="bg-penda-purple text-white px-4 py-2 rounded-firm flex items-center gap-2 hover:bg-penda-light transition-colors border border-penda-purple"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      <div className="grid gap-4">
        {entries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-soft border border-penda-border">
                <div className="inline-block p-4 bg-penda-bg rounded-full mb-3 text-penda-light">
                    <Book size={32} />
                </div>
                <p className="text-penda-light">No entries yet. Start writing today.</p>
            </div>
        ) : (
            entries.map((entry) => (
                <div key={entry.id} className="bg-white p-5 rounded-soft shadow-sm border border-penda-border">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${moodColors[entry.mood] || 'bg-gray-100'}`}>
                            {entry.mood}
                        </span>
                        <span className="text-xs text-penda-light">
                            {new Date(entry.date).toLocaleDateString()} • {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <p className="text-penda-text whitespace-pre-wrap mb-4 font-normal text-sm leading-relaxed">
                        {entry.text}
                    </p>
                    {entry.aiReflection && (
                        <div className="bg-penda-bg p-3 rounded-firm border border-dashed border-penda-light flex gap-3">
                            <Sparkles className="text-penda-purple flex-shrink-0 mt-0.5" size={16} />
                            <div>
                                <h4 className="text-xs font-bold text-penda-purple uppercase tracking-wide mb-1">AI Reflection</h4>
                                <p className="text-xs text-penda-text italic">{entry.aiReflection}</p>
                            </div>
                        </div>
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
};
