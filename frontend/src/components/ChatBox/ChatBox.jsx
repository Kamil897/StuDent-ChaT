import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './ChatBox.module.scss';

const ChatBox = () => {
  const { friendId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (friendId) {
      loadMessages();
      loadFriendInfo();
    }
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/messages/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFriendInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const friendsData = await response.json();
        const friendData = friendsData.find(f => f.id === parseInt(friendId));
        setFriend(friendData);
      }
    } catch (error) {
      console.error('Error loading friend info:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          toUserId: parseInt(friendId),
          content: newMessage
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
      } else {
        const error = await response.json();
        alert(error.message || 'Ошибка при отправке сообщения');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка при отправке сообщения');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="chat-container">
        <div className="loading">Загрузка чата...</div>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="chat-container">
        <div className="error">Пользователь не найден</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="friend-info">
          <div className="friend-avatar">
            {friend.avatar ? (
              <img src={friend.avatar} alt={friend.name} />
            ) : (
              <div className="avatar-placeholder">
                {friend.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="friend-details">
            <h3 className="friend-name">{friend.name}</h3>
            <p className="friend-status">В сети</p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>Начните разговор с {friend.name}!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => {
              const isOwnMessage = message.fromUserId === parseInt(localStorage.getItem('userId') || '0');
              const showDate = index === 0 || 
                formatDate(message.createdAt) !== formatDate(messages[index - 1]?.createdAt);

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="date-separator">
                      {formatDate(message.createdAt)}
                    </div>
                  )}
                  <div className={`message ${isOwnMessage ? 'own' : 'other'}`}>
                    <div className="message-content">
                      <p className="message-text">{message.content}</p>
                      <span className="message-time">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите сообщение..."
          className="message-textarea"
          rows="1"
        />
        <button 
          onClick={sendMessage} 
          className="send-button"
          disabled={!newMessage.trim()}
        >
          📤
        </button>
      </div>
    </div>
  );
};

export default ChatBox;




