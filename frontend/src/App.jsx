import { Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Postpage from "./pages/Postpage";
import Header from "./components/Header";

function App() {
  return (
    <Container maxW={620}>
      <Header />
      <Routes>
        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<Postpage />} />
      </Routes>
    </Container>
  );
}

export default App;
