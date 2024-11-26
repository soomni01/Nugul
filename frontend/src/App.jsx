import axios from "axios";
import { Box } from "@chakra-ui/react";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function App() {
  return (
    <>
      <Box>hello</Box>
    </>
  );
}

export default App;
