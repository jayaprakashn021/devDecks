import React from 'react';
import { ToolType } from '../types';
import { NAVIGATION_ITEMS, APP_NAME } from '../constants';
import { Icon } from './Icon';

interface LayoutProps {
  currentTool: ToolType;
  onNavigate: (tool: ToolType) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentTool, onNavigate, children }) => {
  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] border-r border-slate-700 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold flex items-center gap-2 text-blue-400">
            <Icon name="Terminal" className="text-blue-500" />
            {APP_NAME}
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentTool === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-2">
          <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">Status: Online</p>
            <p>Gemini AI: Connected</p>
            <p>v1.1.0 (Build 2024)</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-[#1e293b] border-b border-slate-700 flex items-center px-4 justify-between">
           <h1 className="text-lg font-bold text-blue-400">{APP_NAME}</h1>
           <div className="flex gap-2">
             {NAVIGATION_ITEMS.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => onNavigate(item.id)}
                  className={`p-2 rounded ${currentTool === item.id ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400'}`}
                >
                  <Icon name={item.icon} size={20} />
                </button>
             ))}
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};