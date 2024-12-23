import React, { createContext, useContext } from "react";

// 대표 고정 색상 정의
const theme = {
  primaryColor: "#FFF0DC", // 네브바, 버튼
  secondaryColor: "#F0BB78",
  tertiaryColor: "#914F1E",
  fontColor: "#493628",
};

export const ThemeContext = createContext(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export default ThemeProvider;
