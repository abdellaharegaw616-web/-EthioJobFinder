import { useState } from 'react';
import { useMessages } from '../contexts/MessagesContext';
import { MessageSquare, Send, Plus, Trash2, Search, User, Clock, CheckCircle } from 'lucide-react';

const Messages = () => {
  const { conversations, activeConversation, setActiveConversation, sendMessage, createConversation, markAsRead, deleteConversation } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newParticipant, setNewParticipant] = useState({ name: '', company: '' });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && activeConversation) {
      sendMessage(activeConversation, newMessage);
      setNewMessage('');
    }
  };

  const handleCreateConversation = (e) => {
    e.preventDefault();
    if (newParticipant.name) {
      createConversation(newParticipant);
      setNewParticipant({ name: '', company: '' });
      setShowNewConversation(false);
    }
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversation(conversationId);
    markAsRead(conversationId);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find(conv => conv.id === activeConversation);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-8 h-8 text-green-700" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm"
                    />
                  </div>
                  <button
                    onClick={() => setShowNewConversation(!showNewConversation)}
                    className="p-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {showNewConversation && (
                  <form onSubmit={handleCreateConversation} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Contact name"
                      value={newParticipant.name}
                      onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Company (optional)"
                      value={newParticipant.company}
                      onChange={(e) => setNewParticipant({ ...newParticipant, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 px-3 py-1 bg-green-700 text-white rounded-md text-sm hover:bg-green-800"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewConversation(false)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Click the + button to start a conversation</p>
                  </div>
                ) : (
                  filteredConversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                        activeConversation === conv.id ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-700' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate dark:text-white">{conv.participant.name}</h3>
                            {conv.unreadCount > 0 && (
                              <span className="bg-green-700 text-white text-xs px-2 py-0.5 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.participant.company}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                            {conv.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-2 flex flex-col">
              {activeConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white">{activeConv.participant.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activeConv.participant.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteConversation(activeConv.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeConv.messages.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation by sending a message</p>
                      </div>
                    ) : (
                      activeConv.messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.sender === 'user'
                                ? 'bg-green-700 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 opacity-70" />
                              <span className="text-xs opacity-70">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {msg.sender === 'user' && msg.read && (
                                <CheckCircle className="w-3 h-3 opacity-70" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-semibold mb-2 dark:text-white">Select a conversation</p>
                    <p className="text-sm">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
