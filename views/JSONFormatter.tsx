import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

export const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('{\n  "name": "DevDeck",\n  "version": 1,\n  "features": ["AI", "ABAP", "SQL"]\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Auto-format on load or just leave it for user action? 
  // Let's leave it for user action to avoid annoying errors while typing if we implemented live preview.
  
  const formatJSON = (minify: boolean) => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, minify ? 0 : 2);
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      // Optional: Auto format on paste could be nice, but might be aggressive.
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 flex-1 flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Icon name="FileJson" className="text-blue-400" />
              Raw JSON
            </h3>
            <div className="flex gap-2">
                <Button onClick={() => setInput('')} variant="ghost" className="text-xs px-2 py-1 h-8">
                    Clear
                </Button>
                <Button onClick={handlePaste} variant="secondary" className="text-xs px-2 py-1 h-8">
                    Paste
                </Button>
            </div>
          </div>
          <textarea
            className={`flex-1 w-full bg-[#0f172a] text-slate-300 font-mono text-sm p-4 rounded-lg border focus:ring-2 resize-none transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            spellCheck={false}
          />
          {error && (
            <div className="mt-2 text-red-400 text-sm flex items-start gap-2 animate-pulse">
                <Icon name="AlertCircle" size={16} className="mt-0.5" /> 
                <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 flex-1 flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-white font-bold flex items-center gap-2">
              <Icon name="AlignLeft" className="text-green-400" />
              Formatted
            </h3>
            <div className="flex gap-2">
              <Button onClick={() => formatJSON(true)} variant="secondary" className="text-xs h-8">
                Minify
              </Button>
              <Button onClick={() => formatJSON(false)} variant="primary" className="text-xs h-8">
                Format
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full bg-[#0f172a] text-green-300 font-mono text-sm p-4 rounded-lg border border-slate-600 relative overflow-auto group">
            <pre className="whitespace-pre-wrap break-words">{output || (input && !error ? "Ready to format..." : "Waiting for input...")}</pre>
            {output && (
                <button
                className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
                onClick={() => navigator.clipboard.writeText(output)}
                title="Copy to Clipboard"
                >
                <Icon name="Copy" size={14} />
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};