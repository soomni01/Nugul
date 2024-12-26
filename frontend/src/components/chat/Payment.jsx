import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { Box, Button, Spinner } from "@chakra-ui/react";
import { useTheme } from "../context/ThemeProvider.jsx";

const Payment = ({ chatRoom, onComplete, statusControl }) => {
  const [price, setPrice] = useState(null);
  const { id, nickname } = useContext(AuthenticationContext);
  const { fontColor, buttonColor } = useTheme();

  // 제이쿼리와 아임포트 스크립트를 추가하는 useEffect
  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);

    // 상품 정보 가져오기
    const ProductData = async () => {
      const productId = chatRoom.productId; // 현재 채팅방의 상품 ID
      const res = await axios.get(`/api/product/view/${productId}`); // 상품 API 호출
      const product = res.data; // 응답 받은 데이터에서 상품 정보 추출

      // 가격만 상태로 저장
      setPrice(product.price);
    };

    ProductData(); // 상품 정보를 비동기로 가져옴

    // cleanup 함수: 컴포넌트가 언마운트될 때 스크립트 제거
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, [chatRoom.productId]); // `chatRoom.productId`가 변경될 때마다 실행

  const requestPay = async () => {
    const productId = chatRoom.productId;
    const res = await axios.get(`/api/product/view/${productId}`);
    const product = res.data;

    const { IMP } = window;
    IMP.init("imp42577807");

    // 결제 요청
    IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: new Date().getTime(), // 고유 거래 ID
        id: product.productId,
        name: product.productName,
        amount: product.price,
        buyer_email: id,
        buyer_name: nickname,
      },
      async (rsp) => {
        try {
          const { data } = await axios.post(
            "/api/verifyIamport/" + rsp.imp_uid,
          );

          // 결제 금액이 일치하는지 확인
          if (rsp.paid_amount === data.response.amount) {
            // 결제 완료 후 거래 처리
            await axios
              .post(
                `/api/product/transaction/${productId}`,
                {
                  roomId: chatRoom.roomId, // body로 roomId를 전달
                  paymentMethod: "KakaoPay",
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                },
              )
              .catch((error) =>
                console.error(
                  "Transaction Error:",
                  error.response?.data || error,
                ),
              )
              .finally(() => {
                // 결제시 purchased 바꿔서 리렌더
                onComplete();
                // statusControl();
              });
            // 시연을 위해 결제 완료시 localStorage에 상태 저장
            localStorage.setItem(`payment_${chatRoom.roomId}`, "completed");

            // 결제 성공 알림
            toaster.create({
              type: "success",
              description: "결제가 정상적으로 완료되었습니다.",
            });
          }
        } catch (error) {
          console.error("결제 확인 중 오류 발생:", error);
          toaster.create({
            type: "error",
            description:
              "결제 확인 중 오류가 발생했습니다. 다시 시도해 주세요.",
          });
        }
      },
    );
  };
  // console.log(onComplete);

  // 가격이 0이면 결제 버튼을 렌더링하지 않음
  if (price === 0) {
    return <Box ml={11}></Box>;
  }

  // 가격이 null일 때 로딩 중 스피너 표시
  if (price === null) {
    return <Spinner size="md" />;
  }

  return (
    <div>
      <Button
        size="xl"
        onClick={requestPay}
        color={fontColor}
        fontWeight="bold"
        bg={buttonColor}
        _hover={{ bg: `${buttonColor}AA` }}
      >
        결제하기
      </Button>
    </div>
  );
};

export default Payment;
