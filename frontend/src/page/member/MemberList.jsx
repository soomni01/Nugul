import { Box, Spinner, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    axios.get("/api/member/list").then((res) => setMemberList(res.data));
  }, []);

  if (!memberList || memberList.length === 0) {
    return <Spinner />;
  }

  return (
    <Box>
      <h3>회원 목록</h3>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>아이디</Table.ColumnHeader>
            <Table.ColumnHeader>이름</Table.ColumnHeader>
            <Table.ColumnHeader>별명</Table.ColumnHeader>
            <Table.ColumnHeader>가입일시</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {memberList.map((member) => (
            <Table.Row>
              <Table.Cell>{member.memberId}</Table.Cell>
              <Table.Cell>{member.name}</Table.Cell>
              <Table.Cell>{member.nickName}</Table.Cell>
              <Table.Cell>{member.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
