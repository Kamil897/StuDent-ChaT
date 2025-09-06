import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import s from './AiChat.module.scss';

const AiChat = () => {
  const { t } = useTranslation();

  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("chatTheme") || "light");
  const [replyStyle, setReplyStyle] = useState(localStorage.getItem("replyStyle") || "normal");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const chatBoxRef = useRef(null);
  const textareaRef = useRef(null);

  // ✅ загрузка истории чата из backend-login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:3000/chat", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const history = res.data.flatMap((msg) => [
          { role: "user", text: msg.question },
          { role: "ai", text: msg.answer },
        ]);
        setChat(history);
      })
      .catch((err) => console.error("Ошибка загрузки истории:", err));
  }, []);

  // ✅ отправка сообщения
  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Отправляем запрос в AI (backend-main)
      const res = await axios.post(
        "http://localhost:7777/api/ai/ask",
        { message, history: newChat },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reply = res.data?.reply || res.data || t("ai_chat.no_reply");
      const updatedChat = [...newChat, { role: "ai", text: reply }];
      setChat(updatedChat);

      // Сохраняем в backend-login
      await axios.post(
        "http://localhost:3000/chat",
        { question: message, answer: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Ошибка при отправке сообщения:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ очистка истории
  const clearHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete("http://localhost:3000/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChat([]);
    } catch (err) {
      console.error("Ошибка очистки истории:", err);
    }
  };

  // ✅ выбор чата (пока просто заглушка)
  const newChat = () => {
    setChat([]);
    setSelectedChat(null);
  };

  const selectChat = (chatObj) => {
    setSelectedChat(chatObj.id);
  };

  // ✅ вспомогательные функции
  const handleInputChange = (e) => setMessage(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getUserInitials = (username = "U") => username[0]?.toUpperCase();

  const filteredMessages = chat;

  return (
    <div className={`${s.chatWrapper} ${theme === "light" ? s.light : s.dark}`}>
      {/* Боковая панель */}
      <div className={s.sidebar}>
        <div className={s.sidebarTop}>
          <h2>{t("ai_chat.chats")}</h2>

          <button className={`${s.sidebarBtn} ${s.newChat}`} onClick={newChat}>
            <span>✨</span>
            {t("ai_chat.new_chat")}
          </button>

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
          <button className={s.sidebarBtn} onClick={() => setIsSettingsOpen(true)}>
            <span>⚙️</span>
            {t("ai_chat.settings")}
          </button>
        </div>
      </div>

      {/* Основная область */}
      <div className={s.chatContainer}>
        <h1 className={s.Aititle}>Cognia</h1>

        <div className={s.chatBox} ref={chatBoxRef}>
          {filteredMessages.length === 0 ? (
            <div className={s.placeholder}>
              <h2>👋 {t("ai_chat.welcome")}</h2>
              <p>{t("ai_chat.start_prompt")}</p>
            </div>
          ) : (
            filteredMessages.map((msg, i) => (
              <div
                key={i}
                className={`${s.message} ${msg.role === "user" ? s.user : s.ai}`}
              >
                <div
                  className={`${s.messageAvatar} ${
                    msg.role === "user" ? s.userAvatar : s.aiAvatar
                  }`}
                >
                  {msg.role === "user" ? getUserInitials("User") : "AI"}
                </div>
                <div className={s.messageContent}>{msg.text}</div>
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
              {isLoading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      </div>

      {/* Модалка настроек */}
      {isSettingsOpen && (
        <div className={s.settingsOverlay}>
          <div className={s.settingsBox}>
            <h2>{t("ai_chat.settings")}</h2>

            {/* Тема */}
            <div className={s.settingItem}>
              <label>{t("ai_chat.theme")}</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">{t("ai_chat.light")}</option>
                <option value="dark">{t("ai_chat.dark")}</option>
              </select>
            </div>

            {/* Стиль ответов */}
            <div className={s.settingItem}>
              <label>{t("ai_chat.reply_style")}</label>
              <select
                value={replyStyle}
                onChange={(e) => setReplyStyle(e.target.value)}
              >
                <option value="normal">{t("ai_chat.style_normal")}</option>
                <option value="detailed">{t("ai_chat.style_detailed")}</option>
                <option value="creative">{t("ai_chat.style_creative")}</option>
              </select>
            </div>

            {/* Очистка истории */}
            <div className={s.settingItem}>
              <button onClick={clearHistory} className={s.clearBtn}>
                ❌ {t("ai_chat.clear_history")}
              </button>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className={s.closeBtn}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChat;
