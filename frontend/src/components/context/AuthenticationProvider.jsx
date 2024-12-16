import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// step 1 : context 만들기
export const AuthenticationContext = createContext(null);

function AuthenticationProvider({ children }) {
  const [userToken, setUserToken] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserToken(decoded);

      // 프로필 이미지 가져오기
      axios
        .get("/api/myPage/image", { params: { memberId: decoded.sub } })
        .then((res) => {
          console.log("프로필 이미지 요청 성공");
          setProfileImage(res.data);
        })
        .catch((error) => {
          console.error("프로필 이미지 요청 실패:");
        });
    }
  }, []);

  function login(token) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUserToken(decoded);

    // 프로필 이미지 다시 가져오기
    axios
      .get("/api/myPage/image", { params: { memberId: decoded.sub } })
      .then((res) => {
        console.log("프로필 이미지 요청 성공"); // 서버에서 받은 응답 확인
        setProfileImage(res.data);
      })
      .catch((error) => {
        console.error("프로필 이미지 요청 실패:", error);
      });
  }

  function logout() {
    localStorage.removeItem("token");
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

  // 프로필 이미지 업데이트 함수
  function updateProfileImage(newImage) {
    setProfileImage(newImage);
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
        profileImage,
        updateProfileImage,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationProvider;
