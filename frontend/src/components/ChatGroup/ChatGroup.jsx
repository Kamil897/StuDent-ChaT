import * as sdk from 'matrix-js-sdk';
import { useState, useEffect, useRef } from 'react';
import Picker from 'emoji-picker-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:7777', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default function GroupChat() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixMessages, setMatrixMessages] = useState([]);
  const [matrixInput, setMatrixInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // ← Новый state
  const matrixClientRef = useRef(null);
  const matrixRoomId = "!eMbakzRBTOyjeLiyIX:matrix.org";

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
        await client.loginWithPassword("@anton_danik_22:matrix.org", "KamilandDaniyar070884"); // ⚠️ Заменить на безопасный способ
        await client.startClient();
        matrixClientRef.current = client;

        // Проверка уровня прав
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

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShowMatrix(false)} style={{ marginRight: '10px' }}>🗨 Локальный чат</button>
        <button
          onClick={() => {
            if (isAdmin) {
              setShowMatrix(true);
            } else {
              alert("Matrix доступен только администраторам");
            }
          }}
        >
          🌐 Matrix Element
        </button>
      </div>

      {showMatrix ? (
        <div style={{ marginTop: '20px' }}>
          <h3>Matrix Element Чат</h3>
          <div style={{ height: '300px', overflowY: 'auto', backgroundColor: '#fff', padding: '10px', marginBottom: '10px' }}>
            {matrixMessages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: '5px' }}>
                <strong>{msg.user}</strong>: {msg.text}
              </div>
            ))}
          </div>
          <input
            value={matrixInput}
            onChange={(e) => setMatrixInput(e.target.value)}
            style={{ padding: '10px', width: '80%' }}
          />
          <button
            onClick={sendMatrixMessage}
            style={{ padding: '10px', backgroundColor: '#007bff', color: 'white' }}
          >
            Отправить
          </button>
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ padding: '10px' }}>
            😀
          </button>
          {showEmojiPicker && <Picker onEmojiClick={(_, emoji) => handleEmojiClick(emoji)} />}
        </div>
      ) : (
        <div style={{ display: 'flex' }}>
          <div>
            <button
              onClick={addChat}
              style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#28a745', color: 'white' }}
            >
              ➕ Добавить чат
            </button>
            <div>
              {chats.map((chat) => (
                <div key={chat.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <button
                    onClick={() => toggleChatSelection(chat.id)}
                    style={{
                      padding: '10px',
                      marginRight: '5px',
                      backgroundColor: currentChatId === chat.id ? '#007bff' : '#ccc',
                      color: 'white',
                    }}
                  >
                    Чат {chat.id}
                  </button>
                  {chat.id !== 1 && (
                    <button
                      onClick={() => removeChat(chat.id)}
                      style={{ padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '50%' }}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                height: '400px',
                width: '600px',
                overflowY: 'auto',
                padding: '10px',
                backgroundColor: '#fff',
                borderRadius: '8px',
              }}
            >
              {currentChatId ? (
                currentChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      padding: '8px',
                      backgroundColor: '#e5e5e5',
                      color: 'black',
                      borderRadius: '5px',
                      marginBottom: '5px',
                      maxWidth: '100px',
                    }}
                  >
                    <strong>{msg.msguser}</strong>{' '}
                    <small>{msg.msgtime}</small>
                    <p>{msg.msgtext}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#888' }}>Выберите чат</p>
              )}
            </div>

            {currentChatId && (
              <div style={{ marginTop: '10px' }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ padding: '10px', width: '80%' }}
                />
                <button onClick={sendMessage} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white' }}>
                  Отправить
                </button>
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ padding: '10px' }}>
                  😀
                </button>
                {showEmojiPicker && <Picker onEmojiClick={(_, emoji) => handleEmojiClick(emoji)} />}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
