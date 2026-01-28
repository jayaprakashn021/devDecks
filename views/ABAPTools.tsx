import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

export const ABAPTools: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('{\n  "kunnr": "0000102030",\n  "name1": "Acme Corp",\n  "city": "Walldorf"\n}');
  const [abapOutput, setAbapOutput] = useState('');

  const convertJsonToAbap = () => {
    try {
        const obj = JSON.parse(jsonInput);
        let output = "* Generated ABAP Type Definition \nTYPES: BEGIN OF ty_data,\n";
        
        Object.keys(obj).forEach(key => {
            const val = obj[key];
            let type = "STRING";
            if (typeof val === 'number') type = Number.isInteger(val) ? "I" : "P DECIMALS 2";
            if (typeof val === 'boolean') type = "ABAP_BOOL";
            
            output += `  ${key.toLowerCase().padEnd(20)} TYPE ${type},\n`;
        });
        
        output += "TYPES: END OF ty_data.";
        setAbapOutput(output);
    } catch (e) {
        setAbapOutput("Error: Invalid JSON");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
        <div className="flex flex-col gap-4">
            <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 flex-1 flex flex-col shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Icon name="FileJson" className="text-yellow-500" />
                        JSON Input
                    </h3>
                </div>
                <textarea 
                    className="flex-1 w-full bg-[#0f172a] text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 resize-none"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    spellCheck={false}
                />
            </div>
        </div>

        <div className="flex flex-col gap-4">
             <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 flex-1 flex flex-col shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Icon name="FileCode" className="text-blue-500" />
                        ABAP TYPES Output
                    </h3>
                    <div className="flex gap-2">
                        <Button onClick={convertJsonToAbap} size="sm">
                            <Icon name="ArrowRight" size={16} /> Convert
                        </Button>
                    </div>
                </div>
                <div className="flex-1 w-full bg-[#0f172a] text-blue-300 font-mono text-sm p-4 rounded-lg border border-slate-600 relative overflow-auto">
                    <pre>{abapOutput || "Waiting for input..."}</pre>
                    {abapOutput && (
                        <button 
                            className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                            onClick={() => navigator.clipboard.writeText(abapOutput)}
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