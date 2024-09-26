import { Flex, Image, useColorMode } from "@chakra-ui/react";
import LogoutButton from "./LogoutButton.jsx";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  return (
    <Flex justifyContent={"center"} mt={6} mb={12}>
      <Image
        cursor={"pointer"}
        w={6}
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && <LogoutButton />}
    </Flex>
  );
};

export default Header;
