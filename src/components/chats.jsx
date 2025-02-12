// components/Chat.jsx
import React, { useState } from 'react';
import axios from 'axios';

const chats = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Make API call
      const response =
        (await axios.post('http://localhost:5000/api/chat/ask', {
          question: input,
        })) || {};

      // Add AI response
      const aiMessage = {
        type: 'ai',
        content: response.data.answer,
        sources: response.data.sources,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
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
    <div className="flex flex-col h-screen">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.type === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : msg.type === 'ai'
                ? 'bg-pink-950'
                : 'bg-red-500 text-black'
            } p-3 rounded-lg max-w-[80%]`}
          >
            <p>{msg.content}</p>
            {msg.sources && (
              <div className=" mt-2 text-gray-600">
                Sources: {msg.sources.length} references found
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about courses, teachers, etc..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default chats;
