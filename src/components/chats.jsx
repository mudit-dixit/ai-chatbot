import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://13.235.80.128:4000/api/chat/ask',
        {
          question: input,
        }
      );

      const aiMessage = {
        type: 'ai',
        content: response.data.answer,
        sources: response.data.sources,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I encountered an error processing your request.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#E2E0C8]">
      {/* Header */}
      <div className="bg-[#5C7285] p-4 shadow-md">
        <h1
          className="text-white text-xl font-semibold "
          style={{
            fontFamily: 'fantasy',
            textShadow: '5px 5px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          COLLEGE ASSISTANT
        </h1>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-4 rounded-lg max-w-[80%] shadow-md ${
                msg.type === 'user'
                  ? 'bg-[#818C78] text-white rounded-br-none'
                  : msg.type === 'ai'
                  ? 'bg-[#A7B49E] text-gray-800 rounded-bl-none'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <p className="text-sm md:text-base">{msg.content}</p>
              {msg.sources && (
                <div className="mt-2 text-sm opacity-75">
                  {msg.sources.length} references found
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#A7B49E] p-4 rounded-lg rounded-bl-none shadow-md">
              <Loader2 className="h-5 w-5 animate-spin text-gray-800" />
            </div>
          </div>
        )}
      </div>

      {/* Input form */}
      <div className="p-4 bg-[#5C7285]">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about courses, teachers, etc..."
            className="flex-1 p-3 rounded-lg bg-white/90 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#818C78]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#818C78] text-white rounded-lg hover:bg-[#A7B49E] transition-colors duration-200 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span className="mr-2">Send</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
