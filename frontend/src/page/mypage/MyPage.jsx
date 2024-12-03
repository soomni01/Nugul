import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import { Wishlist } from "../mypage/Wishlist.jsx";
import { SoldItems } from "../mypage/SoldItems.jsx";
import { PurchasedItems } from "../mypage/PurchasedItems.jsx";
import { Profile } from "../mypage/Profile.jsx";

export function MyPage() {
  const [activeTab, setActiveTab] = useState("profile"); // 기본적으로 '찜 목록'을 활성화

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
            variant={activeTab === "profile" ? "solid" : "ghost"}
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
            찜 목록
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
            variant={activeTab === "review" ? "solid" : "ghost"}
            colorScheme="teal"
            onClick={() => handleTabClick("profile")}
          >
            후기
          </Button>
        </VStack>
      </Box>

      {/* 오른쪽 콘텐츠 */}
      <Box flex="1" p={5}>
        {activeTab === "profile" && <Profile />}
        {activeTab === "wishlist" && <Wishlist />}
        {activeTab === "sold" && <SoldItems />}
        {activeTab === "purchased" && <PurchasedItems />}
      </Box>
    </Flex>
  );
}
