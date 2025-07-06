import s from './AiChat.module.scss';
import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Chat({ userId }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const baseURL = import.meta.env.VITE_API_URL || '/api';

      const res = await axios.post(`${baseURL}/ai/ask`, {
        userId,
        message
      });

      const reply = res.data?.reply || res.data || t("ai_chat.no_reply");

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
        { role: 'ai', text: t("ai_chat.connection_error") }
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
      <h1 className={s.Aititle}>StuDent AI</h1>
      <div className={s.chatBox}>
        {chat.length === 0 ? (
          <div className={s.placeholder}>{t("ai_chat.start_prompt")}</div>
        ) : (
          chat.map((c, i) => (
            <div key={i} className={s.message}>
              <strong className={c.role === 'user' ? s.user : s.ai}>
                {c.role === 'user' ? t("ai_chat.you") : t("ai_chat.ai")}:
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
          placeholder={t("ai_chat.input_placeholder")}
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
