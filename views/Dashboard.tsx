import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MOCK_STATS } from '../constants';
import { Icon } from '../components/Icon';

const StatCard: React.FC<{ title: string; value: string; icon: string; trend: string; color: string }> = ({ title, value, icon, trend, color }) => (
  <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon name={icon} className={color.replace('bg-', 'text-')} />
      </div>
      <span className="text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">{trend}</span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-slate-100">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Developer Overview</h2>
          <p className="text-slate-400">Welcome back, Engineer. Here's your stack performance.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-[#1e293b] hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition flex items-center gap-2">
                <Icon name="RefreshCw" size={16} /> Sync
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="ABAP Objects" value="1,284" icon="Box" trend="+12%" color="bg-orange-500" />
        <StatCard title="JS Modules" value="842" icon="FileCode" trend="+5%" color="bg-yellow-500" />
        <StatCard title="SQL Queries" value="45.2k" icon="Database" trend="+24%" color="bg-blue-500" />
        <StatCard title="UI5 Views" value="128" icon="Layout" trend="+2%" color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Code Output vs Bug Rate</h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="codeLines" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Lines of Code" />
                <Bar dataKey="bugs" fill="#ef4444" radius={[4, 4, 0, 0]} name="Bugs Found" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Caffeine vs Efficiency</h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_STATS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="coffee" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b' }} name="Cups of Coffee" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
