import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function InquiryDetail() {
  const { inquiryId } = useParams();
  const [inquiry, setInquiry] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/inquiry/${inquiryId}`)
      .then((res) => {
        setInquiry(res.data);
      })
      .catch((error) => {
        console.error("문의 상세 데이터 요청 중 오류 발생:", error);
      });
  }, [inquiryId]);

  if (!inquiry) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>{inquiry.title}</h1>
      <p>작성자: {inquiry.memberId}</p>
      <p>내용: {inquiry.content}</p>
      <p>작성 일자: {new Date(inquiry.inserted).toLocaleDateString()}</p>
      <p>답변: {inquiry.answer ? inquiry.answer : "답변 대기 중"}</p>
    </div>
  );
}
