import React, { useState, useRef } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

type TabType = 'text' | 'hex' | 'image' | 'pdf' | 'file';

export const Base64Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('text');

  // Text/Hex State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // File/Image State
  const [base64Output, setBase64Output] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setBase64Output('');
    setPreviewSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    clearAll();
  };

  // --- Logic: Text & ASCII ---
  const handleTextEncode = () => {
    try {
      // Use TextEncoder to handle UTF-8 correctly
      const bytes = new TextEncoder().encode(inputText);
      const binString = String.fromCodePoint(...bytes);
      setOutputText(btoa(binString));
    } catch (e) {
      setOutputText('Error encoding text.');
    }
  };

  const handleTextDecode = () => {
    try {
      const binString = atob(inputText);
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
      setOutputText(new TextDecoder().decode(bytes));
    } catch (e) {
      setOutputText('Error decoding Base64. Check input.');
    }
  };

  // --- Logic: Hex ---
  const handleHexEncode = () => {
    try {
      // Hex string to Bytes
      const hex = inputText.replace(/\s+/g, '');
      if (hex.length % 2 !== 0) throw new Error("Invalid hex length");
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
      }
      const binString = String.fromCodePoint(...bytes);
      setOutputText(btoa(binString));
    } catch (e) {
      setOutputText('Error: Invalid Hex string.');
    }
  };

  const handleHexDecode = () => {
    try {
      const binString = atob(inputText);
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
      const hexArray = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
      setOutputText(hexArray.join(' ')); // Space separated for readability
    } catch (e) {
      setOutputText('Error decoding Base64 to Hex.');
    }
  };

  // --- Logic: Files (Image, PDF, Generic) ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      setBase64Output(result); // This includes data:mime;base64,...
      setPreviewSrc(result);   // For immediate preview if applicable
    };
    reader.readAsDataURL(file);
  };

  const handleBase64ToPreview = (type: 'image' | 'pdf') => {
    let src = inputText.trim();
    // Add prefix if missing
    if (!src.startsWith('data:')) {
      const mime = type === 'image' ? 'image/png' : 'application/pdf';
      src = `data:${mime};base64,${src}`;
    }
    setPreviewSrc(src);
  };

  const downloadBase64File = (filename: string = 'download') => {
    if (!inputText) return;
    let src = inputText.trim();
    // Naive mimetype detection or default
    if (!src.startsWith('data:')) {
        src = `data:application/octet-stream;base64,${src}`;
    }
    
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // --- Render Helpers ---
  const renderTextTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-400">Input Text</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type or paste text here..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-400">Output</label>
        <textarea
          value={outputText}
          readOnly
          className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-blue-300 font-mono text-sm resize-none"
          placeholder="Result will appear here..."
        />
      </div>
      <div className="col-span-1 md:col-span-2 flex gap-4 justify-center mt-2">
        <Button onClick={handleTextEncode}><Icon name="ArrowDown" size={16}/> Encode (To Base64)</Button>
        <Button onClick={handleTextDecode} variant="secondary"><Icon name="ArrowUp" size={16}/> Decode (From Base64)</Button>
        <Button onClick={clearAll} variant="ghost">Clear</Button>
      </div>
    </div>
  );

  const renderHexTab = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-400">Input (Hex or Base64)</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-slate-200 font-mono text-sm resize-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g. 48 65 6c 6c 6f or SGVsbG8="
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-400">Output</label>
        <textarea
          value={outputText}
          readOnly
          className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-purple-300 font-mono text-sm resize-none"
          placeholder="Result..."
        />
      </div>
      <div className="col-span-1 md:col-span-2 flex gap-4 justify-center mt-2">
        <Button onClick={handleHexEncode}><Icon name="ArrowRight" size={16}/> Hex to Base64</Button>
        <Button onClick={handleHexDecode} variant="secondary"><Icon name="ArrowLeft" size={16}/> Base64 to Hex</Button>
        <Button onClick={clearAll} variant="ghost">Clear</Button>
      </div>
    </div>
  );

  const renderFileTab = (mode: 'image' | 'pdf' | 'file') => (
    <div className="flex flex-col h-full gap-6">
      
      {/* Encoder Section */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col gap-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Icon name="Upload" className="text-blue-400" />
          Encode {mode === 'file' ? 'File' : mode.charAt(0).toUpperCase() + mode.slice(1)} to Base64
        </h3>
        <div className="flex gap-4 items-center">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept={mode === 'image' ? 'image/*' : mode === 'pdf' ? 'application/pdf' : '*/*'}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
        </div>
        {base64Output && (
          <div className="mt-2 relative">
             <label className="text-xs text-slate-500 mb-1 block">Base64 Output (Includes data URI prefix)</label>
             <textarea 
                value={base64Output}
                readOnly 
                className="w-full h-24 bg-[#0f172a] border border-slate-600 rounded-lg p-2 text-xs text-slate-400 font-mono resize-none"
             />
             <Button 
                onClick={() => navigator.clipboard.writeText(base64Output)} 
                variant="ghost" 
                className="absolute top-8 right-2 px-2 py-1 text-xs bg-slate-800"
              >
                Copy
             </Button>
          </div>
        )}
      </div>

      {/* Decoder Section */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-sm flex flex-col gap-4 flex-1 min-h-0">
         <h3 className="text-white font-bold flex items-center gap-2">
          <Icon name="Download" className="text-green-400" />
          Decode Base64 to {mode === 'file' ? 'File' : mode.charAt(0).toUpperCase() + mode.slice(1)}
        </h3>
        <div className="flex gap-2">
             <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste Base64 string here to preview/download ${mode}...`}
              className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-2 text-slate-200 text-sm"
             />
             {mode !== 'file' && <Button onClick={() => handleBase64ToPreview(mode as 'image'|'pdf')}>Preview</Button>}
             {/* Fix: removed comparison with 'text' since mode is strictly 'image' | 'pdf' | 'file' */}
             <Button onClick={() => downloadBase64File(`decoded.${mode === 'image' ? 'png' : mode === 'pdf' ? 'pdf' : 'bin'}`)} variant="secondary">
                Download
             </Button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-[#0f172a] rounded-lg border border-slate-600 overflow-hidden flex items-center justify-center p-4 relative">
             {!previewSrc && <span className="text-slate-600 text-sm">Preview Area</span>}
             
             {previewSrc && mode === 'image' && (
                <img src={previewSrc} alt="Preview" className="max-w-full max-h-full object-contain" />
             )}
             
             {previewSrc && mode === 'pdf' && (
                <iframe src={previewSrc} className="w-full h-full" title="PDF Preview"></iframe>
             )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-[#1e293b] p-1 rounded-lg border border-slate-700 w-fit">
        {(['text', 'hex', 'image', 'pdf', 'file'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === 'text' && renderTextTab()}
        {activeTab === 'hex' && renderHexTab()}
        {activeTab === 'image' && renderFileTab('image')}
        {activeTab === 'pdf' && renderFileTab('pdf')}
        {activeTab === 'file' && renderFileTab('file')}
      </div>
    </div>
  );
};