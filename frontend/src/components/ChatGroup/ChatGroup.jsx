import { useState, useEffect, useRef } from 'react';
import Picker from 'emoji-picker-react';
import { io } from 'socket.io-client';
import api from '../../axios';

const socket = io('https://student-chat.online', {
  transports: ['websocket'],
});

export default function GroupChat() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [user, setUser] = useState({ id: '', name: '', role: '' });
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const containerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    api.get('/chats')
      .then(({ data }) => setChats(data))
      .catch((err) => setError('Ошибка при загрузке чатов.'));
  }, []);

  useEffect(() => {
    if (currentChatId) {
      api.get(`/messages/${currentChatId}`)
        .then(({ data }) => setChatMessages(data))
        .catch(() => setError('Ошибка при загрузке сообщений.'));
    }
  }, [currentChatId]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      if (message.chatId === currentChatId) {
        setChatMessages((prev) => [...prev, message]);
      }
    });

    socket.on('typing', ({ chatId, username }) => {
      if (chatId === currentChatId && username !== user.name) {
        setTypingUsers((prev) => [...new Set([...prev, username])]);
      }
    });

    socket.on('stopTyping', ({ chatId, username }) => {
      if (chatId === currentChatId && username !== user.name) {
        setTypingUsers((prev) => prev.filter((name) => name !== username));
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [currentChatId, user.name]);

  const sendMessage = () => {
    if (!input.trim() || !currentChatId) return;
    const newMessage = {
      msgtext: input,
      msguser: user.name,
      msgtime: new Date().toLocaleTimeString(),
      chatId: currentChatId,
    };
    socket.emit('sendMessage', newMessage);
    socket.emit('stopTyping', { chatId: currentChatId, username: user.name });
    setInput('');
    setTyping(false);
  };

  const sendFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentChatId) return;
    const form = new FormData();
    form.append('file', file);
    form.append('chatId', currentChatId);
    form.append('msguser', user.name);

    try {
      const { data } = await api.post('/messages/file', form);
      socket.emit('sendMessage', data);
    } catch (err) {
      setError('Ошибка при отправке файла.');
    }
  };

  const addChat = async () => {
    try {
      const { data } = await api.post('/chats');
      setChats((prev) => [...prev, data]);
    } catch (err) {
      setError('Ошибка при добавлении чата.');
    }
  };

  const removeChat = async (id) => {
    try {
      await api.delete(`/chats/${id}`);
      setChats(chats.filter((c) => c.id !== id));
      if (currentChatId === id) setCurrentChatId(null);
    } catch (err) {
      setError('Ошибка при удалении чата.');
    }
  };

  const toggleChatSelection = (id) => {
    setCurrentChatId((prev) => (prev === id ? null : id));
    setTypingUsers([]);
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { chatId: currentChatId, username: user.name });
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
        socket.emit('stopTyping', { chatId: currentChatId, username: user.name });
      }, 3000);
    } else {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
        socket.emit('stopTyping', { chatId: currentChatId, username: user.name });
      }, 3000);
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const styles = {
    container: { display: 'flex', height: '90vh', borderRadius: '12px', backgroundColor: '#111b21', color: '#e9edef', overflow: 'hidden', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' },
    sidebar: { width: isMobile && currentChatId ? '0' : '30%', minWidth: '200px', transition: 'width 0.3s', backgroundColor: '#202c33', display: isMobile && currentChatId ? 'none' : 'block' },
    chatListBtn: { display: 'block', width: '100%', padding: '15px', backgroundColor: '#2a2a2a', color: '#e9edef', border: 'none', cursor: 'pointer', textAlign: 'left', borderTop: '2px solid #444444' },
    chatArea: { flex: 1, display: 'flex', flexDirection: 'column', padding: '10px' },
    chatWindow: { flex: 1, overflowY: 'auto', backgroundColor: '#0b141a', padding: '10px', borderRadius: '10px', marginBottom: '10px' },
    message: (isYou) => ({ alignSelf: isYou ? 'flex-end' : 'flex-start', backgroundColor: isYou ? '#005c4b' : '#202c33', borderRadius: '10px', padding: '10px 14px', margin: '6px 0', maxWidth: '70%', wordWrap: 'break-word', color: '#e9edef', fontSize: '14px' }),
    inputBar: { display: 'flex', alignItems: 'center', gap: '10px' },
    input: { flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #2a3942', backgroundColor: '#202c33', color: '#e9edef' },
    sendBtn: { backgroundColor: '#00a884', border: 'none', color: 'white', padding: '10px 16px', borderRadius: '20px', cursor: 'pointer' },
    emojiBtn: { backgroundColor: '#111b21', border: 'none', color: '#e9edef', fontSize: '20px', cursor: 'pointer' },
    backBtn: { display: isMobile ? 'inline-block' : 'none', marginBottom: '10px', backgroundColor: '#2a3942', color: '#e9edef', padding: '6px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer' },
    fileInput: { display: 'none' },
    fileLabel: { backgroundColor: '#2a3942', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#ccc' },
    typingIndicator: { fontStyle: 'italic', fontSize: '13px', color: '#aaa', padding: '4px 10px' },
    errorBox: { padding: '10px', backgroundColor: '#ff4444', color: 'white', textAlign: 'center', marginBottom: '10px', borderRadius: '6px' },
  };

  const filteredChats = chats.filter(chat => chat.id.toString().includes(search));

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <input
          placeholder="Поиск чата..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px', backgroundColor: '#0b141a', color: '#e9edef', border: 'none', borderBottom: '1px solid #2a3942' }}
        />
        {filteredChats.map((chat) => (
          <button key={chat.id} onClick={() => toggleChatSelection(chat.id)} style={styles.chatListBtn}>
            Чат {chat.id}
            {user.role === 'admin' && (
              <span onClick={(e) => { e.stopPropagation(); removeChat(chat.id); }} style={{ float: 'right', color: '#f55', cursor: 'pointer' }}>×</span>
            )}
          </button>
        ))}
        <button onClick={addChat} style={styles.chatListBtn}>➕ Добавить чат</button>
      </div>

      <div style={styles.chatArea}>
        {error && <div style={styles.errorBox}>{error}</div>}

        {isMobile && currentChatId && (
          <button onClick={() => setCurrentChatId(null)} style={styles.backBtn}>
            ← Назад к чатам
          </button>
        )}

        {currentChatId && (
          <div ref={containerRef} style={styles.chatWindow}>
            {chatMessages.map((msg) => (
              <div key={msg.id || Math.random()} style={styles.message(msg.msguser === user.name)}>
                <div><strong>{msg.msguser}</strong> <small>{msg.msgtime}</small></div>
                {msg.msgtext && <div>{msg.msgtext}</div>}
                {msg.fileUrl && (
                  <div>
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#8ab4f8' }}>
                      📎 Вложение
                    </a>
                  </div>
                )}
              </div>
            ))}
            {typingUsers.length > 0 && (
              <div style={styles.typingIndicator}>{typingUsers.join(', ')} печатает...</div>
            )}
          </div>
        )}

        {currentChatId && (
          <div style={styles.inputBar}>
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Напишите сообщение..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>Отправить</button>
            <label htmlFor="file-upload" style={styles.fileLabel}>📎</label>
            <input id="file-upload" type="file" onChange={sendFile} style={styles.fileInput} />
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={styles.emojiBtn}>😀</button>
            {showEmojiPicker && <Picker onEmojiClick={(_, emoji) => handleEmojiClick(emoji)} />}
          </div>
        )}
      </div>
    </div>
  );
}
