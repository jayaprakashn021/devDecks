# DevDeck - Full Stack Developer Dashboard

DevDeck is a comprehensive productivity tool designed for ABAP, SAP UI5, JavaScript, and SQL developers. It integrates AI assistance with practical utilities to speed up development workflows.

## Features

- **Dashboard**: Visual overview of code metrics and bugs (Mock data).
- **AI Architect**: Chat with a Gemini-powered AI specialized in SAP and Web technologies.
- **ABAP ↔ JSON**: Convert JSON objects directly to ABAP Types.
- **UI5 Boilerplate**: Generate SAP UI5 XML Views from natural language descriptions.
- **SQL Assistant**: Generate HANA-compliant SQL queries based on table schemas.
- **Formatters**: JSON and XML formatters with minification support.
- **Base64 Tools**: Encoder/Decoder for Text, Hex, Images, PDF, and Files.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```
   API_KEY=your_gemini_api_key_here
   ```

3. **Run the App**
   ```bash
   npm start
   ```

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI**: Google Gemini API

## License

MIT
