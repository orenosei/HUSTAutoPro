import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [autoQuery, setAutoQuery] = useState(null); 

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setAutoQuery(null);
  };

  const askAboutCar = (carInfo) => {
    setAutoQuery(carInfo); 
    openChat(); 
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