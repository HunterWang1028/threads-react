import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Postpage from "./pages/Postpage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import userAtom from "./atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreateThread from "./components/CreateThread";
import Chatpage from "./pages/Chatpage.jsx";
import { useEffect } from "react";

function App() {
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/googleProfile", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // To send cookies in the request
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("user-threads", JSON.stringify(data));
          setUser(data);
        }
      } catch (error) {
        console.log("Error fetching user: ", error);
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <Box position={"relative"} w={"full"}>
      <Container
        maxW={
          pathname === "/"
            ? { base: "620px", md: "900px" }
            : pathname === "/chat"
            ? "95%"
            : "620px"
        }
      >
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
          <Route path="/:username/thread/:tid" element={<Postpage />} />
          <Route
            path="/chat"
            element={user ? <Chatpage /> : <Navigate to="/auth" />}
          />
        </Routes>
        {user && pathname !== "/chat" && <CreateThread />}
      </Container>
    </Box>
  );
}

export default App;
