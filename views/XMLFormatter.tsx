import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

export const XMLFormatter: React.FC = () => {
  const [input, setInput] = useState('<root><user id="1"><name>DevDeck</name><role>Admin</role></user><settings><theme>Dark</theme></settings></root>');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatXML = (xml: string) => {
    try {
      let formatted = '';
      const reg = /(>)(<)(\/*)/g;
      const xmlStr = xml.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      
      const lines = xmlStr.split('\r\n');
      
      lines.forEach((node, index) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        let padding = '';
        for (let i = 0; i < pad; i++) {
          padding += '  ';
        }

        formatted += padding + node + (index < lines.length - 1 ? '\r\n' : '');
        pad += indent;
      });
      return formatted;
    } catch (e) {
      throw new Error("Unable to format XML");
    }
  };

  const handleFormat = (minify: boolean) => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      // Validate XML first using DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "application/xml");
      if (doc.getElementsByTagName("parsererror").length > 0) {
        throw new Error("Invalid XML Structure");
      }

      if (minify) {
        // Simple minify: remove spacing between tags and trim
        const minified = input.replace(/>\s*</g, '><').trim();
        setOutput(minified);
      } else {
        // Pre-process to remove existing newlines/spaces between tags for clean formatting
        const cleanInput = input.replace(/>\s*</g, '><').trim();
        const formatted = formatXML(cleanInput);
        setOutput(formatted);
      }
    } catch (err: any) {
      setError(err.message || "Error processing XML");
      setOutput('');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
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
              <Icon name="FileCode" className="text-orange-400" />
              Raw XML
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
            placeholder="<root>Paste your XML here...</root>"
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
              <Icon name="AlignLeft" className="text-blue-400" />
              Formatted
            </h3>
            <div className="flex gap-2">
              <Button onClick={() => handleFormat(true)} variant="secondary" className="text-xs h-8">
                Minify
              </Button>
              <Button onClick={() => handleFormat(false)} variant="primary" className="text-xs h-8">
                Format
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full bg-[#0f172a] text-blue-300 font-mono text-sm p-4 rounded-lg border border-slate-600 relative overflow-auto group">
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