import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { SiCardano } from "react-icons/si";
import ReactMarkdown from 'react-markdown'; 
import { useChat } from '@/context/ChatContext';

const ChatWidget = () => {
  const { 
    isChatOpen, 
    closeChat, 
    openChat,
    autoQuery,
    resetAutoQuery
  } = useChat();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Привeтик! Arya có thể giúp gì cho bạn?", sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const skipScrollRef = useRef(false);

  const scrollToBottom = () => {
    if (!skipScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    skipScrollRef.current = false;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && autoQuery) {
      skipScrollRef.current = true;
      handleAutoQuery(autoQuery);
      resetAutoQuery();
    }
  }, [isChatOpen, autoQuery]);

  const handleAutoQuery = async (carInfo) => {
    setIsLoading(true);
    console.log("Handling auto query for car:", carInfo);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bạn là chuyên gia tư vấn xe hơi tên là Arya, hãy xưng hô bằng Arya. 
              Hãy phân tích và đánh giá ngắn gọn chiếc xe này dựa trên thông tin sau:
              - Hãng xe: ${carInfo.make}
              - Model: ${carInfo.model}
              - Năm sản xuất: ${carInfo.year}
              - Giá bán: ${carInfo.sellingPrice} đồng
              - Tình trạng: ${carInfo.condition}
              - Số km: ${carInfo.mileage}
              
              Hãy đưa ra:
              1. Đánh giá tổng quan
              2. Ưu điểm nổi bật
              3. Khuyến nghị (nếu có)
              4. So sánh giá cả thị trường (nếu có dữ liệu)
              `
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                     "Xin lỗi, Arya không thể phân tích chiếc xe này ngay bây giờ.";
      
      const botMessage = {
        id: Date.now(),
        text: `**Phân tích chiếc xe ${carInfo.make} ${carInfo.model} ${carInfo.year}**\n\n${botText}`,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi khi gọi Gemini API:", error);
      const errorMessage = {
        id: Date.now(),
        text: "Đã có lỗi xảy ra khi phân tích xe. Vui lòng thử lại sau!",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bạn là chuyên gia tư vấn xe hơi tên là Arya, hãy xưng hô bằng Arya.
             Trả lời ngắn gọn Câu hỏi: ${message}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                     "Xin lỗi, Arya không thể trả lời câu hỏi này ngay bây giờ.";

      const botMessage = {
        id: Date.now() + 1,
        text: botText,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi khi gọi Gemini API:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (text) => (
    <ReactMarkdown
      components={{
        strong: ({ node, ...props }) => (
          <strong className="font-bold" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-2 last:mb-0" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 my-2" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="mb-1" {...props} />
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
            <div className="w-96 h-[500px] bg-white shadow-2xl rounded-lg flex flex-col border border-gray-200 transition-all duration-300 animate-slideUp">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-pink-400 to-red-300 text-white p-2 pr-4 pl-4 rounded-t-lg flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-white/20 rounded-full mr-3">
                            <img src="/arya.png" alt="Arya Avatar" className="h-15 w-15 rounded-full" />
                        </div>
                        <h3 className="font-semibold">Trợ lý Arya đáng yêu</h3>
                    </div>
                    <button 
                        onClick={closeChat}
                        className="text-white hover:text-gray-200 focus:outline-none"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`mb-4 ${msg.sender === 'user' ? 'text-right' : ''}`}
                    >
                        <div 
                        className={`inline-block p-3 rounded-lg max-w-[80%] shadow-sm ${
                            msg.sender === 'user' 
                            ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none'
                        }`}
                        >
                        {msg.sender === 'bot' 
                            ? renderMarkdown(msg.text) 
                            : msg.text}
                        </div>
                    </div>
                    ))}
                    {isLoading && (
                        <div className="mb-4">
                            <div className="inline-block p-3 rounded-lg bg-white text-gray-800 rounded-bl-none shadow-sm">
                                <div className="flex items-center">
                                    <div className="mr-2"></div>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Input Area */}
                <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                    <div className="flex">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Hỏi Arya ngay..."
                            className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className={`px-4 rounded-r-lg transition-all ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-pink-300 text-white hover:bg-pink-400'
                            }`}
                        >
                            <FaPaperPlane className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <button
                onClick={() => openChat()}
                className="bg-gradient-to-r from-pink-400 to-red-500 text-white p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                aria-label="Mở trợ lý chat"
            >
                <img src="/arya.png" alt="Arya Avatar" className="h-15 w-15 rounded-full" />
            </button>
        )}
    </div>
  );
};

export default ChatWidget;