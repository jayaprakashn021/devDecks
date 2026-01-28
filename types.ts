export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  ABAP_CONVERTER = 'ABAP_CONVERTER',
  UI5_GENERATOR = 'UI5_GENERATOR',
  SQL_HELPER = 'SQL_HELPER',
  JSON_FORMATTER = 'JSON_FORMATTER',
  XML_FORMATTER = 'XML_FORMATTER',
  BASE64_TOOLS = 'BASE64_TOOLS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: 'abap' | 'javascript' | 'sql' | 'xml' | 'html';
  code: string;
}

export interface NavItem {
  id: ToolType;
  label: string;
  icon: string;
}