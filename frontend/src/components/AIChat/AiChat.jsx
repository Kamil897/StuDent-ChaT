import s from './AiChat.module.scss';
import { useState } from 'react';
import axios from 'axios';

export default function Chat({ userId }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post('/api/ai/ask', {
        userId,
        message
      });

      const reply = res.data?.reply || res.data || 'Ответ отсутствует';

      setChat(prev => [
        ...prev,
        { role: 'user', text: message },
        { role: 'ai', text: reply }
      ]);

      setMessage('');
    } catch (err) {
      console.error('Ошибка запроса:', err);
      setChat(prev => [
        ...prev,
        { role: 'user', text: message },
        { role: 'ai', text: 'Ошибка соединения с сервером.' }
      ]);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={s.chatContainer}>
      <h1 className={s.Aititle}>Учебный ассистент</h1>
      <div className={s.chatBox}>
        {chat.length === 0 ? (
          <div className={s.placeholder}>Начни диалог, задав вопрос!</div>
        ) : (
          chat.map((c, i) => (
            <div key={i} className={s.message}>
              <strong className={c.role === 'user' ? s.user : s.ai}>
                {c.role === 'user' ? 'Вы' : 'ИИ'}:
              </strong>{' '}
              {c.text}
            </div>
          ))
        )}
      </div>
      <div className={s.AiinputSection}>
        <input
          className={s.Aiinput}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Задай вопрос"
        />
        <button onClick={sendMessage} className={s.AiButton}>
          <svg className={s.svgIcon} viewBox="0 0 384 512">
            <path
              d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
