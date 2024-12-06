import { useContext, useEffect, useState } from "react";
import { Box, Button, Flex, Heading, VStack } from "@chakra-ui/react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Profile } from "./Profile.jsx";
import { ProfileEdit } from "./ProfileEdit.jsx";
import { Wishlist } from "./Wishlist.jsx";
import { SoldItems } from "./SoldItems.jsx";
import { PurchasedItems } from "./PurchasedItems.jsx";
import { Review } from "./Review.jsx";
import { useLocation } from "react-router-dom"; // Context import 예시

export function MyPage() {
  const { id } = useContext(AuthenticationContext);
  const location = useLocation();

  // 마이페이지 컴포넌트에서만 tab 상태를 관리하도록 수정
  const [activeTab, setActiveTab] = useState(() => {
    // 마이페이지에서만 localStorage 저장된 상태 사용
    return localStorage.getItem("activeTab") || "profile";
  });

  useEffect(() => {
    // activeTab이 변경되면 localStorage에 저장
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]); // activeTab 상태가 변경될 때마다 실행

  const handleTabClick = (tab) => {
    setActiveTab(tab); // 탭 클릭 시 activeTab 값 변경
  };

  return (
    <Flex direction="row" mt={5}>
      {/* 왼쪽 메뉴 */}
      <Box
        width="30%"
        p={10}
        borderRight="1px"
        borderColor="gray.200"
        bgColor="gray.100"
      >
        <VStack align="stretch" spacing={4}>
          <Heading m={5} align="center">
            마이페이지
          </Heading>
          <Button
            variant={
              activeTab === "profile" || activeTab === "editProfile"
                ? "solid"
                : "ghost"
            }
            colorScheme="teal"
            onClick={() => handleTabClick("profile")}
          >
            내 정보
          </Button>
          <Button
            variant={activeTab === "wishlist" ? "solid" : "ghost"}
            colorScheme="teal"
            onClick={() => handleTabClick("wishlist")}
          >
            관심 목록
          </Button>
          <Button
            variant={activeTab === "sold" ? "solid" : "ghost"}
            colorScheme="teal"
            onClick={() => handleTabClick("sold")}
          >
            판매 상품
          </Button>
          <Button
            variant={activeTab === "purchased" ? "solid" : "ghost"}
            colorScheme="teal"
            onClick={() => handleTabClick("purchased")}
          >
            구매 상품
          </Button>
          <Button
            variant={activeTab === "inquiry" ? "solid" : "ghost"}
            colorScheme="teal"
            onClick={() => handleTabClick("inquiry")}
          >
            문의 내역
          </Button>
          <Button
            variant={activeTab === "review" ? "solid" : "ghost"}
            colorScheme="teal"
            onClick={() => handleTabClick("review")}
          >
            후기
          </Button>
        </VStack>
      </Box>

      {/* 오른쪽 콘텐츠 */}
      <Box flex="1" p={5}>
        {activeTab === "profile" && (
          <Profile onEditClick={() => setActiveTab("editProfile")} />
        )}
        {activeTab === "editProfile" && (
          <ProfileEdit
            id={id}
            onCancel={() => setActiveTab("profile")}
            onSave={() => setActiveTab("profile")}
          />
        )}
        {activeTab === "wishlist" && <Wishlist />}
        {activeTab === "sold" && <SoldItems />}
        {activeTab === "purchased" && <PurchasedItems />}
        {activeTab === "review" && <Review />}
      </Box>
    </Flex>
  );
}
