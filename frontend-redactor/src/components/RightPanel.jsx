import React from 'react';
import { useEditorStore } from '../store/editorStore';

export default function RightPanel() {
  const items = useEditorStore(s => s.items);
  const setItems = (next) => useEditorStore.setState({ items: next });
  const pushHistory = useEditorStore(s => s.pushHistory);
  const toggleVisibility = useEditorStore(s => s.toggleVisibility);
  const removeItemById = useEditorStore(s => s.removeItemById);
  const selectionId = useEditorStore(s => s.selectionId);
  const setSelectionId = useEditorStore(s => s.setSelectionId);
  const drawingsHidden = useEditorStore(s => s.drawingsHidden);
  const toggleDrawingsHidden = useEditorStore(s => s.toggleDrawingsHidden);
  const clearDrawings = useEditorStore(s => s.clearDrawings);
  const lockedIds = useEditorStore(s => s.lockedIds);
  const toggleLock = useEditorStore(s => s.toggleLock);
  const moveLayer = useEditorStore(s => s.moveLayer);

  function move(index, direction) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    pushHistory(next);
    setItems(next);
  }

  function remove(index) {
    const next = items.filter((_, i) => i !== index);
    pushHistory(next);
    setItems(next);
  }

  return (
    <aside className="right-panel">
      <h3>Слои</h3>
      <div className="layer-row" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span>Drawing Layer</span>
        <div className="layer-actions">
          <button onClick={toggleDrawingsHidden}>{drawingsHidden? '👁️‍🗨️':'👁️'}</button>
          <button onClick={clearDrawings}>✕</button>
        </div>
      </div>
      <ul className="layers-list">
        {items.map((it, i) => (
          <li key={it.id} className="layer-row" style={{ opacity: it.hidden ? 0.5 : 1, outline: selectionId===it.id?'1px solid #0ea5e9':'none' }} onClick={()=> setSelectionId(it.id)}>
            <span>{it.type}</span>
            <div className="layer-actions">
              <button onClick={(e)=>{ e.stopPropagation(); toggleLock(it.id); }}>{lockedIds.has(it.id)? '🔒':'🔓'}</button>
              <button onClick={() => toggleVisibility(it.id)}>{it.hidden? '👁️‍🗨️':'👁️'}</button>
              <button onClick={(e)=>{ e.stopPropagation(); moveLayer(it.id, -1); }}>↑</button>
              <button onClick={(e)=>{ e.stopPropagation(); moveLayer(it.id, 1); }}>↓</button>
              <button onClick={() => removeItemById(it.id)}>✕</button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}


