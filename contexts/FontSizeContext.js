import React, { createContext, useState, useContext } from 'react';

const FontSizeContext = createContext();

export function FontSizeProvider({ children }) {
  const [fontScale, setFontScale] = useState(1);

  const increaseFontSize = () => {
    setFontScale(prevScale => Math.min(prevScale + 0.1, 1.5));
  };

  const decreaseFontSize = () => {
    setFontScale(prevScale => Math.max(prevScale - 0.1, 0.8));
  };

  return (
    <FontSizeContext.Provider value={{ fontScale, increaseFontSize, decreaseFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
} 