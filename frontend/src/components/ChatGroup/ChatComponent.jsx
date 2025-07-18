import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

function ChatComponent() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/src/components/ChatGroup/test.json');
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Ошибка загрузки чатов:', error);
        setChats([{ chatid: 1, messages: [] }]);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    const savedChatId = sessionStorage.getItem('currentChatId');
    if (savedChatId) {
      setCurrentChatId(Number(savedChatId));
    }
  }, []);

  useEffect(() => {
    if (currentChatId !== null) {
      sessionStorage.setItem('currentChatId', currentChatId);
    }
  }, [currentChatId]);

  const handleChatClick = (chatId) => {
    setCurrentChatId(chatId);
  };

  const currentChat = chats.find((chat) => chat.chatid === currentChatId);

  return (
    <div>
      <h2>{t("chat.select_chat")}</h2>
      <div>
        {chats.map((chat) => (
          <button key={chat.chatid} onClick={() => handleChatClick(chat.chatid)}>
            {chat.chatid}
          </button>
        ))}
      </div>
      <div>
        {currentChat ? (
          <div>
            <h3>{t("chat.chat_id")}: {currentChat.chatid}</h3>
            {currentChat.messages.map((message) => (
              <p key={message.msgid}>
                <strong>{message.msguser} ({message.msgtime}):</strong> {message.msgtext}
              </p>
            ))}
          </div>
        ) : (
          <p>{t("chat.choose_prompt")}</p>
        )}
      </div>
    </div>
  );
}

export default ChatComponent;
