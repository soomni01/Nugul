import React, { createContext, useContext } from "react";

// 대표 고정 색상 정의
const theme = {
  primaryColor: "#DEAC80", // 네브바, 버튼
  secondaryColor: "#914F1E",
  tertiaryColor: "#F7DCB9",
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
