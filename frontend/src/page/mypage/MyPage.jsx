import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Float,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Profile } from "./Profile.jsx";
import { ProfileEdit } from "./ProfileEdit.jsx";
import { Wishlist } from "./Wishlist.jsx";
import { SoldItems } from "./SoldItems.jsx";
import { PurchasedItems } from "./PurchasedItems.jsx";
import { Budget } from "./Budget.jsx";
import { Review } from "./Review.jsx";
import { Rating } from "../../components/ui/rating.jsx";
import axios from "axios";
import { Avatar } from "../../components/ui/avatar.jsx";
import { TbMoodEdit } from "react-icons/tb";
import { SkeletonCircle } from "../../components/ui/skeleton.jsx";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../../components/ui/menu.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";
import { BoardsAndComments } from "./BoardsAndComments.jsx";
import { useTheme } from "../../components/context/ThemeProvider.jsx";

export function MyPage() {
  const { id, nickname, profileImage, updateProfileImage } = useContext(
    AuthenticationContext,
  );
  const [rating, setRating] = useState(0.0);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [progress, setProgress] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const navigate = useNavigate();
  const { primaryColor, buttonColor, fontColor } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    if (!id) {
      return;
    }
    // 병렬로 두 개의 요청 처리
    Promise.all([
      axios.get("/api/myPage/rating", { params: { memberId: id } }),
      axios.get("/api/myPage/image", { params: { memberId: id } }),
    ])
      .then(([ratingRes, imageRes]) => {
        // 평점 데이터 처리
        const roundedRating = Math.round(ratingRes.data * 2) / 2; // 소수점 한자리 반올림
        setRating(roundedRating);

        // 프로필 이미지 데이터 처리
        const profileImageUrl = imageRes.data;
        setProfileImageUrl(profileImageUrl);
        updateProfileImage(profileImageUrl);
      })
      .catch((error) => {
        console.log("데이터를 가져오는 데 실패했습니다.", error);
      });
  }, [id, updateProfileImage]);

  // 마이페이지 컴포넌트에서만 tab 상태를 관리하도록 수정
  const [activeTab, setActiveTab] = useState(() => {
    // 마이페이지에서만 localStorage 저장된 상태 사용
    return localStorage.getItem("activeTab") || "profile";
  });

  // 탭이 변경될 때마다 상태를 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]); // activeTab 상태가 변경될 때마다 실행

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // 선택한 첫 번째 파일
    if (file) {
      const previewUrl = URL.createObjectURL(file); // 미리보기 URL 생성
      setProfileImageUrl(previewUrl); // 아바타에 반영

      const formData = new FormData();
      formData.append("memberId", id);
      formData.append("profileImage", file);

      setProgress(true);
      axios
        .post("/api/myPage/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          updateProfileImage(previewUrl);
          toaster.create({
            description: res.data.message.text,
            type: res.data.message.type,
          });
        })
        .catch((e) => {
          const message = e.response?.data?.message;
          toaster.create({
            description: message?.text || "이미지 업로드에 실패했습니다.",
            type: "error",
          });
        })
        .finally(() => {
          setProgress(false);
        });
    }
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = () => {
    axios
      .delete("/api/myPage/image", {
        params: { memberId: id },
      })
      .then((res) => {
        setProfileImageUrl(null);
        updateProfileImage(null);
      })
      .catch((e) => {
        console.error("이미지 삭제에 실패했습니다.", e);
      });
  };

  const TAB_ITEMS = [
    {
      id: "profile",
      label: "내 정보",
      matches: (activeTab) =>
        activeTab === "profile" || activeTab === "editProfile",
    },
    {
      id: "boardsAndComments",
      label: "내가 쓴 글",
    },
    {
      id: "wishlist",
      label: "관심 목록",
    },
    {
      id: "sold",
      label: "판매 상품",
    },
    {
      id: "purchased",
      label: "구매 상품",
    },
    {
      id: "budget",
      label: "가계부",
    },
    {
      id: "review",
      label: "후기",
    },
  ];

  // 탭 버튼 컴포넌트
  const TabButton = ({ isActive, onClick, children }) => (
    <Button
      backgroundColor={isActive ? buttonColor : "transparent"}
      color={isActive ? "white" : fontColor}
      _hover={{ backgroundColor: buttonColor }}
      _active={{ backgroundColor: buttonColor }}
      onClick={onClick}
      fontWeight="bold"
      borderRadius="full"
      size="xl"
    >
      {children}
    </Button>
  );

  return (
    <Flex direction="row">
      {/* 왼쪽 메뉴 */}
      <Box width="23%" height="828px" p={16} mt={-2} bgColor={primaryColor}>
        <VStack align="stretch" spacing={4}>
          <Flex justifyContent="center" alignItems="center">
            <Heading mb={7} size="3xl" fontWeight="bold">
              MyPage
            </Heading>
          </Flex>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            pos="relative"
          >
            {progress ? (
              <SkeletonCircle size="130px" />
            ) : (
              <Avatar
                boxSize="130px"
                borderRadius="full"
                fit="cover"
                src={profileImageUrl || "/image/default.png"}
              />
            )}
            <Float placement="bottom-center">
              <Box position="relative">
                <MenuRoot>
                  <MenuTrigger asChild>
                    <Button size="xs" rounded="full" variant="solid">
                      <TbMoodEdit />
                    </Button>
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem onClick={() => fileInputRef.current.click()}>
                      변경하기
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                    </MenuItem>
                    <MenuItem onClick={handleImageDelete}>삭제하기</MenuItem>
                  </MenuContent>
                </MenuRoot>
              </Box>
            </Float>
          </Box>
          <Stack display="flex" alignItems="center">
            <Text ali fontSize="xl" fontWeight="bold" mt={5}>
              {nickname}
            </Text>
            <Rating
              colorPalette="yellow"
              readOnly
              value={rating}
              allowHalf
              size="lg"
              mt={1}
              mb={5}
            />
          </Stack>
          <VStack align="stretch" spacing={4}>
            {TAB_ITEMS.map((tab) => (
              <TabButton
                key={tab.id}
                isActive={
                  tab.matches ? tab.matches(activeTab) : activeTab === tab.id
                }
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </VStack>
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
        {activeTab === "budget" && <Budget />}
        {activeTab === "review" && <Review />}
        {activeTab === "boardsAndComments" && <BoardsAndComments />}
      </Box>
    </Flex>
  );
}
