import { create } from 'zustand';
import { listAssets, listProjects, saveProject, getMe } from '../api';

export const useEditorStore = create((set, get) => ({
  user: null,
  assets: [],
  items: [],
  selectionId: null,
  selection: null,
  lockedIds: new Set(),
  userColor: `hsl(${Math.floor(Math.random()*360)} 70% 50%)`,
  remoteSelections: {}, // userId -> { selectionId }
  projects: [],
  projectName: 'My Project',
  currentProjectId: null,
  history: [],
  historyIndex: -1,

  // drawing tool state
  activeTool: 'select', // 'brush' | 'line' | 'rect' | 'ellipse' | 'eraser'
  strokeColor: '#111827',
  fillColor: '#e5e7eb',
  strokeWidth: 4,
  drawings: [], // persisted drawing items separate from items
  drawingsHidden: false,

  initSession: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const user = await getMe();
      set({ user });
      await get().refreshAssets();
      await get().refreshProjects();
    } catch (e) {
      localStorage.removeItem('access_token');
      set({ user: null });
    }
  },

  setUser: (user) => set({ user }),

  refreshAssets: async () => {
    try {
      const assets = await listAssets();
      set({ assets });
    } catch {}
  },

  refreshProjects: async () => {
    try {
      const projects = await listProjects();
      set({ projects });
    } catch {}
  },

  setProjectName: (name) => set({ projectName: name }),

  addAssetToCanvas: (url) => {
    const next = [...get().items, { id: Date.now(), type: 'image', url, x: 50, y: 100, hidden: false }];
    get().pushHistory(next);
    set({ items: next });
  },

  clearCanvas: () => {
    get().pushHistory([]);
    set({ items: [] });
  },

  setSelectionId: (id) => set({ selectionId: id }),
  setRemoteSelection: (userId, selectionId) => set({ remoteSelections: { ...get().remoteSelections, [userId]: { selectionId } } }),

  setItemsWithHistory: (updater) => {
    const next = typeof updater === 'function' ? updater(get().items) : updater;
    get().pushHistory(next);
    set({ items: next });
  },

  updateItemProps: (id, partial) => {
    const next = get().items.map(it => it.id === id ? { ...it, ...partial } : it);
    get().pushHistory(next);
    set({ items: next });
  },

  toggleVisibility: (id) => {
    const next = get().items.map(it => it.id === id ? { ...it, hidden: !it.hidden } : it);
    get().pushHistory(next);
    set({ items: next });
  },

  toggleLock: (id) => {
    const setLocked = new Set(get().lockedIds);
    if (setLocked.has(id)) setLocked.delete(id); else setLocked.add(id);
    set({ lockedIds: setLocked });
  },

  moveLayer: (id, direction) => {
    const idx = get().items.findIndex(it => it.id === id);
    if (idx < 0) return;
    const target = idx + direction;
    if (target < 0 || target >= get().items.length) return;
    const next = [...get().items];
    const tmp = next[idx];
    next[idx] = next[target];
    next[target] = tmp;
    get().pushHistory(next);
    set({ items: next });
  },

  removeItemById: (id) => {
    const next = get().items.filter(it => it.id !== id);
    get().pushHistory(next);
    set({ items: next, selectionId: null });
  },

  cloneSelected: () => {
    const id = get().selectionId;
    if (!id) return;
    const it = get().items.find(x => x.id === id);
    if (!it) return;
    const clone = { ...it, id: Date.now(), x: (it.x||0)+20, y: (it.y||0)+20 };
    const next = [...get().items, clone];
    get().pushHistory(next);
    set({ items: next, selectionId: clone.id });
  },

  renameSelected: (name) => {
    const id = get().selectionId;
    if (!id) return;
    const next = get().items.map(it => it.id === id ? { ...it, name } : it);
    get().pushHistory(next);
    set({ items: next });
  },

  addTextItem: (text = 'Text') => {
    const next = [
      ...get().items,
      { id: Date.now(), type: 'text', text, x: 80, y: 120, fontSize: 24, fill: '#111827', hidden: false }
    ];
    get().pushHistory(next);
    set({ items: next });
  },

  addRectItem: () => {
    const next = [
      ...get().items,
      { id: Date.now(), type: 'rect', x: 120, y: 160, width: 160, height: 100, fill: '#e5e7eb', stroke: '#111827', strokeWidth: 1, hidden: false }
    ];
    get().pushHistory(next);
    set({ items: next });
  },

  updateItemPosition: (id, x, y) => {
    const next = get().items.map(it => it.id === id ? { ...it, x, y } : it);
    get().pushHistory(next);
    set({ items: next });
  },

  pushHistory: (nextItems) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextItems);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const idx = historyIndex - 1;
    set({ historyIndex: idx, items: history[idx] });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    set({ historyIndex: idx, items: history[idx] });
  },

  saveProject: async () => {
    const { projectName, items, drawings } = get();
    const res = await saveProject({ name: projectName, items: [...items, ...drawings] });
    set({ currentProjectId: res.project.id });
    await get().refreshProjects();
    return res;
  },

  setActiveTool: (tool) => set({ activeTool: tool }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (w) => set({ strokeWidth: w }),

  pushDrawing: (drawing) => {
    const next = [...get().drawings, drawing];
    get().pushHistory([...get().items, ...next]);
    set({ drawings: next });
  },

  updateLastDrawing: (updater) => {
    const ds = [...get().drawings];
    if (ds.length === 0) return;
    const last = ds[ds.length - 1];
    const updated = typeof updater === 'function' ? updater(last) : updater;
    ds[ds.length - 1] = updated;
    set({ drawings: ds });
  },

  toggleDrawingsHidden: () => set({ drawingsHidden: !get().drawingsHidden }),
  clearDrawings: () => set({ drawings: [] }),
}));


