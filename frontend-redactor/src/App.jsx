import React from 'react';
import Toolbar from './components/Toolbar';
import CanvasEditor from './components/CanvasEditor';
import RightPanel from './components/RightPanel';
import { useEffect } from 'react';
import { useEditorStore } from './store/editorStore';

export default function App() {
  const initSession = useEditorStore(s => s.initSession);
  useEffect(() => { initSession(); }, [initSession]);
  return (
    <div className="redactor-root">
      <header className="topbar">
        <h1>AI Canvas — Website</h1>
      </header>

      <div className="layout">
        <Toolbar />
        <div className="canvas-column">
          <CanvasEditor />
        </div>
        <RightPanel />
      </div>
    </div>
  );
}
