import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KImage, Text, Rect } from 'react-konva';
import useImage from 'use-image';
import { listAssets, listProjects, saveProject, inpaint, generateBackground } from '../api';

function KonvaImage({ src, x = 0, y = 0 }) {
  const [image] = useImage(src);
  return <KImage image={image} x={x} y={y} draggable />;
}

export default function CanvasEditor() {
  const stageRef = useRef();
  const [assets, setAssets] = useState([]);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('My Project');
  const [selection, setSelection] = useState(null); // {x,y,w,h}
  const [prompt, setPrompt] = useState('');

  useEffect(() => { loadAssets(); loadProjects(); }, []);
  async function loadAssets() {
    try { const res = await listAssets(); setAssets(res); }
    catch (e) { console.error(e); }
  }

  async function loadProjects() {
    try { const res = await listProjects(); setProjects(res); }
    catch (e) { console.error(e); }
  }

  function addAssetToCanvas(url) {
    const next = [...items, { id: Date.now(), type: 'image', url, x: 50, y: 100 }];
    pushHistory(next);
    setItems(next);
  }

  function exportPNG() {
    const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
    const a = document.createElement('a');
    a.href = uri;
    a.download = 'canvas.png';
    a.click();
  }

  function clearCanvas() {
    pushHistory([]);
    setItems([]);
  }

  function pushHistory(nextItems) {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextItems);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }

  function undo() {
    if (historyIndex <= 0) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    setItems(history[idx]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setItems(history[idx]);
  }

  async function onSaveProject() {
    try {
      const res = await saveProject({ name: projectName, items });
      alert('Сохранено: ' + res.project.id);
      loadProjects();
    } catch (e) { alert('Ошибка сохранения'); }
  }

  async function onOpenProject(id) {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    setProjectName(proj.name);
    setItems(proj.items || []);
    pushHistory(proj.items || []);
  }

  function onMouseDown(e) {
    const pos = e.target.getStage().getPointerPosition();
    setSelection({ x: pos.x, y: pos.y, w: 0, h: 0 });
  }

  function onMouseMove(e) {
    if (!selection) return;
    const pos = e.target.getStage().getPointerPosition();
    setSelection({ ...selection, w: pos.x - selection.x, h: pos.y - selection.y });
  }

  function onMouseUp() {
    // keep selection as-is for inpaint
  }

  async function onInpaint() {
    if (!selection) return alert('Выделите область');
    const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
    const imageB64 = uri.replace(/^data:image\/png;base64,/, '');
    // simple rectangle mask: white where to edit, black elsewhere
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = 1024; maskCanvas.height = 768;
    const ctx = maskCanvas.getContext('2d');
    ctx.fillStyle = 'black'; ctx.fillRect(0,0,1024,768);
    ctx.fillStyle = 'white';
    ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
    const maskB64 = maskCanvas.toDataURL().replace(/^data:image\/png;base64,/, '');
    try {
      const res = await inpaint(imageB64, maskB64, prompt);
      if (res.asset?.url) addAssetToCanvas(res.asset.url);
    } catch (e) { alert('Ошибка inpaint'); }
  }

  async function onGenerateBackground() {
    try {
      const res = await generateBackground(prompt || 'Beautiful abstract background');
      if (res.asset?.url) addAssetToCanvas(res.asset.url);
    } catch (e) { alert('Ошибка генерации фона'); }
  }

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <div style={{ flex: '0 0 1024px', padding: 20, position: 'relative' }}>
        <div className="canvas-area">
          {/* Панель управления */}
          <div className="canvas-controls">
            <button onClick={exportPNG}>Экспорт PNG</button>
            <button onClick={clearCanvas}>Очистить</button>
          </div>

          <Stage
            width={1024}
            height={768}
            ref={stageRef}
            style={{ background: '#fff' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            <Layer>
              <Rect x={0} y={0} width={1024} height={768} fill="#ffffff" />
              <Text text="AI Canvas" x={20} y={20} fontSize={28} fill="#111" />
              {items.map(it => (
                <KonvaImage key={it.id} src={it.url} x={it.x || 50} y={it.y || 100} />
              ))}
              {selection && (
                <Rect x={selection.x} y={selection.y} width={selection.w} height={selection.h} stroke="#00A3FF" dash={[4,4]} />
              )}
            </Layer>
          </Stage>
        </div>
      </div>

      <div className="assets-panel">
        <h4>Библиотека</h4>
        <div className="canvas-controls" style={{ marginBottom: 10 }}>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
        </div>
        <div className="canvas-controls" style={{ marginBottom: 10 }}>
          <input className="input" placeholder="Название проекта" value={projectName} onChange={e=>setProjectName(e.target.value)} />
          <button onClick={onSaveProject}>Сохранить проект</button>
          <select onChange={e=>onOpenProject(Number(e.target.value))} defaultValue="">
            <option value="" disabled>Открыть проект...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="canvas-controls" style={{ marginBottom: 10 }}>
          <input className="input" placeholder="Промпт" value={prompt} onChange={e=>setPrompt(e.target.value)} />
          <button onClick={onInpaint}>Inpaint Выделение</button>
          <button onClick={onGenerateBackground}>Сгенерировать фон</button>
        </div>
        <div className="assets-list">
          {assets.map(a => (
            <div key={a.id} className="asset-card">
              <img
                src={a.url}
                alt="asset"
                className="asset-img"
                onClick={() => addAssetToCanvas(a.url)}
              />
              <div className="asset-caption">{a.prompt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
