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
import InquiryList from "./InquiryList.jsx";
import { InquiryView } from "./InquiryView.jsx";
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

export function MyPage() {
  const { id, nickname } = useContext(AuthenticationContext);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [rating, setRating] = useState(0.0);
  const [profileImage, setProfileImage] = useState(null);
  const [progress, setProgress] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/myPage/ImageAndRating", { params: { memberId: id } })
      .then((res) => {
        const { rating, profileImage } = res.data;

        // 평점을 반올림한 값으로 설정
        const roundedRating = Math.round(rating * 2) / 2; // 소수점 한자리 반올림
        setRating(roundedRating);

        setProfileImage(profileImage);
      })
      .catch((error) => {
        console.log("평점 정보를 가져오는 데 실패했습니다.", error);
      });
  }, [id, profileImage]);

  // 마이페이지 컴포넌트에서만 tab 상태를 관리하도록 수정
  const [activeTab, setActiveTab] = useState(() => {
    // 마이페이지에서만 localStorage 저장된 상태 사용
    return localStorage.getItem("activeTab") || "profile";
  });

  // 탭이 변경될 때마다 상태를 localStorage에 저장
  useEffect(() => {
    // activeTab이 변경되면 localStorage에 저장
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]); // activeTab 상태가 변경될 때마다 실행

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 행 클릭 시 선택된 문의 ID를 설정하고 'inquiryDetail' 탭으로 전환합니다.
  const handleRowClick = (inquiryId) => {
    setSelectedInquiryId(inquiryId);
    setActiveTab("inquiryDetail");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // 선택한 첫 번째 파일
    if (file) {
      const previewUrl = URL.createObjectURL(file); // 미리보기 URL 생성
      setProfileImage(previewUrl); // 아바타에 반영

      const formData = new FormData();
      formData.append("memberId", id);
      formData.append("profileImage", file);

      setProgress(true);
      axios
        .post("/api/myPage/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
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
      .delete("/api/myPage/image", { params: { memberId: id, profileImage } })
      .then((res) => {
        setProfileImage(null);
      })
      .catch((e) => {
        console.error("이미지 삭제에 실패했습니다.", e);
      });
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
                src={profileImage}
              />
            )}
            <Float placement="bottom-end" mr={10} mb={3}>
              <Box position="relative">
                <MenuRoot>
                  <MenuTrigger asChild>
                    <Button
                      size="xs"
                      rounded="full"
                      colorPalette="orange"
                      variant="solid"
                    >
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
            <Text ali>{nickname}</Text>
            <Rating readOnly value={rating} allowHalf size="md" mb={5} />
          </Stack>
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
        {activeTab === "inquiry" && <InquiryList onRowClick={handleRowClick} />}
        {activeTab === "inquiryDetail" && (
          <InquiryView inquiryId={selectedInquiryId} />
        )}
        {activeTab === "review" && <Review />}
      </Box>
    </Flex>
  );
}
