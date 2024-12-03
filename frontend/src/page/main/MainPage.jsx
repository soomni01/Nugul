import { Box, Heading, Image, Separator } from "@chakra-ui/react";
import { CategoryContainer } from "../../components/category/CategoryContainer.jsx";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "./MainPage.css";
import axios from "axios";
import { ProductItem } from "../../components/product/ProductItem.jsx";

export function MainPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sellProductList, setSellProductList] = useState([]);
  const [shareProductList, setShareProductList] = useState([]);
  const [likeData, setLikeData] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // 카테고리 변경 처리
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("api/product/main")
      .then((res) => res.data)
      .then((data) => {
        setSellProductList(data.sellProducts);
        setShareProductList(data.shareProducts);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== "CanceledError") {
          console.log("상품 정보를 가져오는 데 실패했습니다.", error);
        }
      });
  }, []);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const [likeRes, userLikeRes] = await Promise.all([
          axios.get("/api/product/likes"),
          axios.get("/api/product/like/member"),
        ]);

        const likes = likeRes.data.reduce((acc, item) => {
          acc[item.product_id] = item.like_count;
          return acc;
        }, {});

        setLikeData(likes);
        setUserLikes(new Set(userLikeRes.data)); // Set으로 저장
      } catch (error) {
        console.error("Error fetching like data:", error);
      }
    };

    fetchLikeData();
  }, []);

  return (
    <Box>
      <Image src="/image/testImage.png" w="100%" h="300px" mt="3" />
      <Separator my={10} />
      <Heading m={5}> 카테고리별 상품 찾기</Heading>
      <CategoryContainer
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <Separator my={10} />
      <Heading>중고 아이템</Heading>
      {loading ? (
        <p>상품 정보를 불러오는 중입니다...</p>
      ) : (
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {sellProductList.length > 0 ? (
            sellProductList.map((product) => (
              <SwiperSlide key={product.productId}>
                <Box w="300px" h="auto">
                  <ProductItem
                    product={product}
                    likeCount={likeData[product.productId] || 0}
                    isLiked={userLikes.has(product.productId)}
                  />
                </Box>
              </SwiperSlide>
            ))
          ) : (
            <p>조회된 결과가 없습니다.</p>
          )}
        </Swiper>
      )}
      <Separator my={10} />
      <Heading>나눔 아이템</Heading>
      {loading ? (
        <p>상품 정보를 불러오는 중입니다...</p>
      ) : (
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {shareProductList.length > 0 ? (
            shareProductList.map((product) => (
              <SwiperSlide key={product.productId}>
                <Box w="300px" h="auto">
                  <ProductItem
                    product={product}
                    likeCount={likeData[product.productId] || 0}
                    isLiked={userLikes.has(product.productId)}
                  />
                </Box>
              </SwiperSlide>
            ))
          ) : (
            <p>조회된 결과가 없습니다.</p>
          )}
        </Swiper>
      )}
    </Box>
  );
}
