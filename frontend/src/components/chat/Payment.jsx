import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { Button } from "@chakra-ui/react";

const Payment = ({ chatRoom }) => {
  const [product, setProduct] = useState({});
  const { id, nickname } = useContext(AuthenticationContext);
  console.log("Authentication Context:", { id, nickname });
  console.log("Chat Room:", chatRoom);
  console.log("Room ID:", chatRoom.roomId);

  // 제이쿼리와 아임포트 스크립트를 추가하는 useEffect
  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const requestPay = async () => {
    // 상품 정보 가져오기
    const productId = chatRoom.productId;
    const res = await axios.get(`/api/product/view/${productId}`);
    const product = res.data;

    const { IMP } = window;
    IMP.init("imp27532056");

    // 결제 요청
    IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: new Date().getTime(), // 고유 거래 ID
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
            // 결제 내역을 payment_record 테이블에 저장
            await axios.post("/api/savePayment", {
              impUid: rsp.imp_uid,
              buyerId: id,
              productName: product.productName,
              paymentAmount: product.price,
              paymentMethod: rsp.pay_method,
              paymentDate: new Date(),
              status: "paid",
            });

            await axios
              .post(
                `/api/product/transaction/${productId}`,
                {
                  roomId: chatRoom.roomId, // body로 roomId를 전달
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
              );

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

  return (
    <div>
      <Button onClick={requestPay}>결제하기</Button>
    </div>
  );
};

export default Payment;
