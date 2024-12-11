import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { Button } from "@chakra-ui/react";

const Payment = () => {
  const [product, setProduct] = useState({});
  const { member_id, nickname } = useContext(AuthenticationContext);

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

  const requestPay = () => {
    const { IMP } = window;
    IMP.init("imp27532056");

    // 결제 요청
    IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: new Date().getTime(), // 고유 거래 ID
        name: product.product_name, // 서버에서 가져온 상품명
        amount: product.price, // 서버에서 가져온 가격
        buyer_email: member_id, // 로그인된 사용자 이메일
        buyer_name: nickname, // 로그인된 사용자 닉네임
        buyer_tel: "010-1234-5678", // 전화번호는 예시로 넣음
        buyer_addr: "서울특별시", // 마찬가지
        buyer_postcode: "123-456", // 마찬가지
      },
      async (rsp) => {
        try {
          const { data } = await axios.post(
            "http://localhost:8080/verifyIamport/" + rsp.imp_uid,
          );

          // 결제 금액이 일치하는지 확인
          if (rsp.paid_amount === data.response.amount) {
            // 결제 내역을 payment_record 테이블에 저장
            await axios.post("/api/savePayment", {
              imp_uid: rsp.imp_uid,
              buyer_id: member_id,
              product_id: product.id,
              product_name: product.product_name,
              payment_amount: rsp.payment_amount,
              payment_method: rsp.pay_method,
              payment_date: new Date(),
              status: "paid", // 결제 완료 상태
            });

            // 결제 성공 알림
            toaster.create({
              type: "success",
              description: "결제가 성공적으로 처리되었습니다.",
            });
          } else {
            // 결제 금액 불일치 알림
            toaster.create({
              type: "error",
              description: "결제 금액이 일치하지 않습니다. 다시 시도해 주세요.",
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
