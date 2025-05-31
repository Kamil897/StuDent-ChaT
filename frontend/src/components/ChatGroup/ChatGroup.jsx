import * as sdk from 'matrix-js-sdk';
import { useState, useEffect, useRef } from 'react';
import Picker from 'emoji-picker-react';
import { io } from 'socket.io-client';

const socket = io('https://student-chat.online:7777', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  transports: ['websocket'],
});

export default function GroupChat() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixMessages, setMatrixMessages] = useState([]);
  const [matrixInput, setMatrixInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const matrixClientRef = useRef(null);
  const matrixRoomId = "!eMbakzRBTOyjeLiyIX:matrix.org";
  const containerRef = useRef(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/src/components/ChatGroup/test.json');
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Ошибка загрузки чатов:', error);
        setChats([{ id: 1, messages: [] }]);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === message.chatId
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        )
      );
    });
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    if (!showMatrix) return;
    const startMatrix = async () => {
      const client = sdk.createClient({ baseUrl: "https://matrix.org" });
      try {
        await client.loginWithPassword("@anton_danik_22:matrix.org", "KamilandDaniyar070884");
        await client.startClient();
        matrixClientRef.current = client;

        const room = await client.getRoom(matrixRoomId);
        const myUserId = client.getUserId();
        const myPowerLevel = room?.getMyMembership() === 'join'
          ? room.currentState.getStateEvents("m.room.power_levels", "")?.getContent()?.users?.[myUserId] ?? 0
          : 0;

        if (myPowerLevel >= 50) {
          setIsAdmin(true);
        } else {
          alert("У вас нет прав для входа в Matrix чат.");
          setShowMatrix(false);
          return;
        }

        client.on("Room.timeline", (event, room) => {
          if (event.getType() !== "m.room.message" || room.roomId !== matrixRoomId) return;
          const sender = event.getSender();
          const content = event.getContent();
          const text = content.body;

          setMatrixMessages((prev) => [
            ...prev,
            { id: event.getId(), user: sender, text },
          ]);
        });
      } catch (err) {
        console.error("Matrix подключение не удалось:", err);
      }
    };

    startMatrix();

    return () => {
      if (matrixClientRef.current) {
        matrixClientRef.current.stopClient();
      }
    };
  }, [showMatrix]);

  const sendMessage = () => {
    if (!input.trim() || !currentChatId) return;

    const newMessage = {
      id: Date.now(),
      msgtext: input,
      msgtime: new Date().toLocaleTimeString(),
      msguser: 'Вы',
      chatId: currentChatId,
    };

    socket.emit('sendMessage', newMessage);

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setInput('');
  };

  const sendMatrixMessage = () => {
    const client = matrixClientRef.current;
    if (!client || !matrixInput.trim()) return;

    client.sendTextMessage(matrixRoomId, matrixInput);
    setMatrixInput('');
  };

  const addChat = () => {
    const newChatId = chats.length + 1;
    setChats([...chats, { id: newChatId, messages: [] }]);
  };


  const removeChat = (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) setCurrentChatId(null);
  };

  const toggleChatSelection = (chatId) => {
    setCurrentChatId((prev) => (prev === chatId ? null : chatId));
  };

  const handleEmojiClick = (emojiObject) => {
    if (showMatrix) {
      setMatrixInput((prev) => prev + emojiObject.emoji);
    } else {
      setInput((prev) => prev + emojiObject.emoji);
    }
  };

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, matrixMessages]);

  const styles = {
    container: {
      display: 'flex',
      height: '90vh',
      borderRadius: '12px',
      backgroundColor: '#111b21',
      color: '#e9edef',
      overflow: 'hidden',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'sans-serif',
    },
    sidebar: {
      width: isMobile && currentChatId ? '0' : '30%',
      minWidth: '200px',
      transition: 'width 0.3s',
      backgroundColor: '#202c33',
      // padding: '10px',
      display: isMobile && currentChatId ? 'none' : 'block',
    },
    chatListBtn: {
      display: 'block',
      width: '100%',
      // marginBottom: '10px',
      padding: '15px',
      // borderRadius: '10px',
      backgroundColor: '#2a2a2a',
      color: '#e9edef',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      borderTop: '2px solid #444444'
    },
    chatArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
    },
    chatWindow: {
      flex: 1,
      overflowY: 'auto',
      backgroundColor: '#0b141a',
      padding: '10px',
      borderRadius: '10px',
      marginBottom: '10px',
    },
    message: (isYou) => ({
      alignSelf: isYou ? 'flex-end' : 'flex-start',
      backgroundColor: isYou ? '#005c4b' : '#202c33',
      borderRadius: '10px',
      padding: '10px 14px',
      margin: '6px 0',
      maxWidth: '70%',
      wordWrap: 'break-word',
      color: '#e9edef',
      fontSize: '14px',
    }),
    inputBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    input: {
      flex: 1,
      padding: '10px',
      borderRadius: '20px',
      border: '1px solid #2a3942',
      backgroundColor: '#202c33',
      color: '#e9edef',
    },
    sendBtn: {
      backgroundColor: '#00a884',
      border: 'none',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
    },
    emojiBtn: {
      backgroundColor: '#111b21',
      border: 'none',
      color: '#e9edef',
      fontSize: '20px',
      cursor: 'pointer',
    },
    backBtn: {
      display: isMobile ? 'inline-block' : 'none',
      marginBottom: '10px',
      backgroundColor: '#2a3942',
      color: '#e9edef',
      padding: '6px 12px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => toggleChatSelection(chat.id)}
            style={styles.chatListBtn}
          >
            Чат {chat.id}
          </button>
        ))}
        <button onClick={addChat} style={styles.chatListBtn}>➕ Добавить чат</button>
      </div>

      <div style={styles.chatArea}>
        {isMobile && currentChatId && (
          <button onClick={() => setCurrentChatId(null)} style={styles.backBtn}>
            ← Назад к чатам
          </button>
        )}


{currentChatId && currentChat && (
          <div ref={containerRef} style={styles.chatWindow}>
            {currentChat.messages.map((msg) => (
              <div key={msg.id} style={styles.message(msg.msguser === 'Вы')}>
                <div><strong>{msg.msguser}</strong> <small>{msg.msgtime}</small></div>
                <div>{msg.msgtext}</div>
              </div>
            ))}
          </div>
        )}

        {currentChatId && (
          <div style={styles.inputBar}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите сообщение..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>Отправить</button>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={styles.emojiBtn}>😀</button>
            {showEmojiPicker && <Picker onEmojiClick={(_, emoji) => handleEmojiClick(emoji)} />}
          </div>
        )}
      </div>
    </div>
  );
}
