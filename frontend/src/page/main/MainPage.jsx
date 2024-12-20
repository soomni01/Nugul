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
import { useNavigate, useSearchParams } from "react-router-dom";
import { SegmentedControl } from "../../components/ui/segmented-control.jsx";

export function MainPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sellProductList, setSellProductList] = useState([]);
  const [shareProductList, setShareProductList] = useState([]);
  const [likeData, setLikeData] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [pay, setPay] = useState("");
  const [searchParams, setSearchParams] = useSearchParams("");
  const navigate = useNavigate();

  // 카테고리 변경 처리
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", category);
    nextSearchParams.set("page", 1);

    const route = pay === "share" ? "/product/share/list" : "/product/list";
    navigate({
      pathname: route,
      search: nextSearchParams.toString(),
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

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

  // 좋아요 상태 가져오기
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
        console.error("관심 상품을 가져오는데 오류가 발생했습니다.:", error);
      }
    };

    fetchLikeData();
  }, []);

  return (
    <Box mb={"30px"}>
      <Image src="/image/testImage.png" w="100%" h="300px" mt="3" />
      <Separator my={10} />
      <Heading my={3} size={"2xl"}>
        {" "}
        카테고리별 상품 찾기
      </Heading>
      <SegmentedControl
        size={"lg"}
        defaultValue="product"
        onValueChange={(e) => setPay(e.value)}
        items={[
          { label: "중고거래", value: "product" },
          { label: "나눔", value: "share" },
        ]}
      />
      <CategoryContainer
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <Separator my={10} />

      <Heading size={"2xl"} mb={5} ml={"5%"}>
        중고 아이템
      </Heading>
      {loading ? (
        <p>상품 정보를 불러오는 중입니다...</p>
      ) : (
        <Box position="relative">
          <Swiper
            slidesPerView={5}
            spaceBetween={20}
            loop={true}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-sell", // sell Swiper의 pagination
            }}
            navigation={{
              nextEl: ".swiper-button-next-sell", // sell Swiper의 내비게이션
              prevEl: ".swiper-button-prev-sell",
            }}
            modules={[Pagination, Navigation]}
            className="main-page-swiper"
          >
            {sellProductList.length > 0 ? (
              sellProductList.map((product) => (
                <SwiperSlide
                  className="main-page-swiper-slide"
                  key={product.productId}
                >
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
          <div className="swiper-pagination-sell"></div>
          <div className="swiper-button-next-sell">
            <Image src="/image/Arrow.png" />
          </div>
          <div className="swiper-button-prev-sell">
            <Image src="/image/Arrow.png" />
          </div>
        </Box>
      )}

      <Separator my={10} />

      <Heading size={"2xl"} mb={5} ml={"5%"}>
        나눔 아이템
      </Heading>
      {loading ? (
        <p>상품 정보를 불러오는 중입니다...</p>
      ) : (
        <Box position="relative">
          <Swiper
            slidesPerView={5}
            spaceBetween={20}
            loop={true}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-share", // share Swiper의 pagination
            }}
            navigation={{
              nextEl: ".swiper-button-next-share", // share Swiper의 내비게이션
              prevEl: ".swiper-button-prev-share",
            }}
            modules={[Pagination, Navigation]}
            className="main-page-swiper"
          >
            {shareProductList.length > 0 ? (
              shareProductList.map((product) => (
                <SwiperSlide
                  className="main-page-swiper-slide"
                  key={product.productId}
                >
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

          <div className="swiper-pagination-share"></div>
          <div className="swiper-button-next-share">
            <Image src="/image/Arrow.png" />
          </div>
          <div className="swiper-button-prev-share">
            <Image src="/image/Arrow.png" />
          </div>
        </Box>
      )}
    </Box>
  );
}
