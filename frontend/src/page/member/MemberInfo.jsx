import { Box, Input, Spinner, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export function MemberInfo() {
  const [member, setMember] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/api/member/${id}`).then((res) => setMember(res.data));
  }, []);

  if (!member) {
    return <Spinner />;
  }

  return (
    <Box>
      <h3>회원 정보</h3>
      <Stack gap={5}>
        <Field label={"아이디"}>
          <Input readOnly value={member.memberId} />
        </Field>
        <Field label={"암호"}>
          <Input readOnly value={member.password} />
        </Field>
        <Field label={"이름"}>
          <Input readOnly value={member.name} />
        </Field>
        <Field label={"별명"}>
          <Input readOnly value={member.nickName} />
        </Field>
        <Field label={"가입일시"}>
          <Input type={"date"} readOnly value={member.inserted} />
        </Field>
      </Stack>
    </Box>
  );
}
