import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KImage, Text, Rect } from 'react-konva';
import useImage from 'use-image';
import { listAssets } from '../api';

function KonvaImage({ src, x = 0, y = 0 }) {
  const [image] = useImage(src);
  return <KImage image={image} x={x} y={y} draggable />;
}

export default function CanvasEditor() {
  const stageRef = useRef();
  const [assets, setAssets] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => { loadAssets(); }, []);
  async function loadAssets() {
    try { const res = await listAssets(); setAssets(res); }
    catch (e) { console.error(e); }
  }

  function addAssetToCanvas(url) {
    setItems(prev => [...prev, { id: Date.now(), url }]);
  }

  function exportPNG() {
    const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
    const a = document.createElement('a');
    a.href = uri;
    a.download = 'canvas.png';
    a.click();
  }

  function clearCanvas() {
    setItems([]);
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

          <Stage width={1024} height={768} ref={stageRef} style={{ background: '#fff' }}>
            <Layer>
              <Rect x={0} y={0} width={1024} height={768} fill="#ffffff" />
              <Text text="AI Canvas" x={20} y={20} fontSize={28} fill="#111" />
              {items.map(it => (
                <KonvaImage key={it.id} src={it.url} x={50} y={100} />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>

      <div className="assets-panel">
        <h4>Библиотека</h4>
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
