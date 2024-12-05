// import React, { useEffect, useState } from "react";
// import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
// import axios from "axios";
//
// export function InquiryList() {
//   const [inquiries, setInquiries] = useState([]);
//
//   useEffect(() => {
//     // 서버에서 문의 내역 불러오기
//     axios
//       .get("/api/inquiry/list") // 문의 리스트 API
//       .then((res) => {
//         if (res && res.data) {
//           setInquiries(res.data); // API에서 가져온 데이터를 상태에 저장
//         }
//       })
//       .catch((e) => {
//         console.error("Error loading inquiries:", e);
//       });
//   }, []);
//
//   return (
//     <Box>
//       <Text fontSize="2xl" fontWeight="bold" mb={5}>
//         문의 내역
//       </Text>
//       <Table variant="simple">
//         <Thead>
//           <Tr>
//             <Th>제목</Th>
//             <Th>작성자</Th>
//             <Th>작성일자</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {inquiries.map((inquiry) => (
//             <Tr key={inquiry.id}>
//               <Td>{inquiry.title}</Td>
//               <Td>{inquiry.memberId}</Td>
//               <Td>{inquiry.inserted}</Td>
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>
//     </Box>
//   );
// }
