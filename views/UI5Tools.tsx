import React, { useState } from 'react';
import { generateUI5View } from '../services/geminiService';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

export const UI5Tools: React.FC = () => {
  const [prompt, setPrompt] = useState('A simple table showing products with columns: ID, Name, Price. Add a footer with a save button.');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
      setLoading(true);
      const res = await generateUI5View(prompt);
      setOutput(res);
      setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Icon name="LayoutTemplate" className="text-purple-500" />
                UI5 XML View Generator
            </h3>
            <div className="flex gap-4">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg px-4 text-slate-200 focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your view..."
                />
                <Button onClick={handleGenerate} isLoading={loading} variant="primary">
                    <Icon name="Zap" size={16} /> Generate
                </Button>
            </div>
        </div>

        <div className="flex-1 bg-[#1e293b] p-0 rounded-xl border border-slate-700 shadow-lg overflow-hidden flex flex-col">
            <div className="bg-slate-800 p-3 border-b border-slate-700 flex justify-between">
                <span className="text-xs font-mono text-slate-400">View.xml</span>
                <div className="flex gap-2">
                    {output && (
                         <button 
                            className="text-xs flex items-center gap-1 text-slate-400 hover:text-white"
                            onClick={() => navigator.clipboard.writeText(output)}
                        >
                            <Icon name="Copy" size={12} /> Copy
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-auto bg-[#0f172a] p-4">
                <pre className="text-sm font-mono text-purple-300 whitespace-pre-wrap">{output || "<!-- Generated XML will appear here -->"}</pre>
            </div>
        </div>
    </div>
  );
};