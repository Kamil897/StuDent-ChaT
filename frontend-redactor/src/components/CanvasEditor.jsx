import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KImage, Text as KText, Rect as KRect, Line as KLine, Ellipse as KEllipse, Transformer } from 'react-konva';
import useImage from 'use-image';
import { io } from 'socket.io-client';
import { listAssets, listProjects, saveProject, inpaint, generateBackground, listProjectVersions, restoreProjectVersion, listTemplates, generateStyledText, exportPng, exportSvg } from '../api';
import { useToast } from './ToastProvider';
import './CanvasEditor.scss';
import { useEditorStore } from '../store/editorStore';

const KonvaImage = React.forwardRef(function KonvaImage({ src, x = 0, y = 0, onClick, onDragEnd, onDblClick }, ref) {
  const [image] = useImage(src);
  return <KImage ref={ref} image={image} x={x} y={y} draggable onClick={onClick} onDblClick={onDblClick} onDragEnd={onDragEnd} />;
});

export default function CanvasEditor() {
  const toast = useToast();
  const stageRef = useRef();
  const socketRef = useRef(null);
  const assets = useEditorStore(s => s.assets);
  const items = useEditorStore(s => s.items);
  const setItems = (next) => useEditorStore.setState({ items: next });
  const user = useEditorStore(s => s.user);
  const history = useEditorStore(s => s.history);
  const historyIndex = useEditorStore(s => s.historyIndex);
  const pushHistory = useEditorStore(s => s.pushHistory);
  const undo = useEditorStore(s => s.undo);
  const redo = useEditorStore(s => s.redo);
  const projects = useEditorStore(s => s.projects);
  const projectName = useEditorStore(s => s.projectName);
  const setProjectName = useEditorStore(s => s.setProjectName);
  const currentProjectId = useEditorStore(s => s.currentProjectId);
  const setCurrentProjectId = (id) => useEditorStore.setState({ currentProjectId: id });
  const refreshProjects = useEditorStore(s => s.refreshProjects);
  const selectionId = useEditorStore(s => s.selectionId);
  const setSelectionId = useEditorStore(s => s.setSelectionId);
  const activeTool = useEditorStore(s => s.activeTool);
  const strokeColor = useEditorStore(s => s.strokeColor);
  const fillColor = useEditorStore(s => s.fillColor);
  const strokeWidth = useEditorStore(s => s.strokeWidth);
  const drawings = useEditorStore(s => s.drawings);
  const drawingsHidden = useEditorStore(s => s.drawingsHidden);
  const pushDrawing = useEditorStore(s => s.pushDrawing);
  const updateLastDrawing = useEditorStore(s => s.updateLastDrawing);
  const updateItemProps = useEditorStore(s => s.updateItemProps);
  const remoteSelections = useEditorStore(s => s.remoteSelections);
  const setRemoteSelection = useEditorStore(s => s.setRemoteSelection);

  const [selection, setSelection] = useState(null); // {x,y,w,h}
  const [prompt, setPrompt] = useState('');

  const [versions, setVersions] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [textInput, setTextInput] = useState('Hello');
  const [font, setFont] = useState('Inter');
  const [effect, setEffect] = useState('neon');

  const transformerRef = useRef(null);
  const nodeRefs = useRef({});

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      loadAssets();
      loadProjects();
      loadTemplates();
    }
  }, []);

  async function loadAssets() {
    // уже делает store.initSession, но оставим явный вызов в редакторе
    // нет прямой зависимости — данные читаются из store
  }

  async function loadProjects() {
    try {
      await refreshProjects();
    } catch (e) {
      console.error(e);
    }
  }

  async function loadTemplates() {
    try {
      const res = await listTemplates();
      setTemplates(res);
    } catch (e) {
      console.error(e);
    }
  }

  function addAssetToCanvas(url) {
    const next = [...items, { id: Date.now(), type: 'image', url, x: 50, y: 100 }];
    pushHistory(next);
    setItems(next);
    broadcastItems(next);
  }

  function clearCanvas() {
    pushHistory([]);
    setItems([]);
    broadcastItems([]);
  }

  // history handled by store

  function undoLocal() {
    const prevIndex = historyIndex - 1;
    if (prevIndex < 0) return;
    undo();
    const next = useEditorStore.getState().items;
    broadcastItems(next);
  }

  function redoLocal() {
    const nextIndex = historyIndex + 1;
    if (nextIndex > history.length - 1) return;
    redo();
    const next = useEditorStore.getState().items;
    broadcastItems(next);
  }

  async function onSaveProject() {
    try {
      const res = await saveProject({ name: projectName, items });
      toast.add('Проект сохранён', 'success');
      loadProjects();
      setCurrentProjectId(res.project.id);
      await loadVersions(res.project.id);
    } catch {
      toast.add('Ошибка сохранения', 'error');
    }
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
    try {
      const res = await listProjectVersions(projectId);
      setVersions(res);
    } catch (e) {
      console.error(e);
    }
  }

  async function onRestoreVersion(versionId) {
    if (!currentProjectId) return;
    const res = await restoreProjectVersion(currentProjectId, versionId);
    const proj = res.project;
    setItems(proj.items || []);
    pushHistory(proj.items || []);
  }

  function connectSocket(projectId) {
    if (socketRef.current) socketRef.current.disconnect();
    const token = localStorage.getItem('access_token');
    const sock = io('http://localhost:3000', { auth: { token } });
    socketRef.current = sock;
    sock.emit('joinProject', { projectId });
    sock.on('canvasUpdated', ({ items: incomingItems, drawings: incomingDrawings }) => {
      if (Array.isArray(incomingItems)) setItems(incomingItems);
      if (Array.isArray(incomingDrawings)) useEditorStore.setState({ drawings: incomingDrawings });
    });
    sock.on('canvasSelection', ({ userId, selectionId }) => {
      if (!userId) return;
      setRemoteSelection(userId, selectionId);
    });
    sock.on('chatMessage', msg => setChat(prev => [...prev, msg]));
  }

  function broadcastItems(next) {
    if (socketRef.current && currentProjectId) {
      socketRef.current.emit('updateCanvas', { projectId: currentProjectId, items: next, drawings });
    }
  }

  function broadcastDrawings(nextDrawings) {
    if (socketRef.current && currentProjectId) {
      socketRef.current.emit('updateCanvas', { projectId: currentProjectId, items, drawings: nextDrawings });
    }
  }

  function onMouseDown(e) {
    const pos = e.target.getStage().getPointerPosition();
    if (activeTool === 'select') {
      setSelection({ x: pos.x, y: pos.y, w: 0, h: 0 });
      return;
    }
    if (activeTool === 'brush' || activeTool === 'eraser') {
      pushDrawing({ id: Date.now(), type: 'brush', tool: activeTool, points: [pos.x, pos.y], color: strokeColor, width: strokeWidth, composite: activeTool==='eraser'?'destination-out':'source-over' });
      broadcastDrawings([...useEditorStore.getState().drawings]);
    } else if (activeTool === 'line') {
      pushDrawing({ id: Date.now(), type: 'line', points: [pos.x, pos.y, pos.x, pos.y], color: strokeColor, width: strokeWidth });
      broadcastDrawings([...useEditorStore.getState().drawings]);
    } else if (activeTool === 'rect') {
      pushDrawing({ id: Date.now(), type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, stroke: strokeColor, fill: fillColor, strokeWidth });
      broadcastDrawings([...useEditorStore.getState().drawings]);
    } else if (activeTool === 'ellipse') {
      pushDrawing({ id: Date.now(), type: 'ellipse', x: pos.x, y: pos.y, radiusX: 0, radiusY: 0, stroke: strokeColor, fill: fillColor, strokeWidth });
      broadcastDrawings([...useEditorStore.getState().drawings]);
    }
  }

  function onMouseMove(e) {
    const pos = e.target.getStage().getPointerPosition();
    if (activeTool === 'select') {
      if (!selection) return;
      setSelection({ ...selection, w: pos.x - selection.x, h: pos.y - selection.y });
      return;
    }
    // update last drawing
    updateLastDrawing((d) => {
      if (!d) return d;
      if (d.type === 'brush' || d.type === 'line') {
        const pts = d.type==='brush' ? [...d.points, pos.x, pos.y] : [d.points[0], d.points[1], pos.x, pos.y];
        const updated = { ...d, points: pts };
        setTimeout(()=> broadcastDrawings([...useEditorStore.getState().drawings]), 0);
        return updated;
      }
      if (d.type === 'rect') {
        const updated = { ...d, width: pos.x - d.x, height: pos.y - d.y };
        setTimeout(()=> broadcastDrawings([...useEditorStore.getState().drawings]), 0);
        return updated;
      }
      if (d.type === 'ellipse') {
        const updated = { ...d, radiusX: Math.abs(pos.x - d.x), radiusY: Math.abs(pos.y - d.y) };
        setTimeout(()=> broadcastDrawings([...useEditorStore.getState().drawings]), 0);
        return updated;
      }
      return d;
    });
  }

  function onMouseUp() {}

  // delete selected item via keyboard
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectionId) {
        useEditorStore.getState().removeItemById(selectionId);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoLocal();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redoLocal();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        useEditorStore.getState().cloneSelected();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        useEditorStore.getState().cloneSelected();
        return;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectionId]);

  async function onInpaint() {
    if (!selection) return alert('Выделите область');
    const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
    const imageB64 = uri.replace(/^data:image\/png;base64,/, '');

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = 1024;
    maskCanvas.height = 768;
    const ctx = maskCanvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 1024, 768);
    ctx.fillStyle = 'white';
    ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
    const maskB64 = maskCanvas.toDataURL().replace(/^data:image\/png;base64,/, '');

    try {
      const res = await inpaint(imageB64, maskB64, prompt);
      if (res.asset?.url) addAssetToCanvas(res.asset.url);
    } catch {
      toast.add('Ошибка inpaint', 'error');
    }
  }

  async function onGenerateBackground() {
    try {
      const res = await generateBackground(prompt || 'Beautiful abstract background');
      if (res.asset?.url) addAssetToCanvas(res.asset.url);
    } catch {
      toast.add('Ошибка генерации фона', 'error');
    }
  }

  async function onGenerateStyledText() {
    try {
      const res = await generateStyledText(textInput, font, effect);
      if (res.asset?.url) addAssetToCanvas(res.asset.url);
    } catch {
      toast.add('Ошибка генерации текста', 'error');
    }
  }

  async function onExportPNG() {
    const dataUrl = stageRef.current.toDataURL();
    const res = await exportPng(dataUrl);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas.png';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onExportSVG() {
    const dataUrl = stageRef.current.toDataURL();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='768'><image href='${dataUrl}' width='1024' height='768'/></svg>`;
    const res = await exportSvg(svg);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

  // attach transformer when selection changes
  useEffect(() => {
    const node = nodeRefs.current[selectionId || ''];
    const tr = transformerRef.current;
    if (node && tr) {
      tr.nodes([node]);
      tr.getLayer()?.batchDraw();
    } else if (tr) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
    }
  }, [selectionId, items]);

  function onSaveJSON() {
    const state = {
      items,
      drawings,
    };
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function onLoadJSON(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        const nextItems = Array.isArray(parsed.items) ? parsed.items : [];
        const nextDrawings = Array.isArray(parsed.drawings) ? parsed.drawings : [];
        pushHistory(nextItems);
        setItems(nextItems);
        useEditorStore.setState({ drawings: nextDrawings });
        toast.add('JSON загружен', 'success');
      } catch {
        toast.add('Ошибка чтения JSON', 'error');
      }
    };
    reader.readAsText(file);
    // reset input value to allow re-upload same file
    ev.target.value = '';
  }

  return (
    <div className="ce-root">
      {/* Центр */}
      <div className="canvas-area">
        <div className="canvas-wrapper">
          <div className="canvas-controls">
            <button onClick={onExportPNG}>Экспорт PNG</button>
            <button onClick={onExportSVG}>Экспорт SVG</button>
            <button onClick={clearCanvas}>Очистить</button>
            <button onClick={onSaveJSON}>Сохранить JSON</button>
            <label className="button" style={{ display:'inline-block' }}>
              Загрузить JSON
              <input type="file" accept="application/json" onChange={onLoadJSON} hidden />
            </label>
          </div>

          <Stage
            width={1024}
            height={768}
            ref={stageRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onDragOver={(e)=> e.preventDefault()}
            onDrop={(e)=>{
              const url = e.dataTransfer.getData('text/asset-url');
              if (url) addAssetToCanvas(url);
            }}
          >
            <Layer listening={activeTool!=='select'}>
              <KRect x={0} y={0} width={1024} height={768} fill="#ffffff" />
              {items.filter(it=>!it.hidden).map(it => {
                if (it.type === 'image') {
                  return (
                    <KonvaImage
                      key={it.id}
                      src={it.url}
                      x={it.x || 50}
                      y={it.y || 100}
                      ref={(n)=>{ if (n) nodeRefs.current[it.id] = n; }}
                      onClick={()=> {
                        setSelectionId(it.id);
                        if (socketRef.current && user?.id) socketRef.current.emit('canvasSelection', { projectId: currentProjectId, userId: user.id, selectionId: it.id });
                      }}
                      onDblClick={()=> {
                        updateItemProps(it.id, { scaleX: 1, scaleY: 1, rotation: 0 });
                      }}
                      onDragEnd={(e)=>{
                        const { x, y } = e.target.position();
                        useEditorStore.getState().updateItemPosition(it.id, x, y);
                      }}
                    />
                  );
                }
                if (it.type === 'text') {
                  return (
                    <KText
                      key={it.id}
                      ref={(n)=>{ if (n) nodeRefs.current[it.id] = n; }}
                      text={it.text}
                      x={it.x}
                      y={it.y}
                      fontSize={it.fontSize}
                      fill={it.fill}
                      draggable={!useEditorStore.getState().lockedIds.has(it.id)}
                      onClick={()=> {
                        setSelectionId(it.id);
                        if (socketRef.current && user?.id) socketRef.current.emit('canvasSelection', { projectId: currentProjectId, userId: user.id, selectionId: it.id });
                      }}
                      onDragEnd={(e)=>{
                        const { x, y } = e.target.position();
                        useEditorStore.getState().updateItemPosition(it.id, x, y);
                      }}
                    />
                  );
                }
                if (it.type === 'rect') {
                  return (
                    <KRect
                      key={it.id}
                      ref={(n)=>{ if (n) nodeRefs.current[it.id] = n; }}
                      x={it.x}
                      y={it.y}
                      width={it.width}
                      height={it.height}
                      fill={it.fill}
                      stroke={it.stroke}
                      strokeWidth={it.strokeWidth}
                      draggable={!useEditorStore.getState().lockedIds.has(it.id)}
                      onClick={()=> {
                        setSelectionId(it.id);
                        if (socketRef.current && user?.id) socketRef.current.emit('canvasSelection', { projectId: currentProjectId, userId: user.id, selectionId: it.id });
                      }}
                      onTransformEnd={(e)=>{
                        const node = e.target;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        const newWidth = Math.max(5, node.width() * scaleX);
                        const newHeight = Math.max(5, node.height() * scaleY);
                        node.scaleX(1);
                        node.scaleY(1);
                        updateItemProps(it.id, { width: newWidth, height: newHeight, rotation: node.rotation() });
                      }}
                      onDblClick={(e)=>{
                        const node = e.target;
                        node.scale({ x: 1, y: 1 });
                        node.rotation(0);
                        updateItemProps(it.id, { rotation: 0 });
                      }}
                      onDragEnd={(e)=>{
                        const { x, y } = e.target.position();
                        useEditorStore.getState().updateItemPosition(it.id, x, y);
                      }}
                    />
                  );
                }
                return null;
              })}
              <Transformer ref={transformerRef} rotateEnabled={true} enabledAnchors={[ 'top-left','top-right','bottom-left','bottom-right' ]} />
              {selection && (
                <KRect
                  x={selection.x}
                  y={selection.y}
                  width={selection.w}
                  height={selection.h}
                  stroke="#00A3FF"
                  dash={[4, 4]}
                />
              )}
              {
                Object.entries(remoteSelections || {}).map(([uid, sel]) => {
                  const it = items.find(x => x.id === sel.selectionId);
                  if (!it) return null;
                  const color = 'rgba(14,165,233,0.9)';
                  if (it.type === 'rect') {
                    return <KRect key={`rs-${uid}`} x={it.x} y={it.y} width={it.width} height={it.height} stroke={color} dash={[6,4]} listening={false} />
                  }
                  if (it.type === 'text') {
                    const approxW = (it.text?.length || 4) * (it.fontSize || 16) * 0.6;
                    const approxH = (it.fontSize || 16) * 1.2;
                    return <KRect key={`rs-${uid}`} x={it.x} y={it.y} width={approxW} height={approxH} stroke={color} dash={[6,4]} listening={false} />
                  }
                  if (it.type === 'image') {
                    return <KRect key={`rs-${uid}`} x={it.x||50} y={it.y||100} width={120} height={90} stroke={color} dash={[6,4]} listening={false} />
                  }
                  return null;
                })
              }
            </Layer>

            {/* Drawings layer */}
            <Layer listening={activeTool!=='select'} visible={!drawingsHidden}>
              {drawings.map(d => {
                if (d.type === 'brush') {
                  return (
                    <KLine key={d.id} points={d.points} stroke={d.color} strokeWidth={d.width} lineCap="round" lineJoin="round" globalCompositeOperation={d.composite || 'source-over'} />
                  );
                }
                if (d.type === 'line') {
                  return (
                    <KLine key={d.id} points={d.points} stroke={d.color} strokeWidth={d.width} lineCap="round" lineJoin="round" />
                  );
                }
                if (d.type === 'rect') {
                  return (
                    <KRect key={d.id} x={d.x} y={d.y} width={d.width} height={d.height} stroke={d.stroke} strokeWidth={d.strokeWidth} fill={d.fill} />
                  );
                }
                if (d.type === 'ellipse') {
                  return (
                    <KEllipse key={d.id} x={d.x} y={d.y} radiusX={d.radiusX} radiusY={d.radiusY} stroke={d.stroke} strokeWidth={d.strokeWidth} fill={d.fill} />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Правая панель */}
      <div className="assets-panel">
        <h3>Управление</h3>
        <div className="panel-group">
          <button onClick={undoLocal}>Undo</button>
          <button onClick={redoLocal}>Redo</button>
        </div>

        <div className="panel-group">
          <input
            className="input"
            placeholder="Название проекта"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />
          <button onClick={onSaveProject}>Сохранить</button>
          <select onChange={e => onOpenProject(Number(e.target.value))} defaultValue="">
            <option value="" disabled>
              Открыть проект...
            </option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="panel-group">
          <input
            className="input"
            placeholder="Промпт"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <button onClick={onInpaint}>Inpaint</button>
          <button onClick={onGenerateBackground}>Фон</button>
        </div>

        <div className="panel-group">
          <h4>Версии</h4>
          <select onChange={e => onRestoreVersion(Number(e.target.value))} defaultValue="">
            <option value="" disabled>
              Выберите версию...
            </option>
            {versions.map(v => (
              <option key={v.id} value={v.id}>
                {new Date(v.created_at).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div className="panel-group">
          <h4>Шаблоны</h4>
          <select
            onChange={e => {
              const t = templates.find(x => x.id === e.target.value);
              if (t) {
                setItems(t.items);
                pushHistory(t.items);
                broadcastItems(t.items);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Выберите шаблон...
            </option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="panel-group">
          <h4>Styled Text</h4>
          <input
            className="input"
            placeholder="Текст"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
          />
          <input
            className="input"
            placeholder="Шрифт"
            value={font}
            onChange={e => setFont(e.target.value)}
          />
          <input
            className="input"
            placeholder="Эффект"
            value={effect}
            onChange={e => setEffect(e.target.value)}
          />
          <button onClick={onGenerateStyledText}>Сгенерировать</button>
        </div>

        <div className="panel-group">
          <h4>Чат</h4>
          <div className="chat-box">
            {chat.map((m, i) => (
              <div key={i}>
                <b>{m.userId}:</b> {m.message}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              className="input"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
            />
            <button
              onClick={() => {
                if (socketRef.current && currentProjectId) {
                  socketRef.current.emit('chatMessage', {
                    projectId: currentProjectId,
                    message: chatInput
                  });
                  setChatInput('');
                }
              }}
            >
              Отправить
            </button>
          </div>
        </div>

        <h3>Ассеты</h3>
        <div className="assets-list">
          {assets.map(a => (
            <div key={a.id} className="asset-card" onClick={() => addAssetToCanvas(a.url)}>
              <img src={a.url} alt="asset" className="asset-img" />
              <div className="asset-caption">{a.prompt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
