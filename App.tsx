import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { ABAPTools } from './views/ABAPTools';
import { UI5Tools } from './views/UI5Tools';
import { SQLTools } from './views/SQLTools';
import { JSONFormatter } from './views/JSONFormatter';
import { XMLFormatter } from './views/XMLFormatter';
import { Base64Tools } from './views/Base64Tools';
import { ToolType } from './types';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.DASHBOARD);

  const renderTool = () => {
    switch (currentTool) {
      case ToolType.DASHBOARD: return <Dashboard />;
      case ToolType.ABAP_CONVERTER: return <ABAPTools />;
      case ToolType.JSON_FORMATTER: return <JSONFormatter />;
      case ToolType.XML_FORMATTER: return <XMLFormatter />;
      case ToolType.BASE64_TOOLS: return <Base64Tools />;
      case ToolType.UI5_GENERATOR: return <UI5Tools />;
      case ToolType.SQL_HELPER: return <SQLTools />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentTool={currentTool} onNavigate={setCurrentTool}>
      {renderTool()}
    </Layout>
  );
};

export default App;