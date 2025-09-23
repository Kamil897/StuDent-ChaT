import React, { useState, useEffect } from 'react';
import { generateText, generateImage, listAssets, uploadFile, loginWithBackendLogin, getMe } from '../api';
import { useToast } from './ToastProvider';
import { FilePlus, Image as ImgIcon, Type as TextIcon } from 'lucide-react';
import './Toolbar.scss';
import { useEditorStore } from '../store/editorStore';

export default function Toolbar() {
  const toast = useToast();
  const [prompt, setPrompt] = useState('');
  const [resultText, setResultText] = useState('');
  const assets = useEditorStore(s => s.assets);
  const refreshAssets = useEditorStore(s => s.refreshAssets);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useEditorStore(s => s.user);
  const setUser = useEditorStore(s => s.setUser);
  const addAssetToCanvas = useEditorStore(s => s.addAssetToCanvas);
  const addTextItem = useEditorStore(s => s.addTextItem);
  const addRectItem = useEditorStore(s => s.addRectItem);
  const activeTool = useEditorStore(s => s.activeTool);
  const setActiveTool = useEditorStore(s => s.setActiveTool);
  const strokeColor = useEditorStore(s => s.strokeColor);
  const setStrokeColor = useEditorStore(s => s.setStrokeColor);
  const fillColor = useEditorStore(s => s.fillColor);
  const setFillColor = useEditorStore(s => s.setFillColor);
  const strokeWidth = useEditorStore(s => s.strokeWidth);
  const setStrokeWidth = useEditorStore(s => s.setStrokeWidth);

  // === при загрузке пробуем восстановить сессию ===
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !user) {
      getMe().then(setUser).then(refreshAssets).catch(() => {
        localStorage.removeItem('access_token');
        setUser(null);
      });
    }
  }, [user, setUser, refreshAssets]);

  async function loadAssets() { await refreshAssets(); }

  async function onGenerateText() {
    try {
      const res = await generateText(prompt);
      setResultText(res.text);
    } catch (e) {
      toast.add('Ошибка генерации текста', 'error');
    }
  }

  async function onGenerateImage() {
    try {
      const res = await generateImage(prompt);
      if (res.asset?.url) addAssetToCanvas(res.asset.url);
      await loadAssets();
    } catch (e) {
      toast.add('Ошибка генерации изображения', 'error');
    }
  }

  async function onUpload(e) {
    const f = e.target.files[0];
    if (!f) return;
    const fd = new FormData();
    fd.append('file', f);
    try {
      const res = await uploadFile(fd);
      if (res.asset?.url) addAssetToCanvas(res.asset.url);
      await loadAssets();
    } catch (err) {
      toast.add('Ошибка загрузки', 'error');
      console.error(err);
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    try {
      const { access_token } = await loginWithBackendLogin(email, password);
      if (access_token) {
        const u = await getMe();
        setUser(u);
        await loadAssets();
        toast.add('Вход выполнен', 'success');
      }
    } catch (err) {
      toast.add('Ошибка входа', 'error');
      console.error(err);
    }
  }

  function onLogout() {
    localStorage.removeItem('access_token');
    setUser(null);
    useEditorStore.setState({ assets: [] });
  }

  return (
    <aside className="toolbar tb-root">
      <h3>AI Tools</h3>

      <section className="toolbar-card">
        {user ? (
          <div>
            <div>{user.email}</div>
            <button className="logout-btn" onClick={onLogout}>
              Выйти
            </button>

          </div>
        ) : (
          <form onSubmit={onLogin} className="login-form">
            <input
              className="input"
              type="email"
              placeholder="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="button" type="submit">
              Войти
            </button>
          </form>
        )}
      </section>

      {/* Промпт */}
      <section className="toolbar-card">
        <h4>Введите запрос</h4>
        <textarea
          className="input"
          rows="4"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Опишите, что сгенерировать..."
        />
        <button className="button" onClick={onGenerateText}>
          <TextIcon size={16} style={{ marginRight: 6 }} /> Сгенерировать текст
        </button>
        <button className="button" onClick={onGenerateImage}>
          <ImgIcon size={16} style={{ marginRight: 6 }} /> Сгенерировать изображение
        </button>
      </section>

      {/* Результат */}
      <section className="toolbar-card">
        <h4>Результат</h4>
        <textarea className="input" rows="6" value={resultText} readOnly />
      </section>

      {/* Загрузка */}
      <section className="toolbar-card">
        <h4>Загрузить файл</h4>
        <label className="upload-btn">
          <FilePlus size={16} style={{ marginRight: 6 }} /> Выбрать файл
          <input type="file" onChange={onUpload} hidden />
        </label>
      </section>

      {/* Быстрое добавление */}
      <section className="toolbar-card">
        <h4>Добавить</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button" onClick={() => addTextItem('Заголовок')}>Текст</button>
          <button className="button" onClick={addRectItem}>Фигура</button>
        </div>
      </section>

      {/* Рисование */}
      <section className="toolbar-card">
        <h4>Рисование</h4>
        <div style={{ display:'grid', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap:'wrap' }}>
            {['select','brush','line','rect','ellipse','eraser'].map(t => (
              <button key={t} className="button" style={{ opacity: activeTool===t?1:0.7 }} onClick={() => setActiveTool(t)}>
                {t}
              </button>
            ))}
          </div>
          <label style={{ display:'flex', alignItems:'center', gap: 8 }}>
            Цвет кисти
            <input type="color" value={strokeColor} onChange={e=>setStrokeColor(e.target.value)} />
          </label>
          <label style={{ display:'flex', alignItems:'center', gap: 8 }}>
            Заливка
            <input type="color" value={fillColor} onChange={e=>setFillColor(e.target.value)} />
          </label>
          <label style={{ display:'flex', alignItems:'center', gap: 8 }}>
            Толщина
            <input type="range" min="1" max="32" value={strokeWidth} onChange={e=>setStrokeWidth(Number(e.target.value))} />
            <span>{strokeWidth}px</span>
          </label>
        </div>
      </section>

      {/* Ассеты */}
      <section className="toolbar-card">
        <h4>Assets</h4>
        <div className="assets-list">
          {assets.map(a => (
            <div key={a.id} className="asset-card" draggable onDragStart={(e)=>{
              e.dataTransfer.setData('text/asset-url', a.url);
            }}>
              <img className="asset-img" src={a.url} alt="asset" />
              <div className="asset-caption">{a.prompt}</div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
