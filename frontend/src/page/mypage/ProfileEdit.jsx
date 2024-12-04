import { Box, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";

export function ProfileEdit({ id, onCancel }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    axios.get(`/api/member/${id}`).then((res) => setFormData(res.data));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios
      .put(`/api/member/${id}`, formData) // 서버로 수정 요청
      .then(() => {
        alert("수정이 완료되었습니다.");
        onCancel(); // 수정 완료 후 원래 프로필 페이지로 돌아감
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  if (!formData) {
    return <p>Loading...</p>;
  }

  return (
    <Box>
      <h3>프로필 수정</h3>
      <Stack gap={5}>
        <Field label={"아이디"}>
          <Input name="id" readOnly value={id} />
        </Field>
        <Field label={"암호"}>
          <Input value={formData.password} onChange={handleInputChange} />
        </Field>
        <Field label={"별명"}>
          <Input
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
          />
        </Field>
        <Box>
          <Button onClick={handleSave}>저장</Button>
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
