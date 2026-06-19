import { createContext, useContext, useState, useEffect } from 'react';

const MessagesContext = createContext();

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

export const MessagesProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    // Load conversations from localStorage
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  useEffect(() => {
    // Save conversations to localStorage whenever they change
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  const sendMessage = (conversationId, message) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: false
    };

    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: message,
          lastMessageTime: new Date().toISOString(),
          unreadCount: conv.unreadCount + 1
        };
      }
      return conv;
    }));

    // Simulate auto-reply after 2 seconds
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: 'Thank you for your message. I will get back to you soon.',
        sender: 'other',
        timestamp: new Date().toISOString(),
        read: false
      };

      setConversations(conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, autoReply],
            lastMessage: autoReply.text,
            lastMessageTime: new Date().toISOString()
          };
        }
        return conv;
      }));
    }, 2000);
  };

  const createConversation = (participant) => {
    const newConversation = {
      id: Date.now(),
      participant: participant,
      messages: [],
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    };
    setConversations([...conversations, newConversation]);
    return newConversation;
  };

  const markAsRead = (conversationId) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    }));
  };

  const deleteConversation = (conversationId) => {
    setConversations(conversations.filter(conv => conv.id !== conversationId));
    if (activeConversation === conversationId) {
      setActiveConversation(null);
    }
  };

  const value = {
    conversations,
    activeConversation,
    setActiveConversation,
    sendMessage,
    createConversation,
    markAsRead,
    deleteConversation
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};
