import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { getGithubConfig, saveGithubConfig, pushToGithub, GithubConfig } from '../services/githubService';

// --- Settings Modal ---
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubSettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<GithubConfig>({ token: '', owner: '', repo: '', branch: 'main' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getGithubConfig();
      if (stored) setConfig(stored);
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    saveGithubConfig(config);
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
        onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-md p-6 rounded-xl border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon name="Github" className="text-white" /> GitHub Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="X" size={20} /></button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Personal Access Token (PAT)</label>
            <input 
              type="password" 
              value={config.token}
              onChange={e => setConfig({...config, token: e.target.value})}
              className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              placeholder="ghp_..."
            />
            <p className="text-[10px] text-slate-500 mt-1">Token needs 'repo' scope.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Owner / Org</label>
                <input 
                    type="text" 
                    value={config.owner}
                    onChange={e => setConfig({...config, owner: e.target.value})}
                    className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. facebook"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Repo Name</label>
                <input 
                    type="text" 
                    value={config.repo}
                    onChange={e => setConfig({...config, repo: e.target.value})}
                    className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. react"
                />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Branch</label>
            <input 
              type="text" 
              value={config.branch}
              onChange={e => setConfig({...config, branch: e.target.value})}
              className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              placeholder="main"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant={saved ? "primary" : "secondary"} className={saved ? "bg-green-600 hover:bg-green-500" : ""}>
            {saved ? <><Icon name="Check" size={16} /> Saved</> : "Save Configuration"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Push Button & Dialog ---
interface PushButtonProps {
  content: string;
  defaultFilename: string;
  fileExtension: string;
  className?: string;
  onSuccess?: (url: string) => void;
}

export const PushToGithubButton: React.FC<PushButtonProps> = ({ content, defaultFilename, fileExtension, className, onSuccess }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [filename, setFilename] = useState('');
  const [commitMsg, setCommitMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInit = () => {
    if (!getGithubConfig()) {
        alert("Please configure GitHub settings in the sidebar first.");
        return;
    }
    if (!content.trim()) {
        alert("No content to push.");
        return;
    }
    setFilename(`${defaultFilename}.${fileExtension}`);
    setCommitMsg(`Add ${defaultFilename}.${fileExtension} via DevDeck`);
    setShowDialog(true);
  };

  const handlePush = async () => {
    setLoading(true);
    setError(null);
    try {
        const result = await pushToGithub(filename, content, commitMsg);
        setShowDialog(false);
        if (onSuccess) onSuccess(result.url);
        else alert(`Successfully pushed to GitHub!\n${result.url}`);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleInit} size="sm" variant="secondary" className={className}>
         <Icon name="Github" size={16} /> Push
      </Button>

      {showDialog && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-[#1e293b] w-full max-w-sm p-6 rounded-xl border border-slate-700 shadow-2xl">
             <h3 className="text-lg font-bold text-white mb-4">Push to Repository</h3>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-semibold text-slate-400 mb-1">Filename / Path</label>
                 <input 
                   type="text" 
                   value={filename}
                   onChange={e => setFilename(e.target.value)}
                   className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white"
                 />
               </div>
               <div>
                 <label className="block text-xs font-semibold text-slate-400 mb-1">Commit Message</label>
                 <input 
                   type="text" 
                   value={commitMsg}
                   onChange={e => setCommitMsg(e.target.value)}
                   className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-sm text-white"
                 />
               </div>
               {error && <p className="text-red-400 text-xs">{error}</p>}
             </div>

             <div className="mt-6 flex justify-end gap-3">
               <Button variant="ghost" onClick={() => setShowDialog(false)} disabled={loading}>Cancel</Button>
               <Button onClick={handlePush} isLoading={loading}>Push File</Button>
             </div>
           </div>
         </div>
      )}
    </>
  );
};
