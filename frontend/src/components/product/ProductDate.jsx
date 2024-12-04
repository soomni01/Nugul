import { differenceInDays, parseISO } from "date-fns";

export const getDaysAgo = (createdAt) => {
  if (!createdAt) return "날짜 없음"; // 예외 처리

  const today = new Date();
  const createdDate = parseISO(createdAt); // ISO 형식으로 변환
  const daysAgo = differenceInDays(today, createdDate);

  if (daysAgo === 0) return "오늘";
  if (daysAgo === 1) return "1일 전";
  return `${daysAgo}일 전`;
};
