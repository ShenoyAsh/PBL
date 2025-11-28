import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Loader2, Bot } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the LifeLink AI assistant. Ask me about donation eligibility, our OCR features, or how to find a donor.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const res = await api.post('/chat', { message: userText });
      const botText = res.data.response;
      
      setMessages(prev => [...prev, { sender: 'bot', text: botText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting to the server. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
            style={{ maxHeight: '500px', height: '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-green to-dark-green p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                <span className="font-semibold">LifeLink AI Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'bot'
                        ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                        : 'bg-primary-green text-white rounded-br-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                  placeholder="Ask about eligibility, features..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green text-sm"
                  autoFocus
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="bg-primary-green text-white p-2 rounded-full hover:bg-dark-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-green hover:bg-dark-green text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </motion.button>
    </div>
  );
};

export default ChatBot;