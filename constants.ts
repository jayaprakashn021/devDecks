import { NavItem, ToolType } from './types';

export const APP_NAME = "DevDeck";

export const NAVIGATION_ITEMS: NavItem[] = [
  { id: ToolType.DASHBOARD, label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: ToolType.ABAP_CONVERTER, label: 'ABAP ↔ JSON', icon: 'ArrowRightLeft' },
  { id: ToolType.JSON_FORMATTER, label: 'JSON Formatter', icon: 'Braces' },
  { id: ToolType.XML_FORMATTER, label: 'XML Formatter', icon: 'Code' },
  { id: ToolType.BASE64_TOOLS, label: 'Base64 Converter', icon: 'Repeat' },
  { id: ToolType.UI5_GENERATOR, label: 'UI5 Boilerplate', icon: 'LayoutTemplate' },
  { id: ToolType.SQL_HELPER, label: 'SQL Assistant', icon: 'Database' },
];

export const MOCK_STATS = [
  { name: 'Mon', codeLines: 4000, bugs: 24, coffee: 4 },
  { name: 'Tue', codeLines: 3000, bugs: 13, coffee: 3 },
  { name: 'Wed', codeLines: 2000, bugs: 98, coffee: 5 },
  { name: 'Thu', codeLines: 2780, bugs: 39, coffee: 4 },
  { name: 'Fri', codeLines: 1890, bugs: 48, coffee: 6 },
  { name: 'Sat', codeLines: 2390, bugs: 38, coffee: 2 },
  { name: 'Sun', codeLines: 3490, bugs: 43, coffee: 1 },
];