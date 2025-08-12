import s from './AiChat.module.scss';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Chat({ userId, username = "Guest" }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('chatTheme') || 'light';
    setTheme(savedTheme);
    
    const savedChats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    setChatList(savedChats);
    
    if (savedChats.length > 0) {
      setChat(savedChats[savedChats.length - 1].messages || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatTheme', theme);
  }, [theme]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const saveChatHistory = (newChat) => {
    const updatedList = [...chatList];
    if (updatedList.length === 0) {
      updatedList.push({ 
        id: Date.now(), 
        messages: newChat,
        title: newChat[0]?.text.slice(0, 30) + '...' || 'New Chat'
      });
    } else {
      updatedList[updatedList.length - 1].messages = newChat;
    }
    setChatList(updatedList);
    localStorage.setItem('chatHistory', JSON.stringify(updatedList));
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    const newChat = [...chat, { role: 'user', text: userMessage }];
    setChat(newChat);
    setMessage('');
    setIsLoading(true);

    // Автоматически изменяем высоту textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const baseURL = import.meta.env.VITE_API_URL || '/api';
      const res = await axios.post(`${baseURL}/ai/ask`, { 
        userId, 
        message: userMessage 
      });
      
      const reply = res.data?.reply || res.data || t("ai_chat.no_reply");
      const updatedChat = [...newChat, { role: 'ai', text: reply }];
      setChat(updatedChat);
      saveChatHistory(updatedChat);
    } catch (err) {
      console.error('Ошибка запроса:', err);
      const updatedChat = [...newChat, { 
        role: 'ai', 
        text: t("ai_chat.connection_error") 
      }];
      setChat(updatedChat);
      saveChatHistory(updatedChat);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Автоматическое изменение высоты textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  const newChat = () => {
    const newChatObj = { 
      id: Date.now(), 
      messages: [],
      title: 'New Chat'
    };
    const updatedList = [...chatList, newChatObj];
    setChat([]);
    setChatList(updatedList);
    localStorage.setItem('chatHistory', JSON.stringify(updatedList));
  };

  const selectChat = (chatObj) => {
    setChat(chatObj.messages);
  };

  const filteredMessages = chat.filter(c =>
    c.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`${s.chatWrapper} ${theme === 'light' ? s.light : s.dark}`}>
      {/* Боковая панель */}
      <div className={s.sidebar}>
        <div className={s.sidebarTop}>
          <h2>{t("ai_chat.chats")}</h2>
          
          <button 
            className={`${s.sidebarBtn} ${s.newChat}`} 
            onClick={newChat}
          >
            <span>✨</span>
            {t("ai_chat.new_chat")}
          </button>

          {/* Список чатов */}
          {chatList.map((chatObj, i) => (
            <button 
              key={chatObj.id} 
              className={s.sidebarBtn}
              onClick={() => selectChat(chatObj)}
            >
              <span>💬</span>
              {chatObj.title || `${t("ai_chat.chat")} #${i + 1}`}
            </button>
          ))}
        </div>

        <div className={s.sidebarBottom}>      
          <button className={s.sidebarBtn}>
            <span>⚙️</span>
            {t("ai_chat.settings")}
          </button>
        </div>
      </div>

      {/* Основная область чата */}
      <div className={s.chatContainer}>
        <h1 className={s.Aititle}>StuDent AI</h1>

        <div className={s.chatBox} ref={chatBoxRef}>
          {filteredMessages.length === 0 ? (
            <div className={s.placeholder}>
              <h2>👋 {t("ai_chat.welcome")}</h2>
              <p>{t("ai_chat.start_prompt")}</p>
            </div>
          ) : (
            filteredMessages.map((msg, i) => (
              <div key={i} className={`${s.message} ${msg.role === 'user' ? s.user : s.ai}`}>
                <div className={`${s.messageAvatar} ${msg.role === 'user' ? s.userAvatar : s.aiAvatar}`}>
                  {msg.role === 'user' ? getUserInitials(username) : 'AI'}
                </div>
                <div className={s.messageContent}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className={`${s.message} ${s.ai}`}>
              <div className={`${s.messageAvatar} ${s.aiAvatar}`}>AI</div>
              <div className={s.messageContent}>
                <span>💭 {t("ai_chat.thinking")}...</span>
              </div>
            </div>
          )}
        </div>

        <div className={s.AiinputSection}>
          <div className={s.inputWrapper}>
            <textarea
              ref={textareaRef}
              className={s.Aiinput}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t("ai_chat.input_placeholder")}
              rows={1}
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage} 
              className={s.AiButton}
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}