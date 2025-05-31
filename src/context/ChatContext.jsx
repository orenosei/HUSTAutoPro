import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [autoQuery, setAutoQuery] = useState(null); // Lưu thông tin truy vấn tự động

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setAutoQuery(null);
  };

  const askAboutCar = (carInfo) => {
    setAutoQuery(carInfo); // Lưu thông tin xe để xử lý tự động
    openChat(); // Mở chat widget
  };

  return (
    <ChatContext.Provider value={{ 
      isChatOpen, 
      openChat, 
      closeChat, 
      autoQuery,
      askAboutCar,
      resetAutoQuery: () => setAutoQuery(null)
    }}>
      {children}
    </ChatContext.Provider>
  );
};