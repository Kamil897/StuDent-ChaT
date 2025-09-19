import React, { useState, useEffect } from 'react';
import { generateText, generateImage, listAssets, uploadFile, loginWithBackendLogin } from '../api';
import { FilePlus, Image as ImgIcon, Type as TextIcon } from 'lucide-react';
import './Toolbar.scss';

export default function Toolbar() {
  const [prompt, setPrompt] = useState('');
  const [resultText, setResultText] = useState('');
  const [assets, setAssets] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) loadAssets();
  }, []);

  async function loadAssets() {
    try { const res = await listAssets(); setAssets(res); }
    catch (e) { console.error(e); }
  }

  async function onGenerateText() {
    try { const res = await generateText(prompt); setResultText(res.text); }
    catch (e) { alert('Error: ' + (e.message || e)); }
  }

  async function onGenerateImage() {
    try {
      const res = await generateImage(prompt);
      alert('Image generated and saved. ID: ' + res.asset?.id);
      loadAssets();
    } catch (e) { alert('Error: ' + (e.message || e)); }
  }

  async function onUpload(e) {
    const f = e.target.files[0]; if (!f) return;
    const fd = new FormData(); fd.append('file', f);
    try {
      const res = await uploadFile(fd);
      alert('Uploaded: ' + res.asset.id);
      loadAssets();
    } catch (err) {
      alert('Upload error');
      console.error(err);
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    try {
      const { user } = await loginWithBackendLogin(email, password);
      setUser(user);
      await loadAssets();
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  }

  return (
    <aside className="toolbar tb-root">
      <h3>AI Tools</h3>

      <section className="toolbar-card">
        <h4>Логин</h4>
        {user ? (
          <div>Вошли как: {user.email}</div>
        ) : (
          <form onSubmit={onLogin} className="login-form">
            <input className="input" type="email" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="button" type="submit">Войти</button>
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

      {/* Ассеты */}
      <section className="toolbar-card">
        <h4>Assets</h4>
        <div className="assets-list">
          {assets.map(a => (
            <div key={a.id} className="asset-card">
              <img className="asset-img" src={a.url} alt="asset" />
              <div className="asset-caption">{a.prompt}</div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
