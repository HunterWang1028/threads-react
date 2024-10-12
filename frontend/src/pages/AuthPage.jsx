import { useRecoilState } from "recoil";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import LoginCard from "../components/LoginCard";

const AuthPage = () => {
  const authScreenState = useRecoilState(authScreenAtom);

  return <>{authScreenState[0] === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
