import React from 'react';
import Toolbar from './components/Toolbar';
import CanvasEditor from './components/CanvasEditor';

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <h1>AI Canvas — Website</h1>
      </header>

      <div className="layout">
        <Toolbar />
        <div className="canvas-column">
          <CanvasEditor />
        </div>
      </div>
    </div>
  );
}
