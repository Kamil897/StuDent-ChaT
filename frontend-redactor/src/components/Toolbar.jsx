import React, { useState, useEffect } from 'react';
import { generateText, generateImage, listAssets, uploadFile } from '../api';
import { FilePlus, Image as ImgIcon, Type as TextIcon } from 'lucide-react';

export default function Toolbar() {
  const [prompt, setPrompt] = useState('');
  const [resultText, setResultText] = useState('');
  const [assets, setAssets] = useState([]);

  useEffect(() => { loadAssets(); }, []);

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

  return (
    <aside className="toolbar">
      <h3>AI Tools</h3>

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
