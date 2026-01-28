import React, { useState } from 'react';
import { generateSQLHelper } from '../services/geminiService';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

export const SQLTools: React.FC = () => {
  const [schema, setSchema] = useState('Table: BKPF (Company Code, Doc Number, Fiscal Year, User)\nTable: BSEG (Company Code, Doc Number, Fiscal Year, Line Item, Amount, Cost Center)');
  const [queryReq, setQueryReq] = useState('Sum of Amount per Cost Center for Fiscal Year 2023');
  const [sqlOutput, setSqlOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateSQLHelper(schema, queryReq);
    setSqlOutput(res);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700 shadow-lg flex-1 flex flex-col">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Icon name="TableProperties" className="text-blue-400" />
                    Context / Schema
                </h3>
                <textarea 
                    className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-sm text-slate-300 font-mono resize-none focus:ring-2 focus:ring-blue-500"
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    placeholder="Paste table definitions here..."
                />
            </div>
             <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700 shadow-lg h-1/3 flex flex-col">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Icon name="Search" className="text-green-400" />
                    Requirement
                </h3>
                <textarea 
                    className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-sm text-slate-300 font-mono resize-none focus:ring-2 focus:ring-green-500"
                    value={queryReq}
                    onChange={(e) => setQueryReq(e.target.value)}
                    placeholder="What do you want to select?"
                />
                <div className="mt-4">
                     <Button onClick={handleGenerate} isLoading={loading} className="w-full">
                        Generate SQL
                    </Button>
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 bg-[#1e293b] rounded-xl border border-slate-700 shadow-lg flex flex-col overflow-hidden">
             <div className="bg-slate-800 p-3 border-b border-slate-700 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Icon name="Terminal" size={16} /> Result
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 mr-2">HANA SQL Dialect</span>
                </div>
            </div>
            <div className="flex-1 bg-[#0f172a] p-6 overflow-auto">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{sqlOutput || "-- SQL Query will be generated here"}</pre>
            </div>
        </div>
    </div>
  );
};