import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KImage, Text, Rect } from 'react-konva';
import useImage from 'use-image';
import { io } from 'socket.io-client';
import { listAssets, listProjects, saveProject, inpaint, generateBackground, listProjectVersions, restoreProjectVersion, listTemplates, generateStyledText, exportPng, exportSvg } from '../api';

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
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [selection, setSelection] = useState(null); // {x,y,w,h}
  const [prompt, setPrompt] = useState('');
  const [versions, setVersions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [textInput, setTextInput] = useState('Hello');
  const [font, setFont] = useState('Inter');
  const [effect, setEffect] = useState('neon');
  const socketRef = useRef(null);

  useEffect(() => { loadAssets(); loadProjects(); loadTemplates(); }, []);
  async function loadAssets() {
    try { const res = await listAssets(); setAssets(res); }
    catch (e) { console.error(e); }
  }

  async function loadProjects() {
    try { const res = await listProjects(); setProjects(res); }
    catch (e) { console.error(e); }
  }

  async function loadTemplates() {
    try { const res = await listTemplates(); setTemplates(res); }
    catch (e) { console.error(e); }
  }

  function addAssetToCanvas(url) {
    const next = [...items, { id: Date.now(), type: 'image', url, x: 50, y: 100 }];
    pushHistory(next);
    setItems(next);
    broadcastItems(next);
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
    broadcastItems([]);
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
    broadcastItems(history[idx]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setItems(history[idx]);
    broadcastItems(history[idx]);
  }

  async function onSaveProject() {
    try {
      const res = await saveProject({ name: projectName, items });
      alert('Сохранено: ' + res.project.id);
      loadProjects();
      setCurrentProjectId(res.project.id);
      await loadVersions(res.project.id);
    } catch (e) { alert('Ошибка сохранения'); }
  }

  async function onOpenProject(id) {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    setProjectName(proj.name);
    setItems(proj.items || []);
    pushHistory(proj.items || []);
    setCurrentProjectId(proj.id);
    await loadVersions(proj.id);
    connectSocket(proj.id);
  }

  async function loadVersions(projectId) {
    try { const res = await listProjectVersions(projectId); setVersions(res); }
    catch (e) { console.error(e); }
  }

  async function onRestoreVersion(versionId) {
    if (!currentProjectId) return;
    const res = await restoreProjectVersion(currentProjectId, versionId);
    const proj = res.project;
    setItems(proj.items || []);
    pushHistory(proj.items || []);
  }

  function connectSocket(projectId) {
    if (socketRef.current) { socketRef.current.disconnect(); }
    const token = localStorage.getItem('access_token');
    const sock = io('http://localhost:4000', { auth: { token } });
    socketRef.current = sock;
    sock.emit('joinProject', { projectId });
    sock.on('canvasUpdated', ({ items }) => {
      setItems(items);
    });
    sock.on('chatMessage', msg => {
      setChat(prev => [...prev, msg]);
    });
  }

  function broadcastItems(next) {
    if (socketRef.current && currentProjectId) {
      socketRef.current.emit('updateCanvas', { projectId: currentProjectId, items: next });
    }
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

  async function onGenerateStyledText() {
    try {
      const res = await generateStyledText(textInput, font, effect);
      if (res.asset?.url) addAssetToCanvas(res.asset.url);
    } catch (e) { alert('Ошибка генерации текста'); }
  }

  async function onExportPNG() {
    const dataUrl = stageRef.current.toDataURL();
    const res = await exportPng(dataUrl);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a'); a.href = url; a.download = 'canvas.png'; a.click(); URL.revokeObjectURL(url);
  }

  async function onExportSVG() {
    const dataUrl = stageRef.current.toDataURL();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='768'><image href='${dataUrl}' width='1024' height='768'/></svg>`;
    const res = await exportSvg(svg);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a'); a.href = url; a.download = 'canvas.svg'; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <div style={{ flex: '0 0 1024px', padding: 20, position: 'relative' }}>
        <div className="canvas-area">
          {/* Панель управления */}
          <div className="canvas-controls">
            <button onClick={exportPNG}>Экспорт PNG (client)</button>
            <button onClick={onExportPNG}>Экспорт PNG (server)</button>
            <button onClick={onExportSVG}>Экспорт SVG</button>
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
        <div className="canvas-controls" style={{ marginTop: 10 }}>
          <h4>Версии</h4>
          <select onChange={e=>onRestoreVersion(Number(e.target.value))} defaultValue="">
            <option value="" disabled>Выберите версию...</option>
            {versions.map(v => <option key={v.id} value={v.id}>{new Date(v.created_at).toLocaleString()}</option>)}
          </select>
        </div>
        <div className="canvas-controls" style={{ marginTop: 10 }}>
          <h4>Шаблоны</h4>
          <select onChange={e=>{
            const t = templates.find(x=>x.id===e.target.value);
            if (t) { setItems(t.items); pushHistory(t.items); broadcastItems(t.items); }
          }} defaultValue="">
            <option value="" disabled>Выберите шаблон...</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="canvas-controls" style={{ marginTop: 10 }}>
          <h4>Styled Text</h4>
          <input className="input" placeholder="Текст" value={textInput} onChange={e=>setTextInput(e.target.value)} />
          <input className="input" placeholder="Шрифт" value={font} onChange={e=>setFont(e.target.value)} />
          <input className="input" placeholder="Эффект" value={effect} onChange={e=>setEffect(e.target.value)} />
          <button onClick={onGenerateStyledText}>Сгенерировать текст</button>
        </div>
        <div className="canvas-controls" style={{ marginTop: 10 }}>
          <h4>Чат</h4>
          <div style={{ maxHeight: 160, overflow: 'auto', border: '1px solid #eee', padding: 8 }}>
            {chat.map((m,i)=>(<div key={i}>{m.userId}: {m.message}</div>))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" value={chatInput} onChange={e=>setChatInput(e.target.value)} />
            <button onClick={()=>{ if(socketRef.current&&currentProjectId){ socketRef.current.emit('chatMessage',{ projectId: currentProjectId, message: chatInput }); setChatInput(''); } }}>Отправить</button>
          </div>
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
