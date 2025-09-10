import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import s from "./AISimulation.module.scss";

const API_LOGIN = "http://localhost:3000"; // backend-login
const API_MAIN = "http://localhost:7777"; // backend-main

const AiChat = () => {
  const { t } = useTranslation();
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("chatTheme") || "light");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chatBoxRef = useRef(null);

  // ✅ загрузка списка чатов
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${API_LOGIN}/chat/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChatList(res.data))
      .catch((err) => console.error("Ошибка загрузки чатов:", err));
  }, []);

  // ✅ загрузка истории выбранного чата
  const loadChat = async (chatId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${API_LOGIN}/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let history = [];

      // 🔹 если вернулся список чатов (массив)
      if (Array.isArray(res.data)) {
        history = res.data.flatMap((c) =>
          (c.messages || []).map((msg) => ({
            role: msg.role === "assistant" ? "ai" : "user",
            text: msg.content,
          }))
        );
      }

      // 🔹 если вернулся один чат
      else if (res.data?.messages) {
        history = res.data.messages.map((msg) => ({
          role: msg.role === "assistant" ? "ai" : "user",
          text: msg.content,
        }));
      }

      setSelectedChat(chatId);
      setMessages(history);
    } catch (err) {
      console.error("Ошибка загрузки истории:", err);
    }
  };

  // ✅ создать новый чат
  const newChat = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.post(
        `${API_LOGIN}/chat/new`,
        { title: `Chat ${chatList.length + 1}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newChatObj = res.data;
      setChatList((prev) => [...prev, newChatObj]);
      setSelectedChat(newChatObj.id);
      setMessages([]);
    } catch (err) {
      console.error("Ошибка создания чата:", err);
    }
  };

  // ✅ отправка сообщения
  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const newMessages = [...messages, { role: "user", text: message }];
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_MAIN}/api/ai/ask`,
        { message, history: newMessages },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reply = res.data?.reply || res.data || t("ai_chat.no_reply");
      const updatedMessages = [...newMessages, { role: "ai", text: reply }];
      setMessages(updatedMessages);

      // Сохраняем в backend-login
      await axios.post(
        `${API_LOGIN}/chat/${selectedChat}/message`,
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
    if (!selectedChat) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`${API_LOGIN}/chat/${selectedChat}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
    } catch (err) {
      console.error("Ошибка очистки истории:", err);
    }
  };

  // 🔹 вспомогательные функции
  const handleInputChange = (e) => setMessage(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`${s.chatWrapper} ${theme === "light" ? s.light : s.dark}`}>
      {/* Sidebar */}
      <div className={s.sidebar}>
        <div className={s.sidebarTop}>
          <h2>{t("ai_chat.chats")}</h2>
          <button className={`${s.sidebarBtn} ${s.newChat}`} onClick={newChat}>
            ✨ {t("ai_chat.new_chat")}
          </button>

          {chatList.map((chatObj, i) => (
            <button
              key={chatObj.id}
              className={`${s.sidebarBtn} ${selectedChat === chatObj.id ? s.active : ""}`}
              onClick={() => loadChat(chatObj.id)}
            >
              💬 {chatObj.title || `${t("ai_chat.chat")} #${i + 1}`}
            </button>
          ))}
        </div>

        <div className={s.sidebarBottom}>
          <button className={s.sidebarBtn} onClick={() => setIsSettingsOpen(true)}>
            ⚙️ {t("ai_chat.settings")}
          </button>
        </div>
      </div>

      {/* Chat */}
      <div className={s.chatContainer}>
        <h1 className={s.Aititle}>Cognia</h1>

        <div className={s.chatBox} ref={chatBoxRef}>
          {messages.length === 0 ? (
            <div className={s.placeholder}>
              <h2>👋 {t("ai_chat.welcome")}</h2>
              <p>{t("ai_chat.start_prompt")}</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`${s.message} ${msg.role === "user" ? s.user : s.ai}`}
              >
                <div
                  className={`${s.messageAvatar} ${
                    msg.role === "user" ? s.userAvatar : s.aiAvatar
                  }`}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </div>
                <div className={s.messageContent}>{msg.text}</div>
              </div>
            ))
          )}

          {isLoading && (
            <div className={`${s.message} ${s.ai}`}>
              <div className={`${s.messageAvatar} ${s.aiAvatar}`}>AI</div>
              <div className={s.messageContent}>💭 {t("ai_chat.thinking")}...</div>
            </div>
          )}
        </div>

        <div className={s.AiinputSection}>
          <div className={s.inputWrapper}>
            <textarea
              className={s.Aiinput}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t("ai_chat.input_placeholder")}
              disabled={isLoading || !selectedChat}
            />
            <button
              onClick={sendMessage}
              className={s.AiButton}
              disabled={!message.trim() || isLoading || !selectedChat}
            >
              {isLoading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      </div>

      {/* Settings modal */}
      {isSettingsOpen && (
        <div className={s.settingsOverlay}>
          <div className={s.settingsBox}>
            <h2>{t("ai_chat.settings")}</h2>
            <div className={s.settingItem}>
              <label>{t("ai_chat.theme")}</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">{t("ai_chat.light")}</option>
                <option value="dark">{t("ai_chat.dark")}</option>
              </select>
            </div>
            <div className={s.settingItem}>
              <button onClick={clearHistory} className={s.clearBtn}>
                ❌ {t("ai_chat.clear_history")}
              </button>
            </div>
            <button onClick={() => setIsSettingsOpen(false)} className={s.closeBtn}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChat;
