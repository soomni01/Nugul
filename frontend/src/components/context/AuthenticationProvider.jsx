import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// step 1 : context 만들기
export const AuthenticationContext = createContext(null);

function AuthenticationProvider({ children }) {
  const [userToken, setUserToken] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserToken(decoded);
    }
  }, []);

  function login(token) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUserToken(decoded);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("activeTab");
    setUserToken({});
  }

  function hasAccess(id) {
    return id === userToken.sub;
  }

  const isAuthenticated = Date.now() < userToken.exp * 1000;
  let isAdmin = false;

  if (userToken.scope) {
    isAdmin = userToken.scope.split(" ").includes("admin");
  }

  return (
    <AuthenticationContext.Provider
      value={{
        id: userToken.sub,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        hasAccess,
        nickname: userToken.nickname,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationProvider;
