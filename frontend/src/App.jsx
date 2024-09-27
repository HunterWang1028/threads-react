import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Postpage from "./pages/Postpage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import userAtom from "./atoms/userAtom";
import { useRecoilValue } from "recoil";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreateThread from "./components/CreateThread";
import LogoutButton from "./components/LogoutButton.jsx";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <Container maxW={620}>
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/update"
          element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
        />
        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/thread/:id" element={<Postpage />} />
      </Routes>

      {user && <CreateThread />}
      {user && <LogoutButton />}
    </Container>
  );
}

export default App;
